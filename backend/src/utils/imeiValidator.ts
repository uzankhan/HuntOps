/**
 * Validate IMEI number (15 digits) using Luhn algorithm
 * IMEI = International Mobile Equipment Identity
 */
export function validateIMEI(imei: string): boolean {
  if (!imei || !/^\d{15}$/.test(imei)) {
    return false;
  }

  // Luhn algorithm for IMEI validation
  let sum = 0;
  let weight = 2;
  
  for (let i = imei.length - 2; i >= 0; i--) {
    let digit = parseInt(imei.charAt(i));
    digit = digit * weight;
    
    if (digit > 9) {
      digit = digit - 9;
    }
    
    sum += digit;
    weight = weight === 2 ? 1 : 2;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  const lastDigit = parseInt(imei.charAt(imei.length - 1));
  
  return checkDigit === lastDigit;
}

/**
 * Format IMEI with spaces for better readability
 */
export function formatIMEI(imei: string): string {
  const clean = imei.replace(/\s/g, '');
  if (clean.length !== 15) return clean;
  return `${clean.slice(0, 2)} ${clean.slice(2, 6)} ${clean.slice(6, 10)} ${clean.slice(10, 14)} ${clean.slice(14)}`;
}