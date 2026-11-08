import { VehicleModel } from '../types';

export const POPULAR_YEARS = Array.from({ length: 16 }, (_, i) => 2026 - i);

export const VEHICLE_DATABASE: VehicleModel[] = [
  // Toyota
  {
    id: 'toyota-land-cruiser-prado',
    make: 'Toyota',
    model: 'Land Cruiser Prado (150/250)',
    yearRange: [2010, 2026],
    category: 'SUV',
    trims: ['TX-L 2.8L GD-6', 'TZ-G 3.0L D-4D', 'VX 4.0L V6', 'First Edition 250'],
    popular: true,
  },
  {
    id: 'toyota-land-cruiser-300',
    make: 'Toyota',
    model: 'Land Cruiser 300 / 200',
    yearRange: [2012, 2026],
    category: 'SUV',
    trims: ['GR Sport 3.3L Twin Turbo', 'ZX V6', 'VX.R 4.5L V8'],
    popular: true,
  },
  {
    id: 'toyota-hilux',
    make: 'Toyota',
    model: 'Hilux Double Cab',
    yearRange: [2012, 2026],
    category: 'Pickup',
    trims: ['2.8 GD-6 4x4 Raider', '2.4 GD-6 4x4', 'GR Sport Edition', 'Revo Rocco'],
    popular: true,
  },
  {
    id: 'toyota-land-cruiser-79',
    make: 'Toyota',
    model: 'Land Cruiser 79 / 76 / 78',
    yearRange: [2010, 2026],
    category: 'Pickup',
    trims: ['4.5L V8 Single Cab', '4.5L V8 Double Cab', '4.2L 1HZ Hardtop', '2.8L Turbo Auto'],
    popular: true,
  },
  {
    id: 'toyota-fortuner',
    make: 'Toyota',
    model: 'Fortuner',
    yearRange: [2015, 2026],
    category: 'SUV',
    trims: ['2.8 GD-6 4x4', '2.4 GD-6', 'Epic Black Edition'],
    popular: true,
  },
  {
    id: 'toyota-rav4',
    make: 'Toyota',
    model: 'RAV4',
    yearRange: [2013, 2026],
    category: 'SUV',
    trims: ['Adventure AWD', 'Hybrid XSE', '2.0L Style AWD'],
  },
  {
    id: 'toyota-harrier',
    make: 'Toyota',
    model: 'Harrier',
    yearRange: [2013, 2025],
    category: 'SUV',
    trims: ['2.0L Turbo Premium', 'Hybrid Z Leather', 'Grand 2.0L'],
  },

  // Subaru
  {
    id: 'subaru-forester',
    make: 'Subaru',
    model: 'Forester',
    yearRange: [2012, 2026],
    category: 'SUV',
    trims: ['2.0XT Turbo AWD', '2.5i-S EyeSight', 'Sport AWD', 'Wilderness Edition'],
    popular: true,
  },
  {
    id: 'subaru-outback',
    make: 'Subaru',
    model: 'Outback',
    yearRange: [2013, 2026],
    category: 'SUV',
    trims: ['2.5i Limited', '3.6R 6-Cylinder', 'Touring XT 2.4 Turbo'],
    popular: true,
  },
  {
    id: 'subaru-wrx',
    make: 'Subaru',
    model: 'WRX / STI',
    yearRange: [2012, 2026],
    category: 'Sedan',
    trims: ['STI 2.5L Turbo AWD', 'WRX GT Performance', 'S-Edition'],
  },

  // Isuzu
  {
    id: 'isuzu-d-max',
    make: 'Isuzu',
    model: 'D-Max Double Cab',
    yearRange: [2012, 2026],
    category: 'Pickup',
    trims: ['3.0L V-Cross 4x4', '2.5L Hi-Rider', 'AT35 Arctic Trucks Edition', 'LS Double Cab'],
    popular: true,
  },
  {
    id: 'isuzu-mu-x',
    make: 'Isuzu',
    model: 'MU-X 7-Seater',
    yearRange: [2015, 2026],
    category: 'SUV',
    trims: ['3.0L 4x4 Onyx', '3.0L LS-T AWD', '2.5L LS-M'],
  },

  // Ford
  {
    id: 'ford-ranger',
    make: 'Ford',
    model: 'Ranger',
    yearRange: [2012, 2026],
    category: 'Pickup',
    trims: ['Raptor 3.0L Twin Turbo V6', 'Wildtrak 2.0L Bi-Turbo 4x4', 'XLT 4WD', 'Tremor Edition'],
    popular: true,
  },
  {
    id: 'ford-everest',
    make: 'Ford',
    model: 'Everest',
    yearRange: [2015, 2026],
    category: 'SUV',
    trims: ['Platinum 3.0L V6', 'Sport Bi-Turbo 4x4', 'Titanium 4WD'],
  },

  // Land Rover
  {
    id: 'land-rover-defender',
    make: 'Land Rover',
    model: 'Defender (110 / 90 / 130)',
    yearRange: [2015, 2026],
    category: 'SUV',
    trims: ['110 P400 X-Dynamic', '110 D300 Diesel', '90 V8 Carpathian Edition', 'Td5 Classic'],
    popular: true,
  },
  {
    id: 'range-rover-sport',
    make: 'Land Rover',
    model: 'Range Rover Sport / Vogue',
    yearRange: [2012, 2026],
    category: 'SUV',
    trims: ['Autobiography P530 V8', 'Dynamic SE D350', 'HSE Dynamic 3.0L'],
  },

  // Nissan
  {
    id: 'nissan-patrol',
    make: 'Nissan',
    model: 'Patrol Y62 / Y61',
    yearRange: [2010, 2026],
    category: 'SUV',
    trims: ['Nismo 5.6L V8', 'V8 Platinum LE 4WD', 'Y61 Safari 4.8L GU'],
    popular: true,
  },
  {
    id: 'nissan-navara',
    make: 'Nissan',
    model: 'Navara D23 / Pro-4X',
    yearRange: [2014, 2026],
    category: 'Pickup',
    trims: ['PRO-4X 4WD Warrior', '2.5L LE Double Cab', 'SE 4x4'],
  },
  {
    id: 'nissan-x-trail',
    make: 'Nissan',
    model: 'X-Trail',
    yearRange: [2012, 2026],
    category: 'SUV',
    trims: ['e-4ORCE 4WD', '2.5L Ti-L', '2.0L Hybrid 4WD'],
  },

  // Mitsubishi
  {
    id: 'mitsubishi-pajero',
    make: 'Mitsubishi',
    model: 'Pajero / Montero / Sport',
    yearRange: [2010, 2026],
    category: 'SUV',
    trims: ['Pajero Sport Exceed 4x4', '3.2 DiD Super Select 4WD', 'Pajero V98 Final Edition'],
  },
  {
    id: 'mitsubishi-l200',
    make: 'Mitsubishi',
    model: 'L200 / Triton',
    yearRange: [2014, 2026],
    category: 'Pickup',
    trims: ['Athlete 2.4L MIVEC 4x4', 'Barbarian Double Cab', 'GLS Plus'],
  },

  // Mercedes-Benz
  {
    id: 'mercedes-g-class',
    make: 'Mercedes-Benz',
    model: 'G-Class G63 / G400d',
    yearRange: [2012, 2026],
    category: 'SUV',
    trims: ['AMG G 63 4.0L Bi-Turbo', 'G 400d AMG Line', 'G 500 4x4²'],
    popular: true,
  },
  {
    id: 'mercedes-c-class',
    make: 'Mercedes-Benz',
    model: 'C-Class (W205 / W206)',
    yearRange: [2014, 2026],
    category: 'Sedan',
    trims: ['C200 AMG Line', 'C300 4MATIC', 'AMG C 43 Performance'],
  },
  {
    id: 'mercedes-gle',
    make: 'Mercedes-Benz',
    model: 'GLE / ML-Class',
    yearRange: [2013, 2026],
    category: 'SUV',
    trims: ['GLE 450 AMG Line 4MATIC', 'GLE 400d', 'GLE 53 AMG Coupé'],
  },

  // BMW
  {
    id: 'bmw-x5',
    make: 'BMW',
    model: 'X5 (F15 / G05)',
    yearRange: [2013, 2026],
    category: 'SUV',
    trims: ['xDrive40i M Sport', 'xDrive30d', 'M50i Twin-Turbo V8'],
    popular: true,
  },
  {
    id: 'bmw-3-series',
    make: 'BMW',
    model: '3-Series (F30 / G20)',
    yearRange: [2012, 2026],
    category: 'Sedan',
    trims: ['320i M Sport', '330i M Sport Shadow', 'M340i xDrive'],
  },

  // Volkswagen
  {
    id: 'vw-amarok',
    make: 'Volkswagen',
    model: 'Amarok Double Cab',
    yearRange: [2012, 2026],
    category: 'Pickup',
    trims: ['PanAmericana 3.0L V6 TDI', 'Aventura 4MOTION', 'Highline 2.0L BiTDI'],
  },
  {
    id: 'vw-golf',
    make: 'Volkswagen',
    model: 'Golf GTI / R (Mk7 / Mk8)',
    yearRange: [2013, 2026],
    category: 'Hatchback',
    trims: ['Golf R 4MOTION', 'Golf GTI Clubsport', 'Golf 1.4 TSI R-Line'],
  },
];

export const ALL_MAKES = Array.from(new Set(VEHICLE_DATABASE.map(v => v.make))).sort();
