export const arizonaPricing = {
  'maximum-security': {
    name: 'Maximum Security',
    description: 'Required for controlled substances (Schedule II-V)',
    prices: {
      8: 135,
      16: 210,
      24: 295,
      40: 450,
      80: 775,
    },
  },
  'minimum-security': {
    name: 'Minimum Security',
    description: 'Meets federal Medicaid tamper-resistant requirements',
    prices: {
      8: 95,
      16: 155,
      24: 215,
      40: 325,
      80: 595,
    },
  },
  'no-security': {
    name: 'Standard (No Security)',
    description: 'For non-controlled, non-Medicaid prescriptions',
    prices: {
      8: 55,
      16: 85,
      24: 125,
      40: 195,
      80: 295,
    },
  },
};

export const quantities = [8, 16, 24, 40, 80];

export const paperTypes = [
  { id: 'single', name: 'Single Ply', description: '100 scripts per pad', priceModifier: 0 },
  { id: 'carbonless-2', name: '2-Part Carbonless', description: '50 scripts per pad', priceModifier: 25 },
];

export const productionTimes = [
  { id: 'standard', name: 'Standard', description: '5-7 business days', priceModifier: 0 },
  { id: 'rush', name: 'Rush', description: '2-3 business days', priceModifier: 35 },
];
