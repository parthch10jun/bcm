'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  CogIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

// Gateway configurations
const gateways = {
  email: {
    name: 'Email Gateway',
    icon: EnvelopeIcon,
    provider: 'SendGrid',
    status: 'connected',
    lastTest: '2 hours ago',
    metrics: { sent24h: 1250, delivered: 1242, failed: 8, deliveryRate: '99.4%' },
    config: {
      smtpHost: 'smtp.sendgrid.net',
      smtpPort: '587',
      fromEmail: 'alerts@mashreq.com',
      fromName: 'Mashreq BCM',
      encryption: 'TLS',
      authMethod: 'API Key'
    }
  },
  sms: {
    name: 'SMS Gateway',
    icon: DevicePhoneMobileIcon,
    provider: 'Twilio',
    status: 'connected',
    lastTest: '1 hour ago',
    metrics: { sent24h: 85, delivered: 84, failed: 1, deliveryRate: '98.8%' },
    config: {
      accountSid: 'AC****************************1234',
      senderId: 'BSECYBER',
      region: 'India',
      dltEntityId: 'XXXXXXXXXXXXXX',
      templateApproved: true
    }
  },
  voice: {
    name: 'Voice Call Gateway',
    icon: PhoneIcon,
    provider: 'Twilio',
    status: 'connected',
    lastTest: '30 min ago',
    metrics: { calls24h: 12, answered: 11, failed: 1, answerRate: '91.7%' },
    config: {
      twilioNumber: '+91 22 XXXX XXXX',
      fallbackNumber: '+91 22 XXXX XXXX',
      maxRetries: 3,
      retryInterval: '5 min',
      voiceLanguage: 'en-IN'
    }
  },
  teams: {
    name: 'Microsoft Teams',
    icon: ChatBubbleLeftRightIcon,
    provider: 'Microsoft',
    status: 'connected',
    lastTest: '15 min ago',
    metrics: { sent24h: 320, delivered: 320, failed: 0, deliveryRate: '100%' },
    config: {
      tenantId: '****-****-****-1234',
      webhookUrl: 'https://outlook.office.com/webhook/...',
      channel: '#crisis-alerts',
      mentionAdmins: true
    }
  },
  whatsapp: {
    name: 'WhatsApp Business',
    icon: ChatBubbleLeftRightIcon,
    provider: 'Meta',
    status: 'disconnected',
    lastTest: 'Never',
    metrics: { sent24h: 0, delivered: 0, failed: 0, deliveryRate: '-' },
    config: {
      businessAccountId: '',
      phoneNumberId: '',
      accessToken: '',
      templateName: ''
    }
  }
};

