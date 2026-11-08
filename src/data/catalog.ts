import { ProductItem } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_automotive_wrap_tint_1794065654702.jpg';
export const WRAP_STUDIO_IMAGE = '/src/assets/images/product_vinyl_wrap_studio_1794065655894.jpg';
export const TINT_STUDIO_IMAGE = '/src/assets/images/service_ceramic_window_tint_1794065656843.jpg';
export const ACCESSORIES_4X4_IMAGE = '/src/assets/images/product_car_accessories_4x4_1794065656626.jpg';

export const CATALOG_PRODUCTS: ProductItem[] = [
  // ==================== CAR ACCESSORIES ====================
  {
    id: 'arb-stealth-bullbar',
    name: 'Summit Series Heavy-Duty Steel Bullbar with Winch Mount',
    category: 'accessories',
    categoryLabel: '4x4 Accessories',
    subcategory: 'Bullbars & Protection',
    priceKes: 145000,
    priceUsd: 1120,
    rating: 4.9,
    reviewCount: 42,
    image: ACCESSORIES_4X4_IMAGE,
    description: 'Precision engineered structural steel frontal protection system with integrated fog lights, hi-lift jack points, and airbag-compatible mounting brackets. Designed for rigorous off-road expedition conditions.',
    features: [
      'Cold-rolled 3.5mm thick high-tensile steel construction',
      'Airbag sensor certified crush zones',
      'Twin aerial antenna tabs and winch-ready base plate',
      'Textured black anti-corrosion powder coat finish'
    ],
    specs: {
      'Material': 'Structural Grade Steel 3.5mm',
      'Finish': 'Polyester Powder Coat Satin Black',
      'Winch Capacity': 'Up to 12,500 lbs rated',
      'Mounting': 'Chassis bolted direct replacement'
    },
    fitmentType: 'specific',
    compatibleVehicles: [
      { make: 'Toyota', model: 'Land Cruiser Prado (150/250)' },
      { make: 'Toyota', model: 'Land Cruiser 300 / 200' },
      { make: 'Toyota', model: 'Hilux Double Cab' },
      { make: 'Toyota', model: 'Land Cruiser 79 / 76 / 78' },
      { make: 'Isuzu', model: 'D-Max Double Cab' },
      { make: 'Ford', model: 'Ranger' },
      { make: 'Nissan', model: 'Patrol Y62 / Y61' }
    ],
    badge: 'Popular 4x4',
    inStock: true,
    installTime: '3.5 Hours',
    warranty: '3 Years Warranty'
  },
  {
    id: 'slimline-expedition-roof-rack',
    name: 'Low-Profile Modular Aluminum Roof Rack Platform',
    category: 'accessories',
    categoryLabel: '4x4 Accessories',
    subcategory: 'Roof Racks & Cargo',
    priceKes: 88000,
    priceUsd: 680,
    rating: 4.8,
    reviewCount: 38,
    image: ACCESSORIES_4X4_IMAGE,
    description: 'Aerodynamic, ultra-strong lightweight T6 aluminum roof platform with slotted slat channels for mounting roof tents, jerry cans, recovery boards, and camp accessories.',
    features: [
      'Full black powder-coated structural aluminum',
      'Aero-deflector minimizes highway wind noise',
      'Rated for 300kg dynamic load capacity',
      'Modular t-slot tracks for rapid bracket tie-down'
    ],
    specs: {
      'Dynamic Load': '300 kg (660 lbs)',
      'Static Load': '450 kg (Rooftop tent rated)',
      'Weight': '26 kg complete rack kit',
      'Hardware': 'Stainless steel 316 anti-rust'
    },
    fitmentType: 'specific',
    compatibleVehicles: [
      { make: 'Toyota', model: 'Land Cruiser Prado (150/250)' },
      { make: 'Toyota', model: 'Land Cruiser 300 / 200' },
      { make: 'Toyota', model: 'Hilux Double Cab' },
      { make: 'Subaru', model: 'Forester' },
      { make: 'Subaru', model: 'Outback' },
      { make: 'Land Rover', model: 'Defender (110 / 90 / 130)' },
      { make: 'Ford', model: 'Ranger' },
      { make: 'Isuzu', model: 'D-Max Double Cab' }
    ],
    badge: 'Expedition Spec',
    inStock: true,
    installTime: '2 Hours',
    warranty: 'Lifetime structural'
  },
  {
    id: 'vision-dual-4k-dashcam',
    name: 'Apex 4K UHD Dual Front & Rear Stealth Dashcam with Parking Radar',
    category: 'accessories',
    categoryLabel: 'Electronics & Gadgets',
    subcategory: 'Electronics',
    priceKes: 28500,
    priceUsd: 220,
    rating: 4.9,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-HD front 4K Sony Starvis sensor with 1080p rear camera, built-in GPS speed logging, 24/7 hardwire parking impact sensor, and instantaneous 5GHz Wi-Fi smartphone playback.',
    features: [
      'Sony STARVIS 2 Night Vision HDR lens',
      'Built-in G-Sensor with emergency event auto-lock',
      'Continuous loop recording with voice command prompt',
      'Direct fuse-box hardwire kit included for 24h motion surveillance'
    ],
    specs: {
      'Resolution': '3840 x 2160p @ 30fps (Front) + 1080p (Rear)',
      'Viewing Angle': '170° ultra-wide panoramic lens',
      'Memory': 'Supports up to 256GB MicroSD (64GB included)',
      'Connectivity': 'Dual-Band 5GHz WiFi + GPS tracker'
    },
    fitmentType: 'universal',
    badge: 'Bestseller',
    inStock: true,
    installTime: '45 Mins',
    warranty: '2 Years Replacement'
  },
  {
    id: 'laser-measured-floor-liners',
    name: '3D Laser-Scanned Deep Dish All-Weather TPE Floor Liners',
    category: 'accessories',
    categoryLabel: 'Interior Accessories',
    subcategory: 'Interior Styling',
    priceKes: 18500,
    priceUsd: 140,
    rating: 4.9,
    reviewCount: 114,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    description: 'Custom-fit 3D digitized floor liners with 5cm raised sidewalls protecting against red Kenyan dust, mud, coffee spills, and heavy boots. Zero chemical smell, non-slip retention clips.',
    features: [
      'Vehicle-specific mold perfectly hugging floor contours',
      'High-walled bucket design trapping sand and liquids',
      'Heavy-duty non-slip waterproof vulcanized TPE',
      'Quick jet-wash clean and instant dry'
    ],
    specs: {
      'Coverage': 'Front Row (Driver & Passenger) + 2nd Row Full Bench',
      'Material': 'High-Density Thermoplastic Elastomer (TPE)',
      'Locking': 'Factory floor anchor clip compatible'
    },
    fitmentType: 'specific',
    compatibleVehicles: [
      { make: 'Toyota', model: 'Land Cruiser Prado (150/250)' },
      { make: 'Toyota', model: 'Hilux Double Cab' },
      { make: 'Toyota', model: 'Land Cruiser 300 / 200' },
      { make: 'Subaru', model: 'Forester' },
      { make: 'Subaru', model: 'Outback' },
      { make: 'Isuzu', model: 'D-Max Double Cab' },
      { make: 'Ford', model: 'Ranger' },
      { make: 'Mercedes-Benz', model: 'C-Class (W205 / W206)' },
      { make: 'BMW', model: 'X5 (F15 / G05)' }
    ],
    badge: 'Guaranteed Fit',
    inStock: true,
    installTime: '10 Mins (Plug & Play)',
    warranty: '5 Years'
  },
  {
    id: 'rigid-hyper-led-lightbar',
    name: 'Curved Osram LED 42-Inch Dual-Row Driving Light Bar (38,000 LM)',
    category: 'accessories',
    categoryLabel: '4x4 Accessories',
    subcategory: 'Lighting & Electric',
    priceKes: 34000,
    priceUsd: 260,
    rating: 4.8,
    reviewCount: 52,
    image: ACCESSORIES_4X4_IMAGE,
    description: 'Military-grade IP68 submersible combo beam driving lamp projecting daylight-crisp white illumination over 1,200 meters into unlit bush paths and highways.',
    features: [
      'Authentic German Osram 5W High-Output LEDs',
      'Combo spot 10° and flood 45° optical reflectors',
      'Integrated military pressure breather valve preventing internal fogging',
      'Includes relay harness, rocker switch, and theft-proof stainless bolts'
    ],
    specs: {
      'Luminous Output': '38,000 Lumens / 280 Watts',
      'Waterproof Rating': 'IP68 & IP69K Pressure-jet rated',
      'Color Temp': '5700K Crisp Day White (Reduces driver eye fatigue)'
    },
    fitmentType: 'universal',
    inStock: true,
    installTime: '1.5 Hours',
    warranty: '3 Years'
  },
  {
    id: 'raised-air-intake-snorkel',
    name: 'Safari Deep Water & Dust Sealed Raised Air Intake Snorkel Kit',
    category: 'accessories',
    categoryLabel: '4x4 Accessories',
    subcategory: 'Performance & Air',
    priceKes: 24500,
    priceUsd: 190,
    rating: 4.9,
    reviewCount: 29,
    image: ACCESSORIES_4X4_IMAGE,
    description: 'Relocates engine air intake above the dust cloud and water line. Ensures clean, dry, cooler air intake while traversing deep mud or safari river fords.',
    features: [
      'UV-stabilized Linear Low-Density Polyethylene (LLDPE)',
      'Integrated water separation ram head grille',
      'Chassis and A-pillar precision mounting template',
      'Maximizes fuel economy by drawing cooler ambient air'
    ],
    specs: {
      'Material': 'UV20 Grade Virgin LLDPE Polymer',
      'Ram Head': '3.5 inch swivel pre-cleaner compatible',
      'Airflow': 'Calculated to exceed OEM flow demands'
    },
    fitmentType: 'specific',
    compatibleVehicles: [
      { make: 'Toyota', model: 'Land Cruiser Prado (150/250)' },
      { make: 'Toyota', model: 'Hilux Double Cab' },
      { make: 'Toyota', model: 'Land Cruiser 79 / 76 / 78' },
      { make: 'Ford', model: 'Ranger' },
      { make: 'Isuzu', model: 'D-Max Double Cab' },
      { make: 'Nissan', model: 'Patrol Y62 / Y61' }
    ],
    badge: 'Safari Ready',
    inStock: true,
    installTime: '2.5 Hours',
    warranty: '5 Years'
  },

  // ==================== CERAMIC WINDOW TINT ====================
  {
    id: 'ultra-nano-ceramic-tint-package',
    name: 'Nano-Ceramic IR 98% Heat-Rejection Complete Vehicle Tint Package',
    category: 'tint',
    categoryLabel: 'Window Tinting',
    subcategory: 'Ceramic Window Film',
    priceKes: 35000,
    priceUsd: 270,
    rating: 5.0,
    reviewCount: 184,
    image: TINT_STUDIO_IMAGE,
    description: 'Multi-layer aerospace nano-ceramic window film that drastically reduces cabin heat without interfering with GPS, cell signals, or keyless remotes. Blocks 99% UV rays and rejects 98% infrared heat.',
    features: [
      'Infrared (IR) heat rejection up to 98% (Tested in East Africa sun)',
      '99.9% UV protection preventing interior leather cracking and dash fade',
      'Zero metal particles — 100% signal safe for mobile & navigation',
      'Available in 5%, 20%, 35%, 50%, and 70% VLT'
    ],
    specs: {
      'Heat Rejection (IR)': '98% @ 950nm - 1400nm',
      'Total Solar Energy Rejection (TSER)': 'Up to 71%',
      'Thickness': '2.0 mil Dual-Ply Ceramic Scratch Resistant',
      'Includes': 'All side windows + rear windscreen'
    },
    fitmentType: 'universal',
    badge: 'Top Rated Service',
    inStock: true,
    installTime: '2.5 - 3 Hours in Dust-Free Booth',
    warranty: '10 Years Bubble & Fade-Free'
  },
  {
    id: 'anti-smash-grab-safety-film',
    name: '8-Mil Ballistic-Grade Anti-Smash & Grab Security Film Package',
    category: 'tint',
    categoryLabel: 'Window Tinting',
    subcategory: 'Security & Safety Tint',
    priceKes: 42000,
    priceUsd: 320,
    rating: 4.9,
    reviewCount: 98,
    image: TINT_STUDIO_IMAGE,
    description: 'Heavyweight 8-mil multi-ply safety film anchored to window frames. Holds shattered glass firmly in place during traffic smash-and-grab attempts or accidental flying stone impacts.',
    features: [
      'Heavy 8-mil (200 micron) tensile break strength',
      'Prevents quick intrusion in traffic smash and grab scenarios',
      'Combined with 35% or 20% ceramic privacy tint',
      'Specialized edge-anchoring structural bond primer'
    ],
    specs: {
      'Film Thickness': '8 mil / 200 Microns heavy security core',
      'Tensile Strength': '28,000 PSI Break resistance',
      'UV Rejection': '99%',
      'Includes': 'Driver, Passenger & All 4 side windows'
    },
    fitmentType: 'universal',
    badge: 'Security Essential',
    inStock: true,
    installTime: '3.5 Hours',
    warranty: '7 Years Warranty'
  },
  {
    id: 'front-windshield-chameleon-ir',
    name: 'Apex Chameleon IR 80% Legal Front Windshield Solar Heat Shield',
    category: 'tint',
    categoryLabel: 'Window Tinting',
    subcategory: 'Front Windshield Tint',
    priceKes: 16000,
    priceUsd: 125,
    rating: 4.8,
    reviewCount: 65,
    image: TINT_STUDIO_IMAGE,
    description: 'Ultra-clear front windscreen film with subtle iridescent polarization that cuts intense dashboard glare and steering wheel scorching while remaining 100% compliant with traffic visibility regulations.',
    features: [
      'High optical clarity with subtle chameleon purple-blue solar sheen',
      'Keeps cockpit and air conditioner up to 14°C cooler',
      'Reduces nighttime oncoming LED headlight glare by 40%',
      'Retains HUD heads-up display clarity without ghosting'
    ],
    specs: {
      'Visible Light Transmission (VLT)': '80% (Traffic Legal Clear)',
      'IR Heat Cut': '92%',
      'UV Shield': '99.9%'
    },
    fitmentType: 'universal',
    inStock: true,
    installTime: '1.5 Hours',
    warranty: '5 Years'
  },

  // ==================== CAR WRAPS ("RAPPER" VINYL STUDIO) ====================
  {
    id: 'full-body-color-change-wrap',
    name: 'Custom Full Vehicle Vinyl Color Change Wrap (3M / Avery Dennison)',
    category: 'wraps',
    categoryLabel: 'Vehicle Wraps',
    subcategory: 'Full Body Wraps',
    priceKes: 185000,
    priceUsd: 1420,
    rating: 5.0,
    reviewCount: 89,
    image: WRAP_STUDIO_IMAGE,
    description: 'Transform your vehicle without repainting. Premium cast vinyl wrap with air-release adhesive, tucked seamlessly behind door jams, lights, and moldings. Reversible and preserves original factory paint underneath.',
    features: [
      'Choice of 120+ finishes: Satin Matte, High-Gloss Metallic, Frozen Silk, Chalk',
      'Top-tier genuine 3M 2080 & Avery Dennison Supreme Wrapping Film',
      'Complete vehicle disassembly for deep tucks: zero visible original edges',
      'Removable without adhesive residue when selling or returning to stock'
    ],
    specs: {
      'Film Type': 'Dual-layer cast vinyl with protective cap sheet',
      'Durability': '5 to 7 Years exterior life in tropical UV',
      'Finishes Available': 'Satin Nardo Grey, Midnight Purple, Matte Stealth Black, Khaki, Frozen Blue',
      'Process': 'Deep decontamination, clay bar, disassembly, tuck & post-heat'
    },
    fitmentType: 'universal',
    badge: 'Master Wrapper',
    inStock: true,
    installTime: '4 - 5 Days',
    warranty: '3 Years Installation & Peeling Warranty'
  },
  {
    id: 'stealth-chrome-delete-package',
    name: 'Stealth Blackout Chrome Delete Package (Window Trim + Grille + Badges)',
    category: 'wraps',
    categoryLabel: 'Vehicle Wraps',
    subcategory: 'Chrome Delete',
    priceKes: 38000,
    priceUsd: 290,
    rating: 4.9,
    reviewCount: 142,
    image: WRAP_STUDIO_IMAGE,
    description: 'Eliminates distracting shiny chrome window moldings, roof rails, and front grill accents. Gives your vehicle an aggressive, modern OEM Shadowline / Night Package appearance.',
    features: [
      'High-gloss or satin black cast vinyl wrap applied to all chrome window strips',
      'Plasti-dip or wrapped black front grill louvers and fog surrounds',
      'Blackout badging or emblem debadging styling',
      'Pressure-washer safe and UV stabilized'
    ],
    specs: {
      'Finish': 'Gloss Piano Black or Satin Dark Obsidian',
      'Coverage': 'Window surrounds, mirror accents, side blades, front grille slats',
      'Turnaround': 'Same-Day Service (4 to 6 Hours)'
    },
    fitmentType: 'universal',
    badge: 'Most Popular',
    inStock: true,
    installTime: 'Same Day (5 Hours)',
    warranty: '2 Years'
  },
  {
    id: 'forged-carbon-fiber-wrap-accent',
    name: '3D Embossed & Forged Carbon Fiber Bonnet / Roof / Mirror Wrap Kit',
    category: 'wraps',
    categoryLabel: 'Vehicle Wraps',
    subcategory: 'Carbon Accents',
    priceKes: 28000,
    priceUsd: 215,
    rating: 4.8,
    reviewCount: 57,
    image: WRAP_STUDIO_IMAGE,
    description: 'Realistic forged carbon fiber or 4D twill weave vinyl accent wrap for vehicle hood, mirrors, rear roof spoiler, and interior dashboard trim panels.',
    features: [
      'Tactile gloss clear-coat carbon fiber weave pattern',
      'UV protective high-gloss acrylic laminate top layer',
      'Protects hood against flying highway gravel and stone chips',
      'Bubble-free micro air channel backing'
    ],
    specs: {
      'Pattern': 'Forged Marble Carbon or 4D Twill Weave Gloss',
      'Heat Resistance': 'Up to 110°C (Engine bay heat resistant)',
      'Recommended Zones': 'Engine Hood, Roof Panel, or Mirror Caps'
    },
    fitmentType: 'universal',
    inStock: true,
    installTime: '3 Hours',
    warranty: '3 Years'
  },
  {
    id: 'commercial-fleet-branding-livery',
    name: 'Commercial Fleet Branding, Livery & High-Impact Promotional Wrap',
    category: 'wraps',
    categoryLabel: 'Vehicle Wraps',
    subcategory: 'Fleet & Livery',
    priceKes: 120000,
    priceUsd: 920,
    rating: 4.9,
    reviewCount: 31,
    image: WRAP_STUDIO_IMAGE,
    description: 'Full or half vehicle branded vinyl wrapping with high-resolution digital latex printing and anti-fade laminate. Perfect for corporate pickup fleets, safari tour vans, and racing livery.',
    features: [
      'Photo-quality 1440 DPI latex printing with vivid brand colors',
      'Matching pantone corporate brand guidelines',
      'Heavy-duty cast laminate resisting bush scratches and road chemicals',
      'Custom graphic design consultation included'
    ],
    specs: {
      'Ink Tech': 'Eco-Latex fade resistant UV cured ink',
      'Laminate': 'Gloss or Matte UV barrier shield',
      'Fleet Discount': 'Volume pricing available for 3+ units'
    },
    fitmentType: 'universal',
    inStock: true,
    installTime: '3 Days',
    warranty: '3 Years UV Non-Fade'
  },

  // ==================== AUTO PAINT & PPF / DETAILING ====================
  {
    id: 'graphene-9h-ceramic-coating',
    name: 'Velox 9H Graphene Ceramic Coating Matrix (5-Year Hydrophobic Shield)',
    category: 'paint_ppf',
    categoryLabel: 'Paint & Detailing',
    subcategory: 'Ceramic Coatings',
    priceKes: 65000,
    priceUsd: 500,
    rating: 5.0,
    reviewCount: 104,
    image: HERO_IMAGE,
    description: 'Infused with reduced graphene oxide nanoparticles creating an ultra-slick, extreme water-beading glass armor. Reduces heat absorption, water spotting, and provides deep mirror gloss.',
    features: [
      'Includes complete 2-stage machine polish & scratch paint correction',
      '110° extreme water contact angle: dirt and road grime slide right off',
      'Superior resistance to bird droppings, tree sap, and acid rain etching',
      'Hard 9H pencil hardness scratch barrier'
    ],
    specs: {
      'Hardness': '9H+ Real Pencil Hardness Test Certified',
      'Layers': '2 Base coats + 1 Graphene Top Coat + Wheel Faces',
      'Durability': 'Up to 5 Years with annual maintenance spray'
    },
    fitmentType: 'universal',
    badge: 'Deep Mirror Gloss',
    inStock: true,
    installTime: '2 Days (Including Curing)',
    warranty: '5 Years Certificate'
  },
  {
    id: 'tpu-self-healing-ppf-full-front',
    name: 'Self-Healing TPU Paint Protection Film (PPF) — Full Front Impact Kit',
    category: 'paint_ppf',
    categoryLabel: 'Paint Protection Film',
    subcategory: 'PPF Film',
    priceKes: 160000,
    priceUsd: 1230,
    rating: 4.9,
    reviewCount: 46,
    image: HERO_IMAGE,
    description: 'Optically clear 8.5-mil thermoplastic polyurethane (TPU) armor. Scratches and swirl marks self-heal automatically in sunlight or warm water. Defends front bumper, hood, fenders, and mirrors against flying stones.',
    features: [
      'Self-healing elastomeric polymer clear coat',
      'Computer-cut precision templates tailored to each vehicle make & model',
      'Anti-yellowing UV inhibitors engineered for harsh equatorial climates',
      'Hydrophobic topcoat resisting road tar and insect stains'
    ],
    specs: {
      'Thickness': '8.5 mil (215 microns) Premium TPU',
      'Coverage': 'Front Bumper, Full Hood, Front Fenders, Headlights, Side Mirrors',
      'Heal Activation': 'Heals scratches above 35°C / Hot Water'
    },
    fitmentType: 'specific',
    compatibleVehicles: [
      { make: 'Toyota', model: 'Land Cruiser Prado (150/250)' },
      { make: 'Toyota', model: 'Land Cruiser 300 / 200' },
      { make: 'Toyota', model: 'Hilux Double Cab' },
      { make: 'Land Rover', model: 'Defender (110 / 90 / 130)' },
      { make: 'Range Rover Sport', model: 'Range Rover Sport / Vogue' },
      { make: 'Mercedes-Benz', model: 'G-Class G63 / G400d' },
      { make: 'Mercedes-Benz', model: 'GLE / ML-Class' },
      { make: 'BMW', model: 'X5 (F15 / G05)' },
      { make: 'Ford', model: 'Ranger' }
    ],
    badge: 'Ultimate Paint Armor',
    inStock: true,
    installTime: '3 Days',
    warranty: '10 Years Delamination & Yellowing'
  },
  {
    id: 'custom-caliper-high-heat-paint',
    name: 'Custom Brake Caliper High-Heat Enamel Paint & Decal Styling',
    category: 'paint_ppf',
    categoryLabel: 'Paint & Detailing',
    subcategory: 'Custom Paint',
    priceKes: 22000,
    priceUsd: 170,
    rating: 4.9,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    description: 'Transform OEM dull calipers into performance showstoppers. Precision cleaned, masked, primed, coated with high-temp ceramic brake enamel, and clear-coated with high-heat brand stencils.',
    features: [
      'Color options: Brembo Rosso Red, Porsche Acid Green, M-Power Blue, Speed Yellow, Burnt Copper',
      'Withstands continuous temperatures up to 500°C',
      'Resistant to brake dust etching, wheel cleaners, and road salt',
      'Includes custom high-temp vinyl logos (Brembo, GR, AMG, M-Performance)'
    ],
    specs: {
      'Paint': 'Ceramic-fortified high-heat brake caliper system',
      'Includes': 'All 4 Calipers prepped, primed, painted, decaled & clear coated',
      'Turnaround': 'Same day (4 hours)'
    },
    fitmentType: 'universal',
    inStock: true,
    installTime: '4 Hours',
    warranty: '2 Years Chip-Free'
  },
  {
    id: 'stage-3-paint-correction-scratch-removal',
    name: 'Multi-Stage Heavy Paint Correction & Swirl Mark Restoration',
    category: 'paint_ppf',
    categoryLabel: 'Paint & Detailing',
    subcategory: 'Detailing & Polish',
    priceKes: 28000,
    priceUsd: 215,
    rating: 4.8,
    reviewCount: 63,
    image: HERO_IMAGE,
    description: 'Restores weathered, oxidized, or wash-scratched automotive paint to showroom optical depth. Precision rotary and dual-action rotary compounding removing 85-95% of clear coat imperfections.',
    features: [
      'Removes spider-web scratches, buffer holograms, and oxidation',
      'Micron paint depth gauge measurement before compounding to preserve clear coat',
      'Includes clay bar chemical decontamination and iron fallout remover',
      'Finished with high-carnauba sealant glaze for wet-look reflection'
    ],
    specs: {
      'Process': 'Stage 1 Heavy Cut + Stage 2 Refining Polish + Stage 3 Jewel Glaze',
      'Scratch Removal': 'Eliminates 85-95% of swirl marks without thinning clear coat'
    },
    fitmentType: 'universal',
    inStock: true,
    installTime: '1 Full Day',
    warranty: 'Satisfaction Guaranteed'
  }
];

