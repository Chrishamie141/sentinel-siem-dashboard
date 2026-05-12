import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import type { SecurityLog } from '../types'

export default function ChartsSection({ logs }: { logs: SecurityLog[] }) {
  const sevData = Object.entries(logs.reduce((a,l)=>((a[l.severity]=(a[l.severity]||0)+1),a),{} as Record<string,number>)).map(([name,value])=>({name,value}))
  const typeData = Object.entries(logs.reduce((a,l)=>((a[l.event_type]=(a[l.event_type]||0)+1),a),{} as Record<string,number>)).map(([name,value])=>({name,value}))
  const timeline = Object.entries(logs.reduce((a,l)=>{const t=l.timestamp.slice(0,13)+':00';a[t]=(a[t]||0)+1;return a},{} as Record<string,number>)).slice(-24).map(([time,count])=>({time:time.slice(5),count}))
  const colors=['#38bdf8','#f59e0b','#ef4444','#a855f7']
  return <div className='grid lg:grid-cols-3 gap-4'>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4 lg:col-span-2 h-72'><h3 className='mb-2'>Alert Timeline</h3><ResponsiveContainer width='100%' height='90%'><LineChart data={timeline}><XAxis dataKey='time'/><YAxis/><Tooltip/><Line type='monotone' dataKey='count' stroke='#00d1ff'/></LineChart></ResponsiveContainer></div>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4 h-72'><h3 className='mb-2'>Severity Distribution</h3><ResponsiveContainer width='100%' height='90%'><PieChart><Pie data={sevData} dataKey='value' nameKey='name' outerRadius={90}>{sevData.map((_,i)=><Cell key={i} fill={colors[i%colors.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>
    <div className='bg-soc-panel border border-soc-border rounded-lg p-4 lg:col-span-3 h-72'><h3 className='mb-2'>Event Types</h3><ResponsiveContainer width='100%' height='90%'><BarChart data={typeData}><XAxis dataKey='name' interval={0} angle={-20} height={60} textAnchor='end'/><YAxis/><Tooltip/><Bar dataKey='value' fill='#14b8a6'/></BarChart></ResponsiveContainer></div>
  </div>
}
