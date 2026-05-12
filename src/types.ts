export type SecurityLog = {
  timestamp: string
  source_ip: string
  destination_ip: string
  username: string
  hostname: string
  event_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: string
  message: string
  mitre_attack: string
  tactic: string
  technique_id: string
  process_name: string
  destination_port: number
  protocol: string
}
