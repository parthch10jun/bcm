'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ExclamationCircleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  EyeIcon,
  SparklesIcon,
  XMarkIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { mockIssues, calculateStats } from '@/data/mockIssueActionData';
import { Issue, IssueStatus, IssuePriority, IssueModule, IssueStatusConfig, PriorityConfig } from '@/types/issue-action';

// AI Recommendations for each issue
const aiRecommendations: Record<string, {
  summary: string;
  riskScore: number;
  correctiveActions: { action: string; priority: 'Critical' | 'High' | 'Medium'; timeline: string; owner: string }[];
  preventiveActions: { action: string; benefit: string; timeline: string }[];
  rootCause: string;
  similarIncidents: { id: string; title: string; resolution: string }[];
  complianceImpact: string[];
}> = {
  'iss-001': {
    summary: 'Critical RTO breach detected during DR test. Root cause analysis indicates infrastructure bottlenecks and procedural gaps requiring immediate attention.',
    riskScore: 85,
    rootCause: 'Database restore procedures not optimized for large datasets; network reconfiguration steps not automated; staff training on updated procedures incomplete.',
    correctiveActions: [
      { action: 'Implement incremental backup strategy to reduce restore time by 60%', priority: 'Critical', timeline: '2 weeks', owner: 'Ali Hassan' },
      { action: 'Automate network configuration deployment using Ansible playbooks', priority: 'Critical', timeline: '3 weeks', owner: 'Network Team' },
      { action: 'Conduct emergency DR procedure training for all IT staff', priority: 'High', timeline: '1 week', owner: 'Ahmed Al-Rashid' },
      { action: 'Deploy parallel restore capability for critical databases', priority: 'High', timeline: '4 weeks', owner: 'DBA Team' }
    ],
    preventiveActions: [
      { action: 'Implement continuous DR readiness monitoring dashboard', benefit: 'Real-time visibility into DR capability status', timeline: '6 weeks' },
      { action: 'Establish quarterly DR drills with progressive complexity', benefit: 'Maintain team proficiency and identify gaps early', timeline: 'Ongoing' },
      { action: 'Deploy automated RTO/RPO testing framework', benefit: 'Continuous validation of recovery objectives', timeline: '8 weeks' }
    ],
    similarIncidents: [
      { id: 'ISS-2024-0089', title: 'Database Recovery Timeout Q1 2024', resolution: 'Implemented SSD storage tier for backup systems' },
      { id: 'ISS-2024-0112', title: 'Network Failover Delay', resolution: 'Automated VLAN configuration scripts deployed' }
    ],
    complianceImpact: ['ISO 22301:2019 Section 8.4.4 - Business continuity procedures', 'Internal SLA Agreement - 4-hour RTO mandate', 'Regulatory requirement for financial data availability']
  },
  'iss-002': {
    summary: 'Documentation gaps in finance processes pose compliance and continuity risks. AI analysis recommends structured documentation initiative.',
    riskScore: 62,
    rootCause: 'Lack of standardized documentation templates; no formal review cycle; knowledge concentrated in key individuals without transfer protocols.',
    correctiveActions: [
      { action: 'Create comprehensive SOP templates for all critical finance processes', priority: 'High', timeline: '2 weeks', owner: 'Sara Al-Fahad' },
      { action: 'Document payroll processing workflow with decision trees', priority: 'High', timeline: '3 weeks', owner: 'Finance Team' },
      { action: 'Establish document version control system', priority: 'Medium', timeline: '4 weeks', owner: 'IT Support' }
    ],
    preventiveActions: [
      { action: 'Implement quarterly documentation review cycle', benefit: 'Ensures documents remain current and accurate', timeline: 'Ongoing' },
      { action: 'Create video-based process walkthroughs', benefit: 'Visual training aids for faster onboarding', timeline: '6 weeks' },
      { action: 'Deploy knowledge base with search capability', benefit: 'Instant access to procedures during incidents', timeline: '8 weeks' }
    ],
    similarIncidents: [
      { id: 'ISS-2023-0156', title: 'HR Policy Documentation Gap', resolution: 'Created centralized policy repository with owner assignments' }
    ],
    complianceImpact: ['SOX Compliance - Process documentation requirements', 'Internal Audit findings - Procedure documentation', 'Knowledge transfer policy compliance']
  },
  'iss-003': {
    summary: 'Single vendor dependency creates significant operational risk. Recommend multi-vendor strategy implementation.',
    riskScore: 78,
    rootCause: 'Historical vendor relationship without formal contingency planning; no vendor risk assessment conducted; contract lacks performance guarantees.',
    correctiveActions: [
      { action: 'Immediately identify and qualify 2-3 alternative irrigation system vendors', priority: 'Critical', timeline: '4 weeks', owner: 'Khalid Al-Harbi' },
      { action: 'Negotiate backup service agreement with secondary vendor', priority: 'High', timeline: '6 weeks', owner: 'Procurement' },
      { action: 'Stock critical spare parts inventory (30-day buffer)', priority: 'High', timeline: '2 weeks', owner: 'Facilities' }
    ],
    preventiveActions: [
      { action: 'Implement vendor risk scoring and monitoring program', benefit: 'Early warning of vendor stability issues', timeline: '8 weeks' },
      { action: 'Establish dual-vendor strategy for all critical systems', benefit: 'Eliminates single points of failure', timeline: '12 weeks' },
      { action: 'Include business continuity clauses in all vendor contracts', benefit: 'Contractual protection during disruptions', timeline: 'Next renewal' }
    ],
    similarIncidents: [
      { id: 'ISS-2023-0098', title: 'HVAC Vendor Bankruptcy', resolution: 'Emergency vendor onboarding process established' }
    ],
    complianceImpact: ['Supply chain resilience requirements', 'Operational risk management policy', 'Third-party risk management framework']
  },
  'iss-004': {
    summary: 'Access control logging gaps present security and compliance risks. Immediate remediation required.',
    riskScore: 88,
    rootCause: 'Legacy access control system with limited logging capability; integration gaps between physical and logical access systems; insufficient monitoring procedures.',
    correctiveActions: [
      { action: 'Upgrade access control system firmware to enable full event logging', priority: 'Critical', timeline: '1 week', owner: 'Omar Al-Ghamdi' },
      { action: 'Configure SIEM integration for real-time access event monitoring', priority: 'Critical', timeline: '2 weeks', owner: 'Security Team' },
      { action: 'Implement daily access log review procedure', priority: 'High', timeline: '1 week', owner: 'Security Operations' },
      { action: 'Deploy backup logging mechanism for redundancy', priority: 'High', timeline: '3 weeks', owner: 'IT Infrastructure' }
    ],
    preventiveActions: [
      { action: 'Implement automated anomaly detection for access patterns', benefit: 'Proactive identification of unauthorized access attempts', timeline: '6 weeks' },
      { action: 'Establish quarterly access control system audits', benefit: 'Regular validation of system effectiveness', timeline: 'Ongoing' },
      { action: 'Deploy unified identity management platform', benefit: 'Centralized access governance and reporting', timeline: '16 weeks' }
    ],
    similarIncidents: [
      { id: 'ISS-2024-0067', title: 'Badge Reader Logging Failure', resolution: 'Replaced legacy readers with network-enabled units' }
    ],
    complianceImpact: ['ISO 27001 - Access control requirements', 'Data protection regulations', 'Physical security audit requirements', 'Insurance policy security mandates']
  },
  'iss-005': {
    summary: 'Succession planning gaps in HR create leadership continuity risks. Recommend structured succession framework.',
    riskScore: 55,
    rootCause: 'No formal succession planning process; key person dependencies not identified; cross-training not prioritized.',
    correctiveActions: [
      { action: 'Identify all critical HR positions and key person dependencies', priority: 'High', timeline: '2 weeks', owner: 'Mohammed Al-Qahtani' },
      { action: 'Create succession plan templates for each critical role', priority: 'Medium', timeline: '4 weeks', owner: 'HR Leadership' },
      { action: 'Document institutional knowledge from senior HR staff', priority: 'Medium', timeline: '6 weeks', owner: 'HR Team' }
    ],
    preventiveActions: [
      { action: 'Implement mentorship program for succession candidates', benefit: 'Accelerated leadership development', timeline: '12 weeks' },
      { action: 'Create job shadowing rotations for critical roles', benefit: 'Practical experience transfer', timeline: '8 weeks' },
      { action: 'Establish annual succession plan review process', benefit: 'Keeps plans current with organizational changes', timeline: 'Ongoing' }
    ],
    similarIncidents: [
      { id: 'ISS-2023-0134', title: 'Finance Director Sudden Departure', resolution: 'Emergency succession activation with 3-month transition' }
    ],
    complianceImpact: ['Business continuity policy - key personnel requirements', 'Corporate governance guidelines', 'Talent management framework']
  },
  'iss-006': {
    summary: 'BCP testing overdue by 3 months. Critical gap in plan validation. Immediate test scheduling required.',
    riskScore: 72,
    rootCause: 'Test scheduling deprioritized due to business demands; no automated reminder system; unclear accountability for test execution.',
    correctiveActions: [
      { action: 'Schedule tabletop exercise within next 2 weeks', priority: 'Critical', timeline: '2 weeks', owner: 'Sara Al-Fahad' },
      { action: 'Prepare test scenarios based on recent risk assessments', priority: 'High', timeline: '1 week', owner: 'BCM Team' },
      { action: 'Notify all BCP stakeholders of upcoming test', priority: 'High', timeline: '3 days', owner: 'BCM Coordinator' }
    ],
    preventiveActions: [
      { action: 'Implement automated BCP test scheduling and reminders', benefit: 'Ensures tests are never missed', timeline: '4 weeks' },
      { action: 'Integrate BCP testing into departmental KPIs', benefit: 'Creates accountability for test completion', timeline: 'Next quarter' },
      { action: 'Establish rolling 12-month test calendar', benefit: 'Proactive planning prevents scheduling conflicts', timeline: '2 weeks' }
    ],
    similarIncidents: [
      { id: 'ISS-2024-0023', title: 'IT BCP Test Delay', resolution: 'Implemented mandatory quarterly test checkpoints' }
    ],
    complianceImpact: ['ISO 22301 - Exercise and testing requirements', 'Internal BCM policy - annual test mandate', 'Regulatory examination findings']
  }
};

