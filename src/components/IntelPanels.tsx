import type { SecurityLog } from '../types'

export default function IntelPanels({ logs, detections }: { logs: SecurityLog[]; detections: string[] }) {
  const mitre = Object.entries(logs.reduce((a,l)=>((a[l.technique_id]=(a[l.technique_id]||0)+1),a),{} as Record<string,number>)).slice(0,8)
  return <div className='grid lg:grid-cols-2 gap-4'>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4'><h3>MITRE ATT&CK Mapping</h3><ul className='mt-2 text-sm'>{mitre.map(([t,c])=><li key={t}>{t}: {c} events</li>)}</ul></div>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4'><h3>Incident Summary & Recommendations</h3><p className='text-sm mt-2'>Potential incidents detected: {detections.length}.</p><ul className='list-disc ml-5 text-sm mt-2'>{detections.map((d)=><li key={d}>{d}</li>)}<li>Enable MFA, tighten egress filtering, isolate flagged hosts, and enrich with threat intel.</li></ul></div>
  </div>
}
