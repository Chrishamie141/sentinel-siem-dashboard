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

const logs = logsData as SecurityLog[]

export default function App() {
  const [severity, setSeverity] = useState('all')
  const [eventType, setEventType] = useState('all')

  const filtered = useMemo(
    () =>
      logs.filter(
        (l) =>
          (severity === 'all' || l.severity === severity) &&
          (eventType === 'all' || l.event_type === eventType)
      ),
    [severity, eventType]
  )

  const eventTypes = Array.from(new Set(logs.map((l) => l.event_type)))

  const detections = useMemo(
    () => generateDetections(filtered),
    [filtered]
  )

  return (
    <main className="min-h-screen bg-soc-bg text-soc-text p-4 md:p-6 space-y-5">
      <header className="bg-soc-panel border border-soc-border rounded-lg p-5">
        <h1 className="text-3xl font-bold text-soc-accent">
          Sentinel SIEM Dashboard
        </h1>

        <p className="text-soc-muted">
          Simulated SOC Lab • Last updated{' '}
          {new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC • Total alerts{' '}
          {detections.length}
        </p>

        <p className="text-xs text-soc-muted mt-2">
          Telemetry and incidents are simulated for portfolio demonstration of
          SOC triage, detection engineering, and MITRE ATT&CK mapping workflows.
        </p>
      </header>

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