import type { SecurityLog } from '../types'

export type StreamSpeed = 1 | 2 | 4 | 8

const ATTACK_SEQUENCE: SecurityLog['event_type'][] = [
  'reconnaissance',
  'port_scan',
  'failed_login',
  'failed_login',
  'failed_login',
  'successful_login',
  'privilege_escalation',
  'suspicious_powershell',
  'dns_beacon',
  'outbound_c2',
  'data_exfiltration'
]

export function orderForReplay(logs: SecurityLog[]) {
  const eventRank = new Map(ATTACK_SEQUENCE.map((e, i) => [e, i]))
  return [...logs].sort((a, b) => {
    if (a.source_ip !== b.source_ip) return a.timestamp.localeCompare(b.timestamp)
    const ar = eventRank.get(a.event_type) ?? 99
    const br = eventRank.get(b.event_type) ?? 99
    if (ar !== br) return ar - br
    return a.timestamp.localeCompare(b.timestamp)
  })
}

export function getBatchSize(speed: StreamSpeed) {
  return speed
}
