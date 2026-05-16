import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import type { DetectionResult, SecurityLog } from '../types'

export default function ChartsSection({ logs, detections }: { logs: SecurityLog[]; detections: DetectionResult[] }) {
  const sevData = Object.entries(logs.reduce((a,l)=>((a[l.severity]=(a[l.severity]||0)+1),a),{} as Record<string,number>)).map(([name,value])=>({name,value}))
  const typeData = Object.entries(logs.reduce((a,l)=>((a[l.event_type]=(a[l.event_type]||0)+1),a),{} as Record<string,number>)).map(([name,value])=>({name,value}))
  const timeline = Object.entries(logs.reduce((a,l)=>{const t=l.timestamp.slice(0,13)+':00';a[t]=(a[t]||0)+1;return a},{} as Record<string,number>)).slice(-24).map(([time,count])=>({time:time.slice(5),count}))
  const mitreTacticData = Object.entries(detections.reduce((a,d)=>((a[d.mitre_tactic]=(a[d.mitre_tactic]||0)+1),a),{} as Record<string,number>)).map(([name,value])=>({name,value}))
  const attackerData = Object.entries(logs.reduce((a,l)=>((a[l.source_ip]=(a[l.source_ip]||0)+1),a),{} as Record<string,number>)).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([ip,count])=>({ip,count}))
  const confidenceData = [0,20,40,60,80].map((min)=>({bucket:`${min}-${min+19}`,count:detections.filter((d)=>d.confidence>=min&&d.confidence<min+20).length}))
  const colors=['#38bdf8','#f59e0b','#ef4444','#a855f7','#10b981']
  return <div className='grid lg:grid-cols-3 gap-4'>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4 lg:col-span-2 h-72'><h3 className='mb-2'>Alert Timeline</h3><ResponsiveContainer width='100%' height='90%'><LineChart data={timeline}><XAxis dataKey='time'/><YAxis/><Tooltip/><Line type='monotone' dataKey='count' stroke='#00d1ff'/></LineChart></ResponsiveContainer></div>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4 h-72'><h3 className='mb-2'>Severity Distribution</h3><ResponsiveContainer width='100%' height='90%'><PieChart><Pie data={sevData} dataKey='value' nameKey='name' outerRadius={90}>{sevData.map((_,i)=><Cell key={i} fill={colors[i%colors.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4 h-72'><h3 className='mb-2'>Alerts by MITRE Tactic</h3><ResponsiveContainer width='100%' height='90%'><BarChart data={mitreTacticData}><XAxis dataKey='name' interval={0} angle={-20} height={60} textAnchor='end'/><YAxis/><Tooltip/><Bar dataKey='value' fill='#f59e0b'/></BarChart></ResponsiveContainer></div>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4 h-72'><h3 className='mb-2'>Top Attacker IPs</h3><ResponsiveContainer width='100%' height='90%'><BarChart data={attackerData}><XAxis dataKey='ip' interval={0} angle={-20} height={60} textAnchor='end'/><YAxis/><Tooltip/><Bar dataKey='count' fill='#ef4444'/></BarChart></ResponsiveContainer></div>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4 h-72'><h3 className='mb-2'>Detection Confidence Distribution</h3><ResponsiveContainer width='100%' height='90%'><BarChart data={confidenceData}><XAxis dataKey='bucket'/><YAxis/><Tooltip/><Bar dataKey='count' fill='#14b8a6'/></BarChart></ResponsiveContainer></div>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4 lg:col-span-3 h-72'><h3 className='mb-2'>Event Types</h3><ResponsiveContainer width='100%' height='90%'><BarChart data={typeData}><XAxis dataKey='name' interval={0} angle={-20} height={60} textAnchor='end'/><YAxis/><Tooltip/><Bar dataKey='value' fill='#14b8a6'/></BarChart></ResponsiveContainer></div>
  </div>
}