export const BRANCHES = [
  {
    id: 'nairobi-westlands',
    name: 'Westlands Flagship Studio',
    city: 'Nairobi',
    address: 'Rhapta Road, Westlands, Nairobi',
    phone: '+254 712 345 678',
    features: ['Dust-Free Tint Booth', 'PPF Clean Room', '4x4 Lift Bays', 'Customer VIP Lounge'],
    hours: 'Mon - Sat: 8:00 AM - 6:30 PM'
  },
  {
    id: 'nairobi-mombasa-rd',
    name: 'Mombasa Road Fitment Hub',
    city: 'Nairobi',
    address: 'Near Sameer Business Park, Mombasa Rd, Nairobi',
    phone: '+254 722 987 654',
    features: ['Heavy Vehicle Bay', 'Fleet Branding Studio', 'Express 2-Hour Tint', 'Bullbar Fitting'],
    hours: 'Mon - Sat: 7:30 AM - 7:00 PM'
  },
  {
    id: 'nairobi-karen',
    name: 'Karen Detailing & Styling Lounge',
    city: 'Nairobi',
    address: 'Karen Road, opposite The Hub, Karen',
    phone: '+254 733 456 789',
    features: ['Ceramic Coating Suite', 'Bespoke Vinyl Wraps', 'Valet Pickup Service'],
    hours: 'Mon - Sat: 8:30 AM - 6:00 PM'
  },
  {
    id: 'mombasa-nyali',
    name: 'Mombasa Coastal Studio',
    city: 'Mombasa',
    address: 'Links Road, Nyali, Mombasa',
    phone: '+254 740 123 456',
    features: ['Salt-Spray Anti-Rust Coating', 'High-Heat Nano-Ceramic Tint', '4x4 Accessories'],
    hours: 'Mon - Sat: 8:00 AM - 6:00 PM'
  },
  {
    id: 'mobile-fitment',
    name: 'Doorstep Mobile Fitment Unit',
    city: 'Greater Nairobi Metro',
    address: 'We come to your home or office with our equipped mobile van',
    phone: '+254 700 888 999',
    features: ['On-Site Dashcam & Liner Fitment', 'Mobile Tinting (Enclosed Garage required)', 'Home Delivery'],
    hours: '7 Days a week: 8:00 AM - 5:30 PM'
  }
];

