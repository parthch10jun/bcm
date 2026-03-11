'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  ServerIcon,
  CloudIcon,
  PhoneIcon,
  CogIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  LockClosedIcon,
  GlobeAltIcon,
  BellIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

// Integration Categories
const integrationCategories = [
  {
    id: 'siem-security',
    name: 'SIEM & Security',
    description: 'Security Information and Event Management',
    icon: ShieldCheckIcon,
    color: 'red',
    integrations: [
      { id: 'splunk', name: 'Splunk Enterprise', vendor: 'Splunk Inc.', status: 'connected', lastSync: '2 min ago', eventsToday: 125840 },
      { id: 'qradar', name: 'IBM QRadar', vendor: 'IBM', status: 'connected', lastSync: '5 min ago', eventsToday: 89420 },
      { id: 'crowdstrike', name: 'CrowdStrike Falcon', vendor: 'CrowdStrike', status: 'connected', lastSync: '1 min ago', eventsToday: 45230 },
      { id: 'sentinel', name: 'Microsoft Sentinel', vendor: 'Microsoft', status: 'disconnected', lastSync: 'Never', eventsToday: 0 },
      { id: 'palo-xdr', name: 'Palo Alto Cortex XDR', vendor: 'Palo Alto Networks', status: 'pending', lastSync: 'Configuring...', eventsToday: 0 },
    ]
  },
  {
    id: 'itsm-itam',
    name: 'ITSM & ITAM',
    description: 'IT Service & Asset Management',
    icon: ServerIcon,
    color: 'blue',
    integrations: [
      { id: 'servicenow', name: 'ServiceNow ITSM', vendor: 'ServiceNow', status: 'connected', lastSync: '10 min ago', tickets: 342 },
      { id: 'bmc-remedy', name: 'BMC Remedy', vendor: 'BMC Software', status: 'disconnected', lastSync: 'Never', tickets: 0 },
      { id: 'jira-sm', name: 'Jira Service Management', vendor: 'Atlassian', status: 'connected', lastSync: '3 min ago', tickets: 128 },
      { id: 'freshservice', name: 'Freshservice', vendor: 'Freshworks', status: 'disconnected', lastSync: 'Never', tickets: 0 },
    ]
  },
  {
    id: 'network-infra',
    name: 'Network & Firewall',
    description: 'Network Infrastructure Management',
    icon: GlobeAltIcon,
    color: 'amber',
    integrations: [
      { id: 'palo-fw', name: 'Palo Alto Firewall', vendor: 'Palo Alto Networks', status: 'connected', lastSync: '1 min ago', rules: 2480, policies: 156 },
      { id: 'cisco-asa', name: 'Cisco ASA/FTD', vendor: 'Cisco Systems', status: 'connected', lastSync: '2 min ago', rules: 1850, policies: 98 },
      { id: 'fortinet', name: 'FortiGate', vendor: 'Fortinet', status: 'connected', lastSync: '5 min ago', rules: 920, policies: 45 },
      { id: 'checkpoint', name: 'Check Point', vendor: 'Check Point', status: 'disconnected', lastSync: 'Never', rules: 0, policies: 0 },
      { id: 'f5', name: 'F5 BIG-IP', vendor: 'F5 Networks', status: 'pending', lastSync: 'Configuring...', rules: 0, policies: 0 },
    ]
  },
  {
    id: 'bcpdr',
    name: 'BCP/DR Tools',
    description: 'Backup & Disaster Recovery',
    icon: CloudIcon,
    color: 'green',
    integrations: [
      { id: 'veeam', name: 'Veeam Backup', vendor: 'Veeam', status: 'connected', lastSync: '15 min ago', backupJobs: 48, successRate: '99.2%' },
      { id: 'commvault', name: 'Commvault', vendor: 'Commvault', status: 'connected', lastSync: '20 min ago', backupJobs: 32, successRate: '98.8%' },
      { id: 'zerto', name: 'Zerto', vendor: 'Zerto/HPE', status: 'connected', lastSync: '5 min ago', vpgs: 24, rpo: '< 5 sec' },
      { id: 'rubrik', name: 'Rubrik', vendor: 'Rubrik', status: 'disconnected', lastSync: 'Never', backupJobs: 0, successRate: '-' },
    ]
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Email, SMS & Voice Gateways',
    icon: PhoneIcon,
    color: 'purple',
    integrations: [
      { id: 'smtp', name: 'SMTP Gateway', vendor: 'SendGrid', status: 'connected', lastSync: '1 min ago', sent24h: 1250 },
      { id: 'twilio', name: 'Twilio SMS/Voice', vendor: 'Twilio', status: 'connected', lastSync: '2 min ago', sent24h: 85 },
      { id: 'ms-teams', name: 'Microsoft Teams', vendor: 'Microsoft', status: 'connected', lastSync: '5 min ago', sent24h: 320 },
      { id: 'slack', name: 'Slack', vendor: 'Salesforce', status: 'disconnected', lastSync: 'Never', sent24h: 0 },
    ]
  },
  {
    id: 'custom-api',
    name: 'API & Custom',
    description: 'Custom API Integrations',
    icon: CommandLineIcon,
    color: 'gray',
    integrations: [
      { id: 'rest-api', name: 'REST API Endpoint', vendor: 'Custom', status: 'connected', lastSync: 'Real-time', calls24h: 45200 },
      { id: 'webhook', name: 'Webhook Receiver', vendor: 'Custom', status: 'connected', lastSync: 'Real-time', calls24h: 8920 },
      { id: 'syslog', name: 'Syslog Collector', vendor: 'Custom', status: 'connected', lastSync: 'Real-time', calls24h: 125000 },
    ]
  }
];

