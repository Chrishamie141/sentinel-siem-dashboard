export type Severity = 'low' | 'medium' | 'high' | 'critical'

export type AlertStatus = 'Open' | 'Investigating' | 'Resolved'

export type SecurityLog = {
  timestamp: string
  source_ip: string
  destination_ip: string
  username: string
  hostname: string
  event_type: string
  severity: Severity
  status: string
  message: string
  mitre_attack: string
  tactic: string
  technique_id: string
  process_name: string
  destination_port: number
  protocol: string
}

export type DetectionResult = {
  id: string
  title: string
  severity: Severity
  confidence: number
  status: AlertStatus
  affected_ip?: string
  affected_user?: string
  affected_host?: string
  mitre_tactic: string
  mitre_technique: string
  evidence: string
  recommendation: string
}

export type IOC = {
  indicator: string
  type: 'ip' | 'host' | 'user' | 'process'
  severity: Severity
  first_seen: string
  last_seen: string
  related_mitre_technique: string
  recommended_action: string
}

export type AssetRisk = {
  hostname: string
  alert_count: number
  critical_count: number
  top_technique: string
  risk_score: number
}

export type UserRisk = {
  username: string
  failed_logins: number
  escalations: number
  risky_events: number
  risk_score: number
}
