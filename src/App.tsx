import { useMemo, useState } from 'react'
import logsData from './data/securityLogs.json'
import type { SecurityLog } from './types'

import KpiCards from './components/KpiCards'
import ChartsSection from './components/ChartsSection'
import TablesSection from './components/TablesSection'
import IntelPanels from './components/IntelPanels'
import RawLogViewer from './components/RawLogViewer'
import AlertQueue from './components/AlertQueue'

import { generateDetections } from './utils/detections'
import { useLiveTelemetry } from './hooks/useLiveTelemetry'

const allLogs = logsData as SecurityLog[]

export default function App() {
  const [severity, setSeverity] = useState('all')
  const [eventType, setEventType] = useState('all')

  const {
    events,
    isRunning,
    speed,
    setSpeed,
    setIsRunning,
    clear,
    cursor,
    total,
    remaining,
  } = useLiveTelemetry(allLogs)

  const filtered = useMemo(
    () =>
      events.filter(
        (l: SecurityLog) =>
          (severity === 'all' || l.severity === severity) &&
          (eventType === 'all' || l.event_type === eventType)
      ),
    [events, severity, eventType]
  )

  const eventTypes = Array.from(
    new Set(allLogs.map((l: SecurityLog) => l.event_type))
  )

  const detections = useMemo(
    () => generateDetections(filtered),
    [filtered]
  )

  return (
    <main className="min-h-screen bg-soc-bg text-soc-text p-4 md:p-6 space-y-5">
      <header className="bg-soc-panel border border-soc-border rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-soc-accent">
              Sentinel SIEM Dashboard
            </h1>

            <p className="text-soc-muted">
              Live SOC Telemetry Simulation •{' '}
              {new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC
            </p>

            <p className="text-xs text-soc-muted mt-2">
              Telemetry and incidents are simulated for portfolio demonstration
              of SOC triage, detection engineering, and MITRE ATT&CK mapping
              workflows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
              }`}
            />

            <span className="text-xs text-soc-muted">
              {isRunning ? 'INGESTING' : 'PAUSED'}
            </span>
          </div>
        </div>
      </header>

      <section className="bg-soc-panel border border-soc-border rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-1.5 rounded border border-soc-border hover:bg-white/5"
            onClick={() => setIsRunning(true)}
          >
            ▶ Play
          </button>

          <button
            className="px-3 py-1.5 rounded border border-soc-border hover:bg-white/5"
            onClick={() => setIsRunning(false)}
          >
            ⏸ Pause
          </button>

          <button
            className="px-3 py-1.5 rounded border border-soc-border hover:bg-white/5"
            onClick={clear}
          >
            🧹 Clear Feed
          </button>

          <select
            className="bg-soc-bg border border-soc-border px-2 rounded"
            value={speed}
            onChange={(e) =>
              setSpeed(Number(e.target.value) as 1 | 2 | 4 | 8)
            }
          >
            {[1, 2, 4, 8].map((n) => (
              <option key={n} value={n}>
                {n}x speed
              </option>
            ))}
          </select>

          <span className="text-xs text-soc-muted self-center">
            Ingested {cursor}/{total} • Remaining {remaining} • Active alerts{' '}
            {detections.length}
          </span>
        </div>

        <div className="text-xs text-soc-accent bg-black/20 rounded px-2 py-1 overflow-hidden whitespace-nowrap">
          {filtered
            .slice(-8)
            .map(
              (l: SecurityLog) =>
                `${l.timestamp.slice(11, 19)} ${l.event_type} ${l.source_ip} → ${l.hostname}`
            )
            .join('  •  ')}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <select
          className="bg-soc-panel border border-soc-border px-3 py-2 rounded"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="all">All Severities</option>

          {['low', 'medium', 'high', 'critical'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="bg-soc-panel border border-soc-border px-3 py-2 rounded"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="all">All Event Types</option>

          {eventTypes.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <KpiCards logs={filtered} />

      <AlertQueue detections={detections} />

      <ChartsSection
        logs={filtered}
        detections={detections}
      />

      <TablesSection logs={filtered} />

      <IntelPanels
        logs={filtered}
        detections={detections}
      />

      <RawLogViewer logs={filtered} />
    </main>
  )
}