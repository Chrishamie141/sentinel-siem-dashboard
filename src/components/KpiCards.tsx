import { Activity, AlertTriangle, ShieldCheck, Siren } from 'lucide-react'
import type { SecurityLog } from '../types'

export default function KpiCards({ logs }: { logs: SecurityLog[] }) {
  const critical = logs.filter((l) => l.severity === 'critical').length
  const alerts = logs.filter((l) => l.status === 'alert').length
  const uniqueIps = new Set(logs.map((l) => l.source_ip)).size
  return <div className="grid grid-cols-1 md:grid-cols-4 gap-4">{[
    {label:'Total Events', value: logs.length, icon: Activity},
    {label:'Active Alerts', value: alerts, icon: Siren},
    {label:'Critical', value: critical, icon: AlertTriangle},
    {label:'Unique Source IPs', value: uniqueIps, icon: ShieldCheck},
  ].map((k)=><div key={k.label} className="bg-soc-panel border border-soc-border rounded-lg p-4"><k.icon className="text-soc-accent mb-2"/><p className="text-soc-muted text-sm">{k.label}</p><p className="text-2xl font-semibold">{k.value}</p></div>)}</div>
}
