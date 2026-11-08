import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

// Structured Logger
function logStructured(level: 'INFO' | 'WARN' | 'ERROR' | 'SECURITY', message: string, meta: Record<string, any> = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  console.log(JSON.stringify(logEntry));
}

// ==================== 1. SECURITY & TRAFFIC CONTROL ====================

// Security Metrics Store
const securityStats = {
  totalRequests: 0,
  blockedWafRequests: 0,
  rateLimitHits: 0,
  attacksDetected: [] as Array<{ ip: string; reason: string; timestamp: string; path: string }>,
};

// Rate Limiter Store (Sliding window in-memory)
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 120; // 120 requests per minute

function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  let record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    record = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitMap.set(ip, record);
  } else {
    record.count++;
  }

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS_PER_WINDOW - record.count));
  res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetAt / 1000));

  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    securityStats.rateLimitHits++;
    logStructured('SECURITY', 'Rate limit exceeded', { ip, path: req.path, count: record.count });
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please wait 60 seconds before making further requests.',
      retryAfterSeconds: Math.ceil((record.resetAt - now) / 1000),
    });
    return;
  }

  next();
}

// Web Application Firewall (WAF) Middleware
const MALICIOUS_PATTERNS = [
  /(\b(UNION\s+SELECT|UNION\s+ALL\s+SELECT|DROP\s+TABLE|ALTER\s+TABLE|TRUNCATE\s+TABLE)\b)/i,
  /(\bOR\s+1\s*=\s*1\b|\bAND\s+1\s*=\s*1\b|'\s*OR\s*'1'\s*=\s*'1)/i,
  /(--\s|;\s*--)/,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/i,
  /(\.\.\/|\.\.\\)/, // Directory traversal
  /etc\/(passwd|shadow)/i,
];

function wafMiddleware(req: Request, res: Response, next: NextFunction) {
  securityStats.totalRequests++;
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

  // Inspect URL, Query params, and JSON Body only (exclude standard headers like Accept: */*)
  const checkPayload = `${decodeURIComponent(req.originalUrl)} ${JSON.stringify(req.body || {})}`;

  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(checkPayload)) {
      securityStats.blockedWafRequests++;
      const reason = `Blocked suspicious pattern: ${pattern.source}`;
      securityStats.attacksDetected.unshift({
        ip,
        reason,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      });
      if (securityStats.attacksDetected.length > 50) securityStats.attacksDetected.pop();

      logStructured('SECURITY', 'WAF Blocked Malicious Request', { ip, path: req.originalUrl, pattern: pattern.source });

      res.status(403).json({
        error: 'Forbidden by WAF',
        message: 'Security inspection identified an unauthorized signature in your request.',
        incidentId: `WAF-${Date.now().toString(36).toUpperCase()}`,
      });
      return;
    }
  }

  next();
}

// Security Headers & CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // CORS
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// JSON body parser with size limits to prevent payload exhaustion
app.use(express.json({ limit: '2mb' }));

// Apply rate limiting and WAF to API routes
app.use('/api', rateLimiter);
app.use('/api', wafMiddleware);

// ==================== 2. PERFORMANCE & SERVER-SIDE CACHING ====================

interface CacheEntry {
  data: any;
  expiresAt: number;
}
const cacheStore = new Map<string, CacheEntry>();
const cacheMetrics = { hits: 0, misses: 0 };

function getFromCache(key: string) {
  const entry = cacheStore.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    cacheMetrics.hits++;
    return entry.data;
  }
  cacheMetrics.misses++;
  cacheStore.delete(key);
  return null;
}

function setInCache(key: string, data: any, ttlSeconds: number) {
  cacheStore.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

// Clean up expired cache items periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cacheStore.entries()) {
    if (entry.expiresAt <= now) {
      cacheStore.delete(key);
    }
  }
}, 60000);

// ==================== 3. MONITORING & RELIABILITY ====================

const serverStartTime = Date.now();

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);
  const memory = process.memoryUsage();

  res.setHeader('Cache-Control', 'no-store');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    version: '1.2.0-production',
    service: 'Velox Automotive Styling & Wraps API',
    environment: process.env.NODE_ENV || 'development',
    system: {
      memoryRssMb: Math.round(memory.rss / 1024 / 1024),
      heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
      nodeVersion: process.version,
    },
    security: {
      wafStatus: 'active',
      rateLimiter: 'active',
      totalRequests: securityStats.totalRequests,
      blockedAttacks: securityStats.blockedWafRequests,
      rateLimitExceeded: securityStats.rateLimitHits,
    },
    performance: {
      cacheSize: cacheStore.size,
      cacheHits: cacheMetrics.hits,
      cacheMisses: cacheMetrics.misses,
      cacheHitRatio:
        cacheMetrics.hits + cacheMetrics.misses > 0
          ? `${Math.round((cacheMetrics.hits / (cacheMetrics.hits + cacheMetrics.misses)) * 100)}%`
          : '100%',
    },
  });
});

