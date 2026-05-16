import fs from 'node:fs'
import path from 'node:path'

const now = Date.now()
const logs = []
const users = ['j.smith', 'analyst1', 'svc_backup', 'it_admin', 'finance.user', 'guest']
const hosts = ['WS-01', 'WS-22', 'DB-PRD', 'SRV-DC01', 'LAPTOP-19', 'API-GW']
const attackers = ['185.220.101.4', '45.95.147.22', '103.77.192.11']
const victimHosts = ['WS-22', 'SRV-DC01', 'DB-PRD']

function addLog(offsetMins, p) { logs.push({ timestamp: new Date(now - offsetMins * 60000).toISOString(), status: 'ok', protocol: 'TCP', ...p }) }
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function ip() { return `${Math.floor(Math.random()*223)+1}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}` }

for (let i = 0; i < 380; i++) addLog(2000 - i * 3, { source_ip: ip(), destination_ip: ip(), username: rand(users), hostname: rand(hosts), event_type: rand(['dns_query', 'file_access', 'successful_login', 'outbound_connection']), severity: rand(['low','low','medium']), message: 'Normal enterprise activity observed', mitre_attack: 'ATT&CK T1071', tactic: 'Command and Control', technique_id: 'T1071', process_name: rand(['chrome.exe','teams.exe','svchost.exe']), destination_port: rand([53,80,443]), protocol: rand(['TCP','UDP','HTTPS']) })

let t = 900
for (const attacker of attackers) {
  for (let p = 20; p <= 200; p += 15) addLog(t--, { source_ip: attacker, destination_ip: '10.0.10.15', username: 'guest', hostname: victimHosts[0], event_type: 'port_scan', severity: 'medium', message: `Sequential probing on port ${p}`, mitre_attack: 'ATT&CK T1046', tactic: 'Discovery', technique_id: 'T1046', process_name: 'nmap.exe', destination_port: p, protocol: 'TCP' })
  for (let f = 0; f < 8; f++) addLog(t--, { source_ip: attacker, destination_ip: '10.0.10.15', username: rand(['it_admin','j.smith','finance.user','svc_backup']), hostname: victimHosts[0], event_type: 'failed_login', severity: 'high', message: 'Authentication failure from untrusted source', mitre_attack: 'ATT&CK T1110', tactic: 'Credential Access', technique_id: 'T1110', process_name: 'sshd', destination_port: 22, protocol: 'TCP' })
  addLog(t--, { source_ip: attacker, destination_ip: '10.0.10.15', username: 'it_admin', hostname: victimHosts[0], event_type: 'successful_login', severity: 'critical', message: 'Login success after multiple failures', mitre_attack: 'ATT&CK T1078', tactic: 'Initial Access', technique_id: 'T1078', process_name: 'sshd', destination_port: 22, protocol: 'TCP' })
  addLog(t--, { source_ip: attacker, destination_ip: '10.0.10.15', username: 'it_admin', hostname: victimHosts[0], event_type: 'privilege_escalation', severity: 'critical', message: 'Token impersonation and admin group modification', mitre_attack: 'ATT&CK T1068', tactic: 'Privilege Escalation', technique_id: 'T1068', process_name: 'runas.exe', destination_port: 445, protocol: 'TCP' })
  for (let ps = 0; ps < 4; ps++) addLog(t--, { source_ip: attacker, destination_ip: '10.0.10.45', username: 'it_admin', hostname: victimHosts[1], event_type: 'suspicious_powershell', severity: 'high', message: 'Encoded PowerShell command executed', mitre_attack: 'ATT&CK T1059.001', tactic: 'Execution', technique_id: 'T1059.001', process_name: 'powershell.exe', destination_port: 5985, protocol: 'TCP' })
  for (let d = 0; d < 8; d++) addLog(t--, { source_ip: attacker, destination_ip: '8.8.8.8', username: 'svc_backup', hostname: victimHosts[1], event_type: 'dns_beacon', severity: 'high', message: 'Periodic DNS beacon to rare domain', mitre_attack: 'ATT&CK T1071.004', tactic: 'Command and Control', technique_id: 'T1071.004', process_name: 'svchost.exe', destination_port: 53, protocol: 'UDP' })
  for (let c = 0; c < 8; c++) addLog(t--, { source_ip: attacker, destination_ip: '91.240.118.12', username: 'svc_backup', hostname: victimHosts[1], event_type: 'outbound_c2', severity: 'critical', message: 'Repeated outbound C2 traffic over uncommon TLS', mitre_attack: 'ATT&CK T1571', tactic: 'Command and Control', technique_id: 'T1571', process_name: 'rundll32.exe', destination_port: rand([8080,8443,1337]), protocol: 'HTTPS' })
  for (let x = 0; x < 3; x++) addLog(t--, { source_ip: attacker, destination_ip: '203.0.113.54', username: 'finance.user', hostname: victimHosts[2], event_type: 'data_exfiltration', severity: 'critical', message: 'Bulk outbound transfer from sensitive share', mitre_attack: 'ATT&CK T1567', tactic: 'Exfiltration', technique_id: 'T1567', process_name: '7z.exe', destination_port: 443, protocol: 'HTTPS' })
}

for (let i = 0; i < 10; i++) addLog(300 - i, { source_ip: attackers[0], destination_ip: '10.0.1.5', username: 'analyst1', hostname: 'LAPTOP-19', event_type: 'impossible_travel', severity: 'medium', message: 'User geolocation anomaly', mitre_attack: 'ATT&CK T1078', tactic: 'Credential Access', technique_id: 'T1078', process_name: 'browser.exe', destination_port: 443, protocol: 'HTTPS' })

logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
const out = path.resolve('src/data/securityLogs.json')
fs.writeFileSync(out, JSON.stringify(logs, null, 2))
console.log(`Generated ${logs.length} logs to ${out}`)
