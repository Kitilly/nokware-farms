import { useEffect, useRef, useState } from 'react'

export function useCountdown(initialSeconds: number): { secondsLeft: number; restart: (seconds: number) => void } {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isRunning = secondsLeft > 0

  useEffect(() => {
    if (!isRunning) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  const restart = (seconds: number) => setSecondsLeft(seconds)

  return { secondsLeft, restart }
}
