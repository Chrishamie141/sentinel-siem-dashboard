import type { AssetRisk, DetectionResult, SecurityLog, UserRisk } from '../types'

export default function IntelPanels({ logs, detections }: { logs: SecurityLog[]; detections: DetectionResult[] }) {
  const mitre = Object.entries(logs.reduce((a,l)=>((a[l.technique_id]=(a[l.technique_id]||0)+1),a),{} as Record<string,number>)).slice(0,8)
  const assets: AssetRisk[] = Object.entries(logs.reduce((a,l)=>{a[l.hostname]=a[l.hostname]||{hostname:l.hostname,alert_count:0,critical_count:0,top_technique:l.technique_id,risk_score:0};a[l.hostname].alert_count++;if(['high','critical'].includes(l.severity))a[l.hostname].critical_count++;a[l.hostname].risk_score=a[l.hostname].alert_count+a[l.hostname].critical_count*2;return a},{} as Record<string,AssetRisk>)).map(([,v])=>v).sort((a,b)=>b.risk_score-a.risk_score).slice(0,6)
  const users: UserRisk[] = Object.entries(logs.reduce((a,l)=>{a[l.username]=a[l.username]||{username:l.username,failed_logins:0,escalations:0,risky_events:0,risk_score:0};if(l.event_type==='failed_login')a[l.username].failed_logins++;if(l.event_type==='privilege_escalation')a[l.username].escalations++;if(['high','critical'].includes(l.severity))a[l.username].risky_events++;a[l.username].risk_score=a[l.username].failed_logins+a[l.username].escalations*3+a[l.username].risky_events;return a},{} as Record<string,UserRisk>)).map(([,v])=>v).sort((a,b)=>b.risk_score-a.risk_score).slice(0,6)
  return <div className='grid lg:grid-cols-3 gap-4'>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4'><h3>MITRE ATT&CK Mapping</h3><ul className='mt-2 text-sm'>{mitre.map(([t,c])=><li key={t}>{t}: {c} events</li>)}</ul></div>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4'><h3>Affected Assets</h3><ul className='mt-2 text-sm space-y-1'>{assets.map((a)=><li key={a.hostname}>{a.hostname} • alerts {a.alert_count} • critical {a.critical_count} • risk {a.risk_score}</li>)}</ul></div>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4'><h3>User Risk</h3><ul className='mt-2 text-sm space-y-1'>{users.map((u)=><li key={u.username}>{u.username} • failed {u.failed_logins} • escalations {u.escalations} • risk {u.risk_score}</li>)}</ul><p className='mt-3 text-xs text-soc-muted'>Active detections: {detections.length}</p></div>
  </div>
}
