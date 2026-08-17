import { mockRequest } from './_client'
import { appConfig } from '@/config/app.config'
import { generateId } from '@/lib/id'
import type { User } from '@/types/user'

interface OtpState {
  phone: string
  code: string
  expiresAt: number
}

let activeOtp: OtpState | null = null

function issueOtp(phone: string): OtpState {
  activeOtp = {
    phone,
    code: appConfig.otp.demoCode,
    expiresAt: Date.now() + appConfig.otp.expirySeconds * 1000,
  }
  return activeOtp
}

export interface RequestOtpResult {
  success: boolean
  expiresInSeconds: number
  demoCode?: string
}

export function requestOtp(phone: string): Promise<RequestOtpResult> {
  return mockRequest(() => {
    issueOtp(phone)
    return {
      success: true,
      expiresInSeconds: appConfig.otp.expirySeconds,
      demoCode: appConfig.otp.demoCode,
    }
  })
}

export function resendOtp(phone: string): Promise<{ success: boolean; expiresInSeconds: number }> {
  return mockRequest(() => {
    issueOtp(phone)
    return { success: true, expiresInSeconds: appConfig.otp.expirySeconds }
  })
}

export interface VerifyOtpResult {
  success: boolean
  reason?: 'invalid' | 'expired'
  user?: User
}

export function verifyOtp(phone: string, code: string): Promise<VerifyOtpResult> {
  return mockRequest(() => {
    if (!activeOtp || activeOtp.phone !== phone) {
      return { success: false, reason: 'invalid' as const }
    }
    if (Date.now() > activeOtp.expiresAt) {
      return { success: false, reason: 'expired' as const }
    }
    if (code !== activeOtp.code) {
      return { success: false, reason: 'invalid' as const }
    }
    const user: User = {
      id: generateId('user'),
      phone,
      phoneVerified: true,
      createdAt: new Date().toISOString(),
    }
    return { success: true, user }
  })
}
