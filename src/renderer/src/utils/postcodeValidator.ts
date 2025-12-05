/**
 * UK Postcode Validation Utility
 *
 * Validates UK postcodes according to the Royal Mail specification.
 * UK postcodes follow the format: A9A 9AA or A9 9AA (with some variations)
 *
 * Examples of valid postcodes:
 * - SW1A 1AA (Westminster)
 * - M1 1AE (Manchester)
 * - B33 8TH (Birmingham)
 * - CR2 6XH (Croydon)
 * - DN55 1PT (Isle of Man)
 */

/**
 * Validates a UK postcode
 * @param postcode - The postcode string to validate
 * @returns Object with isValid boolean and optional error message
 */
export function validatePostcode(postcode: string): { isValid: boolean; error?: string } {
  // Trim whitespace
  const trimmed = postcode.trim().toUpperCase()

  // Check if empty
  if (!trimmed) {
    return { isValid: false, error: 'Postcode is required' }
  }

  // UK postcode regex pattern
  // This pattern matches the valid UK postcode format
  // Format: Alphanumeric character combinations with a space
  // Inward code: Always 3 characters (1 digit/letter + 1 digit/letter + 1 letter)
  // Outward code: 2-4 characters
  const postcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}|BFPO\s?\d{1,4}|GIR\s?0AA)$/

  if (!postcodeRegex.test(trimmed)) {
    return { isValid: false, error: 'Invalid UK postcode format' }
  }

  return { isValid: true }
}

/**
 * Formats a UK postcode to the standard format with space
 * @param postcode - The postcode string to format
 * @returns Formatted postcode (e.g., "SW1A 1AA")
 */
export function formatPostcode(postcode: string): string {
  const trimmed = postcode.trim().toUpperCase().replace(/\s+/g, '')

  // Insert space before the last 3 characters (inward code)
  if (trimmed.length >= 3) {
    return trimmed.slice(0, -3) + ' ' + trimmed.slice(-3)
  }

  return trimmed
}

/**
 * Checks if a postcode is valid and returns it formatted
 * @param postcode - The postcode to validate and format
 * @returns Object with validation result and formatted postcode
 */
export function validateAndFormatPostcode(
  postcode: string
): { isValid: boolean; formatted?: string; error?: string } {
  const validation = validatePostcode(postcode)

  if (!validation.isValid) {
    return validation
  }

  return {
    isValid: true,
    formatted: formatPostcode(postcode)
  }
}
