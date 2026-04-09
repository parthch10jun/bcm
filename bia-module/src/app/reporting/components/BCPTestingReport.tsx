'use client';

import { useState } from 'react';
import {
  BeakerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ChartBarIcon,
  UserGroupIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

export default function BCPTestingReport() {
  const [selectedTest, setSelectedTest] = useState<string>('BCP-T-001');

  const reportData = {
    generatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    reportingPeriod: 'FY 2025 Q4',

    summary: {
      totalTests: 2,
      completed: 2,
      inProgress: 0,
      scheduled: 0,
      draft: 0,
      successRate: 100,
      avgTestDuration: '4.25 hours',
      criticalIssuesFound: 5,
      issuesResolved: 2
    },

    testResults: [
      {
        id: 'BCP-T-001',
        name: 'Q4 2024 Full DR Simulation',
        type: 'Full Simulation',
        date: '2024-11-15',
        startTime: '08:00',
        endTime: '14:00',
        duration: '6 hours',
        location: 'Munich DR Site',
        testCoordinator: 'Klaus Weber',
        result: 'Passed',
        rtoTarget: '8 hours',
        rtoAchieved: '6 hours',

        participants: [
          { name: 'Klaus Weber', role: 'Test Coordinator', department: 'IT Operations', contactNumber: '+49-89-3800-5001' },
          { name: 'Anna Schmidt', role: 'Database Lead', department: 'IT Infrastructure', contactNumber: '+49-89-3800-5012' },
          { name: 'Michael Torres', role: 'Network Lead', department: 'IT Infrastructure', contactNumber: '+49-89-3800-5023' },
          { name: 'Sarah Chen', role: 'Application Lead', department: 'IT Development', contactNumber: '+49-89-3800-5034' },
          { name: 'David Klein', role: 'Security Lead', department: 'Information Security', contactNumber: '+49-89-3800-5045' },
          { name: 'Emma Weber', role: 'Business Liaison', department: 'Business Continuity', contactNumber: '+49-89-3800-5056' },
          { name: 'Tom Harris', role: 'Communications Lead', department: 'Corporate Communications', contactNumber: '+49-89-3800-5067' },
          { name: 'Lisa Anderson', role: 'Facilities Lead', department: 'Facilities Management', contactNumber: '+49-89-3800-5078' }
        ],

        callTree: [
          { sequence: 1, time: '08:00', caller: 'Klaus Weber', recipient: 'Anna Schmidt', status: 'Success', responseTime: '2 min', notes: 'Database team activated' },
          { sequence: 2, time: '08:02', caller: 'Klaus Weber', recipient: 'Michael Torres', status: 'Success', responseTime: '3 min', notes: 'Network team activated' },
          { sequence: 3, time: '08:05', caller: 'Klaus Weber', recipient: 'Sarah Chen', status: 'Success', responseTime: '1 min', notes: 'Application team activated' },
          { sequence: 4, time: '08:06', caller: 'Anna Schmidt', recipient: 'Database Team (5 members)', status: 'Success', responseTime: '8 min', notes: 'All database engineers contacted' },
          { sequence: 5, time: '08:08', caller: 'Michael Torres', recipient: 'Network Team (4 members)', status: 'Delayed', responseTime: '15 min', notes: 'One engineer unreachable, backup contacted' },
          { sequence: 6, time: '08:10', caller: 'Sarah Chen', recipient: 'Development Team (6 members)', status: 'Success', responseTime: '10 min', notes: 'All developers confirmed availability' }
        ],

        timeline: [
          { time: '08:00', phase: 'Activation', activity: 'DR plan activated by Test Coordinator', responsible: 'Klaus Weber', status: 'Completed', duration: '5 min', objective: 'Initiate DR procedures' },
          { time: '08:05', phase: 'Notification', activity: 'Call tree execution initiated', responsible: 'Klaus Weber', status: 'Completed', duration: '18 min', objective: 'Notify all team members' },
          { time: '08:23', phase: 'Assessment', activity: 'DR site readiness assessment', responsible: 'Lisa Anderson', status: 'Completed', duration: '30 min', objective: 'Validate DR site readiness' },
          { time: '08:53', phase: 'Network Recovery', activity: 'Network infrastructure failover', responsible: 'Michael Torres', status: 'Completed', duration: '45 min', objective: 'Restore network connectivity' },
          { time: '09:38', phase: 'Database Recovery', activity: 'Database restoration from backup', responsible: 'Anna Schmidt', status: 'Completed', duration: '90 min', objective: 'Restore all critical databases' },
          { time: '11:08', phase: 'Application Recovery', activity: 'Application services restoration', responsible: 'Sarah Chen', status: 'Completed', duration: '120 min', objective: 'Restore all critical applications' },
          { time: '13:08', phase: 'Testing', activity: 'End-to-end functionality testing', responsible: 'Emma Weber', status: 'Completed', duration: '45 min', objective: 'Verify system functionality' },
          { time: '13:53', phase: 'Validation', activity: 'Business process validation', responsible: 'Emma Weber', status: 'Completed', duration: '7 min', objective: 'Confirm business operations' },
          { time: '14:00', phase: 'Completion', activity: 'Test completion and documentation', responsible: 'Klaus Weber', status: 'Completed', duration: '0 min', objective: 'Document results' }
        ],

        objectives: [
          { objective: 'Validate DR site readiness', met: true, evidence: 'DR site fully operational, all systems available', issues: 'None' },
          { objective: 'Test communication protocols', met: true, evidence: 'Call tree executed successfully, 95% response rate', issues: 'One network engineer unreachable, backup contacted successfully' },
          { objective: 'Verify data recovery', met: true, evidence: 'All databases restored within RTO, data integrity verified', issues: 'None' },
          { objective: 'Restore critical applications', met: true, evidence: 'All 12 critical applications operational', issues: 'None' },
          { objective: 'Validate business processes', met: true, evidence: 'End-to-end business processes tested successfully', issues: 'None' }
        ],

        findings: [
          { severity: 'Low', finding: 'Communication delay in initial notification - one network engineer unreachable', impact: 'Minimal - backup contact responded within acceptable timeframe', status: 'Resolved', remediation: 'Updated contact information and added secondary contacts for all critical roles' },
          { severity: 'Medium', finding: 'Documentation gaps in network recovery procedures', impact: 'Moderate - caused 10-minute delay in network restoration', status: 'In Progress', remediation: 'Network team updating all recovery procedures with detailed step-by-step instructions' },
          { severity: 'Low', finding: 'DR site access badges not pre-configured for 2 team members', impact: 'Minimal - temporary badges issued within 15 minutes', status: 'Resolved', remediation: 'All team members now have permanent DR site access' }
        ],

        recommendations: [
          'Update communication tree with backup contacts for all critical roles',
          'Enhance network recovery documentation with detailed procedures',
          'Pre-configure DR site access for all potential team members',
          'Consider reducing database recovery time through incremental backup strategy',
          'Schedule quarterly DR drills to maintain team readiness'
        ]
      },

      {
        id: 'TT-001',
        name: 'Cybersecurity Incident Response Tabletop',
        type: 'Tabletop Exercise',
        date: '2024-11-10',
        startTime: '14:00',
        endTime: '16:30',
        duration: '2.5 hours',
        location: 'Munich HQ - Conference Room A',
        testCoordinator: 'David Klein',
        result: 'Passed with Issues',
        rtoTarget: 'N/A',
        rtoAchieved: 'N/A',

        scenario: {
          title: 'Ransomware Attack on Core Insurance Platform',
          description: 'At 02:00 on a Monday morning, the IT security team detects unusual encryption activity on the core insurance platform. Multiple file servers show signs of ransomware infection. The attack appears to be spreading through the network.',
          initialConditions: [
            '15% of file servers encrypted',
            'Ransomware note demanding €5M in cryptocurrency',
            'Attack detected by automated monitoring systems',
            'No immediate impact on customer-facing services',
            'Backup systems appear unaffected'
          ],
          assumptions: [
            'Attack occurred during off-peak hours',
            'Incident response team available within 30 minutes',
            'DR site is operational and unaffected',
            'Law enforcement and regulators must be notified',
            'Media may become aware within 24 hours'
          ]
        },

        participants: [
          { name: 'David Klein', role: 'Exercise Facilitator', department: 'Information Security', contactNumber: '+49-89-3800-5045' },
          { name: 'Klaus Weber', role: 'IT Operations Director', department: 'IT Operations', contactNumber: '+49-89-3800-5001' },
          { name: 'Emma Weber', role: 'Business Continuity Manager', department: 'Business Continuity', contactNumber: '+49-89-3800-5056' },
          { name: 'Dr. Stefan Mueller', role: 'CISO', department: 'Information Security', contactNumber: '+49-89-3800-5100' },
          { name: 'Anna Schmidt', role: 'Database Administrator', department: 'IT Infrastructure', contactNumber: '+49-89-3800-5012' },
          { name: 'Michael Torres', role: 'Network Security Lead', department: 'IT Infrastructure', contactNumber: '+49-89-3800-5023' },
          { name: 'Sarah Chen', role: 'Application Security Lead', department: 'IT Development', contactNumber: '+49-89-3800-5034' },
          { name: 'Thomas Becker', role: 'Legal Counsel', department: 'Legal', contactNumber: '+49-89-3800-6001' },
          { name: 'Maria Schneider', role: 'Communications Director', department: 'Corporate Communications', contactNumber: '+49-89-3800-7001' },
          { name: 'Hans Zimmerman', role: 'Chief Risk Officer', department: 'Risk Management', contactNumber: '+49-89-3800-8001' }
        ],

        discussionQuestions: [
          {
            time: '14:05',
            question: 'Q1: What are the immediate actions that should be taken upon detection of the ransomware?',
            responses: [
              { respondent: 'Dr. Stefan Mueller', answer: 'Immediately isolate affected servers from the network to prevent spread. Activate incident response team and notify executive management.' },
              { respondent: 'Michael Torres', answer: 'Implement network segmentation to contain the attack. Block all outbound connections from affected systems.' },
              { respondent: 'Anna Schmidt', answer: 'Verify backup integrity and ensure backups are isolated from the network.' }
            ],
            facilitatorNotes: 'Good initial responses. Team correctly identified containment as priority. Need to emphasize importance of preserving forensic evidence.',
            gaps: ['No mention of forensic evidence preservation', 'Unclear who has authority to isolate production systems'],
            correctActions: ['Isolate affected systems', 'Activate IR team', 'Preserve evidence', 'Verify backups']
          },
          {
            time: '14:20',
            question: 'Q2: Who needs to be notified and in what order? What is the escalation path?',
            responses: [
              { respondent: 'Emma Weber', answer: 'Follow the crisis management escalation tree: CISO → CIO → CEO → Board. Also notify business unit heads.' },
              { respondent: 'Thomas Becker', answer: 'Legal must be involved immediately. We have regulatory obligations to notify BaFin within 72 hours under DORA regulations.' },
              { respondent: 'Maria Schneider', answer: 'Communications team should prepare holding statements for internal and external stakeholders.' }
            ],
            facilitatorNotes: 'Escalation path discussed but not clearly defined. Regulatory notification timeline understood.',
            gaps: ['No clear escalation criteria or thresholds', 'Uncertainty about when to involve law enforcement', 'No defined communication protocol for customers'],
            correctActions: ['Internal escalation per crisis plan', 'Regulatory notification (BaFin, GDPR)', 'Law enforcement notification', 'Customer communication plan']
          },
          {
            time: '14:40',
            question: 'Q3: Should we pay the ransom? What factors influence this decision?',
            responses: [
              { respondent: 'Hans Zimmerman', answer: 'Company policy is not to pay ransoms. We should focus on recovery from backups.' },
              { respondent: 'Klaus Weber', answer: 'We need to assess recovery time from backups vs. business impact. If recovery takes more than 48 hours, business pressure to pay may be significant.' },
              { respondent: 'Thomas Becker', answer: 'Paying ransom may violate sanctions laws if attackers are in sanctioned countries. Also sets precedent for future attacks.' },
              { respondent: 'Dr. Stefan Mueller', answer: 'Even if we pay, there\'s no guarantee of decryption. Many ransomware groups don\'t provide working decryption keys.' }
            ],
            facilitatorNotes: 'Excellent discussion covering business, legal, and technical perspectives. Team consensus against payment.',
            gaps: ['No formal decision-making framework for ransom decisions', 'Unclear who has final authority'],
            correctActions: ['Assess backup recovery feasibility', 'Consider legal implications', 'Evaluate business impact', 'Document decision rationale']
          },
          {
            time: '15:00',
            question: 'Q4: How do we recover operations? What is the recovery strategy?',
            responses: [
              { respondent: 'Anna Schmidt', answer: 'Restore from last clean backup. We have backups from 6 hours before the attack. Need to verify no malware in backups.' },
              { respondent: 'Klaus Weber', answer: 'Activate DR site for critical systems while we clean and rebuild production environment. Estimated 24-48 hours for full recovery.' },
              { respondent: 'Sarah Chen', answer: 'Need to scan all systems for indicators of compromise before bringing them back online. Can\'t risk reinfection.' }
            ],
            facilitatorNotes: 'Recovery strategy sound but timeline may be optimistic. Need more detailed recovery procedures.',
            gaps: ['No documented recovery procedures for ransomware', 'Unclear testing requirements before restoring services', 'No defined criteria for "clean" systems'],
            correctActions: ['Restore from verified clean backups', 'Scan for IOCs', 'Rebuild compromised systems', 'Test before production']
          },
          {
            time: '15:25',
            question: 'Q5: What communication should go to customers and when?',
            responses: [
              { respondent: 'Maria Schneider', answer: 'We should notify customers only if their data was compromised. Need to complete forensic analysis first.' },
              { respondent: 'Thomas Becker', answer: 'GDPR requires notification within 72 hours if personal data is breached. We need to determine scope quickly.' },
              { respondent: 'Emma Weber', answer: 'Even if no data breach, customers may notice service disruptions. Proactive communication builds trust.' }
            ],
            facilitatorNotes: 'Tension between legal requirements and business communication strategy. Need clearer guidelines.',
            gaps: ['No pre-approved communication templates', 'Unclear approval process for customer communications', 'No defined communication channels'],
            correctActions: ['Assess data breach scope', 'Prepare GDPR notifications if needed', 'Proactive customer communication', 'Regular status updates']
          },
          {
            time: '15:50',
            question: 'Q6: What lessons learned and improvements should be implemented?',
            responses: [
              { respondent: 'Dr. Stefan Mueller', answer: 'Need better network segmentation to prevent lateral movement. Also need offline/immutable backups.' },
              { respondent: 'Klaus Weber', answer: 'Recovery procedures need to be documented and tested. This exercise showed gaps in our playbooks.' },
              { respondent: 'Emma Weber', answer: 'Escalation criteria need to be clearly defined. Too much ambiguity about who makes what decisions.' },
              { respondent: 'Michael Torres', answer: 'Need enhanced monitoring and detection capabilities. Attack was detected but response was delayed.' }
            ],
            facilitatorNotes: 'Excellent self-assessment. Team identified key improvement areas.',
            gaps: [],
            correctActions: ['Improve network segmentation', 'Implement immutable backups', 'Document recovery procedures', 'Define escalation criteria', 'Enhance detection capabilities']
          }
        ],

        objectives: [
          { objective: 'Test incident response procedures', met: true, evidence: 'Team successfully walked through IR procedures, identified containment and recovery steps', issues: 'Procedures not well documented, relied on individual knowledge' },
          { objective: 'Validate escalation paths', met: false, evidence: 'Escalation discussed but no clear criteria or thresholds defined', issues: 'Ambiguity about decision authority and escalation triggers' },
          { objective: 'Review communication protocols', met: true, evidence: 'Communication requirements identified for internal, regulatory, and customer audiences', issues: 'No pre-approved templates or defined approval processes' },
          { objective: 'Assess recovery capabilities', met: true, evidence: 'Recovery strategy defined using backups and DR site', issues: 'Recovery timeline may be optimistic, procedures not fully documented' }
        ],

        findings: [
          { severity: 'High', finding: 'Unclear escalation criteria for cyber incidents - no defined thresholds for when to escalate to executive management or board', impact: 'Critical - could delay decision-making during actual incident', status: 'In Progress', remediation: 'CISO developing escalation matrix with clear criteria based on impact severity, data sensitivity, and regulatory requirements' },
          { severity: 'High', finding: 'No documented ransomware recovery procedures - team relied on general knowledge', impact: 'Critical - could significantly extend recovery time during actual incident', status: 'Open', remediation: 'IT Operations to document detailed ransomware recovery playbook including forensic preservation, backup verification, and system rebuild procedures' },
          { severity: 'Medium', finding: 'Insufficient technical expertise in crisis management team - no dedicated cybersecurity representative', impact: 'Moderate - technical decisions may be delayed or incorrect', status: 'Open', remediation: 'Add CISO or designated security lead to crisis management team' },
          { severity: 'Medium', finding: 'No pre-approved communication templates for cyber incidents', impact: 'Moderate - delays in customer and regulatory notifications', status: 'In Progress', remediation: 'Communications team developing templates for various cyber incident scenarios' },
          { severity: 'Low', finding: 'Ambiguity about authority to isolate production systems', impact: 'Low - could cause brief delay in containment', status: 'Resolved', remediation: 'Updated incident response procedures to grant CISO authority to isolate systems during active attacks' }
        ],

        recommendations: [
          'Define clear escalation thresholds for cyber incidents based on impact severity, data sensitivity, and regulatory requirements',
          'Add cybersecurity specialist (CISO or delegate) to crisis management team with standing authority',
          'Develop and document detailed ransomware recovery playbook with step-by-step procedures',
          'Create pre-approved communication templates for various cyber incident scenarios',
          'Implement immutable backup solution to protect against ransomware encryption',
          'Enhance network segmentation to limit lateral movement during attacks',
          'Conduct quarterly tabletop exercises focusing on different cyber threat scenarios',
          'Establish clear decision-making framework for ransom payment decisions (even if policy is not to pay)'
        ]
      }
    ]
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Passed': return 'text-green-700 bg-green-50 border-green-200';
      case 'Passed with Issues': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Failed': return 'text-red-700 bg-red-50 border-red-200';
      case 'In Progress': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-700 bg-red-50 border-red-300';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-300';
      case 'Low': return 'text-blue-700 bg-blue-50 border-blue-300';
      default: return 'text-gray-700 bg-gray-50 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'text-green-700 bg-green-50';
      case 'In Progress': return 'text-blue-700 bg-blue-50';
      case 'Open': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm">
      {/* Report Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-sm">
                <BeakerIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">BCP Testing & Exercises Report</h1>
                <p className="text-xs text-gray-600">Comprehensive testing results and findings analysis</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700">
              <PrinterIcon className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        {/* Report Metadata */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-xs">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Generated</p>
              <p className="font-medium text-gray-900">{reportData.generatedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <ClockIcon className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Period</p>
              <p className="font-medium text-gray-900">{reportData.reportingPeriod}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Test Selection */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Select Test Report</h2>
          <div className="grid grid-cols-2 gap-3">
            {reportData.testResults.map((test) => (
              <button
                key={test.id}
                onClick={() => setSelectedTest(test.id)}
                className={`text-left p-4 rounded-sm border-2 transition-all ${
                  selectedTest === test.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{test.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{test.id} • {test.date}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getResultColor(test.result)}`}>
                    {test.result}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-600">
                  <span className="flex items-center gap-1">
                    <BeakerIcon className="h-3 w-3" />
                    {test.type}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    {test.duration}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Detailed Test Report */}
        {reportData.testResults.filter(t => t.id === selectedTest).map((test) => (
          <div key={test.id} className="space-y-6">
            {/* Test Overview */}
            <section className="border border-gray-200 rounded-sm p-6 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">{test.name}</h2>
                  <p className="text-xs text-gray-600 mt-1">{test.id} • {test.type}</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-sm text-xs font-semibold border ${getResultColor(test.result)}`}>
                  {test.result}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-gray-500 mb-1">Date</p>
                  <p className="font-medium text-gray-900">{test.date}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Time</p>
                  <p className="font-medium text-gray-900">{test.startTime} - {test.endTime}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Duration</p>
                  <p className="font-medium text-gray-900">{test.duration}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Location</p>
                  <p className="font-medium text-gray-900">{test.location}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">Test Coordinator</p>
                <p className="text-sm font-semibold text-gray-900">{test.testCoordinator}</p>
              </div>
            </section>

            {/* Scenario (for Tabletop only) */}
            {test.scenario && (
              <section className="border border-gray-200 rounded-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="h-4 w-4 text-purple-600" />
                  Test Scenario
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900 mb-2">{test.scenario.title}</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{test.scenario.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Initial Conditions</p>
                      <ul className="space-y-1">
                        {test.scenario.initialConditions.map((condition, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-purple-600 mt-0.5">•</span>
                            <span>{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-2">Assumptions</p>
                      <ul className="space-y-1">
                        {test.scenario.assumptions.map((assumption, idx) => (
                          <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-purple-600 mt-0.5">•</span>
                            <span>{assumption}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Participants */}
            <section className="border border-gray-200 rounded-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <UserGroupIcon className="h-4 w-4 text-blue-600" />
                Test Participants ({test.participants.length})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {test.participants.map((participant, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-900">{participant.name}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">{participant.role}</p>
                        <p className="text-[10px] text-gray-500">{participant.department}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <PhoneIcon className="h-3 w-3" />
                        <span>{participant.contactNumber}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Call Tree (for Full Simulation) */}
            {test.callTree && (
              <section className="border border-gray-200 rounded-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-green-600" />
                  Call Tree Execution
                </h3>
                <div className="border border-gray-200 rounded-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">#</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Caller</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Recipient</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Response Time</th>
                        <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {test.callTree.map((call) => (
                        <tr key={call.sequence} className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-xs text-gray-900">{call.sequence}</td>
                          <td className="px-3 py-2 text-xs text-gray-700">{call.time}</td>
                          <td className="px-3 py-2 text-xs text-gray-700">{call.caller}</td>
                          <td className="px-3 py-2 text-xs text-gray-700">{call.recipient}</td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium ${
                              call.status === 'Success' ? 'text-green-700 bg-green-50 border border-green-200' : 'text-amber-700 bg-amber-50 border border-amber-200'
                            }`}>
                              {call.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700">{call.responseTime}</td>
                          <td className="px-3 py-2 text-xs text-gray-600">{call.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Timeline (for Full Simulation) */}
            {test.timeline && (
              <section className="border border-gray-200 rounded-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-blue-600" />
                  Test Execution Timeline
                </h3>
                <div className="space-y-3">
                  {test.timeline.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          step.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {idx + 1}
                        </div>
                        {idx < test.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <p className="text-xs font-semibold text-gray-900">{step.phase}</p>
                            <p className="text-xs text-gray-700 mt-0.5">{step.activity}</p>
                          </div>
                          <span className="text-xs font-medium text-gray-600">{step.time}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
                          <div>
                            <span className="text-gray-500">Responsible:</span>
                            <span className="ml-1 text-gray-900 font-medium">{step.responsible}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <span className="ml-1 text-gray-900 font-medium">{step.duration}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Objective:</span>
                            <span className="ml-1 text-gray-900 font-medium">{step.objective}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tabletop Discussion Questions */}
            {test.discussionQuestions && (
              <section className="border border-gray-200 rounded-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-purple-600" />
                  Discussion Questions & Responses
                </h3>
                <div className="space-y-6">
                  {test.discussionQuestions.map((qa, idx) => (
                    <div key={idx} className="border-l-4 border-purple-300 pl-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-purple-900">{qa.question}</p>
                          <p className="text-[10px] text-gray-500 mt-1">Time: {qa.time}</p>
                        </div>
                      </div>

                      {/* Responses */}
                      <div className="space-y-2 mb-3">
                        {qa.responses.map((response, rIdx) => (
                          <div key={rIdx} className="bg-gray-50 rounded-sm p-3">
                            <p className="text-[10px] font-semibold text-gray-700 mb-1">{response.respondent}:</p>
                            <p className="text-xs text-gray-900 leading-relaxed">{response.answer}</p>
                          </div>
                        ))}
                      </div>

                      {/* Facilitator Notes */}
                      <div className="bg-blue-50 border border-blue-200 rounded-sm p-3 mb-2">
                        <p className="text-[10px] font-semibold text-blue-700 mb-1">Facilitator Notes:</p>
                        <p className="text-xs text-blue-900">{qa.facilitatorNotes}</p>
                      </div>

                      {/* Gaps Identified */}
                      {qa.gaps.length > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 mb-2">
                          <p className="text-[10px] font-semibold text-amber-700 mb-1">Gaps Identified:</p>
                          <ul className="space-y-1">
                            {qa.gaps.map((gap, gIdx) => (
                              <li key={gIdx} className="text-xs text-amber-900 flex items-start gap-2">
                                <ExclamationTriangleIcon className="h-3 w-3 flex-shrink-0 mt-0.5" />
                                <span>{gap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Correct Actions */}
                      <div className="bg-green-50 border border-green-200 rounded-sm p-3">
                        <p className="text-[10px] font-semibold text-green-700 mb-1">Expected Actions:</p>
                        <ul className="space-y-1">
                          {qa.correctActions.map((action, aIdx) => (
                            <li key={aIdx} className="text-xs text-green-900 flex items-start gap-2">
                              <CheckCircleIcon className="h-3 w-3 flex-shrink-0 mt-0.5" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Objectives Assessment */}
            <section className="border border-gray-200 rounded-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ListBulletIcon className="h-4 w-4 text-blue-600" />
                Objectives Assessment
              </h3>
              <div className="space-y-3">
                {test.objectives.map((obj, idx) => (
                  <div key={idx} className={`border-l-4 rounded-sm p-4 ${obj.met ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    <div className="flex items-start gap-3">
                      {obj.met ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-900 mb-2">{obj.objective}</p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-[10px] font-medium text-gray-700">Evidence:</p>
                            <p className="text-xs text-gray-900">{obj.evidence}</p>
                          </div>
                          {obj.issues && obj.issues !== 'None' && (
                            <div>
                              <p className="text-[10px] font-medium text-gray-700">Issues:</p>
                              <p className="text-xs text-gray-900">{obj.issues}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Findings */}
            <section className="border border-gray-200 rounded-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-amber-600" />
                Findings & Issues ({test.findings.length})
              </h3>
              <div className="space-y-3">
                {test.findings.map((finding, idx) => (
                  <div key={idx} className={`border-l-4 rounded-sm p-4 ${getSeverityColor(finding.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-bold border ${getSeverityColor(finding.severity)}`}>
                        {finding.severity} SEVERITY
                      </span>
                      <span className={`text-[10px] px-2 py-1 rounded-sm font-medium ${getStatusColor(finding.status)}`}>
                        {finding.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 mb-2">{finding.finding}</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] font-medium text-gray-700">Impact:</p>
                        <p className="text-xs text-gray-900">{finding.impact}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-gray-700">Remediation:</p>
                        <p className="text-xs text-gray-900">{finding.remediation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommendations */}
            <section className="border border-gray-200 rounded-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DocumentTextIcon className="h-4 w-4 text-blue-600" />
                Recommendations ({test.recommendations.length})
              </h3>
              <div className="space-y-2">
                {test.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-gray-900 flex-1">{rec}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ))}

        {/* Report Footer */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <p>© 2025 Allianz Business Continuity Management | Confidential</p>
            <p>Page 1 of 1 | Generated: {reportData.generatedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

