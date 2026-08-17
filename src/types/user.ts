export interface User {
  id: string
  phone: string
  phoneVerified: boolean
  createdAt: string
}

export interface Profile {
  userId: string
  firstName: string
  lastName: string
  email?: string
  avatarUrl?: string
  language: string
  currency: string
}
