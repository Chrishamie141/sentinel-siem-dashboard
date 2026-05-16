import { useEffect, useMemo, useRef, useState } from 'react'
import type { SecurityLog } from '../types'
import { getBatchSize, orderForReplay, type StreamSpeed } from '../utils/telemetryStream'

const MAX_EVENTS = 450
const TICK_MS = 900

export function useLiveTelemetry(seedLogs: SecurityLog[]) {
  const queue = useMemo(() => orderForReplay(seedLogs), [seedLogs])
  const [speed, setSpeed] = useState<StreamSpeed>(2)
  const [isRunning, setIsRunning] = useState(true)
  const [cursor, setCursor] = useState(0)
  const [events, setEvents] = useState<SecurityLog[]>([])
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isRunning) return
    timerRef.current = window.setInterval(() => {
      setCursor((current) => {
        if (current >= queue.length) return current
        const nextCursor = Math.min(current + getBatchSize(speed), queue.length)
        const batch = queue.slice(current, nextCursor)
        setEvents((prev) => [...prev, ...batch].slice(-MAX_EVENTS))
        return nextCursor
      })
    }, TICK_MS)

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [isRunning, queue, speed])

  const clear = () => {
    setEvents([])
    setCursor(0)
  }

  return {
    events,
    speed,
    setSpeed,
    isRunning,
    setIsRunning,
    clear,
    remaining: Math.max(queue.length - cursor, 0),
    cursor,
    total: queue.length
  }
}
