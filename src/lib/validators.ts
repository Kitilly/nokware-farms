import { appConfig } from '@/config/app.config'

export interface ValidationResult {
  valid: boolean
  message?: string
}

export function validatePhone(nationalNumber: string): ValidationResult {
  const digits = nationalNumber.replace(/\D/g, '')
  if (digits.length === 0) return { valid: false, message: 'Phone number is required' }
  if (digits.length !== appConfig.phone.nationalLength) {
    return { valid: false, message: `Enter a valid ${appConfig.phone.nationalLength}-digit phone number` }
  }
  return { valid: true }
}

export function validateOtp(code: string): ValidationResult {
  if (code.length !== appConfig.otp.length) {
    return { valid: false, message: `Enter the ${appConfig.otp.length}-digit code` }
  }
  if (!/^\d+$/.test(code)) {
    return { valid: false, message: 'Code must contain only numbers' }
  }
  return { valid: true }
}

export function validateName(name: string, fieldLabel = 'Name'): ValidationResult {
  const trimmed = name.trim()
  if (trimmed.length === 0) return { valid: false, message: `${fieldLabel} is required` }
  if (trimmed.length < 2) return { valid: false, message: `${fieldLabel} is too short` }
  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return { valid: false, message: `${fieldLabel} can only contain letters` }
  }
  return { valid: true }
}

export function validateEmail(email: string): ValidationResult {
  if (email.trim().length === 0) return { valid: true } // optional field
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!pattern.test(email.trim())) {
    return { valid: false, message: 'Enter a valid email address' }
  }
  return { valid: true }
}

export function validateAddressLine(value: string): ValidationResult {
  if (value.trim().length === 0) return { valid: false, message: 'This field is required' }
  return { valid: true }
}

/** Accepts a phone string that may include the dial code prefix (e.g. "+233 241234567" or "241234567"). */
export function formatMaskedPhone(phone: string): string {
  const withoutDialCode = phone.replace(appConfig.phone.dialCode, '').trim()
  const digits = withoutDialCode.replace(/\D/g, '')
  if (digits.length < 4) return `${appConfig.phone.dialCode} ${digits}`
  const last2 = digits.slice(-2)
  const masked = '•'.repeat(Math.max(digits.length - 2, 0))
  return `${appConfig.phone.dialCode} ${masked}${last2}`
}
