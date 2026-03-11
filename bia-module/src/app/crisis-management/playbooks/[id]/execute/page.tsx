'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  PauseIcon,
  UserGroupIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckIcon,
  XMarkIcon,
  BellAlertIcon,
  SignalIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

// Playbook phases and steps data
const playbookData: Record<string, any> = {
  'CPB-001': {
    id: 'CPB-001',
    name: 'Ransomware Attack Response',
    severity: 'Critical',
    estimatedTime: '4-8 hours',
    phases: [
      {
        id: 1,
        name: 'Detection & Initial Assessment',
        duration: '15-30 min',
        steps: [
          { id: 1, title: 'Confirm ransomware indicators', description: 'Verify encryption patterns, ransom notes, and file extensions', required: true, evidence: true },
          { id: 2, title: 'Identify affected systems', description: 'Document all systems showing signs of infection', required: true, evidence: true },
          { id: 3, title: 'Determine ransomware variant', description: 'Analyze ransom note and encrypted file signatures', required: true, evidence: true },
          { id: 4, title: 'Assess scope of impact', description: 'Evaluate number of endpoints, servers, and data affected', required: true, evidence: false },
          { id: 5, title: 'Activate incident response team', description: 'Notify all IR team members and establish command center', required: true, evidence: false }
        ]
      },
      {
        id: 2,
        name: 'Containment',
        duration: '30-60 min',
        steps: [
          { id: 6, title: 'Isolate infected systems', description: 'Disconnect affected systems from network immediately', required: true, evidence: true },
          { id: 7, title: 'Block malicious IPs/domains', description: 'Update firewall rules to block C2 communications', required: true, evidence: true },
          { id: 8, title: 'Disable compromised accounts', description: 'Reset credentials for potentially compromised accounts', required: true, evidence: false },
          { id: 9, title: 'Preserve forensic evidence', description: 'Create disk images of infected systems before remediation', required: true, evidence: true },
          { id: 10, title: 'Implement network segmentation', description: 'Further segment network to prevent lateral movement', required: false, evidence: false }
        ]
      },
      {
        id: 3,
        name: 'Stakeholder Communication',
        duration: '30 min',
        steps: [
          { id: 11, title: 'Brief executive leadership', description: 'Provide situation update to C-suite and board if required', required: true, evidence: false },
          { id: 12, title: 'Notify legal counsel', description: 'Engage legal team for regulatory and liability guidance', required: true, evidence: false },
          { id: 13, title: 'Activate crisis communications', description: 'Prepare internal and external communication templates', required: true, evidence: false },
          { id: 14, title: 'Notify cyber insurance', description: 'Contact insurance provider and document incident', required: true, evidence: true }
        ]
      },
      {
        id: 4,
        name: 'Eradication',
        duration: '2-4 hours',
        steps: [
          { id: 15, title: 'Remove ransomware artifacts', description: 'Clean infected systems using approved tools', required: true, evidence: true },
          { id: 16, title: 'Patch vulnerabilities', description: 'Apply security patches to prevent reinfection', required: true, evidence: true },
          { id: 17, title: 'Reset all credentials', description: 'Force password reset for all affected accounts', required: true, evidence: false },
          { id: 18, title: 'Validate system integrity', description: 'Verify systems are clean before reconnection', required: true, evidence: true }
        ]
      },
      {
        id: 5,
        name: 'Recovery',
        duration: '2-4 hours',
        steps: [
          { id: 19, title: 'Restore from clean backups', description: 'Recover data from verified clean backup sources', required: true, evidence: true },
          { id: 20, title: 'Validate data integrity', description: 'Verify restored data completeness and accuracy', required: true, evidence: true },
          { id: 21, title: 'Reconnect systems gradually', description: 'Bring systems back online in controlled phases', required: true, evidence: false },
          { id: 22, title: 'Monitor for reinfection', description: 'Enhanced monitoring for 72 hours post-recovery', required: true, evidence: false }
        ]
      },
      {
        id: 6,
        name: 'Post-Incident',
        duration: '1-2 hours',
        steps: [
          { id: 23, title: 'Conduct lessons learned', description: 'Document what worked and what needs improvement', required: true, evidence: true },
          { id: 24, title: 'Update playbook', description: 'Incorporate lessons learned into response procedures', required: true, evidence: false },
          { id: 25, title: 'File regulatory reports', description: 'Submit required notifications to regulators', required: true, evidence: true },
          { id: 26, title: 'Close incident ticket', description: 'Complete all documentation and archive evidence', required: true, evidence: true }
        ]
      }
    ]
  },
  'CPB-002': {
    id: 'CPB-002',
    name: 'Data Breach Response',
    severity: 'Critical',
    estimatedTime: '24-72 hours',
    phases: [
      {
        id: 1, name: 'Detection & Confirmation', duration: '1-2 hours',
        steps: [
          { id: 1, title: 'Verify breach indicators', description: 'Confirm unauthorized access or data exfiltration', required: true, evidence: true },
          { id: 2, title: 'Identify data types affected', description: 'Determine if PII, financial, or sensitive data exposed', required: true, evidence: true },
          { id: 3, title: 'Assess breach timeline', description: 'Determine when breach occurred and duration', required: true, evidence: true }
        ]
      },
      {
        id: 2, name: 'Containment', duration: '2-4 hours',
        steps: [
          { id: 4, title: 'Stop data exfiltration', description: 'Block unauthorized access paths', required: true, evidence: true },
          { id: 5, title: 'Preserve evidence', description: 'Collect logs and forensic artifacts', required: true, evidence: true },
          { id: 6, title: 'Secure affected systems', description: 'Isolate or lock down compromised systems', required: true, evidence: false }
        ]
      },
      {
        id: 3, name: 'Impact Assessment', duration: '4-8 hours',
        steps: [
          { id: 7, title: 'Quantify affected records', description: 'Count number of records potentially exposed', required: true, evidence: true },
          { id: 8, title: 'Identify affected individuals', description: 'Compile list of affected data subjects', required: true, evidence: true },
          { id: 9, title: 'Assess regulatory requirements', description: 'Determine notification obligations', required: true, evidence: false }
        ]
      },
      {
        id: 4, name: 'Notification', duration: '24-72 hours',
        steps: [
          { id: 10, title: 'Notify regulators', description: 'File breach notifications per GDPR/CCPA', required: true, evidence: true },
          { id: 11, title: 'Notify affected individuals', description: 'Send breach notification letters', required: true, evidence: true },
          { id: 12, title: 'Issue public statement', description: 'Prepare and release press statement if required', required: false, evidence: false }
        ]
      }
    ]
  },
  'CPB-003': {
    id: 'CPB-003',
    name: 'DDoS Attack Mitigation',
    severity: 'High',
    estimatedTime: '1-4 hours',
    phases: [
      {
        id: 1, name: 'Detection', duration: '5-15 min',
        steps: [
          { id: 1, title: 'Confirm DDoS attack', description: 'Verify traffic patterns indicate DDoS', required: true, evidence: true },
          { id: 2, title: 'Identify attack type', description: 'Determine volumetric, protocol, or application layer', required: true, evidence: true },
          { id: 3, title: 'Assess impact', description: 'Evaluate which services are affected', required: true, evidence: false }
        ]
      },
      {
        id: 2, name: 'Mitigation', duration: '15-60 min',
        steps: [
          { id: 4, title: 'Activate DDoS protection', description: 'Enable cloud-based DDoS mitigation', required: true, evidence: true },
          { id: 5, title: 'Implement rate limiting', description: 'Apply traffic throttling rules', required: true, evidence: false },
          { id: 6, title: 'Block attack sources', description: 'Blackhole attacking IP ranges', required: true, evidence: true }
        ]
      },
      {
        id: 3, name: 'Recovery', duration: '30-60 min',
        steps: [
          { id: 7, title: 'Verify service restoration', description: 'Confirm services are accessible', required: true, evidence: false },
          { id: 8, title: 'Monitor for renewed attack', description: 'Enhanced monitoring for 24 hours', required: true, evidence: false },
          { id: 9, title: 'Document incident', description: 'Complete incident report', required: true, evidence: true }
        ]
      }
    ]
  }
};

