let counter = 0

export function generateId(prefix = 'id'): string {
  counter += 1
  const random = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${Date.now().toString(36)}${random}${counter}`
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(1000 + Math.random() * 9000)
  return `NF-${year}-${random}`
}
