import type { SecurityLog } from '../types'

export default function TablesSection({ logs }: { logs: SecurityLog[] }) {
  const topIps = Object.entries(logs.reduce((a,l)=>((a[l.source_ip]=(a[l.source_ip]||0)+1),a),{} as Record<string,number>)).sort((a,b)=>b[1]-a[1]).slice(0,8)
  const iocs = logs.filter((l)=>['malware_beacon','data_exfiltration','privilege_escalation'].includes(l.event_type)).slice(-10)
  return <div className='grid lg:grid-cols-2 gap-4'>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4'><h3>Top Source IPs</h3><table className='w-full text-sm mt-2'><tbody>{topIps.map(([ip,count])=><tr key={ip}><td>{ip}</td><td className='text-right'>{count}</td></tr>)}</tbody></table></div>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4'><h3>IOC Table</h3><table className='w-full text-xs mt-2'><thead><tr><th>Time</th><th>IP</th><th>Event</th><th>Technique</th></tr></thead><tbody>{iocs.map((l,i)=><tr key={i}><td>{l.timestamp.slice(11,19)}</td><td>{l.source_ip}</td><td>{l.event_type}</td><td>{l.technique_id}</td></tr>)}</tbody></table></div>
  </div>
}