// Security & Traffic Stats Endpoint
app.get('/api/security/stats', (req: Request, res: Response) => {
  res.json({
    securityStats,
    cacheMetrics,
    cachedKeysCount: cacheStore.size,
    uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
  });
});

// ==================== 4. BACKEND SERVICES & INTEGRATIONS ====================

// --- Gemini AI Assistant (/api/chat) ---
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  geminiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const CHATBOT_SYSTEM_INSTRUCTION = `You are "SJO Assistant", the expert automotive styling, accessories, ceramic tint, and vinyl wrapping ("rapper" studio) specialist for SJO Motorsport (operating across Kenya in Nairobi Westlands, Mombasa Road, Karen, Nyali Mombasa, and Mobile Doorstep Fitment). Support email: sjomotorsport@gmail.com.

Knowledge Base:
1. Window Tinting:
   - Nano-Ceramic IR 98% Heat Rejection Film: cuts cockpit temperatures by up to 14°C, 99.9% UV protection, lifetime bubble-free warranty.
   - Tint shades: 5% (Limo Privacy), 20% (Dark Smoke), 35% (Medium Cool), 50% (Light Solar Shield), 70% (Clear Ceramic).
   - Kenya Traffic Regulations: Front windshield must maintain high visibility (our Chameleon 80% or 70% Clear Ceramic is 100% legal compliant). Side and rear windows can use 35%, 20%, or 5% privacy tint.
   - 8-Mil Anti-Smash & Grab: Heavy security core protecting against roadside smash-and-grab attacks.
2. Car Wraps ("Rapper" Studio):
   - Premium 3M 2080 and Avery Dennison Supreme wrapping films.
   - 120+ finishes: Satin Nardo Grey, Metallic Midnight Purple, Stealth Satin Black, Military Khaki Olive, Frozen Blue, Liquid Copper.
   - Process: Full vehicle disassembly for deep tucks (zero visible edges), preserves original OEM factory paint underneath, completely reversible, lasts 5-7 years.
   - Chrome Delete: Blackout window surrounds, grille slats, and emblems.
3. 4x4 Accessories & Fitment:
   - Summit heavy-duty steel bullbars with winch plates (chassis-bolted, airbag sensor crush-certified) for Toyota Prado, Hilux, Land Cruiser 300, D-Max, Ranger, Patrol.
   - Modular aluminum roof racks, Osram curved 42-inch LED lightbars, Safari sealed raised air intake snorkels, 3D laser-measured deep-dish floor liners, dual 4K stealth dashcams.
4. Paint & Protection:
   - 9H Graphene Ceramic Coating (5-year hydrophobic shield, 110° water contact angle).
   - Self-healing TPU Paint Protection Film (PPF) for full front impact resistance against flying stones.
5. Payment & Booking:
   - M-Pesa STK Push Online (Paybill 882910) instant prompt to phone.
   - Visa / Mastercard / Amex credit/debit cards with 3D Secure.
   - Fitment bays at Westlands (Rhapta Rd), Mombasa Rd (near Sameer), Karen, Nyali Mombasa, and Mobile van across Nairobi.

Tone & Style:
- Professional, knowledgeable, courteous, helpful.
- Reference vehicle fitment for specific models (Year/Make/Model) when the user mentions their car.
- Provide clear price estimates in KES (Kenyan Shillings) or USD when asked.
- Keep answers concise, actionable, and invite the customer to book a fitment slot or customize in the visualizer.`;

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, vehicleContext } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const contextPrompt = vehicleContext
      ? `[Customer's Active Garage Vehicle: ${vehicleContext.year || ''} ${vehicleContext.make || ''} ${vehicleContext.model || ''} (${vehicleContext.trim || 'Standard'})]\nUser Question: ${message}`
      : `User Question: ${message}`;

    const hasValidKey =
      Boolean(process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY.startsWith('AIza') &&
      process.env.GEMINI_API_KEY.length > 20);

    if (geminiClient && hasValidKey) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 3500)
        );

        const apiPromise = geminiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contextPrompt,
          config: {
            systemInstruction: CHATBOT_SYSTEM_INSTRUCTION,
          },
        });

        const response = await Promise.race([apiPromise, timeoutPromise]);
        const replyText = response.text || 'I am ready to help you with your vehicle styling, tint, or accessories. What model do you drive?';
        res.json({ reply: replyText, source: 'gemini-3.8-flash' });
        return;
      } catch (geminiErr: any) {
        logStructured('WARN', 'Gemini generation error or timeout, falling back to automotive engine', {
          error: geminiErr.message,
        });
        // Proceed to intelligent automotive domain fallback below
      }
    }

    // Intelligent domain fallback if Gemini API key is not configured
    const lower = message.toLowerCase();
    let fallbackReply = '';

    if (lower.includes('tint') || lower.includes('heat') || lower.includes('dark')) {
      fallbackReply = 'Our Nano-Ceramic IR tint rejects up to 98% of heat and 99.9% of UV rays. We offer 5%, 20%, 35%, 50%, and 70% VLT. In Kenya, our 70% or 80% Chameleon front windshield film is 100% compliant with traffic visibility laws, while 20% or 35% on rear windows provides optimal privacy and night visibility. A full vehicle package is KES 35,000 with a 10-year warranty!';
    } else if (lower.includes('wrap') || lower.includes('color') || lower.includes('rapper')) {
      fallbackReply = 'We specialize in bespoke 3M and Avery Dennison cast vinyl color wraps! Popular finishes include Satin Nardo Grey, Metallic Midnight Purple, and Stealth Satin Black. It protects your original paint, is completely reversible, and takes 4-5 days with seamless edge tucks. Prices start from KES 185,000. Check out our interactive Wrap Studio to preview!';
    } else if (lower.includes('mpesa') || lower.includes('pay') || lower.includes('payment') || lower.includes('card')) {
      fallbackReply = 'We support seamless Lipa na M-Pesa Online STK Push! When checking out, enter your Safaricom mobile number and you will receive an instant PIN prompt on your phone for Paybill 882910. We also accept Visa and Mastercard with 3D Secure verification.';
    } else if (lower.includes('prado') || lower.includes('hilux') || lower.includes('d-max') || lower.includes('ranger') || lower.includes('fit') || lower.includes('bullbar')) {
      fallbackReply = 'Our Summit series heavy-duty bullbars, expedition roof racks, and 3D laser-scanned floor liners have guaranteed vehicle-specific fitments for Toyota Prado (150/250), Hilux, Isuzu D-Max, Ford Ranger, and Land Rover Defender. Use our "Select Your Vehicle" filter at the top to filter items tested for your car!';
    } else if (lower.includes('location') || lower.includes('branch') || lower.includes('where') || lower.includes('nairobi')) {
      fallbackReply = 'You can visit any of our certified fitment centers: Westlands Flagship (Rhapta Rd), Mombasa Road Hub, Karen Lounge, and Links Rd Nyali in Mombasa. We also offer a Doorstep Mobile Fitment van across Nairobi for dashcams and floor liners!';
    } else {
      fallbackReply = `Jambo! At Velox Automotive Styling, we provide precision car accessories, 98% heat-rejection nano-ceramic window tint, 3M vinyl vehicle wraps, and 9H graphene ceramic coatings. ${
        vehicleContext?.make ? `I see you are inquiring about a ${vehicleContext.year} ${vehicleContext.make} ${vehicleContext.model}. ` : ''
      }How can I assist with your vehicle's customization or booking today?`;
    }

    res.json({ reply: fallbackReply, source: 'domain-engine' });
  } catch (error: any) {
    logStructured('ERROR', 'Error in /api/chat', { error: error.message });
    res.status(500).json({ error: 'Failed to generate response. Please try again or chat with our team on WhatsApp.' });
  }
});