export const WRAP_COLORS = [
  { id: 'satin-nardo', name: 'Satin Nardo Grey', hex: '#5b6169', finish: 'Satin Matte', popular: true },
  { id: 'midnight-purple', name: 'Metallic Midnight Purple', hex: '#2e1065', finish: 'High Gloss Metallic', popular: true },
  { id: 'stealth-black', name: 'Stealth Satin Black', hex: '#18181b', finish: 'Satin Sheen', popular: true },
  { id: 'khaki-olive', name: 'Military Tactical Khaki', hex: '#414833', finish: 'Ultra Matte', popular: true },
  { id: 'frozen-blue', name: 'Frozen Riviera Blue', hex: '#1d4ed8', finish: 'Frozen Metallic', popular: false },
  { id: 'liquid-copper', name: 'Liquid Sunset Bronze', hex: '#9a3412', finish: 'Gloss Pearl', popular: false },
  { id: 'liquid-silver', name: 'Liquid Quicksilver', hex: '#94a3b8', finish: 'Chrome Gloss', popular: false },
  { id: 'acid-lime', name: 'Acid Competition Lime', hex: '#65a30d', finish: 'Satin Pearl', popular: false }
];

export const TINT_LEVELS = [
  { percent: 5, label: '5% Limo Privacy', desc: 'Maximum privacy & blackout look. Pitch dark from outside.' },
  { percent: 20, label: '20% Dark Smoke', desc: 'Sleek luxury privacy. Most popular rear window tint.' },
  { percent: 35, label: '35% Medium Cool', desc: 'Balanced privacy with excellent night optical visibility.' },
  { percent: 50, label: '50% Light Solar Shield', desc: 'Subtle executive tint with maximum IR heat rejection.' },
  { percent: 70, label: '70% Ultra-Clear Ceramic', desc: 'Virtually transparent nano-ceramic heat rejection. Windshield safe.' }
];