// Calculate summary stats
const totalIntegrations = integrationCategories.reduce((sum, cat) => sum + cat.integrations.length, 0);
const connectedIntegrations = integrationCategories.reduce((sum, cat) => 
  sum + cat.integrations.filter(i => i.status === 'connected').length, 0);
const pendingIntegrations = integrationCategories.reduce((sum, cat) => 
  sum + cat.integrations.filter(i => i.status === 'pending').length, 0);
const disconnectedIntegrations = totalIntegrations - connectedIntegrations - pendingIntegrations;

// Available integrations for adding
const availableIntegrations = [
  { id: 'logrhythm', name: 'LogRhythm SIEM', vendor: 'LogRhythm', category: 'siem-security', description: 'Next-gen SIEM platform' },
  { id: 'elastic', name: 'Elastic Security', vendor: 'Elastic', category: 'siem-security', description: 'Security analytics platform' },
  { id: 'tenable', name: 'Tenable.io', vendor: 'Tenable', category: 'siem-security', description: 'Vulnerability management' },
  { id: 'qualys', name: 'Qualys VMDR', vendor: 'Qualys', category: 'siem-security', description: 'Vulnerability detection & response' },
  { id: 'ivanti', name: 'Ivanti ITSM', vendor: 'Ivanti', category: 'itsm-itam', description: 'IT service management' },
  { id: 'manageengine', name: 'ManageEngine', vendor: 'Zoho', category: 'itsm-itam', description: 'IT operations management' },
  { id: 'sonicwall', name: 'SonicWall', vendor: 'SonicWall', category: 'network-infra', description: 'Next-gen firewall' },
  { id: 'juniper', name: 'Juniper SRX', vendor: 'Juniper', category: 'network-infra', description: 'Security gateway' },
  { id: 'acronis', name: 'Acronis Cyber Protect', vendor: 'Acronis', category: 'bcpdr', description: 'Backup & cyber protection' },
  { id: 'druva', name: 'Druva', vendor: 'Druva', category: 'bcpdr', description: 'Cloud data protection' },
  { id: 'whatsapp', name: 'WhatsApp Business', vendor: 'Meta', category: 'communication', description: 'Business messaging' },
  { id: 'webex', name: 'Cisco Webex', vendor: 'Cisco', category: 'communication', description: 'Team collaboration' },
];

