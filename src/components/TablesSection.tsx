import type { IOC, SecurityLog } from '../types'

export default function TablesSection({ logs }: { logs: SecurityLog[] }) {
  const topIps = Object.entries(logs.reduce((a,l)=>((a[l.source_ip]=(a[l.source_ip]||0)+1),a),{} as Record<string,number>)).sort((a,b)=>b[1]-a[1]).slice(0,8)
  const iocs: IOC[] = Object.values(logs.reduce((acc, l) => {
    const key = `${l.source_ip}-${l.technique_id}`
    if (!acc[key]) acc[key] = { indicator: l.source_ip, type: 'ip', severity: l.severity, first_seen: l.timestamp, last_seen: l.timestamp, related_mitre_technique: l.technique_id, recommended_action: 'Block indicator and enrich with threat intel feeds.' }
    acc[key].last_seen = l.timestamp
    return acc
  }, {} as Record<string, IOC>)).slice(-10)

  return <div className='grid xl:grid-cols-2 gap-4'>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4'><h3>Top Source IPs</h3><table className='w-full text-sm mt-2'><tbody>{topIps.map(([ip,count])=><tr key={ip}><td>{ip}</td><td className='text-right'>{count}</td></tr>)}</tbody></table></div>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4 overflow-auto'><h3>IOC Table</h3><table className='w-full text-xs mt-2'><thead><tr><th>Indicator</th><th>Type</th><th>Severity</th><th>First Seen</th><th>Last Seen</th><th>MITRE</th><th>Action</th></tr></thead><tbody>{iocs.map((l,i)=><tr key={i}><td>{l.indicator}</td><td>{l.type}</td><td>{l.severity}</td><td>{l.first_seen.slice(11,19)}</td><td>{l.last_seen.slice(11,19)}</td><td>{l.related_mitre_technique}</td><td>{l.recommended_action}</td></tr>)}</tbody></table></div>
  </div>
}
