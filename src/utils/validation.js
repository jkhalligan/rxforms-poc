// DEA number validation
// Format: 2 letters + 7 digits
// First letter: A, B, C, D, F, G, M (practitioner type)
// Second letter: First letter of last name (or 9 for certain cases)
// Checksum: Sum of (1st + 3rd + 5th digits) + 2*(2nd + 4th + 6th digits)
// Last digit of sum should equal 7th digit

export function validateDEA(dea) {
  if (!dea) return { valid: true, message: '' }; // Optional for POC
  
  const pattern = /^[A-Z]{2}\d{7}$/;
  if (!pattern.test(dea.toUpperCase())) {
    return { valid: false, message: 'DEA format: 2 letters followed by 7 digits (e.g., AB1234567)' };
  }
  
  // Checksum validation
  const digits = dea.slice(2).split('').map(Number);
  const sum = (digits[0] + digits[2] + digits[4]) + 2 * (digits[1] + digits[3] + digits[5]);
  const checkDigit = sum % 10;
  
  if (checkDigit !== digits[6]) {
    return { valid: false, message: 'Invalid DEA number checksum' };
  }
  
  return { valid: true, message: '' };
}

export function formatPhone(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}