// Call tree data
const callTree = {
  levels: [
    {
      level: 1,
      name: 'Crisis Commander',
      members: [
        { id: 1, name: 'Sarah Johnson', role: 'CISO', phone: '+1 555-0101', email: 'sarah.johnson@company.com', status: 'available' }
      ]
    },
    {
      level: 2,
      name: 'Core Response Team',
      members: [
        { id: 2, name: 'Ahmed Al-Mansouri', role: 'Security Operations Lead', phone: '+1 555-0102', email: 'ahmed.mansouri@company.com', status: 'available' },
        { id: 3, name: 'Maria Garcia', role: 'Incident Response Manager', phone: '+1 555-0103', email: 'maria.garcia@company.com', status: 'busy' },
        { id: 4, name: 'David Wilson', role: 'Infrastructure Lead', phone: '+1 555-0104', email: 'david.wilson@company.com', status: 'available' }
      ]
    },
    {
      level: 3,
      name: 'Extended Team',
      members: [
        { id: 5, name: 'Lisa Chen', role: 'Forensics Analyst', phone: '+1 555-0105', email: 'lisa.chen@company.com', status: 'available' },
        { id: 6, name: 'Mohammed Hassan', role: 'Network Security', phone: '+1 555-0106', email: 'mohammed.hassan@company.com', status: 'offline' },
        { id: 7, name: 'Emily Davis', role: 'Backup Administrator', phone: '+1 555-0107', email: 'emily.davis@company.com', status: 'available' },
        { id: 8, name: 'James Brown', role: 'Legal Counsel', phone: '+1 555-0108', email: 'james.brown@company.com', status: 'available' }
      ]
    },
    {
      level: 4,
      name: 'Executive Stakeholders',
      members: [
        { id: 9, name: 'Robert Taylor', role: 'CEO', phone: '+1 555-0109', email: 'robert.taylor@company.com', status: 'available' },
        { id: 10, name: 'Jennifer White', role: 'CFO', phone: '+1 555-0110', email: 'jennifer.white@company.com', status: 'available' },
        { id: 11, name: 'Michael Lee', role: 'General Counsel', phone: '+1 555-0111', email: 'michael.lee@company.com', status: 'busy' }
      ]
    }
  ]
};

