export const practiceFields = [
  { id: 'name', label: 'Practice Name', type: 'text', placeholder: 'Practice Name' },
  { id: 'address', label: 'Address', type: 'text', placeholder: 'Street Address' },
  { id: 'city', label: 'City', type: 'text', placeholder: 'City' },
  { id: 'state', label: 'State', type: 'text', placeholder: 'State', defaultValue: 'AZ' },
  { id: 'zip', label: 'ZIP', type: 'text', placeholder: 'ZIP Code' },
  { id: 'phone', label: 'Telephone', type: 'tel', placeholder: '(555) 555-5555' },
  { id: 'fax', label: 'Fax', type: 'tel', placeholder: '(555) 555-5555' },
];

export const prescriberFields = [
  { id: 'name', label: 'Prescriber Name', type: 'text', placeholder: 'Dr. Jane Smith' },
  { id: 'credentials', label: 'Credentials', type: 'text', placeholder: 'MD, DO, DDS, DVM, etc.' },
  { id: 'specialty', label: 'Specialty', type: 'text', placeholder: 'Family Medicine' },
  { id: 'licenseNumber', label: 'State License Number', type: 'text', placeholder: 'License #' },
  { id: 'hideLicense', label: 'Hide license number on pad', type: 'checkbox' },
  { id: 'npiNumber', label: 'NPI Number', type: 'text', placeholder: '1234567890' },
  { id: 'deaNumber', label: 'DEA Number', type: 'text', placeholder: 'AB1234567', validation: 'dea' },
];

export const padOptionsFields = [
  { 
    id: 'startingNumber', 
    label: 'Starting Pad Number', 
    type: 'text', 
    placeholder: '0001',
    defaultValue: '0001',
    helpText: 'Optional — sequential numbering for tracking. Leave as 0001 if not needed.'
  },
];
