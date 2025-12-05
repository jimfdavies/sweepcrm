import { describe, it, expect } from 'vitest'
import { validatePostcode, formatPostcode, validateAndFormatPostcode } from '../../src/renderer/src/utils/postcodeValidator'

describe('Postcode Validator', () => {
  describe('validatePostcode', () => {
    it('should validate common UK postcodes', () => {
      const validPostcodes = [
        'SW1A 1AA', // Westminster
        'M1 1AE', // Manchester
        'B33 8TH', // Birmingham
        'CR2 6XH', // Croydon
        'DN55 1PT', // Isle of Man
        'W1A 1AA', // London
        'E1 6AN', // London
        'M2 5BY', // Manchester
        'B1 1AF', // Birmingham
        'GIR 0AA' // Girobank
      ]

      validPostcodes.forEach((postcode) => {
        const result = validatePostcode(postcode)
        expect(result.isValid).toBe(true)
        expect(result.error).toBeUndefined()
      })
    })

    it('should accept postcodes without spaces', () => {
      const result = validatePostcode('SW1A1AA')
      expect(result.isValid).toBe(true)
    })

    it('should accept lowercase postcodes', () => {
      const result = validatePostcode('sw1a 1aa')
      expect(result.isValid).toBe(true)
    })

    it('should accept postcodes with extra spaces', () => {
      const result = validatePostcode('  SW1A 1AA  ')
      expect(result.isValid).toBe(true)
    })

    it('should reject empty postcode', () => {
      const result = validatePostcode('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Postcode is required')
    })

    it('should reject invalid format', () => {
      const invalidPostcodes = [
        '123456', // All numbers
        'ABCDEF', // All letters
        'SW1', // Too short
        'SW1A 1AAAA', // Too long
        '12345', // Five digit number
        'SW1A 1A', // Inward code too short
        'INVALID' // Random letters
      ]

      invalidPostcodes.forEach((postcode) => {
        const result = validatePostcode(postcode)
        expect(result.isValid).toBe(false)
        expect(result.error).toBe('Invalid UK postcode format')
      })
    })

    it('should handle BFPO postcodes', () => {
      const result = validatePostcode('BFPO 1234')
      expect(result.isValid).toBe(true)
    })
  })

  describe('formatPostcode', () => {
    it('should format postcode with space in correct position', () => {
      const result = formatPostcode('SW1A1AA')
      expect(result).toBe('SW1A 1AA')
    })

    it('should handle postcodes that already have space', () => {
      const result = formatPostcode('SW1A 1AA')
      expect(result).toBe('SW1A 1AA')
    })

    it('should handle lowercase input', () => {
      const result = formatPostcode('m11ae')
      expect(result).toBe('M1 1AE')
    })

    it('should handle extra spaces', () => {
      const result = formatPostcode('  SW1A  1AA  ')
      expect(result).toBe('SW1A 1AA')
    })

    it('should handle postcodes with varying lengths', () => {
      const result1 = formatPostcode('B338TH')
      expect(result1).toBe('B33 8TH')

      const result2 = formatPostcode('DN551PT')
      expect(result2).toBe('DN55 1PT')
    })
  })

  describe('validateAndFormatPostcode', () => {
    it('should return valid and formatted postcode', () => {
      const result = validateAndFormatPostcode('sw1a1aa')
      expect(result.isValid).toBe(true)
      expect(result.formatted).toBe('SW1A 1AA')
      expect(result.error).toBeUndefined()
    })

    it('should return validation error for invalid postcode', () => {
      const result = validateAndFormatPostcode('INVALID')
      expect(result.isValid).toBe(false)
      expect(result.formatted).toBeUndefined()
      expect(result.error).toBe('Invalid UK postcode format')
    })

    it('should return error for empty postcode', () => {
      const result = validateAndFormatPostcode('')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Postcode is required')
    })
  })
})
