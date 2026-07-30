export const profile = {
  name: 'Arihant Jain',
  callsign: 'AJ',
  role: 'Final-year B.Tech CSE · Cyber Security minor',
  location: 'Ahmedabad, India',
  email: 'arihant.j0609@gmail.com',
  phone: '+91 7568565631',
  resume: '/Arihant_Jain_Resume.pdf',
  headline: ['Security tooling.', 'Forensic pipelines.', 'Software that flies.'],
  blurb:
    'Final-year Computer Science undergrad at Nirma University with a minor in Cyber Security. I go deep on security and systems, and wide on purpose - because real-world problems rarely fit within a single discipline.',
  approach:
    'Curious, self-directed, and security-minded, I enjoy solving complex systems problems through hands-on engineering. I prioritize verification over assumptions, design with security from the start, and focus on building complete, reliable solutions that work in real-world environments.',
  socials: [
    { label: 'GitHub', handle: 'aj-singhvi', url: 'https://github.com/aj-singhvi' },
    { label: 'LinkedIn', handle: 'arihantjain0609', url: 'https://linkedin.com/in/arihantjain0609' },
    { label: 'LeetCode', handle: 'Aj_singhvi', url: 'https://leetcode.com/u/Aj_singhvi' },
    { label: 'Codeforces', handle: 'Aj.singhvi', url: 'https://codeforces.com/profile/Aj.singhvi' },
  ],
}
export const stats = [
  { value: 8.99, suffix: '/10', label: 'CGPA' },
  { value: 1712, suffix: '', label: 'LeetCode rating' },
  { value: 1049, suffix: '', label: 'Codeforces max' }
]
export const domains = [
  'Cyber Security',
  'Digital Forensics',
  'Cloud',
  'Machine Learning',
  'Computer Architecture',
  'Networks',
  'Blockchain',
  'Systems',
]
export const modules = [
  {
    id: 'EXP_01',
    kind: 'Experience' as const,
    image: '/work/gcs.png',
    title: 'UAV Ground Control Station',
    org: 'Verniq UAVs Pvt Ltd',
    role: 'Software Development Intern',
    period: 'MAY–JUL 2026',
    summary: 'Mission planning and live surveillance for real airframes',
    stack: ['React', 'TypeScript', 'FastAPI', 'Python', 'MAVLink', 'RTSP'],
    points: [
      'A FastAPI backend - MAVProxy bridge, telemetry and command services - with Mission, Surveillance and Calibration consoles in React and TypeScript.',
      'Validated on real, non-simulated field tests: live telemetry, RTSP feed, GPS accuracy and mission deploy on actual flight hardware.',
    ],
    link: '',
  },
  {
    id: 'PRJ_01',
    kind: 'Project' as const,
    image: '/work/minion.png',
    title: 'Minion',
    org: 'Vulnerability scanner',
    role: 'Full-stack web security assessment platform',
    period: 'SELF-DIRECTED',
    summary: 'Concurrent scanning with findings streamed live',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Socket.IO', 'JWT', 'Docker'],
    points: [
      'Modular checks across web, API, DNS, SSL/TLS, CMS, network and cloud, with findings streaming to the interface as they are found.',
      'Hardened with JWT auth, role-based authorization, SSRF protection and rate limiting, and PDF/CSV reports carrying evidence, CVE references and remediation.',
    ],
    link: 'https://github.com/aj-singhvi/minion-vulnerability-scanner',
  },
  {
    id: 'PRJ_02',
    kind: 'Project' as const,
    image: '/work/triagex.png',
    title: 'TriageX',
    org: 'Forensic triage tool',
    role: 'Portable live analysis for Windows incident response',
    period: 'SELF-DIRECTED',
    summary: 'Dual-model threat scoring, zero install on target',
    stack: ['Python', 'scikit-learn', 'Random Forest', 'Isolation Forest', 'SHA-256'],
    points: [
      'Live process, network and system analysis on a target machine with no installation required - built for the speed a first responder actually has.',
      'Random Forest classification paired with Isolation Forest anomaly detection, output as integrity-verified reports with SHA-256 hashing and per-process threat scoring.',
    ],
    link: 'https://github.com/aj-singhvi/TriageX',
  },
  {
    id: 'PRJ_03',
    kind: 'Project' as const,
    image: '/work/snapsense.png',
    title: 'SnapSense AI',
    org: 'Workflow automation',
    role: 'Screenshots in, structured action out',
    period: 'SELF-DIRECTED',
    summary: 'Vision-model extraction routed into live Google APIs',
    stack: ['React', 'Node.js', 'MongoDB Atlas', 'Groq Vision', 'OAuth 2.0'],
    points: [
      'Classifies screenshots, extracts structured information with a vision language model, then routes it into Google Calendar, Tasks, Drive and Sheets.',
      'Google OAuth, real-time image processing, and AI actions the user can edit - so every automated decision stays reviewable.',
    ],
    link: 'https://github.com/Krish-bhavsar19/SnapSense',
  },
]

/** Technical spec. Names only - no ratings, no invented percentages, no commentary. */
export const spec = [
  { group: 'Languages', items: ['Python', 'C++', 'C', 'JavaScript', 'TypeScript', 'SQL'] },
  { group: 'Backend', items: ['FastAPI', 'Node.js', 'Express', 'Flask', 'REST', 'Socket.IO'] },
  { group: 'Data', items: ['PostgreSQL', 'MongoDB Atlas', 'scikit-learn'] },
  { group: 'Cloud & Infra', items: ['AWS', 'Docker', 'Supabase', 'Linux', 'Git'] },
  { group: 'Security', items: ['JWT', 'OAuth 2.0', 'SSRF', 'XSS', 'SQL Injection', 'IDOR', 'SSL/TLS'] },
  { group: 'Systems', items: ['MAVLink', 'RTSP', 'Electron', 'Packet Tracer'] },
]

export const education = [
  {
    school: 'Nirma University',
    detail: 'B.Tech. Computer Science & Engineering, minor in Cyber Security',
    period: '2023 - 2027',
    place: 'Ahmedabad',
  },
  {
    school: 'The Modern School',
    detail: 'Senior Secondary - HSC 97.2%, SSC 95.2%',
    period: '2020 - 2022',
    place: 'Barmer',
  },
]

export const certifications = [
  { name: 'Gen AI Academy', issuer: 'Google Cloud × Hack2skill Gen AI Exchange', year: '2025' },
  { name: 'AWS Academy Graduate', issuer: 'Cloud Foundations', year: '—' },
]

export const sections = [
  { id: 'work', num: '01', label: 'Work' },
  { id: 'spec', num: '02', label: 'Spec' },
  { id: 'contact', num: '03', label: 'Contact' },
]
