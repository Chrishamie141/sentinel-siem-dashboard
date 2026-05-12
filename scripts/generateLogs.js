import fs from 'node:fs'
import path from 'node:path'

const eventTypes = ['failed_login','successful_login','port_scan','dns_query','malware_beacon','file_access','outbound_connection','privilege_escalation','data_exfiltration','impossible_travel','suspicious_process']
const severities = ['low','medium','high','critical']
const tactics = ['Credential Access','Discovery','Execution','Exfiltration','Lateral Movement','Command and Control']
const techniques = ['T1110','T1046','T1071','T1059','T1021','T1567','T1078']
const procs = ['powershell.exe','cmd.exe','svchost.exe','python.exe','wmic.exe','rundll32.exe']

const r=(arr)=>arr[Math.floor(Math.random()*arr.length)]
const ip=()=>`${Math.floor(Math.random()*223)+1}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`
const users=['j.smith','analyst1','svc_backup','it_admin','guest','finance.user']
const hosts=['WS-01','WS-22','DB-PRD','SRV-DC01','LAPTOP-19','API-GW']
const protocols=['TCP','UDP','HTTPS','DNS']

const now=Date.now()
const logs=[]
for (let i=0;i<650;i++) {
  const event=r(eventTypes)
  const severity=r(severities)
  logs.push({
    timestamp:new Date(now-Math.floor(Math.random()*1000*60*60*24*7)).toISOString(),
    source_ip:ip(),
    destination_ip:ip(),
    username:r(users),
    hostname:r(hosts),
    event_type:event,
    severity,
    status: severity==='critical' || severity==='high' ? 'alert':'ok',
    message:`${event.replaceAll('_',' ')} detected on endpoint`,
    mitre_attack:`ATT&CK ${r(techniques)}`,
    tactic:r(tactics),
    technique_id:r(techniques),
    process_name:r(procs),
    destination_port:[22,53,80,443,3389,8080,8443][Math.floor(Math.random()*7)],
    protocol:r(protocols)
  })
}
logs.sort((a,b)=> new Date(a.timestamp)-new Date(b.timestamp))

const out = path.resolve('src/data/securityLogs.json')
fs.writeFileSync(out, JSON.stringify(logs,null,2))
console.log(`Generated ${logs.length} logs to ${out}`)
