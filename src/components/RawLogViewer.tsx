import type { SecurityLog } from '../types'

export default function RawLogViewer({ logs }: { logs: SecurityLog[] }) {
  return <div className='bg-soc-panel border border-soc-border rounded-lg p-4'><h3>Raw Log Viewer</h3><pre className='text-xs mt-2 h-64 overflow-auto bg-black/30 p-2 rounded'>{JSON.stringify(logs.slice(-40), null, 2)}</pre></div>
}
