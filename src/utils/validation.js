// DEA number validation
export function validateDEA(dea) {
  if (!dea) return { valid: true, message: '' }; // Optional field
  
  const pattern = /^[A-Z]{2}\d{7}$/i;
  if (!pattern.test(dea)) {
    return { 
      valid: false, 
      message: 'Format: 2 letters + 7 digits (e.g., AB1234567)' 
    };
  }
  
  // Checksum validation
  const normalized = dea.toUpperCase();
  const digits = normalized.slice(2).split('').map(Number);
  const sum = (digits[0] + digits[2] + digits[4]) + 2 * (digits[1] + digits[3] + digits[5]);
  const checkDigit = sum % 10;
  
  if (checkDigit !== digits[6]) {
    return { valid: false, message: 'Invalid DEA checksum' };
  }
  
  return { valid: true, message: '' };
}

export function validateNPI(npi) {
  if (!npi) return { valid: true, message: '' };
  
  if (!/^\d{10}$/.test(npi)) {
    return { valid: false, message: 'NPI must be 10 digits' };
  }
  
  return { valid: true, message: '' };
}

export function formatPhone(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function validatePractice(practice) {
  const errors = {};
  if (!practice.name?.trim()) errors.name = 'Practice name is required';
  if (!practice.address?.trim()) errors.address = 'Address is required';
  if (!practice.city?.trim()) errors.city = 'City is required';
  if (!practice.state?.trim()) errors.state = 'State is required';
  if (!practice.zip?.trim()) errors.zip = 'ZIP is required';
  if (!practice.phone?.trim()) errors.phone = 'Phone is required';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validatePrescriber(prescriber) {
  const errors = {};
  if (!prescriber.name?.trim()) errors.name = 'Name is required';
  if (!prescriber.credentials?.trim()) errors.credentials = 'Credentials required';
  
  // DEA format validation (if provided)
  if (prescriber.deaNumber) {
    const deaResult = validateDEA(prescriber.deaNumber);
    if (!deaResult.valid) errors.deaNumber = deaResult.message;
  }

  // NPI format validation (if provided)
  if (prescriber.npiNumber) {
    const npiResult = validateNPI(prescriber.npiNumber);
    if (!npiResult.valid) errors.npiNumber = npiResult.message;
  }
  
  return { valid: Object.keys(errors).length === 0, errors };
}