// Integration guides
const integrationGuides = [
  { id: 'getting-started', title: 'Getting Started', description: 'Quick start guide for setting up integrations', icon: '🚀' },
  { id: 'siem-setup', title: 'SIEM Integration Guide', description: 'Connect Splunk, QRadar, and other SIEM tools', icon: '🛡️' },
  { id: 'api-reference', title: 'API Reference', description: 'REST API documentation for custom integrations', icon: '📡' },
  { id: 'authentication', title: 'Authentication Methods', description: 'OAuth, API Keys, and certificate-based auth', icon: '🔐' },
  { id: 'troubleshooting', title: 'Troubleshooting', description: 'Common issues and solutions', icon: '🔧' },
  { id: 'best-practices', title: 'Best Practices', description: 'Security and performance recommendations', icon: '✅' },
];

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [selectedGuide, setSelectedGuide] = useState<any>(null);
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [addStep, setAddStep] = useState<number>(1);
  const [selectedNewIntegration, setSelectedNewIntegration] = useState<any>(null);
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'disconnected': return 'bg-gray-50 text-gray-500 border-gray-200';
      case 'error': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircleIcon className="h-3.5 w-3.5 text-green-600" />;
      case 'pending': return <ArrowPathIcon className="h-3.5 w-3.5 text-amber-600 animate-spin" />;
      case 'disconnected': return <XCircleIcon className="h-3.5 w-3.5 text-gray-400" />;
      case 'error': return <ExclamationTriangleIcon className="h-3.5 w-3.5 text-red-600" />;
      default: return <XCircleIcon className="h-3.5 w-3.5 text-gray-400" />;
    }
  };

  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      red: 'bg-red-50 border-red-200 text-red-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      amber: 'bg-amber-50 border-amber-200 text-amber-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      gray: 'bg-gray-50 border-gray-200 text-gray-700',
    };
    return colors[color] || colors.gray;
  };

  const handleTestConnection = async (integrationId: string) => {
    setTestingConnection(integrationId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestingConnection(null);
  };

  const handleConfigure = (integration: any, category: any) => {
    setSelectedIntegration({ ...integration, category: category.name });
    setShowConfigModal(true);
  };

  const filteredCategories = activeCategory === 'all' 
    ? integrationCategories 
    : integrationCategories.filter(c => c.id === activeCategory);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings" className="mr-4 p-1 hover:bg-gray-100 rounded-sm">
              <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">OEM & Third-Party Integrations</h1>
              <p className="mt-0.5 text-xs text-gray-500">Connect and manage external systems, security tools, and data sources</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowGuideModal(true)}
              className="inline-flex items-center h-[32px] px-3 text-xs font-medium rounded-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Integration Guide
            </button>
            <button
              onClick={() => { setShowAddModal(true); setAddStep(1); setSelectedNewIntegration(null); }}
              className="inline-flex items-center h-[32px] px-3 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Integration
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Summary KPI Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Integrations</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{totalIntegrations}</p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-sm flex items-center justify-center">
                <CogIcon className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Connected</p>
                <p className="text-2xl font-semibold text-green-600 mt-1">{connectedIntegrations}</p>
              </div>
              <div className="h-10 w-10 bg-green-50 rounded-sm flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Pending Setup</p>
                <p className="text-2xl font-semibold text-amber-600 mt-1">{pendingIntegrations}</p>
              </div>
              <div className="h-10 w-10 bg-amber-50 rounded-sm flex items-center justify-center">
                <ArrowPathIcon className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Disconnected</p>
                <p className="text-2xl font-semibold text-gray-400 mt-1">{disconnectedIntegrations}</p>
              </div>
              <div className="h-10 w-10 bg-gray-100 rounded-sm flex items-center justify-center">
                <XCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-sm mb-4">
          <div className="p-3 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-[30px] pl-8 pr-3 w-64 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                />
              </div>
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="h-[30px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option value="all">All Categories</option>
                {integrationCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <select className="h-[30px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                <option value="all">All Status</option>
                <option value="connected">Connected</option>
                <option value="pending">Pending</option>
                <option value="disconnected">Disconnected</option>
              </select>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center h-[30px] px-3 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded-sm"
              >
                <ArrowPathIcon className="h-4 w-4 mr-1" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Integration Categories */}
        {filteredCategories.map(category => (
          <div key={category.id} className="mb-6">
            <div className="flex items-center mb-3">
              <div className={`h-8 w-8 rounded-sm flex items-center justify-center ${getCategoryColor(category.color)}`}>
                <category.icon className="h-4 w-4" />
              </div>
              <div className="ml-3">
                <h2 className="text-sm font-semibold text-gray-900">{category.name}</h2>
                <p className="text-[10px] text-gray-500">{category.description}</p>
              </div>
              <div className="ml-auto flex items-center space-x-3">
                <span className="text-[10px] text-gray-500">
                  {category.integrations.filter(i => i.status === 'connected').length} of {category.integrations.length} connected
                </span>
                {category.id === 'communication' && (
                  <button
                    onClick={() => router.push('/settings/communication-gateways')}
                    className="inline-flex items-center h-[26px] px-2 text-[10px] font-medium rounded-sm border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    <CogIcon className="h-3 w-3 mr-1" />
                    Manage Gateways
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-[22%] px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Integration</th>
                    <th className="w-[15%] px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="w-[12%] px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="w-[12%] px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Last Sync</th>
                    <th className="w-[22%] px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Metrics</th>
                    <th className="w-[17%] px-4 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {category.integrations.map(integration => (
                    <tr key={integration.id} className="hover:bg-gray-50">
                      <td className="w-[22%] px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gray-100 rounded-sm flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-[10px] font-bold text-gray-600">
                              {integration.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-gray-900 truncate">{integration.name}</span>
                        </div>
                      </td>
                      <td className="w-[15%] px-4 py-3 text-xs text-gray-500 truncate">{integration.vendor}</td>
                      <td className="w-[12%] px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-sm border ${getStatusColor(integration.status)}`}>
                          {getStatusIcon(integration.status)}
                          <span className="ml-1 capitalize">{integration.status}</span>
                        </span>
                      </td>
                      <td className="w-[12%] px-4 py-3 text-xs text-gray-500">{integration.lastSync}</td>
                      <td className="w-[22%] px-4 py-3 text-xs text-gray-500">
                        {(integration as { eventsToday?: number }).eventsToday !== undefined && (
                          <span>{(integration as { eventsToday: number }).eventsToday.toLocaleString()} events</span>
                        )}
                        {(integration as { tickets?: number }).tickets !== undefined && (
                          <span>{(integration as { tickets: number }).tickets} tickets</span>
                        )}
                        {(integration as { rules?: number }).rules !== undefined && (
                          <span>{(integration as { rules: number }).rules.toLocaleString()} rules, {(integration as { policies: number }).policies} policies</span>
                        )}
                        {(integration as { backupJobs?: number }).backupJobs !== undefined && (
                          <span>{(integration as { backupJobs: number }).backupJobs} jobs ({(integration as { successRate: string }).successRate})</span>
                        )}
                        {(integration as { sent24h?: number }).sent24h !== undefined && (
                          <span>{(integration as { sent24h: number }).sent24h.toLocaleString()} sent (24h)</span>
                        )}
                        {(integration as { calls24h?: number }).calls24h !== undefined && (
                          <span>{(integration as { calls24h: number }).calls24h.toLocaleString()} calls (24h)</span>
                        )}
                        {(integration as { vpgs?: number }).vpgs !== undefined && (
                          <span>{(integration as { vpgs: number }).vpgs} VPGs, RPO: {(integration as { rpo: string }).rpo}</span>
                        )}
                      </td>
                      <td className="w-[17%] px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleTestConnection(integration.id)}
                            disabled={testingConnection === integration.id}
                            className="inline-flex items-center h-[26px] px-2 text-[10px] font-medium rounded-sm border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            {testingConnection === integration.id ? (
                              <>
                                <ArrowPathIcon className="h-3 w-3 mr-1 animate-spin" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <ArrowPathIcon className="h-3 w-3 mr-1" />
                                Test
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleConfigure(integration, category)}
                            className="inline-flex items-center h-[26px] px-2 text-[10px] font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800"
                          >
                            <CogIcon className="h-3 w-3 mr-1" />
                            Configure
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {showConfigModal && selectedIntegration && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowConfigModal(false)} />

            <div className="relative bg-white rounded-sm shadow-xl max-w-2xl w-full">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Configure {selectedIntegration.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedIntegration.category} Integration</p>
                  </div>
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="p-1 hover:bg-gray-100 rounded-sm"
                  >
                    <XCircleIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {/* Connection Settings */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center">
                      <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Connection Settings
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">API Endpoint URL</label>
                        <input
                          type="text"
                          placeholder="https://api.example.com/v1"
                          className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                          defaultValue={selectedIntegration.status === 'connected' ? 'https://api.example.com/v1' : ''}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Port</label>
                        <input
                          type="text"
                          placeholder="443"
                          className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                          defaultValue={selectedIntegration.status === 'connected' ? '443' : ''}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Authentication */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center">
                      <LockClosedIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Authentication
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Auth Type</label>
                        <select className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                          <option>API Key</option>
                          <option>OAuth 2.0</option>
                          <option>Basic Auth</option>
                          <option>Certificate</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">API Key / Token</label>
                        <input
                          type="password"
                          placeholder="••••••••••••••••"
                          className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                          defaultValue={selectedIntegration.status === 'connected' ? 'sk_live_xxxxxxxxxxxx' : ''}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sync Settings */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center">
                      <ArrowPathIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Sync Settings
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Sync Frequency</label>
                        <select className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                          <option>Real-time</option>
                          <option>Every 1 minute</option>
                          <option>Every 5 minutes</option>
                          <option>Every 15 minutes</option>
                          <option>Every hour</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Retry Attempts</label>
                        <select className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                          <option>3 attempts</option>
                          <option>5 attempts</option>
                          <option>10 attempts</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Timeout (seconds)</label>
                        <input
                          type="number"
                          placeholder="30"
                          className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                          defaultValue="30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center">
                      <BellIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Notifications
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-gray-900 rounded-sm border-gray-300" defaultChecked />
                        <span className="ml-2 text-xs text-gray-700">Alert on connection failure</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-gray-900 rounded-sm border-gray-300" defaultChecked />
                        <span className="ml-2 text-xs text-gray-700">Alert on sync errors</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-gray-900 rounded-sm border-gray-300" />
                        <span className="ml-2 text-xs text-gray-700">Daily sync summary report</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => handleTestConnection(selectedIntegration.id)}
                  className="inline-flex items-center h-[32px] px-4 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ArrowPathIcon className={`h-4 w-4 mr-2 ${testingConnection ? 'animate-spin' : ''}`} />
                  Test Connection
                </button>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="h-[32px] px-4 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="h-[32px] px-4 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddModal(false)} />

            <div className="relative bg-white rounded-sm shadow-xl max-w-3xl w-full">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Add New Integration</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {addStep === 1 ? 'Select an integration to add' : 'Configure connection settings'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${addStep >= 1 ? 'bg-gray-900' : 'bg-gray-300'}`} />
                      <div className={`h-2 w-2 rounded-full ${addStep >= 2 ? 'bg-gray-900' : 'bg-gray-300'}`} />
                    </div>
                    <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded-sm">
                      <XCircleIcon className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                {addStep === 1 && (
                  <div>
                    <div className="mb-4">
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search available integrations..."
                          className="w-full h-[36px] pl-9 pr-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {availableIntegrations.map(integration => (
                        <div
                          key={integration.id}
                          onClick={() => setSelectedNewIntegration(integration)}
                          className={`p-3 border rounded-sm cursor-pointer transition-all ${
                            selectedNewIntegration?.id === integration.id
                              ? 'border-gray-900 bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="h-10 w-10 bg-gray-100 rounded-sm flex items-center justify-center mr-3 flex-shrink-0">
                              <span className="text-xs font-bold text-gray-600">
                                {integration.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-medium text-gray-900">{integration.name}</h4>
                              <p className="text-[10px] text-gray-500">{integration.vendor}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{integration.description}</p>
                            </div>
                            {selectedNewIntegration?.id === integration.id && (
                              <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {addStep === 2 && selectedNewIntegration && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-white border border-gray-200 rounded-sm flex items-center justify-center mr-4">
                          <span className="text-sm font-bold text-gray-600">
                            {selectedNewIntegration.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{selectedNewIntegration.name}</h4>
                          <p className="text-xs text-gray-500">{selectedNewIntegration.vendor} • {selectedNewIntegration.description}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center">
                        <GlobeAltIcon className="h-4 w-4 mr-2 text-gray-500" />
                        Connection Settings
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">API Endpoint URL</label>
                          <input type="text" placeholder="https://api.example.com/v1" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Port</label>
                          <input type="text" placeholder="443" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center">
                        <LockClosedIcon className="h-4 w-4 mr-2 text-gray-500" />
                        Authentication
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Auth Type</label>
                          <select className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                            <option>API Key</option>
                            <option>OAuth 2.0</option>
                            <option>Basic Auth</option>
                            <option>Certificate</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">API Key / Token</label>
                          <input type="password" placeholder="Enter your API key" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center">
                        <ArrowPathIcon className="h-4 w-4 mr-2 text-gray-500" />
                        Sync Settings
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Sync Frequency</label>
                          <select className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                            <option>Real-time</option>
                            <option>Every 1 minute</option>
                            <option>Every 5 minutes</option>
                            <option>Every 15 minutes</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Enable Integration</label>
                          <select className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                            <option>Yes - Enable immediately</option>
                            <option>No - Configure only</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => addStep === 1 ? setShowAddModal(false) : setAddStep(1)}
                  className="h-[32px] px-4 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {addStep === 1 ? 'Cancel' : 'Back'}
                </button>
                <button
                  onClick={() => {
                    if (addStep === 1 && selectedNewIntegration) {
                      setAddStep(2);
                    } else if (addStep === 2) {
                      setShowAddModal(false);
                      setAddStep(1);
                      setSelectedNewIntegration(null);
                    }
                  }}
                  disabled={addStep === 1 && !selectedNewIntegration}
                  className="h-[32px] px-4 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addStep === 1 ? 'Continue' : 'Add Integration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => { setShowGuideModal(false); setSelectedGuide(null); }} />

            <div className="relative bg-white rounded-sm shadow-xl max-w-4xl w-full">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Integration Guide & Documentation</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Setup guides, API reference, and best practices</p>
                  </div>
                  <button onClick={() => { setShowGuideModal(false); setSelectedGuide(null); }} className="p-1 hover:bg-gray-100 rounded-sm">
                    <XCircleIcon className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex max-h-[70vh]">
                {/* Sidebar */}
                <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
                  <h4 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3">Documentation</h4>
                  <div className="space-y-1">
                    {integrationGuides.map(guide => (
                      <button
                        key={guide.id}
                        onClick={() => setSelectedGuide(guide)}
                        className={`w-full text-left px-3 py-2 rounded-sm text-xs transition-colors ${
                          selectedGuide?.id === guide.id
                            ? 'bg-gray-100 text-gray-900 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-2">{guide.icon}</span>
                        {guide.title}
                      </button>
                    ))}
                  </div>

                  <h4 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-3 mt-6">Quick Links</h4>
                  <div className="space-y-1">
                    <a href="#" className="block px-3 py-2 text-xs text-blue-600 hover:underline">API Status Page</a>
                    <a href="#" className="block px-3 py-2 text-xs text-blue-600 hover:underline">Support Portal</a>
                    <a href="#" className="block px-3 py-2 text-xs text-blue-600 hover:underline">Release Notes</a>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {!selectedGuide ? (
                    <div className="text-center py-12">
                      <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300" />
                      <h4 className="mt-4 text-sm font-medium text-gray-900">Select a guide</h4>
                      <p className="mt-1 text-xs text-gray-500">Choose a topic from the sidebar to view documentation</p>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                          <span className="mr-3 text-2xl">{selectedGuide.icon}</span>
                          {selectedGuide.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">{selectedGuide.description}</p>
                      </div>

                      {selectedGuide.id === 'getting-started' && (
                        <div className="prose prose-sm max-w-none">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Start Guide</h3>
                          <div className="space-y-4">
                            <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                              <div className="flex items-start">
                                <span className="h-6 w-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">1</span>
                                <div>
                                  <h4 className="text-xs font-medium text-gray-900">Choose Your Integration</h4>
                                  <p className="text-xs text-gray-500 mt-1">Browse available integrations and select the one that matches your OEM product.</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                              <div className="flex items-start">
                                <span className="h-6 w-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">2</span>
                                <div>
                                  <h4 className="text-xs font-medium text-gray-900">Configure Connection</h4>
                                  <p className="text-xs text-gray-500 mt-1">Enter your API endpoint, authentication credentials, and sync settings.</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                              <div className="flex items-start">
                                <span className="h-6 w-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium mr-3 flex-shrink-0">3</span>
                                <div>
                                  <h4 className="text-xs font-medium text-gray-900">Test & Activate</h4>
                                  <p className="text-xs text-gray-500 mt-1">Use the Test Connection feature to verify connectivity, then activate the integration.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedGuide.id === 'siem-setup' && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-900">Supported SIEM Platforms</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {['Splunk Enterprise', 'IBM QRadar', 'Microsoft Sentinel', 'CrowdStrike Falcon', 'Palo Alto Cortex XDR', 'LogRhythm'].map(siem => (
                              <div key={siem} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                                <h4 className="text-xs font-medium text-gray-900">{siem}</h4>
                                <p className="text-[10px] text-gray-500 mt-1">Real-time event ingestion supported</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-sm">
                            <h4 className="text-xs font-medium text-blue-900">💡 Pro Tip</h4>
                            <p className="text-xs text-blue-700 mt-1">Enable real-time sync for critical security events to ensure immediate visibility in your crisis management workflows.</p>
                          </div>
                        </div>
                      )}

                      {selectedGuide.id === 'api-reference' && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-900">REST API Endpoints</h3>
                          <div className="bg-gray-900 rounded-sm p-4 font-mono text-xs text-green-400">
                            <p className="text-gray-500"># Base URL</p>
                            <p>https://api.cyberresilience.platform/v1</p>
                            <p className="text-gray-500 mt-3"># Authentication</p>
                            <p>Authorization: Bearer {'<your-api-token>'}</p>
                            <p className="text-gray-500 mt-3"># Get Integrations</p>
                            <p>GET /integrations</p>
                            <p className="text-gray-500 mt-3"># Create Integration</p>
                            <p>POST /integrations</p>
                          </div>
                        </div>
                      )}

                      {selectedGuide.id === 'authentication' && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-900">Supported Authentication Methods</h3>
                          <div className="space-y-3">
                            {[
                              { name: 'API Key', desc: 'Simple key-based authentication for most integrations' },
                              { name: 'OAuth 2.0', desc: 'Token-based auth with automatic refresh support' },
                              { name: 'Basic Auth', desc: 'Username/password authentication over HTTPS' },
                              { name: 'mTLS Certificate', desc: 'Mutual TLS for highest security requirements' },
                            ].map(auth => (
                              <div key={auth.name} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                                <h4 className="text-xs font-medium text-gray-900">{auth.name}</h4>
                                <p className="text-[10px] text-gray-500 mt-1">{auth.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedGuide.id === 'troubleshooting' && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-900">Common Issues & Solutions</h3>
                          <div className="space-y-3">
                            <div className="border border-gray-200 rounded-sm">
                              <div className="bg-red-50 px-4 py-2 border-b border-gray-200">
                                <h4 className="text-xs font-medium text-red-800">Connection Timeout</h4>
                              </div>
                              <div className="p-4">
                                <p className="text-xs text-gray-600">Check firewall rules and ensure the API endpoint is accessible. Verify the port configuration matches your setup.</p>
                              </div>
                            </div>
                            <div className="border border-gray-200 rounded-sm">
                              <div className="bg-amber-50 px-4 py-2 border-b border-gray-200">
                                <h4 className="text-xs font-medium text-amber-800">Authentication Failed</h4>
                              </div>
                              <div className="p-4">
                                <p className="text-xs text-gray-600">Regenerate your API key and ensure it has the required permissions. Check token expiration for OAuth integrations.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedGuide.id === 'best-practices' && (
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-gray-900">Security & Performance Best Practices</h3>
                          <div className="space-y-3">
                            {[
                              { icon: '🔐', title: 'Rotate API Keys Regularly', desc: 'Change credentials every 90 days' },
                              { icon: '📊', title: 'Monitor Sync Health', desc: 'Set up alerts for failed syncs' },
                              { icon: '⚡', title: 'Optimize Sync Frequency', desc: 'Balance real-time needs with API limits' },
                              { icon: '🔒', title: 'Use Encrypted Connections', desc: 'Always use HTTPS/TLS for all integrations' },
                            ].map(practice => (
                              <div key={practice.title} className="flex items-start bg-gray-50 border border-gray-200 rounded-sm p-3">
                                <span className="text-lg mr-3">{practice.icon}</span>
                                <div>
                                  <h4 className="text-xs font-medium text-gray-900">{practice.title}</h4>
                                  <p className="text-[10px] text-gray-500 mt-0.5">{practice.desc}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end">
                <button
                  onClick={() => { setShowGuideModal(false); setSelectedGuide(null); }}
                  className="h-[32px] px-4 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

