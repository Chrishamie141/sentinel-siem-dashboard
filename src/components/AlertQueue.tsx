import { useMemo, useState } from 'react'
import type { AlertStatus, DetectionResult } from '../types'

const badge = { low: 'bg-blue-500/20 text-blue-300', medium: 'bg-amber-500/20 text-amber-300', high: 'bg-orange-500/20 text-orange-300', critical: 'bg-red-500/20 text-red-300' }

export default function AlertQueue({ detections }: { detections: DetectionResult[] }) {
  const [statuses, setStatuses] = useState<Record<string, AlertStatus>>({})
  const [selectedId, setSelectedId] = useState<string | null>(detections[0]?.id ?? null)
  const withStatus = useMemo(() => detections.map((d) => ({ ...d, status: statuses[d.id] ?? d.status })), [detections, statuses])
  const selected = withStatus.find((d) => d.id === selectedId) ?? withStatus[0]

  return <section className='grid lg:grid-cols-3 gap-4'>
    <div className='lg:col-span-2 bg-soc-panel border border-soc-border rounded-lg p-4'>
      <h3 className='text-lg font-semibold'>Alert Queue</h3>
      <div className='mt-3 space-y-2 max-h-96 overflow-auto'>
        {withStatus.map((d) => <button key={d.id} onClick={() => setSelectedId(d.id)} className='w-full text-left border border-soc-border rounded p-3 hover:bg-white/5'>
          <div className='flex flex-wrap items-center gap-2'><span className={`text-xs px-2 py-1 rounded ${badge[d.severity]}`}>{d.severity.toUpperCase()}</span><span className='font-medium'>{d.title}</span><span className='text-xs text-soc-muted'>Confidence: {d.confidence}%</span></div>
          <p className='text-xs text-soc-muted mt-1'>{d.affected_ip ?? '-'} • {d.affected_user ?? '-'} • {d.affected_host ?? '-'} • {d.mitre_tactic} / {d.mitre_technique}</p>
          <p className='text-sm mt-1'>{d.evidence}</p>
        </button>)}
      </div>
    </div>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4'>
      <h3 className='text-lg font-semibold'>Alert Details</h3>
      {selected && <div className='mt-3 space-y-2 text-sm'>
        <p className='font-medium'>{selected.title}</p>
        <p><strong>Evidence:</strong> {selected.evidence}</p>
        <p><strong>Recommended response:</strong> {selected.recommendation}</p>
        <p><strong>Status:</strong> {selected.status}</p>
        <div className='flex gap-2 pt-2'>{(['Open','Investigating','Resolved'] as AlertStatus[]).map((s)=><button key={s} onClick={()=>setStatuses((p)=>({...p,[selected.id]:s}))} className='px-2 py-1 border border-soc-border rounded text-xs'>{s}</button>)}</div>
      </div>}
    </div>
  </section>
}
