import type { SecurityLog } from '../types'

export const detectBruteForce = (logs: SecurityLog[]) => logs.filter((l) => l.event_type === 'failed_login').length > 20
export const detectPortScan = (logs: SecurityLog[]) => logs.filter((l) => l.event_type === 'port_scan').length > 10
export const detectMalwareBeaconing = (logs: SecurityLog[]) => logs.filter((l) => l.event_type === 'malware_beacon').length > 5
export const detectSuspiciousOutboundTraffic = (logs: SecurityLog[]) => logs.filter((l) => l.event_type === 'outbound_connection' && [8080,8443].includes(l.destination_port)).length > 10
export const detectPrivilegeEscalation = (logs: SecurityLog[]) => logs.some((l) => l.event_type === 'privilege_escalation' && (l.severity === 'high' || l.severity === 'critical'))
export const detectImpossibleTravel = (logs: SecurityLog[]) => logs.filter((l) => l.event_type === 'impossible_travel').length > 1
export const detectDataExfiltration = (logs: SecurityLog[]) => logs.filter((l) => l.event_type === 'data_exfiltration').length > 2
