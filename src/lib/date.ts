const dayFormatter = new Intl.DateTimeFormat('en-GH', { weekday: 'short', day: 'numeric', month: 'short' })
const fullFormatter = new Intl.DateTimeFormat('en-GH', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const timeFormatter = new Intl.DateTimeFormat('en-GH', { hour: 'numeric', minute: '2-digit' })

export function formatShortDate(iso: string): string {
  return dayFormatter.format(new Date(iso))
}

export function formatFullDate(iso: string): string {
  return fullFormatter.format(new Date(iso))
}

export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso))
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function isToday(iso: string): boolean {
  return toISODate(new Date(iso)) === toISODate(new Date())
}

export function relativeTimeFromNow(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMinutes = Math.round(diffMs / 60000)
  if (diffMinutes < 1) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`
  return formatShortDate(iso)
}