export default function CommunicationGatewaysPage() {
  const [activeTab, setActiveTab] = useState<'email' | 'sms' | 'voice' | 'teams' | 'whatsapp'>('email');
  const [showTestModal, setShowTestModal] = useState(false);
  const [testingGateway, setTestingGateway] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const currentGateway = gateways[activeTab];

  const handleTestGateway = async () => {
    setTestingGateway(activeTab);
    setTestResult(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestResult({ success: true, message: 'Connection successful! Test message sent.' });
    setTestingGateway(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-50 text-green-700 border-green-200';
      case 'disconnected': return 'bg-gray-50 text-gray-500 border-gray-200';
      case 'error': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'disconnected': return <XCircleIcon className="h-4 w-4 text-gray-400" />;
      case 'error': return <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />;
      default: return <XCircleIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const tabs = [
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
    { id: 'sms', name: 'SMS', icon: DevicePhoneMobileIcon },
    { id: 'voice', name: 'Voice', icon: PhoneIcon },
    { id: 'teams', name: 'Teams', icon: ChatBubbleLeftRightIcon },
    { id: 'whatsapp', name: 'WhatsApp', icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings/integrations" className="mr-4 p-1 hover:bg-gray-100 rounded-sm">
              <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Communication Gateways</h1>
              <p className="mt-0.5 text-xs text-gray-500">Configure email, SMS, voice, and messaging channels for alerts and notifications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6">
            <div className="flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                  {gateways[tab.id as keyof typeof gateways].status === 'connected' && (
                    <span className="ml-2 h-2 w-2 bg-green-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Gateway Status Card */}
          <div className="bg-white border border-gray-200 rounded-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gray-100 rounded-sm flex items-center justify-center mr-4">
                    <currentGateway.icon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">{currentGateway.name}</h2>
                    <p className="text-xs text-gray-500">Provider: {currentGateway.provider}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-sm border ${getStatusColor(currentGateway.status)}`}>
                    {getStatusIcon(currentGateway.status)}
                    <span className="ml-1.5 capitalize">{currentGateway.status}</span>
                  </span>
                  <button
                    onClick={() => setShowTestModal(true)}
                    className="inline-flex items-center h-[32px] px-3 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    Send Test
                  </button>
                  <button
                    onClick={() => setShowConfigModal(true)}
                    className="inline-flex items-center h-[32px] px-3 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800"
                  >
                    <CogIcon className="h-4 w-4 mr-2" />
                    Configure
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 divide-x divide-gray-200">
              <div className="p-4 text-center">
                <p className="text-2xl font-semibold text-gray-900">
                  {activeTab === 'voice' ? (currentGateway.metrics as { calls24h: number }).calls24h : (currentGateway.metrics as { sent24h: number }).sent24h}
                </p>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-1">
                  {activeTab === 'voice' ? 'Calls (24h)' : 'Sent (24h)'}
                </p>
              </div>
              <div className="p-4 text-center">
                <p className="text-2xl font-semibold text-green-600">
                  {activeTab === 'voice' ? (currentGateway.metrics as { answered: number }).answered : (currentGateway.metrics as { delivered: number }).delivered}
                </p>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-1">
                  {activeTab === 'voice' ? 'Answered' : 'Delivered'}
                </p>
              </div>
              <div className="p-4 text-center">
                <p className="text-2xl font-semibold text-red-600">{currentGateway.metrics.failed}</p>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-1">Failed</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-2xl font-semibold text-gray-900">
                  {activeTab === 'voice' ? (currentGateway.metrics as { answerRate: string }).answerRate : (currentGateway.metrics as { deliveryRate: string }).deliveryRate}
                </p>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mt-1">
                  {activeTab === 'voice' ? 'Answer Rate' : 'Delivery Rate'}
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Details */}
          <div className="grid grid-cols-2 gap-6">
            {/* Current Configuration */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Current Configuration</h3>
              </div>
              <div className="p-4">
                <dl className="space-y-3">
                  {Object.entries(currentGateway.config).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <dt className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                      <dd className="text-xs font-medium text-gray-900">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '-'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
                <span className="text-[10px] text-gray-500">Last 24 hours</span>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {currentGateway.status === 'connected' ? (
                    <>
                      <div className="flex items-start">
                        <div className="h-6 w-6 bg-green-50 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <CheckCircleIcon className="h-3.5 w-3.5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-900">Crisis alert sent successfully</p>
                          <p className="text-[10px] text-gray-500">15 recipients • 2 min ago</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-6 w-6 bg-green-50 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <CheckCircleIcon className="h-3.5 w-3.5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-900">DR test notification delivered</p>
                          <p className="text-[10px] text-gray-500">8 recipients • 1 hour ago</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-6 w-6 bg-blue-50 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <ArrowPathIcon className="h-3.5 w-3.5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-900">Connection health check passed</p>
                          <p className="text-[10px] text-gray-500">{currentGateway.lastTest}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-6 w-6 bg-amber-50 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <ExclamationTriangleIcon className="h-3.5 w-3.5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-900">1 message delivery delayed</p>
                          <p className="text-[10px] text-gray-500">Retried successfully • 3 hours ago</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <XCircleIcon className="mx-auto h-8 w-8 text-gray-300" />
                      <p className="mt-2 text-xs text-gray-500">Gateway not configured</p>
                      <button
                        onClick={() => setShowConfigModal(true)}
                        className="mt-3 text-xs text-blue-600 hover:underline"
                      >
                        Configure now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-4 grid grid-cols-4 gap-3">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors">
                <BellAlertIcon className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-xs font-medium text-gray-900">Send Test Alert</span>
                <span className="text-[10px] text-gray-500 mt-1">Verify delivery</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors">
                <ChartBarIcon className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-xs font-medium text-gray-900">View Analytics</span>
                <span className="text-[10px] text-gray-500 mt-1">Delivery metrics</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors">
                <ClockIcon className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-xs font-medium text-gray-900">Message History</span>
                <span className="text-[10px] text-gray-500 mt-1">Past 30 days</span>
              </button>
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors">
                <CogIcon className="h-6 w-6 text-gray-600 mb-2" />
                <span className="text-xs font-medium text-gray-900">Advanced Settings</span>
                <span className="text-[10px] text-gray-500 mt-1">Templates, rules</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => { setShowTestModal(false); setTestResult(null); }} />

            <div className="relative bg-white rounded-sm shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Test {currentGateway.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Send a test message to verify connectivity</p>
              </div>

              <div className="px-6 py-4">
                {activeTab === 'email' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Test Email Address</label>
                      <input type="email" placeholder="test@example.com" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Subject</label>
                      <input type="text" defaultValue="Test Alert - Mashreq Resilience" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                    </div>
                  </div>
                )}

                {activeTab === 'sms' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Test Mobile Number</label>
                      <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Message Template</label>
                      <select className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                        <option>Crisis Alert Template</option>
                        <option>DR Test Notification</option>
                        <option>Call Tree Activation</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'voice' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Test Phone Number</label>
                      <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Voice Message</label>
                      <select className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                        <option>Crisis Alert (English)</option>
                        <option>Crisis Alert (Hindi)</option>
                        <option>Call Tree Test</option>
                      </select>
                    </div>
                  </div>
                )}

                {(activeTab === 'teams' || activeTab === 'whatsapp') && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Test Message</label>
                      <textarea rows={3} placeholder="Enter test message..." className="w-full px-3 py-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" defaultValue="🔔 This is a test alert from Mashreq's Auto Resilience Platform" />
                    </div>
                  </div>
                )}

                {testResult && (
                  <div className={`mt-4 p-3 rounded-sm border ${testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center">
                      {testResult.success ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
                      ) : (
                        <ExclamationTriangleIcon className="h-4 w-4 text-red-600 mr-2" />
                      )}
                      <span className={`text-xs ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>{testResult.message}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button onClick={() => { setShowTestModal(false); setTestResult(null); }} className="h-[32px] px-4 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={handleTestGateway}
                  disabled={testingGateway !== null}
                  className="inline-flex items-center h-[32px] px-4 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {testingGateway ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                      Send Test
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowConfigModal(false)} />

            <div className="relative bg-white rounded-sm shadow-xl max-w-2xl w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Configure {currentGateway.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Provider: {currentGateway.provider}</p>
              </div>

              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                {activeTab === 'email' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">SMTP Host</label>
                        <input type="text" defaultValue={(currentGateway.config as { smtpHost: string }).smtpHost} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">SMTP Port</label>
                        <input type="text" defaultValue={(currentGateway.config as { smtpPort: string }).smtpPort} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">From Email</label>
                        <input type="email" defaultValue={(currentGateway.config as { fromEmail: string }).fromEmail} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">From Name</label>
                        <input type="text" defaultValue={(currentGateway.config as { fromName: string }).fromName} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Encryption</label>
                        <select defaultValue={(currentGateway.config as { encryption: string }).encryption} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                          <option>TLS</option>
                          <option>SSL</option>
                          <option>None</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">API Key</label>
                        <input type="password" placeholder="••••••••••••" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'sms' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Account SID</label>
                        <input type="text" defaultValue={(currentGateway.config as { accountSid: string }).accountSid} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Auth Token</label>
                        <input type="password" placeholder="••••••••••••" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Sender ID</label>
                        <input type="text" defaultValue={(currentGateway.config as { senderId: string }).senderId} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">DLT Entity ID</label>
                        <input type="text" defaultValue={(currentGateway.config as { dltEntityId: string }).dltEntityId} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'voice' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Twilio Phone Number</label>
                        <input type="text" defaultValue={(currentGateway.config as { twilioNumber: string }).twilioNumber} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Fallback Number</label>
                        <input type="text" defaultValue={(currentGateway.config as { fallbackNumber: string }).fallbackNumber} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Max Retries</label>
                        <select defaultValue={(currentGateway.config as { maxRetries: number }).maxRetries.toString()} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Retry Interval</label>
                        <select defaultValue={(currentGateway.config as { retryInterval: string }).retryInterval} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                          <option>2 min</option>
                          <option>5 min</option>
                          <option>10 min</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Voice Language</label>
                        <select defaultValue={(currentGateway.config as { voiceLanguage: string }).voiceLanguage} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                          <option value="en-IN">English (India)</option>
                          <option value="hi-IN">Hindi</option>
                          <option value="en-US">English (US)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'teams' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Tenant ID</label>
                      <input type="text" defaultValue={(currentGateway.config as { tenantId: string }).tenantId} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Webhook URL</label>
                      <input type="text" defaultValue={(currentGateway.config as { webhookUrl: string }).webhookUrl} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Default Channel</label>
                        <input type="text" defaultValue={(currentGateway.config as { channel: string }).channel} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Mention Admins</label>
                        <select defaultValue={(currentGateway.config as { mentionAdmins: boolean }).mentionAdmins ? 'yes' : 'no'} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'whatsapp' && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 mb-4">
                      <p className="text-xs text-amber-800">WhatsApp Business API requires Meta Business verification. Please complete the setup in Meta Business Manager first.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Business Account ID</label>
                        <input type="text" placeholder="Enter Business Account ID" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Phone Number ID</label>
                        <input type="text" placeholder="Enter Phone Number ID" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Access Token</label>
                      <input type="password" placeholder="Enter Access Token" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={handleTestGateway}
                  className="inline-flex items-center h-[32px] px-4 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ArrowPathIcon className={`h-4 w-4 mr-2 ${testingGateway ? 'animate-spin' : ''}`} />
                  Test Connection
                </button>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setShowConfigModal(false)} className="h-[32px] px-4 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={() => setShowConfigModal(false)} className="h-[32px] px-4 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800">
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
