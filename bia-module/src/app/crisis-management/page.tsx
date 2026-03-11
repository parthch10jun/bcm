'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircleIcon,
  ChartBarIcon,
  FireIcon,
  ShieldExclamationIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  BugAntIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { ShieldExclamationIcon as ShieldExclamationSolid } from '@heroicons/react/24/solid';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart
} from 'recharts';

const THREAT_COLORS = ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d'];

export default function CrisisManagementPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [liveUpdate, setLiveUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setLiveUpdate(prev => prev + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  // Data
  const threatLandscape = [
    { name: 'Ransomware', value: 35, severity: 'critical', trend: 'up', count: 12 },
    { name: 'Phishing', value: 28, severity: 'high', trend: 'up', count: 45 },
    { name: 'DDoS', value: 15, severity: 'medium', trend: 'stable', count: 8 },
    { name: 'Insider Threat', value: 12, severity: 'high', trend: 'down', count: 3 },
    { name: 'Zero-Day', value: 10, severity: 'critical', trend: 'up', count: 2 },
  ];

  const attackTimeline = [
    { day: 'Mon', ransomware: 2, phishing: 8, ddos: 1, blocked: 45, attempted: 52 },
    { day: 'Tue', ransomware: 1, phishing: 12, ddos: 0, blocked: 62, attempted: 68 },
    { day: 'Wed', ransomware: 3, phishing: 15, ddos: 2, blocked: 78, attempted: 89 },
    { day: 'Thu', ransomware: 2, phishing: 10, ddos: 1, blocked: 55, attempted: 63 },
    { day: 'Fri', ransomware: 4, phishing: 18, ddos: 3, blocked: 92, attempted: 108 },
    { day: 'Sat', ransomware: 1, phishing: 5, ddos: 1, blocked: 28, attempted: 32 },
    { day: 'Sun', ransomware: 0, phishing: 3, ddos: 0, blocked: 18, attempted: 21 },
  ];

  const securityDomains = [
    { domain: 'Network', score: 85, target: 90 },
    { domain: 'Endpoint', score: 72, target: 85 },
    { domain: 'Access', score: 88, target: 90 },
    { domain: 'Data', score: 65, target: 80 },
    { domain: 'Cloud', score: 70, target: 85 },
    { domain: 'Response', score: 82, target: 85 },
  ];

  const vulnTrend = [
    { month: 'Jul', open: 275, remediated: 120 },
    { month: 'Aug', open: 258, remediated: 145 },
    { month: 'Sep', open: 254, remediated: 168 },
    { month: 'Oct', open: 254, remediated: 185 },
    { month: 'Nov', open: 247, remediated: 192 },
    { month: 'Dec', open: 235, remediated: 210 },
  ];

  const topVulnerabilities = [
    { cve: 'CVE-2024-1234', name: 'Apache Log4j RCE', cvss: 10.0, affected: '8 systems', priority: 'P1' },
    { cve: 'CVE-2024-5678', name: 'Windows Print Spooler', cvss: 8.8, affected: '45 systems', priority: 'P1' },
    { cve: 'CVE-2024-9012', name: 'OpenSSL Buffer Overflow', cvss: 8.1, affected: '12 systems', priority: 'P2' },
    { cve: 'CVE-2024-3456', name: 'SQL Server Injection', cvss: 7.5, affected: '3 systems', priority: 'P2' },
  ];

  const executiveKPIs = [
    { name: 'MTTR', value: 4.2, unit: 'hrs', target: 4.0, change: '-28%' },
    { name: 'MTTD', value: 12, unit: 'min', target: 10, change: '-33%' },
    { name: 'Incidents/Wk', value: 2.3, unit: '', target: 2.0, change: '-26%' },
    { name: 'Security Score', value: 78, unit: '%', target: 85, change: '+8%' },
    { name: 'Compliance', value: 94, unit: '%', target: 100, change: '+3%' },
    { name: 'Staff Trained', value: 87, unit: '%', target: 95, change: '+6%' },
  ];

  const historicalComparison = [
    { quarter: 'Q1 2024', incidents: 45, resolved: 42, mttr: 6.5, score: 72 },
    { quarter: 'Q2 2024', incidents: 38, resolved: 36, mttr: 5.2, score: 75 },
    { quarter: 'Q3 2024', incidents: 32, resolved: 31, mttr: 4.8, score: 78 },
    { quarter: 'Q4 2024', incidents: 28, resolved: 27, mttr: 4.2, score: 82 },
  ];

  const activeCrises = [
    { id: 'CRS-001', title: 'Data Center Power Outage', severity: 'CRITICAL', status: 'ACTIVE', duration: '2h 15m', commander: 'Sarah Johnson', systems: 12 },
    { id: 'CRS-002', title: 'Ransomware Attack - Finance', severity: 'HIGH', status: 'ACTIVE', duration: '5h 30m', commander: 'Ahmed Al-Mansouri', systems: 25 },
    { id: 'CRS-003', title: 'Supply Chain Disruption', severity: 'MEDIUM', status: 'MONITORING', duration: '8h 45m', commander: 'Maria Garcia', systems: 5 },
  ];

  const activityFeed = [
    { time: '2 min ago', action: 'Response team activated for CRS-001', type: 'alert' },
    { time: '5 min ago', action: 'Incident Commander assigned to CRS-002', type: 'update' },
    { time: '12 min ago', action: 'Stakeholder notification sent', type: 'notification' },
    { time: '18 min ago', action: 'Crisis escalated to CRITICAL', type: 'escalation' },
    { time: '25 min ago', action: 'Emergency protocol initiated', type: 'alert' },
  ];

  const configGaps = [
    { id: 'GAP-001', category: 'Firewall', description: 'Outbound traffic not filtered', severity: 'Critical', status: 'Open' },
    { id: 'GAP-002', category: 'Endpoints', description: 'EDR agent outdated on 23 endpoints', severity: 'High', status: 'In Progress' },
    { id: 'GAP-003', category: 'IAM', description: 'MFA not enforced for admins', severity: 'Critical', status: 'Open' },
    { id: 'GAP-004', category: 'Encryption', description: 'Backup servers missing encryption', severity: 'High', status: 'Open' },
  ];

  // Theme classes
  const t = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textSec: darkMode ? 'text-gray-400' : 'text-gray-600',
    textMuted: darkMode ? 'text-gray-500' : 'text-gray-500',
    chartBg: darkMode ? '#1f2937' : '#ffffff',
    chartGrid: darkMode ? '#374151' : '#e5e7eb',
    chartText: darkMode ? '#9ca3af' : '#6b7280',
  };

  return (
    <div className={`min-h-screen ${t.bg} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' : 'bg-white'} border-b ${t.border} shadow-lg`}>
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-40 animate-pulse"></div>
              <div className={`relative ${t.card} p-2 rounded-lg border border-red-500/30`}>
                <ShieldExclamationSolid className="h-7 w-7 text-red-500" />
              </div>
            </div>
            <div>
              <h1 className={`text-lg font-bold ${t.text} flex items-center gap-2`}>
                Cyber Crisis Command Center
                <span className="text-[10px] px-2 py-0.5 bg-red-600 text-white rounded font-medium animate-pulse">LIVE</span>
              </h1>
              <p className={`text-xs ${t.textSec}`}>Real-time threat monitoring • Security posture • Vulnerability management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg border ${t.border} ${t.card} hover:opacity-80 transition-all`} title={darkMode ? 'Light Mode' : 'Dark Mode'}>
              {darkMode ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-gray-600" />}
            </button>
            <div className={`flex items-center gap-2 px-3 py-1.5 ${darkMode ? 'bg-red-900/30' : 'bg-red-100'} border border-red-500/30 rounded`}>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-red-500">2 Active Threats</span>
            </div>
            <button className={`px-3 py-1.5 text-xs font-medium rounded border ${t.border} ${t.card} ${t.textSec} hover:opacity-80`}>
              <DocumentArrowDownIcon className="h-4 w-4 inline mr-1" />Export All
            </button>
            <Link href="/crisis-management/playbooks/new" className="px-3 py-1.5 text-xs font-medium rounded text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg shadow-red-500/20">
              <FireIcon className="h-4 w-4 inline mr-1" />Declare Crisis
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - All Sections on One Page */}
      <main className="px-6 py-6">
        <div className="space-y-6">

          {/* Section 1: Executive KPIs */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className={`text-sm font-bold ${t.text} flex items-center gap-2`}>
                <ChartBarIcon className="h-5 w-5 text-red-500" />Executive Overview
              </h2>
              <span className={`text-[10px] ${t.textMuted}`}>Updated: Just now</span>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {executiveKPIs.map((kpi, idx) => (
                <div key={idx} className={`${t.card} border ${t.border} rounded-lg p-3 hover:shadow-lg transition-shadow`}>
                  <p className={`text-[10px] font-medium ${t.textSec} uppercase tracking-wider`}>{kpi.name}</p>
                  <div className="flex items-end justify-between mt-1">
                    <p className={`text-xl font-bold ${t.text}`}>{kpi.value}<span className={`text-xs font-normal ${t.textSec}`}>{kpi.unit}</span></p>
                    <span className={`text-[10px] font-medium ${kpi.change.startsWith('-') ? 'text-green-500' : 'text-green-500'}`}>{kpi.change}</span>
                  </div>
                  <div className={`mt-2 h-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}></div>
                  </div>
                  <p className={`text-[10px] ${t.textMuted} mt-1`}>Target: {kpi.target}{kpi.unit}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Active Incidents & Live Feed */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className={`lg:col-span-2 ${t.card} border ${t.border} rounded-lg overflow-hidden`}>
              <div className={`px-4 py-2 border-b ${t.border} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  <h3 className={`text-sm font-semibold ${t.text}`}>Active Cyber Incidents</h3>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-500 text-[10px] font-medium rounded-full">{activeCrises.length}</span>
                </div>
              </div>
              <table className="min-w-full">
                <thead className={darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}>
                  <tr>
                    {['ID', 'Incident', 'Severity', 'Duration', 'Commander', 'Impact'].map(h => (
                      <th key={h} className={`px-3 py-2 text-left text-[10px] font-medium ${t.textSec} uppercase`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                  {activeCrises.map((crisis) => (
                    <tr key={crisis.id} className={`${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'} cursor-pointer`}>
                      <td className="px-3 py-2 text-xs font-mono text-red-500">{crisis.id}</td>
                      <td className={`px-3 py-2 text-xs ${t.text} font-medium`}>{crisis.title}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                          crisis.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
                          crisis.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' : 'bg-yellow-500/20 text-yellow-600'
                        }`}>{crisis.severity}</span>
                      </td>
                      <td className={`px-3 py-2 text-xs ${t.textSec}`}>{crisis.duration}</td>
                      <td className={`px-3 py-2 text-xs ${t.textSec}`}>{crisis.commander}</td>
                      <td className={`px-3 py-2 text-xs ${t.text}`}>{crisis.systems} systems</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`${t.card} border ${t.border} rounded-lg overflow-hidden`}>
              <div className={`px-4 py-2 border-b ${t.border} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <BellAlertIcon className="h-5 w-5 text-orange-500" />
                  <h3 className={`text-sm font-semibold ${t.text}`}>Live Threat Feed</h3>
                </div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div><span className="text-[10px] text-red-500">Live</span></div>
              </div>
              <div className="p-3 space-y-2 max-h-52 overflow-y-auto">
                {activityFeed.map((a, idx) => (
                  <div key={idx} className={`flex gap-2 p-2 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'} rounded-lg`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${a.type === 'alert' ? 'bg-red-500 animate-pulse' : a.type === 'escalation' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                    <div>
                      <p className={`text-xs ${t.text}`}>{a.action}</p>
                      <p className={`text-[10px] ${t.textMuted}`}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Attack Timeline & Threat Pie */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className={`lg:col-span-2 ${t.card} border ${t.border} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FireIcon className="h-5 w-5 text-orange-500" />
                  <h3 className={`text-sm font-semibold ${t.text}`}>7-Day Attack Timeline</h3>
                </div>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1 text-[10px] text-green-500"><div className="w-2 h-2 rounded-full bg-green-500"></div>Blocked</span>
                  <span className="flex items-center gap-1 text-[10px] text-red-500"><div className="w-2 h-2 rounded-full bg-red-500"></div>Attempted</span>
                </div>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={attackTimeline}>
                    <defs>
                      <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.chartGrid} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: t.chartText }} stroke={t.chartGrid} />
                    <YAxis tick={{ fontSize: 10, fill: t.chartText }} stroke={t.chartGrid} />
                    <Tooltip contentStyle={{ backgroundColor: t.chartBg, border: `1px solid ${t.chartGrid}`, borderRadius: '4px' }} labelStyle={{ color: darkMode ? '#fff' : '#000', fontSize: 11 }} itemStyle={{ fontSize: 10 }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Area type="monotone" dataKey="blocked" stroke="#22c55e" fill="url(#blockedGrad)" name="Blocked" />
                    <Bar dataKey="ransomware" fill="#dc2626" stackId="a" name="Ransomware" />
                    <Bar dataKey="phishing" fill="#ea580c" stackId="a" name="Phishing" />
                    <Bar dataKey="ddos" fill="#d97706" stackId="a" name="DDoS" />
                    <Line type="monotone" dataKey="attempted" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Total Attempted" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`${t.card} border ${t.border} rounded-lg p-4`}>
              <h3 className={`text-sm font-semibold ${t.text} mb-2`}>Threat Distribution</h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={threatLandscape} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={2} dataKey="value">
                      {threatLandscape.map((_, i) => <Cell key={i} fill={THREAT_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: t.chartBg, border: `1px solid ${t.chartGrid}` }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {threatLandscape.map((threat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: THREAT_COLORS[idx] }}></div>
                      <span className={t.textSec}>{threat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={t.textMuted}>{threat.count}</span>
                      {threat.trend === 'up' && <ArrowTrendingUpIcon className="h-3 w-3 text-red-400" />}
                      {threat.trend === 'down' && <ArrowTrendingDownIcon className="h-3 w-3 text-green-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 4: Security Radar & Vulnerabilities */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={`${t.card} border ${t.border} rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                <h3 className={`text-sm font-semibold ${t.text}`}>Security Posture Radar</h3>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={securityDomains}>
                    <PolarGrid stroke={t.chartGrid} />
                    <PolarAngleAxis dataKey="domain" tick={{ fontSize: 9, fill: t.chartText }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: t.chartText }} />
                    <Radar name="Current" dataKey="score" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                    <Radar name="Target" dataKey="target" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                    <Tooltip contentStyle={{ backgroundColor: t.chartBg, border: `1px solid ${t.chartGrid}` }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`${t.card} border ${t.border} rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <BugAntIcon className="h-5 w-5 text-red-500" />
                <h3 className={`text-sm font-semibold ${t.text}`}>Vulnerability Trend (6 Months)</h3>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vulnTrend}>
                    <defs>
                      <linearGradient id="vulnGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.chartGrid} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: t.chartText }} stroke={t.chartGrid} />
                    <YAxis tick={{ fontSize: 10, fill: t.chartText }} stroke={t.chartGrid} />
                    <Tooltip contentStyle={{ backgroundColor: t.chartBg, border: `1px solid ${t.chartGrid}` }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Area type="monotone" dataKey="open" stroke="#ef4444" fill="url(#vulnGrad)" name="Open Vulns" />
                    <Line type="monotone" dataKey="remediated" stroke="#22c55e" strokeWidth={2} name="Remediated" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Section 5: Top Vulnerabilities & Config Gaps */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={`${t.card} border ${t.border} rounded-lg overflow-hidden`}>
              <div className={`px-4 py-2 border-b ${t.border} flex items-center justify-between`}>
                <h3 className={`text-sm font-semibold ${t.text}`}>Top Vulnerabilities (Priority)</h3>
                <button className="px-2 py-1 text-[10px] bg-red-600 hover:bg-red-700 text-white rounded">Export</button>
              </div>
              <table className="min-w-full">
                <thead className={darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}>
                  <tr>
                    {['CVE', 'Name', 'CVSS', 'Affected', 'Priority'].map(h => (
                      <th key={h} className={`px-3 py-2 text-left text-[10px] font-medium ${t.textSec} uppercase`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                  {topVulnerabilities.map((v, idx) => (
                    <tr key={idx} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                      <td className="px-3 py-2 text-xs font-mono text-red-500">{v.cve}</td>
                      <td className={`px-3 py-2 text-xs ${t.text}`}>{v.name}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${v.cvss >= 9 ? 'bg-red-500/20 text-red-500' : v.cvss >= 7 ? 'bg-orange-500/20 text-orange-500' : 'bg-yellow-500/20 text-yellow-600'}`}>{v.cvss}</span>
                      </td>
                      <td className={`px-3 py-2 text-xs ${t.textSec}`}>{v.affected}</td>
                      <td className={`px-3 py-2 text-xs font-medium ${t.text}`}>{v.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={`${t.card} border ${t.border} rounded-lg overflow-hidden`}>
              <div className={`px-4 py-2 border-b ${t.border} flex items-center justify-between`}>
                <h3 className={`text-sm font-semibold ${t.text}`}>Configuration Gaps</h3>
                <button className="px-2 py-1 text-[10px] bg-orange-600 hover:bg-orange-700 text-white rounded">Export Report</button>
              </div>
              <table className="min-w-full">
                <thead className={darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}>
                  <tr>
                    {['ID', 'Category', 'Gap', 'Severity', 'Status'].map(h => (
                      <th key={h} className={`px-3 py-2 text-left text-[10px] font-medium ${t.textSec} uppercase`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                  {configGaps.map((g, idx) => (
                    <tr key={idx} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                      <td className="px-3 py-2 text-xs font-mono text-orange-500">{g.id}</td>
                      <td className={`px-3 py-2 text-xs ${t.text}`}>{g.category}</td>
                      <td className={`px-3 py-2 text-xs ${t.textSec} max-w-[200px] truncate`}>{g.description}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${g.severity === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>{g.severity}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${g.status === 'Open' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-600'}`}>{g.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6: Historical Comparison */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={`${t.card} border ${t.border} rounded-lg p-4`}>
              <div className="flex items-center gap-2 mb-3">
                <ChartBarIcon className="h-5 w-5 text-blue-500" />
                <h3 className={`text-sm font-semibold ${t.text}`}>Quarterly Performance</h3>
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalComparison}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.chartGrid} />
                    <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: t.chartText }} stroke={t.chartGrid} />
                    <YAxis tick={{ fontSize: 10, fill: t.chartText }} stroke={t.chartGrid} />
                    <Tooltip contentStyle={{ backgroundColor: t.chartBg, border: `1px solid ${t.chartGrid}` }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Bar dataKey="incidents" fill="#ef4444" name="Incidents" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" fill="#22c55e" name="Resolved" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`${t.card} border ${t.border} rounded-lg overflow-hidden`}>
              <div className={`px-4 py-2 border-b ${t.border}`}>
                <h3 className={`text-sm font-semibold ${t.text}`}>Historical Assessment</h3>
                <p className={`text-[10px] ${t.textMuted}`}>Quarter-over-quarter comparison</p>
              </div>
              <table className="min-w-full">
                <thead className={darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}>
                  <tr>
                    {['Quarter', 'Incidents', 'Resolved', 'MTTR', 'Score'].map(h => (
                      <th key={h} className={`px-4 py-2 text-left text-[10px] font-medium ${t.textSec} uppercase`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                  {historicalComparison.map((q, idx) => (
                    <tr key={idx} className={darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}>
                      <td className={`px-4 py-2 text-xs ${t.text} font-medium`}>{q.quarter}</td>
                      <td className={`px-4 py-2 text-xs ${t.textSec}`}>{q.incidents}</td>
                      <td className="px-4 py-2 text-xs text-green-500">{q.resolved}</td>
                      <td className={`px-4 py-2 text-xs ${t.textSec}`}>{q.mttr}h</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${q.score >= 80 ? 'bg-green-500/20 text-green-500' : q.score >= 70 ? 'bg-yellow-500/20 text-yellow-600' : 'bg-red-500/20 text-red-500'}`}>{q.score}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Links */}
          <section className={`${t.card} border ${t.border} rounded-lg p-4`}>
            <h3 className={`text-sm font-semibold ${t.text} mb-3`}>Quick Actions</h3>
            <div className="grid grid-cols-6 gap-3">
              {[
                { name: 'Response Teams', href: '/crisis-management/teams', icon: '👥', color: 'red' },
                { name: 'Playbooks', href: '/crisis-management/playbooks', icon: '📋', color: 'orange' },
                { name: 'Runbooks', href: '/bcp/runbooks', icon: '⚡', color: 'yellow' },
                { name: 'IRPs', href: '/bcp/scenarios', icon: '🛡️', color: 'blue' },
                { name: 'Alerts', href: '/crisis-management/testing', icon: '🔔', color: 'purple' },
                { name: 'DR Plans', href: '/it-dr-plans', icon: '💾', color: 'green' },
              ].map((item, idx) => (
                <Link key={idx} href={item.href} className={`group ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-3 rounded-lg border ${t.border} hover:border-${item.color}-500/50 transition-all text-center`}>
                  <span className="text-xl">{item.icon}</span>
                  <p className={`text-[10px] ${t.textSec} mt-1 group-hover:text-${item.color}-400`}>{item.name}</p>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

