import { useEffect, useRef, useState } from 'react'

export function useCountdown(initialSeconds: number): { secondsLeft: number; restart: (seconds: number) => void } {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (secondsLeft <= 0) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [secondsLeft > 0])

  const restart = (seconds: number) => setSecondsLeft(seconds)

  return { secondsLeft, restart }
}