// Communication templates
const commTemplates = {
  teams: { name: 'Microsoft Teams', icon: VideoCameraIcon, color: 'bg-purple-100 text-purple-700' },
  whatsapp: { name: 'WhatsApp', icon: ChatBubbleLeftRightIcon, color: 'bg-green-100 text-green-700' },
  sms: { name: 'SMS', icon: EnvelopeIcon, color: 'bg-blue-100 text-blue-700' },
  phone: { name: 'Phone Call', icon: PhoneIcon, color: 'bg-orange-100 text-orange-700' }
};

export default function ExecutePlaybookPage() {
  const params = useParams();
  const playbookId = params.id as string || 'CPB-001';
  const playbook = playbookData[playbookId] || playbookData['CPB-001'];
  
  const [activePhase, setActivePhase] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([0]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCallTree, setShowCallTree] = useState(false);
  const [showComms, setShowComms] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<{id: number, name: string, method: string, time: string}[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev =>
      prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]
    );
  };

  const togglePhase = (phaseIndex: number) => {
    setExpandedPhases(prev =>
      prev.includes(phaseIndex) ? prev.filter(i => i !== phaseIndex) : [...prev, phaseIndex]
    );
  };

  const toggleMember = (memberId: number) => {
    setSelectedMembers(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  const sendNotification = (method: string) => {
    const methodName = commTemplates[method as keyof typeof commTemplates].name;
    const newNotifications = selectedMembers.map(id => {
      const member = callTree.levels.flatMap(l => l.members).find(m => m.id === id);
      return {
        id: Date.now() + id,
        name: member?.name || '',
        method: methodName,
        time: new Date().toLocaleTimeString()
      };
    });
    setNotifications(prev => [...newNotifications, ...prev]);
    setSelectedMembers([]);
    setShowComms(false);
  };

  const totalSteps = playbook.phases.reduce((acc: number, phase: any) => acc + phase.steps.length, 0);
  const progress = Math.round((completedSteps.length / totalSteps) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/crisis-management/playbooks" className="text-gray-500 hover:text-gray-700">
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-red-100 text-red-700 rounded">EXECUTING</span>
                  <h1 className="text-lg font-semibold text-gray-900">{playbook.name}</h1>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{playbook.id} • Estimated: {playbook.estimatedTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Timer */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-sm">
                <ClockIcon className="h-4 w-4" />
                <span className="font-mono text-sm font-medium">{formatTime(elapsedTime)}</span>
              </div>
              {/* Play/Pause */}
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-sm ${
                  isRunning ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isRunning ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                {isRunning ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Progress: {completedSteps.length} of {totalSteps} steps</span>
              <span className="font-medium text-gray-900">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Complete Incident Button */}
          {progress === 100 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-sm">
              <p className="text-sm text-green-800 mb-3">All steps completed. Ready to close incident.</p>
              <Link
                href={`/crisis-management/playbooks/${playbookId}/pir`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-sm hover:bg-green-700"
              >
                <DocumentTextIcon className="h-4 w-4" />
                Generate Post-Incident Report
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Panel - Playbook Steps */}
        <div className="flex-1 p-6">
          <div className="space-y-3">
            {playbook.phases.map((phase: any, phaseIndex: number) => {
              const phaseSteps = phase.steps;
              const completedInPhase = phaseSteps.filter((s: any) => completedSteps.includes(s.id)).length;
              const isExpanded = expandedPhases.includes(phaseIndex);
              const isComplete = completedInPhase === phaseSteps.length;

              return (
                <div key={phase.id} className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                  {/* Phase Header */}
                  <button
                    onClick={() => togglePhase(phaseIndex)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isComplete ? 'bg-green-100 text-green-700' :
                        activePhase === phaseIndex ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {isComplete ? <CheckIcon className="h-4 w-4" /> : phase.id}
                      </div>
                      <div className="text-left">
                        <h3 className="text-sm font-semibold text-gray-900">{phase.name}</h3>
                        <p className="text-[10px] text-gray-500">{phase.duration} • {completedInPhase}/{phaseSteps.length} steps</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${(completedInPhase / phaseSteps.length) * 100}%` }}
                        />
                      </div>
                      {isExpanded ? <ChevronDownIcon className="h-4 w-4 text-gray-400" /> : <ChevronRightIcon className="h-4 w-4 text-gray-400" />}
                    </div>
                  </button>

                  {/* Phase Steps */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 divide-y divide-gray-100">
                      {phaseSteps.map((step: any) => {
                        const isCompleted = completedSteps.includes(step.id);
                        return (
                          <div key={step.id} className={`px-5 py-3 flex items-start gap-3 ${isCompleted ? 'bg-green-50' : ''}`}>
                            <button
                              onClick={() => toggleStep(step.id)}
                              className={`mt-0.5 h-5 w-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                                isCompleted ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {isCompleted && <CheckIcon className="h-3 w-3" />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${isCompleted ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                                  {step.title}
                                </span>
                                {step.required && (
                                  <span className="px-1.5 py-0.5 text-[9px] font-medium bg-red-100 text-red-600 rounded">REQUIRED</span>
                                )}
                                {step.evidence && (
                                  <span className="px-1.5 py-0.5 text-[9px] font-medium bg-blue-100 text-blue-600 rounded">EVIDENCE</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Communications & Call Tree */}
        <div className="w-96 border-l border-gray-200 bg-white p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-180px)] sticky top-[180px]">
          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Communications</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setShowCallTree(true); setShowComms(false); }}
                className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 rounded-sm hover:bg-gray-200 transition-colors"
              >
                <UserGroupIcon className="h-4 w-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Call Tree</span>
              </button>
              <button
                onClick={() => { setShowComms(true); setShowCallTree(false); }}
                className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 rounded-sm hover:bg-gray-200 transition-colors"
              >
                <BellAlertIcon className="h-4 w-4 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Send Alert</span>
              </button>
            </div>
          </div>

          {/* Communication Channels */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Communication Channels</h3>
            <div className="space-y-2">
              {Object.entries(commTemplates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => { setShowCallTree(true); setShowComms(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm border border-gray-200 hover:border-gray-300 transition-colors`}
                >
                  <div className={`h-8 w-8 rounded-sm flex items-center justify-center ${template.color}`}>
                    <template.icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-gray-900">{template.name}</p>
                    <p className="text-[10px] text-gray-500">Send via {template.name.toLowerCase()}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Notifications */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Notification Log</h3>
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No notifications sent yet</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{notif.name}</p>
                      <p className="text-[10px] text-gray-500">{notif.method} • {notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Call Tree Modal */}
      {showCallTree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-sm w-[700px] max-h-[80vh] overflow-hidden shadow-xl">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Crisis Call Tree</h2>
                <p className="text-xs text-gray-500">Select team members to notify</p>
              </div>
              <button onClick={() => setShowCallTree(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[50vh]">
              {callTree.levels.map((level) => (
                <div key={level.level} className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 w-6 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center justify-center">
                      {level.level}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">{level.name}</h3>
                    <span className="text-xs text-gray-500">({level.members.length} members)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 ml-8">
                    {level.members.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => toggleMember(member.id)}
                        className={`p-3 border rounded-sm cursor-pointer transition-colors ${
                          selectedMembers.includes(member.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900">{member.name}</p>
                            <p className="text-[10px] text-gray-500">{member.role}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <PhoneIcon className="h-3 w-3 text-gray-400" />
                              <span className="text-[10px] text-gray-500">{member.phone}</span>
                            </div>
                          </div>
                          {selectedMembers.includes(member.id) && (
                            <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{selectedMembers.length} members selected</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCallTree(false)}
                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-sm hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { setShowCallTree(false); setShowComms(true); }}
                    disabled={selectedMembers.length === 0}
                    className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Communication Method Modal */}
      {showComms && selectedMembers.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-sm w-[500px] shadow-xl">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Send Notification</h2>
                <p className="text-xs text-gray-500">Select communication method for {selectedMembers.length} recipient(s)</p>
              </div>
              <button onClick={() => setShowComms(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-xs text-gray-600 mb-4">Choose how to notify selected team members:</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(commTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => sendNotification(key)}
                    className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-sm hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <div className={`h-12 w-12 rounded-sm flex items-center justify-center ${template.color}`}>
                      <template.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium text-gray-900">{template.name}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-sm">
                <div className="flex items-start gap-2">
                  <SignalIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-800">Broadcast Mode</p>
                    <p className="text-[10px] text-blue-600 mt-0.5">Messages will be sent simultaneously to all selected recipients</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => { setShowComms(false); setShowCallTree(true); }}
                className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-sm hover:bg-gray-100"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