export default function IssueRegisterPage() {
  const router = useRouter();
  const [issues] = useState<Issue[]>(mockIssues);

  // Filter states per specification
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | 'ALL'>('ALL');
  const [moduleFilter, setModuleFilter] = useState<IssueModule | 'ALL'>('ALL');
  const [businessUnitFilter, setBusinessUnitFilter] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting
  const [sortColumn, setSortColumn] = useState<string>('createdDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // AI Panel state
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [visibleSections, setVisibleSections] = useState<number>(0);
  const [typingText, setTypingText] = useState<Record<string, string>>({});

  const stats = useMemo(() => calculateStats(issues), [issues]);

  // Typing animation effect
  const typeText = (key: string, fullText: string, delay: number = 0) => {
    setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        setTypingText(prev => ({
          ...prev,
          [key]: fullText.slice(0, index + 1)
        }));
        index++;
        if (index >= fullText.length) {
          clearInterval(interval);
        }
      }, 8); // Speed of typing
    }, delay);
  };

  const handleShowAIRecommendations = (issue: Issue) => {
    setSelectedIssue(issue);
    setAiLoading(true);
    setShowAIPanel(true);
    setVisibleSections(0);
    setTypingText({});

    // Simulate AI processing then reveal sections progressively
    setTimeout(() => {
      setAiLoading(false);
      const rec = aiRecommendations[issue.id];
      if (rec) {
        // Start typing animations with delays
        typeText('summary', rec.summary, 100);
        typeText('rootCause', rec.rootCause, 800);
      }
      // Reveal sections one by one
      let section = 0;
      const revealInterval = setInterval(() => {
        section++;
        setVisibleSections(section);
        if (section >= 6) clearInterval(revealInterval);
      }, 400);
    }, 1200);
  };

  const handleCloseAIPanel = () => {
    setShowAIPanel(false);
    setVisibleSections(0);
    setTypingText({});
  };

  // Filter issues
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      if (statusFilter !== 'ALL' && issue.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && issue.priority !== priorityFilter) return false;
      if (moduleFilter !== 'ALL' && issue.module !== moduleFilter) return false;
      if (businessUnitFilter.length > 0 && !businessUnitFilter.includes(issue.businessUnit)) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        if (!issue.title.toLowerCase().includes(search) &&
            !issue.referenceNumber.toLowerCase().includes(search) &&
            !issue.module.toLowerCase().includes(search) &&
            !issue.businessUnit.toLowerCase().includes(search) &&
            !issue.raisedBy.toLowerCase().includes(search)) return false;
      }
      return true;
    });
  }, [issues, statusFilter, priorityFilter, moduleFilter, businessUnitFilter, searchTerm]);

  // Sort issues
  const sortedIssues = useMemo(() => {
    return [...filteredIssues].sort((a, b) => {
      let comparison = 0;
      switch (sortColumn) {
        case 'referenceNumber':
          comparison = a.referenceNumber.localeCompare(b.referenceNumber);
          break;
        case 'priority':
          const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'createdDate':
        default:
          comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredIssues, sortColumn, sortDirection]);

  // Paginate
  const paginatedIssues = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedIssues.slice(start, start + rowsPerPage);
  }, [sortedIssues, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedIssues.length / rowsPerPage);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setModuleFilter('ALL');
    setBusinessUnitFilter([]);
    setSearchTerm('');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 sm:px-8">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  Issue Register
                </h1>
                <p className="mt-1 text-sm text-gray-500 truncate">
                  Track and manage issues across all modules
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export
                </button>
                <Link
                  href="/issues/new"
                  className="inline-flex items-center h-[32px] px-3 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Issue
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-6 py-6 sm:px-8 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-3">
              {/* Total Issues */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Issues</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalIssues}</p>
                      <span className="ml-1 text-xs text-gray-500">issues</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Issues */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Open Issues</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-blue-600">{stats.openIssues}</p>
                      <span className="ml-1 text-xs text-gray-500">open</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical/High Priority */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Critical/High</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-amber-600">{stats.criticalIssues + stats.highPriorityIssues}</p>
                      <span className="ml-1 text-xs text-gray-500">priority</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overdue */}
              <div className="bg-white border border-gray-200 rounded-sm p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Overdue</p>
                    <div className="mt-2 flex items-baseline">
                      <p className="text-2xl font-semibold text-red-600">{stats.overdueIssues}</p>
                      <span className="ml-1 text-xs text-gray-500">overdue</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-sm p-3">
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full h-[30px] pl-8 pr-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                {/* Status Filter */}
                <div className="w-32">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as IssueStatus | 'ALL')}
                    className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CLOSED">Closed</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="w-32">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as IssuePriority | 'ALL')}
                    className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                  >
                    <option value="ALL">All Priorities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                {/* Module Filter */}
                <div className="w-36">
                  <select
                    value={moduleFilter}
                    onChange={(e) => setModuleFilter(e.target.value as IssueModule | 'ALL')}
                    className="block w-full h-[30px] px-2 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white"
                  >
                    <option value="ALL">All Modules</option>
                    <option value="BIA">BIA</option>
                    <option value="RA">Risk Assessment</option>
                    <option value="BCP">BCP</option>
                    <option value="CM">Crisis Management</option>
                    <option value="TESTING">Testing</option>
                    <option value="AUDIT">Audit</option>
                    <option value="OTHERS">Others</option>
                  </select>
                </div>

                {/* Clear All Link */}
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[10%]"
                        onClick={() => handleSort('referenceNumber')}
                      >
                        <div className="flex items-center gap-1">
                          Issue ID
                          {sortColumn === 'referenceNumber' && (
                            <span className="text-gray-900">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[25%]">Issue Title</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[12%]">Business Unit</th>
                      <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[12%]">Assigned To</th>
                      <th
                        className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[10%]"
                        onClick={() => handleSort('priority')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Priority
                          {sortColumn === 'priority' && (
                            <span className="text-gray-900">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[12%]"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Status
                          {sortColumn === 'status' && (
                            <span className="text-gray-900">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[12%]"
                        onClick={() => handleSort('dueDate')}
                      >
                        <div className="flex items-center justify-center gap-1">
                          Due Date
                          {sortColumn === 'dueDate' && (
                            <span className="text-gray-900">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider w-[7%]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedIssues.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center">
                          <ExclamationCircleIcon className="mx-auto h-10 w-10 text-gray-400" />
                          <p className="mt-2 text-xs text-gray-500">
                            {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || moduleFilter !== 'ALL'
                              ? 'No issues match your filters'
                              : 'No issues yet. Create your first issue to get started.'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedIssues.map((issue) => {
                        const statusConfig = IssueStatusConfig[issue.status];
                        const priorityConfig = PriorityConfig[issue.priority];
                        const isOverdue = new Date(issue.dueDate) < new Date() && !['COMPLETED', 'CLOSED'].includes(issue.status);

                        return (
                          <tr
                            key={issue.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => router.push(`/issues/${issue.id}`)}
                          >
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className="text-xs font-medium text-gray-900">{issue.referenceNumber}</span>
                            </td>
                            <td className="px-3 py-2">
                              <div className="text-xs font-medium text-gray-900 truncate">{issue.title}</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className="text-xs text-gray-700">{issue.businessUnit}</span>
                            </td>
                            <td className="px-3 py-2">
                              <div className="text-xs text-gray-900">
                                {issue.assignedTo.length > 0 ? (
                                  <>
                                    <span>{issue.assignedTo[0]}</span>
                                    {issue.assignedTo.length > 1 && (
                                      <span className="ml-1 text-[10px] text-gray-500">+{issue.assignedTo.length - 1}</span>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-gray-400">Unassigned</span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center justify-center w-[60px] px-2 py-0.5 rounded-sm text-[10px] font-medium border border-gray-300 ${priorityConfig.color}`}>
                                {priorityConfig.label}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center justify-center w-[80px] px-2 py-0.5 rounded-sm text-[10px] font-medium border border-gray-300 ${statusConfig.color}`}>
                                {statusConfig.label}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center">
                              <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                {new Date(issue.dueDate).toLocaleDateString()}
                              </span>
                              {isOverdue && <p className="text-[10px] text-red-500">Overdue</p>}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-center space-x-2">
                                <button className="text-gray-600 hover:text-gray-900" title="View">
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleShowAIRecommendations(issue)}
                                  className="text-blue-600 hover:text-blue-800 relative group"
                                  title="AI Recommendations"
                                >
                                  <SparklesIcon className="h-4 w-4" />
                                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-700">Rows per page:</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="text-xs border border-gray-300 rounded-sm px-2 py-1 focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-xs text-gray-700 ml-4">
                      Showing {sortedIssues.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, sortedIssues.length)} of {sortedIssues.length} issues
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-1 rounded-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronDoubleLeftIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1 rounded-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeftIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="text-xs text-gray-700 px-2">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="p-1 rounded-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRightIcon className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage >= totalPages}
                      className="p-1 rounded-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronDoubleRightIcon className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* AI Recommendations Panel */}
      {showAIPanel && selectedIssue && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAIPanel(false)} />
          <div className="absolute right-0 top-0 h-full w-[600px] bg-white shadow-2xl overflow-hidden flex flex-col animate-slide-in-right">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <SparklesIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">AI-Powered Recommendations</h2>
                    <p className="text-sm text-blue-100">Intelligent analysis for issue resolution</p>
                  </div>
                </div>
                <button onClick={handleCloseAIPanel} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {aiLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                    <SparklesIcon className="absolute inset-0 m-auto h-6 w-6 text-blue-600 animate-pulse" />
                  </div>
                  <p className="text-gray-600 font-medium">Analyzing issue and generating recommendations...</p>
                  <div className="mt-3 flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Issue Context */}
                <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 transition-all duration-500 ${visibleSections >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">{selectedIssue.referenceNumber}</span>
                      <h3 className="text-sm font-semibold text-gray-900 mt-1">{selectedIssue.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded font-medium">
                        Risk Score: {aiRecommendations[selectedIssue.id]?.riskScore || 0}/100
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {typingText['summary'] || ''}<span className={`inline-block w-0.5 h-3 bg-gray-400 ml-0.5 ${typingText['summary']?.length === aiRecommendations[selectedIssue.id]?.summary?.length ? 'hidden' : 'animate-pulse'}`}></span>
                  </p>
                </div>

                {/* Root Cause Analysis */}
                <div className={`bg-amber-50 rounded-lg p-4 border border-amber-200 transition-all duration-500 ${visibleSections >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-600" />
                    <h4 className="text-sm font-semibold text-amber-800">Root Cause Analysis</h4>
                  </div>
                  <p className="text-xs text-amber-900">
                    {typingText['rootCause'] || ''}<span className={`inline-block w-0.5 h-3 bg-amber-600 ml-0.5 ${typingText['rootCause']?.length === aiRecommendations[selectedIssue.id]?.rootCause?.length ? 'hidden' : 'animate-pulse'}`}></span>
                  </p>
                </div>

                {/* Corrective Actions */}
                <div className={`transition-all duration-500 ${visibleSections >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">Recommended Corrective Actions</h4>
                  </div>
                  <div className="space-y-2">
                    {aiRecommendations[selectedIssue.id]?.correctiveActions.map((action, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-300"
                        style={{
                          opacity: visibleSections >= 3 ? 1 : 0,
                          transform: visibleSections >= 3 ? 'translateX(0)' : 'translateX(-20px)',
                          transitionDelay: `${idx * 150}ms`
                        }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-xs font-medium text-gray-900">{action.action}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium whitespace-nowrap ${
                            action.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                            action.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                          }`}>{action.priority}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1"><ClockIcon className="h-3 w-3" />{action.timeline}</span>
                          <span>Owner: {action.owner}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preventive Actions */}
                <div className={`transition-all duration-500 ${visibleSections >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">Recommended Preventive Actions</h4>
                  </div>
                  <div className="space-y-2">
                    {aiRecommendations[selectedIssue.id]?.preventiveActions.map((action, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 transition-all duration-300"
                        style={{
                          opacity: visibleSections >= 4 ? 1 : 0,
                          transform: visibleSections >= 4 ? 'translateX(0)' : 'translateX(-20px)',
                          transitionDelay: `${idx * 150}ms`
                        }}
                      >
                        <p className="text-xs font-medium text-gray-900 mb-1">{action.action}</p>
                        <div className="flex items-center gap-2 text-[10px]">
                          <LightBulbIcon className="h-3 w-3 text-amber-500" />
                          <span className="text-gray-600">{action.benefit}</span>
                        </div>
                        <div className="mt-1 text-[10px] text-gray-500">Timeline: {action.timeline}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Similar Incidents */}
                {aiRecommendations[selectedIssue.id]?.similarIncidents.length > 0 && (
                  <div className={`transition-all duration-500 ${visibleSections >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-purple-100 rounded-lg">
                        <ArrowTrendingUpIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900">Similar Past Incidents</h4>
                    </div>
                    <div className="space-y-2">
                      {aiRecommendations[selectedIssue.id]?.similarIncidents.map((incident, idx) => (
                        <div
                          key={idx}
                          className="bg-purple-50 border border-purple-200 rounded-lg p-3 transition-all duration-300"
                          style={{
                            opacity: visibleSections >= 5 ? 1 : 0,
                            transform: visibleSections >= 5 ? 'translateX(0)' : 'translateX(-20px)',
                            transitionDelay: `${idx * 150}ms`
                          }}
                        >
                          <p className="text-xs font-medium text-purple-900">{incident.id}: {incident.title}</p>
                          <p className="text-[10px] text-purple-700 mt-1">Resolution: {incident.resolution}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compliance Impact */}
                <div className={`transition-all duration-500 ${visibleSections >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-gray-100 rounded-lg">
                      <ExclamationCircleIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-gray-900">Compliance Impact</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiRecommendations[selectedIssue.id]?.complianceImpact.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-1 bg-gray-100 text-gray-700 rounded-full transition-all duration-300"
                        style={{
                          opacity: visibleSections >= 6 ? 1 : 0,
                          transform: visibleSections >= 6 ? 'scale(1)' : 'scale(0.8)',
                          transitionDelay: `${idx * 100}ms`
                        }}
                      >{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className={`border-t border-gray-200 px-6 py-4 bg-gray-50 transition-all duration-500 ${!aiLoading && visibleSections >= 6 ? 'opacity-100' : 'opacity-50'}`}>
              <div className="flex items-center justify-between">
                <button className="text-xs text-gray-600 hover:text-gray-900">Generate Report</button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCloseAIPanel}
                    className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    className={`px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700 transition-all ${!aiLoading && visibleSections >= 6 ? '' : 'opacity-50 cursor-not-allowed'}`}
                    disabled={aiLoading || visibleSections < 6}
                  >
                    Create Actions from Recommendations
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

