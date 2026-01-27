export const arizonaConfig = {
  state: 'Arizona',
  stateCode: 'AZ',
  securityLevels: ['maximum-security', 'minimum-security', 'no-security'],
  defaultSecurityLevel: 'maximum-security',
  maxLocations: 2,
  maxPrescribers: 2,
  warningBand: {
    text: 'MICROPRINT SECURITY • SERIAL BATCH NUMBERING • SEQUENTIAL NUMBERING',
    showOn: ['maximum-security', 'minimum-security'],
  },
  disclaimer: 'Prescription is void if more than one (1) controlled substance is written per blank.',
  microprint: {
    text: 'RXFORMSSECUREPRESCRIPTION',
    showOn: ['maximum-security'],
  },
};
