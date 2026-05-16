# Sentinel SIEM Dashboard

## Live SOC Telemetry & Threat Detection Platform

Sentinel SIEM Dashboard is a cybersecurity portfolio project designed to simulate a modern Security Operations Center (SOC) environment. The platform visualizes live telemetry ingestion, attack replay scenarios, MITRE ATT&CK mapping, IOC tracking, and incident detection workflows using a real-time dashboard experience.

This project was built to demonstrate:
- Detection engineering concepts
- SOC analyst workflows
- Security telemetry visualization
- Threat hunting interfaces
- Incident correlation logic
- Real-time dashboard engineering
- Cybersecurity-focused frontend development

---

# Features

## Live Telemetry Streaming
- Simulated enterprise telemetry ingestion
- Live event feed
- Real-time alert generation
- Streaming dashboard updates
- Adjustable telemetry speed controls
- Pause/play SOC feed simulation

## Detection Engineering
Simulated detections include:
- Brute force authentication attempts
- Privilege escalation
- Malware beaconing
- Port scanning
- Suspicious outbound traffic
- Impossible travel anomalies
- Data exfiltration behavior

## MITRE ATT&CK Mapping
The dashboard correlates events with MITRE ATT&CK tactics and techniques including:
- Initial Access
- Execution
- Credential Access
- Discovery
- Lateral Movement
- Exfiltration
- Command and Control

## SOC Workflow Simulation
- Active incident queue
- IOC tables
- Threat actor tracking
- Attack replay chains
- Security KPI monitoring
- Risk analysis panels
- Real-time event correlation

## Threat Hunting
Filter telemetry by:
- Severity
- Event type
- Source IP
- Hostname
- User activity

---

# Architecture Overview

```text
Simulated Telemetry Generator
            ↓
Live Stream Engine
            ↓
Detection Logic & Correlation
            ↓
MITRE ATT&CK Mapping
            ↓
SOC Dashboard Visualization
            ↓
Incident Workflow Panels
```

---

# Tech Stack

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

## Visualization
- Recharts
- Lucide React Icons

## Security Concepts
- SIEM workflows
- IOC analysis
- MITRE ATT&CK framework
- Threat detection logic
- Attack chain simulation
- Telemetry correlation

---

# Live Telemetry Engine

The platform includes a simulated real-time telemetry engine that streams logs into the dashboard over time instead of loading static datasets all at once.

Features include:
- Adjustable streaming speed
- Event replay behavior
- Dynamic KPI updates
- Live incident queue updates
- Streaming SOC visualization

This creates a more realistic enterprise SIEM experience similar to:
- Splunk
- Microsoft Sentinel
- Elastic SIEM
- QRadar

---

# Simulated Attack Chains

Example attack progression:

```text
Reconnaissance
↓
Port Scan
↓
Failed Authentication Attempts
↓
Successful Login
↓
Privilege Escalation
↓
PowerShell Execution
↓
Malware Beaconing
↓
Data Exfiltration
```

---

# Running the Project

## Install Dependencies

```bash
npm install
```

## Generate Simulated Telemetry

```bash
npm run generate:logs
```

## Run Development Server

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

---

# Future Improvements

Planned upgrades include:
- WebSocket telemetry ingestion
- Sigma rule engine
- AI-assisted alert analysis
- Threat intelligence enrichment
- Advanced attack replay engine
- Analyst case management
- Cloud telemetry simulation
- Windows/Sysmon ingestion
- Role-based access control
- Detection rule editor

---

# Resume Project Summary

Developed a live SIEM/SOC simulation platform using React, TypeScript, Tailwind CSS, and Recharts to visualize enterprise telemetry ingestion, MITRE ATT&CK mapping, IOC correlation, and real-time threat detection workflows.

---

# Author

Christopher Hamilton

Computer Science Graduate — Cybersecurity Focus  
Kean University

GitHub:
https://github.com/Chrishamie141

---

# Disclaimer

This project is intended strictly for cybersecurity education, portfolio demonstration, and simulated SOC workflow visualization.
