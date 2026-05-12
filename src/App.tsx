import { useMemo, useState } from 'react'
import logsData from './data/securityLogs.json'
import type { SecurityLog } from './types'
import KpiCards from './components/KpiCards'
import ChartsSection from './components/ChartsSection'
import TablesSection from './components/TablesSection'
import IntelPanels from './components/IntelPanels'
import RawLogViewer from './components/RawLogViewer'
import { detectBruteForce, detectDataExfiltration, detectImpossibleTravel, detectMalwareBeaconing, detectPortScan, detectPrivilegeEscalation, detectSuspiciousOutboundTraffic } from './utils/detections'

const logs = logsData as SecurityLog[]

export default function App() {
  const [severity, setSeverity] = useState('all')
  const [eventType, setEventType] = useState('all')

  const filtered = useMemo(() => logs.filter((l) => (severity === 'all' || l.severity === severity) && (eventType === 'all' || l.event_type === eventType)), [severity, eventType])
  const eventTypes = Array.from(new Set(logs.map((l) => l.event_type)))

  const detections = [
    detectBruteForce(filtered) && 'Brute force pattern detected',
    detectPortScan(filtered) && 'Port scan activity detected',
    detectMalwareBeaconing(filtered) && 'Malware beaconing suspected',
    detectSuspiciousOutboundTraffic(filtered) && 'Suspicious outbound traffic identified',
    detectPrivilegeEscalation(filtered) && 'Privilege escalation behavior seen',
    detectImpossibleTravel(filtered) && 'Impossible travel anomaly triggered',
    detectDataExfiltration(filtered) && 'Possible data exfiltration in progress',
  ].filter(Boolean) as string[]

  return <main className='min-h-screen bg-soc-bg text-soc-text p-6 space-y-4'>
    <header><h1 className='text-3xl font-bold text-soc-accent'>Sentinel SIEM Dashboard</h1><p className='text-soc-muted'>SOC monitoring portfolio application</p></header>
    <div className='flex gap-3'>
      <select className='bg-soc-panel border border-soc-border px-3 py-2 rounded' value={severity} onChange={(e)=>setSeverity(e.target.value)}><option value='all'>All Severities</option>{['low','medium','high','critical'].map((s)=><option key={s}>{s}</option>)}</select>
      <select className='bg-soc-panel border border-soc-border px-3 py-2 rounded' value={eventType} onChange={(e)=>setEventType(e.target.value)}><option value='all'>All Event Types</option>{eventTypes.map((e)=><option key={e}>{e}</option>)}</select>
    </div>
    <KpiCards logs={filtered} />
    <ChartsSection logs={filtered} />
    <TablesSection logs={filtered} />
    <IntelPanels logs={filtered} detections={detections} />
    <RawLogViewer logs={filtered} />
  </main>
}