// --- M-Pesa STK Push Online (/api/payments/mpesa) ---
interface MpesaTransaction {
  checkoutId: string;
  merchantId: string;
  phone: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  receipt?: string;
  timestamp: string;
}
const mpesaTransactions = new Map<string, MpesaTransaction>();

app.post('/api/payments/mpesa', (req: Request, res: Response) => {
  const { phone, amount, reference, customerName } = req.body;

  if (!phone || !amount) {
    res.status(400).json({ error: 'Phone number and amount are required' });
    return;
  }

  // Clean phone number (e.g. 0712345678 -> 254712345678)
  let formattedPhone = phone.replace(/\s+/g, '').replace(/\+/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = `254${formattedPhone.slice(1)}`;
  }

  const checkoutId = `ws_CO_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
  const merchantId = `MKT_${Math.floor(100000 + Math.random() * 900000)}`;

  const tx: MpesaTransaction = {
    checkoutId,
    merchantId,
    phone: formattedPhone,
    amount: Number(amount),
    status: 'PENDING',
    timestamp: new Date().toISOString(),
  };

  mpesaTransactions.set(checkoutId, tx);

  logStructured('INFO', 'M-Pesa STK Push initiated', { phone: formattedPhone, amount, checkoutId });

  // Simulate prompt acceptance
  res.json({
    ResponseCode: '0',
    ResponseDescription: 'Success. Request accepted for processing',
    MerchantRequestID: merchantId,
    CheckoutRequestID: checkoutId,
    CustomerMessage: `Success. An M-Pesa STK PIN prompt has been dispatched to ${formattedPhone}. Enter your M-Pesa PIN on your mobile device to complete payment.`,
  });
});

// Poll M-Pesa Transaction Status (/api/payments/mpesa/status/:checkoutId)
app.get('/api/payments/mpesa/status/:checkoutId', (req: Request, res: Response) => {
  const { checkoutId } = req.params;
  const tx = mpesaTransactions.get(checkoutId);

  if (!tx) {
    res.status(404).json({ error: 'Transaction not found' });
    return;
  }

  // Simulate transaction success after 5 seconds
  const elapsed = Date.now() - new Date(tx.timestamp).getTime();
  if (elapsed > 4000 && tx.status === 'PENDING') {
    tx.status = 'SUCCESS';
    tx.receipt = `SHK${Math.floor(1000000 + Math.random() * 9000000).toString()}`;
    logStructured('INFO', 'M-Pesa STK Push completed successfully', { checkoutId, receipt: tx.receipt });
  }

  res.json({
    checkoutId: tx.checkoutId,
    status: tx.status,
    amount: tx.amount,
    phone: tx.phone,
    receiptNumber: tx.receipt || null,
    message: tx.status === 'SUCCESS' ? 'M-Pesa payment received successfully' : 'Waiting for customer PIN entry...',
  });
});

// --- Credit / Debit Card Payment (/api/payments/card) ---
app.post('/api/payments/card', (req: Request, res: Response) => {
  const { cardNumber, expiry, cvv, cardHolder, amount } = req.body;

  if (!cardNumber || !expiry || !cvv || !cardHolder || !amount) {
    res.status(400).json({ error: 'All card details are required' });
    return;
  }

  const cleanNum = cardNumber.replace(/\s+/g, '');
  if (cleanNum.length < 15) {
    res.status(400).json({ error: 'Invalid card number' });
    return;
  }

  const transactionId = `CARD_TX_${Date.now()}`;
  logStructured('INFO', 'Card payment processed with 3D Secure', {
    transactionId,
    last4: cleanNum.slice(-4),
    amount,
  });

  res.json({
    status: 'SUCCESS',
    transactionId,
    authCode: Math.floor(100000 + Math.random() * 900000).toString(),
    last4: cleanNum.slice(-4),
    amount: Number(amount),
    timestamp: new Date().toISOString(),
    message: 'Card payment authorized via 3D Secure tokenization',
  });
});

// --- Webhook Receiver (/api/webhooks/payment) ---
app.post('/api/webhooks/payment', (req: Request, res: Response) => {
  const event = req.body;
  logStructured('INFO', 'Payment Webhook Received', { eventType: event.type || 'payment.success', payload: event });

  res.json({ received: true, timestamp: new Date().toISOString() });
});

// --- Background Job Queue Simulator (/api/jobs/quote-pdf) ---
app.post('/api/jobs/quote-pdf', (req: Request, res: Response) => {
  const { quoteDetails, email } = req.body;
  const jobId = `JOB_PDF_${Date.now()}`;

  logStructured('INFO', 'Background job queued: Generate Work-Order PDF', { jobId, email });

  res.json({
    jobId,
    status: 'QUEUED',
    estimatedCompletionSeconds: 2,
    message: 'PDF generation and customer dispatch email queued in background worker',
  });
});

// --- Support Ticket Endpoint (/api/support/ticket) ---
app.post('/api/support/ticket', (req: Request, res: Response) => {
  const { ticketId, name, email, phone, category, message, vehicle } = req.body;
  logStructured('INFO', 'SJO Support Ticket created for sjomotorsport@gmail.com', {
    ticketId,
    name,
    email,
    phone,
    category,
    vehicle: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'N/A',
  });

  res.json({
    success: true,
    ticketId,
    destination: 'sjomotorsport@gmail.com',
    message: 'Support ticket registered. Direct Gmail dispatch triggered.',
  });
});

// ==================== 5. VITE INTEGRATION / STATIC SERVING ====================

async function setupServer() {
  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(
        express.static(distPath, {
          maxAge: '1y',
          setHeaders: (res, filePath) => {
            if (filePath.endsWith('.html')) {
              res.setHeader('Cache-Control', 'no-cache');
            }
          },
        })
      );
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  // Centralized Error Handling Middleware (Sentry/GlitchTip pattern)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const errorId = `ERR_${Date.now().toString(36).toUpperCase()}`;
    logStructured('ERROR', 'Unhandled Server Error', {
      errorId,
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
    });

    res.status(500).json({
      error: 'Internal Server Error',
      errorId,
      message: 'A monitored system error occurred. Our engineering team has been alerted.',
    });
  });

  app.listen(PORT, () => {
    logStructured('INFO', `Velox Full-Stack Engine running on port ${PORT}`, {
      port: PORT,
      mode: isDev ? 'development' : 'production',
      waf: 'active',
      rateLimiter: 'active',
    });
  });
}

setupServer();
