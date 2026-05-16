import type { DetectionResult, SecurityLog, Severity } from '../types'

const byEvent = (logs: SecurityLog[], event: string) => logs.filter((l) => l.event_type === event)
const toSeverity = (count: number, high = 8, med = 4): Severity => (count >= high ? 'critical' : count >= med ? 'high' : 'medium')

export function generateDetections(logs: SecurityLog[]): DetectionResult[] {
  const detections: DetectionResult[] = []
  const byIp = new Map<string, SecurityLog[]>()
  logs.forEach((l) => byIp.set(l.source_ip, [...(byIp.get(l.source_ip) ?? []), l]))

  for (const [ip, ipLogs] of byIp) {
    const failed = ipLogs.filter((l) => l.event_type === 'failed_login')
    const success = ipLogs.find((l) => l.event_type === 'successful_login')
    const scans = ipLogs.filter((l) => l.event_type === 'port_scan')
    const c2 = ipLogs.filter((l) => ['malware_beacon', 'dns_beacon', 'outbound_c2'].includes(l.event_type))
    const exfil = ipLogs.filter((l) => l.event_type === 'data_exfiltration')

    if (failed.length >= 6) {
      detections.push({ id: `bruteforce-${ip}`, title: 'Brute Force Login Attempts', severity: toSeverity(failed.length), confidence: Math.min(99, 60 + failed.length * 3), status: 'Open', affected_ip: ip, affected_user: failed[0]?.username, affected_host: failed[0]?.hostname, mitre_tactic: 'Credential Access', mitre_technique: 'T1110 Brute Force', evidence: `${failed.length} failed logins from ${ip} against ${failed[0]?.hostname}.`, recommendation: 'Block source IP, enforce MFA, and reset targeted accounts.' })
    }
    if (failed.length >= 4 && new Set(failed.map((f) => f.username)).size >= 3) {
      detections.push({ id: `spray-${ip}`, title: 'Password Spray Behavior', severity: 'high', confidence: 82, status: 'Open', affected_ip: ip, mitre_tactic: 'Credential Access', mitre_technique: 'T1110.003 Password Spraying', evidence: `Single IP attempted ${new Set(failed.map((f) => f.username)).size} usernames.`, recommendation: 'Enable account lockout thresholds and geo-IP based conditional access.' })
    }
    if (success && failed.length >= 3) {
      detections.push({ id: `success-after-brute-${ip}`, title: 'Successful Login After Brute Force', severity: 'critical', confidence: 93, status: 'Open', affected_ip: ip, affected_user: success.username, affected_host: success.hostname, mitre_tactic: 'Initial Access', mitre_technique: 'T1078 Valid Accounts', evidence: `${failed.length} failed attempts were followed by a successful login for ${success.username}.`, recommendation: 'Disable the account, isolate host, and begin incident response triage.' })
    }
    if (scans.length >= 12) {
      detections.push({ id: `scan-${ip}`, title: 'Port Scan Activity', severity: 'high', confidence: 78, status: 'Open', affected_ip: ip, mitre_tactic: 'Discovery', mitre_technique: 'T1046 Network Service Discovery', evidence: `${scans.length} scan events across multiple destination ports.`, recommendation: 'Block scanning host and review firewall exposure.' })
    }
    if (c2.length >= 5) {
      detections.push({ id: `beacon-${ip}`, title: 'Malware Beaconing / C2 Pattern', severity: 'critical', confidence: 88, status: 'Open', affected_ip: ip, affected_host: c2[0]?.hostname, mitre_tactic: 'Command and Control', mitre_technique: 'T1071 Application Layer Protocol', evidence: `${c2.length} periodic DNS/C2 callbacks detected from ${c2[0]?.hostname}.`, recommendation: 'Contain endpoint and sinkhole malicious domains.' })
    }
    if (exfil.length >= 2) {
      detections.push({ id: `exfil-${ip}`, title: 'Potential Data Exfiltration', severity: 'critical', confidence: 90, status: 'Open', affected_ip: ip, affected_host: exfil[0]?.hostname, mitre_tactic: 'Exfiltration', mitre_technique: 'T1567 Exfiltration Over Web Service', evidence: `${exfil.length} high-volume outbound transfers to uncommon destinations.`, recommendation: 'Terminate sessions and perform data loss impact analysis.' })
    }
  }

  const suspiciousPs = byEvent(logs, 'suspicious_powershell')
  if (suspiciousPs.length >= 3) detections.push({ id: 'suspicious-powershell', title: 'Suspicious PowerShell Execution', severity: 'high', confidence: 84, status: 'Open', affected_host: suspiciousPs[0].hostname, affected_user: suspiciousPs[0].username, mitre_tactic: 'Execution', mitre_technique: 'T1059.001 PowerShell', evidence: `${suspiciousPs.length} encoded/obfuscated PowerShell executions detected.`, recommendation: 'Capture script block logs and isolate impacted host.' })

  const escalations = byEvent(logs, 'privilege_escalation')
  if (escalations.length >= 2) detections.push({ id: 'priv-esc', title: 'Privilege Escalation Attempt', severity: 'critical', confidence: 87, status: 'Open', affected_user: escalations[0].username, affected_host: escalations[0].hostname, mitre_tactic: 'Privilege Escalation', mitre_technique: 'T1068 Exploitation for Privilege Escalation', evidence: `${escalations.length} escalation events tied to elevated token misuse.`, recommendation: 'Revoke tokens and audit admin group changes immediately.' })

  const impossible = byEvent(logs, 'impossible_travel')
  if (impossible.length > 0) detections.push({ id: 'impossible-travel', title: 'Impossible Travel Login', severity: 'medium', confidence: 70, status: 'Open', affected_user: impossible[0].username, mitre_tactic: 'Credential Access', mitre_technique: 'T1078 Valid Accounts', evidence: `Login geolocation shifted faster than physical travel allows.`, recommendation: 'Force re-authentication and investigate possible account compromise.' })

  const outbound = logs.filter((l) => l.event_type === 'outbound_connection' && [8080, 8443, 1337].includes(l.destination_port))
  if (outbound.length >= 6) detections.push({ id: 'suspicious-outbound', title: 'Suspicious Outbound Traffic', severity: 'high', confidence: 79, status: 'Open', affected_host: outbound[0].hostname, affected_ip: outbound[0].source_ip, mitre_tactic: 'Command and Control', mitre_technique: 'T1571 Non-Standard Port', evidence: `${outbound.length} outbound sessions over uncommon C2-like ports.`, recommendation: 'Apply egress filtering and inspect destination reputation.' })

  return detections
}
