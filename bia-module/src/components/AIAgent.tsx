'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  XMarkIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  ClipboardDocumentCheckIcon,
  ShieldExclamationIcon,
  DocumentTextIcon,
  LightBulbIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';
import { SparklesIcon as SparklesSolid } from '@heroicons/react/24/solid';

type Context = 'bia' | 'risk-assessment' | 'bcp' | 'it-dr' | 'general';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: () => void;
  icon?: React.ReactNode;
}

interface AIAgentProps {
  context?: Context;
}

// Demo responses based on context
const DEMO_RESPONSES: Record<Context, { greeting: string; suggestions: string[] }> = {
  'bia': {
    greeting: "✨ Hello! I'm your AI-powered **BIA Assistant**. I can help you conduct Business Impact Analyses, guide you through demos, and answer questions about your critical processes.\n\n🎯 I'm trained on BCM best practices and can help you:\n• Calculate RTO/RPO values\n• Map dependencies\n• Identify critical processes\n• Navigate the BIA workflow\n\nWhat would you like to explore?",
    suggestions: [
      "Show me a BIA demo",
      "What are my critical processes?",
      "How do I calculate RTO/RPO?",
      "Explain dependency mapping"
    ]
  },
  'risk-assessment': {
    greeting: "🛡️ Welcome! I'm your **Risk Assessment AI Advisor**. I specialize in helping organizations identify, assess, and mitigate risks effectively.\n\n📊 My capabilities include:\n• Risk identification & categorization\n• Impact & likelihood scoring\n• Control effectiveness analysis\n• Mitigation recommendations\n\nLet me guide you through our risk management capabilities!",
    suggestions: [
      "Start a risk assessment demo",
      "What are my top risks?",
      "Explain risk scoring",
      "Show control effectiveness"
    ]
  },
  'it-dr': {
    greeting: "🖥️ Welcome to the **IT Disaster Recovery AI Agent**! I'm your intelligent guide to IT DR planning, simulation, and recovery strategies.\n\n⚡ I can help you with:\n• IT asset recovery strategies\n• RTO/RPO compliance analysis\n• DR simulation insights\n• Runbook recommendations\n• Recovery procedure guidance\n\nLet me help you strengthen your IT resilience!",
    suggestions: [
      "What are my critical IT assets?",
      "Explain my recovery strategies",
      "Show DR simulation insights",
      "What's my RTO compliance?"
    ]
  },
  'bcp': {
    greeting: "🚀 Hi there! I'm your **BCP Intelligence Agent**. I assist with business continuity planning, scenario analysis, and incident response.\n\n💪 I can help you with:\n• Recovery scenario planning\n• BCP test execution\n• Incident playbooks\n• Continuity strategies\n\nHow can I help strengthen your resilience today?",
    suggestions: [
      "Show recovery scenarios",
      "What's my BCP status?",
      "Explain testing strategies",
      "Review incident playbooks"
    ]
  },
  'general': {
    greeting: "🌟 Hello! I'm **BCM 360's AI Assistant**, your intelligent guide to Business Continuity Management.\n\n🎯 I can help with:\n• Business Impact Analysis (BIA)\n• Risk Assessment\n• Business Continuity Planning (BCP)\n\nWhat area interests you?",
    suggestions: [
      "Take me to BIA",
      "Show Risk Assessment",
      "Open BCP module",
      "What can you do?"
    ]
  }
};

// Complete smart responses for ALL suggestions
const SMART_RESPONSES: Record<string, { response: string; actions?: { label: string; path: string }[] }> = {
  // BIA Responses
  "show me a bia demo": {
    response: "🎬 I'd be happy to show you our BIA capabilities! We have a comprehensive demo ready:\n\n🏢 **IT Project Management BIA**\nA complete analysis showing:\n• Process criticality assessment\n• RTO/RPO calculations\n• Dependency mapping\n• Recovery strategies\n• Resource requirements\n\nThis demo showcases all 7 steps of our BIA workflow. Ready to explore?",
    actions: [
      { label: "🚀 Launch BIA Demo", path: "/bia-records/demo" },
      { label: "📋 View All BIAs", path: "/bia-records" }
    ]
  },
  "what are my critical processes?": {
    response: "📊 Based on your organization's BIA data, here are your **top critical processes**:\n\n� **Tier 1 - Mission Critical:**\n• IT Project Management (RTO: 4h, RPO: 2h)\n• Payment Processing (RTO: 2h, RPO: 1h)\n• Core Banking System (RTO: 2h, RPO: 30m)\n\n🟠 **Tier 2 - Business Critical:**\n• HR Payroll Processing (RTO: 24h)\n• Vendor Management (RTO: 48h)\n• Customer Support (RTO: 8h)\n\n🟡 **Tier 3 - Important:**\n• Internal Communications (RTO: 72h)\n• Training Systems (RTO: 1 week)\n\nWould you like to see detailed dependencies for any of these?",
    actions: [
      { label: "🔍 View IT PM Details", path: "/bia-records/demo" },
      { label: "📋 All Processes", path: "/bia-records" }
    ]
  },
  "how do i calculate rto/rpo?": {
    response: "📐 Great question! Here's how **RTO/RPO** are calculated in BCM 360:\n\n⏱️ **RTO (Recovery Time Objective)**\nMaximum acceptable downtime before business impact becomes critical.\n\n*Factors considered:*\n• Revenue loss per hour\n• Customer impact\n• Regulatory requirements\n• Contractual SLAs\n• Reputational damage\n\n� **RPO (Recovery Point Objective)**\nMaximum acceptable data loss measured in time.\n\n*Factors considered:*\n• Transaction volume\n• Data criticality\n• Backup frequency capability\n• Compliance requirements\n\n🎯 Our BIA wizard walks you through this calculation step-by-step. Want to try it?",
    actions: [
      { label: "🧮 Calculate RTO/RPO", path: "/bia-records/demo" },
      { label: "📖 View Example", path: "/bia-records/demo" }
    ]
  },
  "explain dependency mapping": {
    response: "🔗 **Dependency Mapping** is crucial for understanding how disruptions cascade through your organization.\n\n📊 **Types of Dependencies we capture:**\n\n⬆️ **Upstream Dependencies**\n• Processes that feed INTO this process\n• Critical inputs required\n\n⬇️ **Downstream Dependencies**\n• Processes that DEPEND on this process\n• Impact of disruption\n\n👥 **People Dependencies**\n• Key personnel (potential SPOFs)\n• Skills & certifications\n• Backup personnel\n\n🖥️ **Technology Dependencies**\n• Applications & systems\n• Infrastructure\n• Third-party services\n\n🏢 **Vendor Dependencies**\n• Critical suppliers\n• SLA requirements\n\nOur demo shows a complete dependency graph. Want to see it?",
    actions: [
      { label: "🕸️ View Dependency Graph", path: "/bia-records/demo" },
      { label: "📋 All Dependencies", path: "/bia-records" }
    ]
  },

  // Risk Assessment Responses
  "start a risk assessment demo": {
    response: "🎯 Excellent choice! Let me guide you through our **Risk Assessment** capabilities:\n\n📋 **What you'll see:**\n\n1️⃣ **Risk Register** - All identified risks with scoring\n2️⃣ **Risk Heat Map** - Visual 5x5 matrix\n3️⃣ **Scoring Models** - Configurable assessment criteria\n4️⃣ **Control Mapping** - Mitigation strategies\n5️⃣ **Risk Trends** - Historical analysis\n\n� **Current Risk Summary:**\n• 3 Critical risks requiring attention\n• 5 High risks being monitored\n• Overall risk score: 72/100\n\nReady to explore the full risk landscape?",
    actions: [
      { label: "🚀 Open Risk Assessment", path: "/risk-assessment" },
      { label: "📊 View Risk Matrix", path: "/risk-assessment" }
    ]
  },
  "what are my top risks?": {
    response: "🔴 Here's your current **Risk Landscape**:\n\n**Critical Risks (Score 20+):**\n• 🔒 Cybersecurity Breach - Score: **25**\n  └ Impact: Catastrophic | Likelihood: Likely\n• 🏢 Third-party Vendor Failure - Score: **20**\n  └ Impact: Major | Likelihood: Likely\n• 💻 Data Center Outage - Score: **18**\n  └ Impact: Major | Likelihood: Possible\n\n**High Risks (Score 12-19):**\n• 📜 Regulatory Non-compliance - Score: **16**\n• 👤 Key Person Dependency - Score: **15**\n• 🚚 Supply Chain Disruption - Score: **14**\n\n📈 **Overall Risk Score: 72/100**\n\nWould you like to see mitigation strategies for any of these?",
    actions: [
      { label: "🛡️ View Mitigations", path: "/risk-assessment" },
      { label: "📊 Full Risk Register", path: "/risk-assessment" }
    ]
  },
  "explain risk scoring": {
    response: "📊 Our **Risk Scoring Methodology** uses a 5x5 matrix approach:\n\n**Impact Scale (1-5):**\n• 1 - Insignificant\n• 2 - Minor\n• 3 - Moderate\n• 4 - Major\n• 5 - Catastrophic\n\n**Likelihood Scale (1-5):**\n• 1 - Rare\n• 2 - Unlikely\n• 3 - Possible\n• 4 - Likely\n• 5 - Almost Certain\n\n**Risk Score = Impact × Likelihood**\n\n🎨 **Heat Map Colors:**\n• 🟢 Low (1-4): Acceptable risk\n• 🟡 Medium (5-9): Monitor closely\n• 🟠 High (10-16): Action required\n• 🔴 Critical (17-25): Immediate action\n\nWant to see this in action?",
    actions: [
      { label: "📊 View Risk Matrix", path: "/risk-assessment" },
      { label: "⚙️ Scoring Models", path: "/risk-assessment" }
    ]
  },
  "show control effectiveness": {
    response: "🛡️ **Control Effectiveness Analysis**\n\nOur system tracks how well your controls mitigate identified risks:\n\n✅ **Highly Effective Controls:**\n• Multi-factor Authentication - 95% effective\n• Daily Backup System - 92% effective\n• Firewall Configuration - 90% effective\n\n⚠️ **Controls Needing Improvement:**\n• Vendor Risk Assessment - 65% effective\n• Incident Response Plan - 70% effective\n• Employee Security Training - 72% effective\n\n📈 **Overall Control Coverage: 78%**\n\n� **Recommendations:**\n• Increase vendor assessment frequency\n• Conduct tabletop exercises quarterly\n• Update security training curriculum\n\nWant to dive deeper into specific controls?",
    actions: [
      { label: "📋 View All Controls", path: "/risk-assessment" },
      { label: "🎯 Improvement Plan", path: "/risk-assessment" }
    ]
  },

  // BCP Responses
  "show recovery scenarios": {
    response: "🎭 Here are your **Business Continuity Scenarios**:\n\n🔴 **Critical Scenarios:**\n• 🔒 Cyberattack Response & Recovery\n  └ Status: Active | Last Tested: Oct 2025\n• 💻 Data Center Failover\n  └ Status: Active | Last Tested: Sep 2025\n\n🟠 **High Priority Scenarios:**\n• 🌊 Natural Disaster Response\n• 🏭 Supply Chain Disruption\n• 👥 Pandemic/Mass Absence\n\n🟢 **Standard Scenarios:**\n• 🔌 Power Outage\n• 📡 Communication Failure\n• 🏢 Building Inaccessibility\n\nEach scenario has linked playbooks and test schedules. Want to explore one?",
    actions: [
      { label: "🚨 View Scenarios", path: "/bcp" },
      { label: "📖 See Playbooks", path: "/bcp/playbooks" }
    ]
  },
  "what's my bcp status?": {
    response: "📊 **BCP Program Status Overview**\n\n✅ **Overall Readiness: 87%**\n\n📋 **Scenarios:** 8 Active | 2 Under Review\n📖 **Playbooks:** 12 Published | 3 In Draft\n🧪 **Tests:** 15 Completed | 4 Scheduled\n🚨 **Incidents:** 2 Active | 5 Resolved (YTD)\n\n**Recent Activity:**\n• ✅ Cyber Response test passed (Oct 15)\n• ⚠️ DR test scheduled (Jan 15)\n• 📝 Pandemic playbook updated (Nov 1)\n\n**Action Items:**\n• 2 playbooks pending review\n• 1 test overdue\n• 3 incidents awaiting closure\n\nWant to see details on any area?",
    actions: [
      { label: "📋 View Scenarios", path: "/bcp" },
      { label: "🧪 View Tests", path: "/bcp/tests" },
      { label: "🚨 View Incidents", path: "/bcp/incidents" }
    ]
  },
  "explain testing strategies": {
    response: "🧪 **BCP Testing Strategies**\n\nWe support multiple testing approaches:\n\n📝 **1. Tabletop Exercise**\n• Discussion-based walkthrough\n• Low cost, minimal disruption\n• Tests decision-making process\n• Frequency: Quarterly\n\n🎭 **2. Simulation Test**\n• Scenario-based exercise\n• Involves key personnel\n• Tests coordination & communication\n• Frequency: Semi-annually\n\n⚡ **3. Parallel Test**\n• Systems run simultaneously\n• No impact to production\n• Validates technical recovery\n• Frequency: Annually\n\n🔄 **4. Full Interruption Test**\n• Complete failover\n• Highest confidence level\n• Most resource-intensive\n• Frequency: As required\n\n📅 **Your Next Scheduled Tests:**\n• Tabletop: Dec 2025\n• Simulation: Jan 2026\n\nWant to schedule or view test results?",
    actions: [
      { label: "📅 Schedule Test", path: "/bcp/tests" },
      { label: "📊 Test Results", path: "/bcp/tests" }
    ]
  },
  "review incident playbooks": {
    response: "📖 **Incident Response Playbooks**\n\nYour organization has **12 active playbooks**:\n\n🔴 **Critical Response:**\n• 🔒 Ransomware Attack Response (v2.3)\n• 💾 Data Breach Protocol (v1.8)\n• 🏢 Facility Evacuation (v3.1)\n\n🟠 **High Priority:**\n• 🌐 DDoS Attack Response (v2.0)\n• ⚡ Power Failure Recovery (v1.5)\n• 👥 Key Person Unavailable (v1.2)\n\n🟢 **Standard Operations:**\n• 📡 Network Outage (v2.1)\n• 🖥️ Application Failure (v1.9)\n• 🏭 Vendor Service Disruption (v1.4)\n\n**Playbook Health:**\n• ✅ 9 Up-to-date\n• ⚠️ 2 Need review\n• 🔄 1 In revision\n\nWant to view or edit a specific playbook?",
    actions: [
      { label: "📖 View Playbooks", path: "/bcp/playbooks" },
      { label: "➕ Create Playbook", path: "/bcp/playbooks" }
    ]
  },

  // General Navigation
  "take me to bia": {
    response: "📋 Taking you to the **Business Impact Analysis** module!\n\nHere you can:\n• View all BIA records\n• Create new impact analyses\n• Track BIA completion status\n• Access the BIA wizard\n\nClick below to navigate:",
    actions: [
      { label: "🚀 Open BIA Module", path: "/bia-records" },
      { label: "🎬 Try BIA Demo", path: "/bia-records/demo" }
    ]
  },
  "show risk assessment": {
    response: "🛡️ Opening the **Risk Assessment** module!\n\nFeatures available:\n• Risk Register with heat map\n• Risk scoring & evaluation\n• Control effectiveness tracking\n• Mitigation planning\n\nClick below to navigate:",
    actions: [
      { label: "🚀 Open Risk Assessment", path: "/risk-assessment" }
    ]
  },
  "open bcp module": {
    response: "🏢 Opening the **Business Continuity Planning** module!\n\nYou'll find:\n• Recovery scenarios\n• Incident playbooks\n• Test management\n• Incident tracking\n\nClick below to navigate:",
    actions: [
      { label: "🚀 Open BCP Module", path: "/bcp" },
      { label: "📖 View Playbooks", path: "/bcp/playbooks" }
    ]
  },
  "what can you do?": {
    response: "🤖 I'm **BCM 360's AI Assistant** - your intelligent guide!\n\n**My Capabilities:**\n\n📋 **Business Impact Analysis**\n• Guide you through BIA creation\n• Explain RTO/RPO calculations\n• Help with dependency mapping\n• Show demo scenarios\n\n🛡️ **Risk Assessment**\n• Explain risk scoring methodology\n• Show your risk landscape\n• Analyze control effectiveness\n• Provide mitigation recommendations\n\n🏢 **Business Continuity**\n• Navigate recovery scenarios\n• Review incident playbooks\n• Explain testing strategies\n• Track program status\n\n🎯 **Navigation**\n• Take you to any module\n• Provide context-aware help\n• Answer BCM questions\n\nJust ask me anything! I'm here to help. 😊",
    actions: [
      { label: "📋 Go to BIA", path: "/bia-records" },
      { label: "🛡️ Go to Risk", path: "/risk-assessment" },
      { label: "🏢 Go to BCP", path: "/bcp" }
    ]
  },

  // IT DR Responses
  "what are my critical it assets?": {
    response: "🖥️ Here's your **Critical IT Asset Inventory**:\n\n**Tier 1 - Mission Critical (RTO < 4h):**\n• 🏢 **Primary Data Center - Newark** (DC-001)\n  └ 500 Racks | 99.99% Uptime | N+1 Redundancy\n• 💾 **SAP HANA Production Cluster** (SRV-001)\n  └ 128 vCPU | 2TB RAM | RTO: 2h | RPO: 15min\n• 🔐 **Active Directory Controllers** (SRV-003)\n  └ 4 Instances | Multi-site Replication | RTO: 1h\n• 💰 **Core Banking System T24** (APP-001)\n  └ 2,500 Users | 50K transactions/day | RTO: 2h\n• 📈 **Trading Platform** (APP-003)\n  └ 100K trades/day | <10ms latency | RTO: 1h\n\n**Tier 2 - Business Critical (RTO 4-24h):**\n• 📧 Exchange Server Cluster (RTO: 4h)\n• 👥 HR & Payroll System (RTO: 24h)\n• 📄 Document Management (RTO: 8h)\n\nWant to see recovery strategies for any of these?",
    actions: [
      { label: "🖥️ View All Assets", path: "/it-dr-plans" },
      { label: "🎮 Run Simulation", path: "/it-dr-plans/simulation" }
    ]
  },
  "explain my recovery strategies": {
    response: "🔄 Here are your **IT Recovery Strategies**:\n\n**SAP HANA (SRV-001):**\n• Primary: SAP HANA System Replication to DR\n• Secondary: Restore from Veeam Backup\n• MTTR: 45 minutes | Last Tested: Nov 1, 2024 ✅\n\n**Oracle Database (SRV-002):**\n• Primary: Oracle Data Guard Failover\n• Secondary: RMAN Restore\n• MTTR: 60 minutes | Last Tested: Sep 20, 2024 ✅\n\n**Active Directory (SRV-003):**\n• Primary: Multi-site AD Replication\n• Secondary: Authoritative Restore\n• MTTR: 15 minutes | Last Tested: Nov 10, 2024 ✅\n\n**Core Banking T24 (APP-001):**\n• Primary: Application Cluster Failover\n• Secondary: DR Site Activation\n• MTTR: 90 minutes | Last Tested: Oct 25, 2024 ✅\n\n**Backup Infrastructure:**\n• Veeam: 500TB capacity, 15TB daily backup\n• Tape Library: 2PB capacity, 7-year retention\n• Cloud (AWS S3): AES-256 encrypted, us-east-1\n\nAll recovery strategies have been tested and validated!",
    actions: [
      { label: "📖 View Runbooks", path: "/it-dr-plans/runbooks" },
      { label: "🎮 Test Recovery", path: "/it-dr-plans/simulation" }
    ]
  },
  "show dr simulation insights": {
    response: "📊 **DR Simulation Insights & Analysis**\n\n**Last Simulation: Data Center Failure**\n• Date: November 15, 2024\n• Duration: 47 minutes\n• Result: ✅ **PASSED**\n\n**Key Metrics:**\n• 🎯 RTO Compliance: **100%** (All targets met)\n• 💾 Data Loss (RPO): **0 transactions**\n• 🖥️ Systems Recovered: **15/15**\n• ⏱️ Fastest Recovery: Trading Platform (28 min)\n• ⏱️ Slowest Recovery: Email Services (40 min)\n\n**Strengths Identified:**\n• SAP HANA replication performed flawlessly\n• DR site activation was smooth\n• Crisis communication was effective\n\n**Recommendations:**\n• ⚠️ Review generator maintenance schedule\n• ⚠️ Consider reducing DNS TTL\n• ⚠️ Add automated customer notifications\n\nWant to run a new simulation?",
    actions: [
      { label: "🎮 Run New Simulation", path: "/it-dr-plans/simulation" },
      { label: "📋 View DR Plans", path: "/it-dr-plans" }
    ]
  },
  "what's my rto compliance?": {
    response: "⏱️ **RTO Compliance Dashboard**\n\n**Overall Compliance: 98.5%** ✅\n\n**Tier 1 Systems (Target: <4h):**\n• SAP HANA: 20 min actual vs 2h target ✅\n• Active Directory: 15 min actual vs 1h target ✅\n• Core Banking: 25 min actual vs 2h target ✅\n• Trading Platform: 28 min actual vs 1h target ✅\n• Customer Portal: 35 min actual vs 3h target ✅\n\n**Tier 2 Systems (Target: 4-24h):**\n• Email Services: 40 min actual vs 4h target ✅\n• HR System: 2h actual vs 24h target ✅\n• Document Mgmt: 1h actual vs 8h target ✅\n\n**Historical Trend:**\n• Q4 2024: 98.5% compliance\n• Q3 2024: 97.2% compliance\n• Q2 2024: 95.8% compliance\n\n📈 **Improvement: +2.7% over 6 months**\n\nYour DR program is performing excellently!",
    actions: [
      { label: "📊 View Full Report", path: "/it-dr-plans" },
      { label: "🎮 Run Simulation", path: "/it-dr-plans/simulation" }
    ]
  }
};

export default function AIAgent({ context = 'general' }: AIAgentProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add greeting message
      setTimeout(() => {
        addAssistantMessage(DEMO_RESPONSES[context].greeting);
      }, 500);
    }
  }, [isOpen, context]);

  const addAssistantMessage = (content: string, actions?: { label: string; path: string }[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content,
        timestamp: new Date(),
        actions: actions?.map(a => ({
          label: a.label,
          action: () => router.push(a.path),
          icon: <ArrowRightIcon className="h-3 w-3" />
        }))
      }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);
    setInputValue('');

    // Find matching response with improved fuzzy matching
    const lowerInput = userMessage.toLowerCase();

    // First try exact match
    let matchedKey = Object.keys(SMART_RESPONSES).find(key => lowerInput === key);

    // Then try if input contains the key
    if (!matchedKey) {
      matchedKey = Object.keys(SMART_RESPONSES).find(key => lowerInput.includes(key));
    }

    // Then try if key contains significant part of input
    if (!matchedKey) {
      matchedKey = Object.keys(SMART_RESPONSES).find(key => {
        const inputWords = lowerInput.split(' ').filter(w => w.length > 3);
        return inputWords.some(word => key.includes(word));
      });
    }

    // Keyword-based matching for common queries
    if (!matchedKey) {
      const keywordMap: Record<string, string> = {
        'demo': context === 'bia' ? 'show me a bia demo' : context === 'risk-assessment' ? 'start a risk assessment demo' : 'show recovery scenarios',
        'critical': 'what are my critical processes?',
        'process': 'what are my critical processes?',
        'rto': 'how do i calculate rto/rpo?',
        'rpo': 'how do i calculate rto/rpo?',
        'dependency': 'explain dependency mapping',
        'dependencies': 'explain dependency mapping',
        'risk': context === 'risk-assessment' ? 'what are my top risks?' : 'what are my top risks?',
        'scoring': 'explain risk scoring',
        'score': 'explain risk scoring',
        'control': 'show control effectiveness',
        'effective': 'show control effectiveness',
        'scenario': 'show recovery scenarios',
        'recovery': 'show recovery scenarios',
        'status': "what's my bcp status?",
        'bcp': context === 'bcp' ? "what's my bcp status?" : 'open bcp module',
        'test': 'explain testing strategies',
        'testing': 'explain testing strategies',
        'playbook': 'review incident playbooks',
        'incident': 'review incident playbooks',
        'bia': context === 'bia' ? 'show me a bia demo' : 'take me to bia',
        'help': 'what can you do?',
        'capabilities': 'what can you do?',
      };

      for (const [keyword, responseKey] of Object.entries(keywordMap)) {
        if (lowerInput.includes(keyword)) {
          matchedKey = responseKey;
          break;
        }
      }
    }

    if (matchedKey && SMART_RESPONSES[matchedKey]) {
      const response = SMART_RESPONSES[matchedKey];
      addAssistantMessage(response.response, response.actions);
    } else {
      // Context-aware default response
      const contextActions = {
        'bia': [
          { label: "🎬 Try BIA Demo", path: "/bia-records/demo" },
          { label: "📋 View BIA Records", path: "/bia-records" }
        ],
        'risk-assessment': [
          { label: "🛡️ View Risk Register", path: "/risk-assessment" },
          { label: "📊 Risk Matrix", path: "/risk-assessment" }
        ],
        'bcp': [
          { label: "📋 View Scenarios", path: "/bcp" },
          { label: "📖 View Playbooks", path: "/bcp/playbooks" }
        ],
        'it-dr': [
          { label: "🖥️ View DR Plans", path: "/it-dr-plans" },
          { label: "🎮 Run Simulation", path: "/it-dr-plans/simulation" },
          { label: "📖 View Runbooks", path: "/it-dr-plans/runbooks" }
        ],
        'general': [
          { label: "📋 Go to BIA", path: "/bia-records" },
          { label: "🛡️ Go to Risk", path: "/risk-assessment" },
          { label: "🏢 Go to BCP", path: "/bcp" }
        ]
      };

      addAssistantMessage(
        "🤔 I understand you're asking about **" + userMessage + "**.\n\nWhile I'm still learning about that specific topic, I can help you explore our BCM capabilities. Here are some quick actions based on your current context:",
        contextActions[context]
      );
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getContextIcon = () => {
    switch (context) {
      case 'bia': return <ClipboardDocumentCheckIcon className="h-5 w-5" />;
      case 'risk-assessment': return <ShieldExclamationIcon className="h-5 w-5" />;
      case 'bcp': return <DocumentTextIcon className="h-5 w-5" />;
      default: return <SparklesSolid className="h-5 w-5" />;
    }
  };

  const getContextTitle = () => {
    switch (context) {
      case 'bia': return 'BIA Assistant';
      case 'risk-assessment': return 'Risk Advisor';
      case 'bcp': return 'BCP Intelligence';
      default: return 'BCM 360 AI';
    }
  };

  return (
    <>
      {/* Custom CSS for magical animations - Matching navbar blue theme */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(24px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(24px) rotate(-360deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(30, 58, 122, 0.5), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(16, 185, 129, 0.1); }
          50% { box-shadow: 0 0 30px rgba(30, 58, 122, 0.7), 0 0 60px rgba(59, 130, 246, 0.5), 0 0 90px rgba(16, 185, 129, 0.2); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .ai-float { animation: float 3s ease-in-out infinite; }
        .ai-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        .ai-sparkle { animation: sparkle 1.5s ease-in-out infinite; }
        .ai-orbit { animation: orbit 8s linear infinite; }
        .ai-glow { animation: glow-pulse 2s ease-in-out infinite; }
        .ai-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>

      {/* Floating AI Button - Matching Navbar Blue Theme */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group ai-float"
        >
          <div className="relative">
            {/* Outer glow rings - matching navbar blue */}
            <div className="absolute inset-[-8px] bg-gradient-to-r from-[#1e3a7a] via-[#2d5a9e] to-[#3b82f6] rounded-full blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
            <div className="absolute inset-[-4px] bg-gradient-to-r from-[#10b981] via-[#3b82f6] to-[#1e3a7a] rounded-full blur-md opacity-50 group-hover:opacity-80 ai-gradient" />

            {/* Main button with glow effect - navbar colors */}
            <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1e3a7a] via-[#2d5a9e] to-[#1a2d54] rounded-full shadow-2xl ai-glow transition-all duration-300 group-hover:scale-110">
              {/* Inner shimmer effect */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 ai-shimmer" />
              </div>

              <SparklesSolid className="h-8 w-8 text-white relative z-10 drop-shadow-lg" />

              {/* Orbiting particles - green accent like navbar */}
              <div className="absolute inset-0 ai-orbit">
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50" />
              </div>
              <div className="absolute inset-0 ai-orbit" style={{ animationDelay: '-2.6s' }}>
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full shadow-lg shadow-blue-400/50" />
              </div>
              <div className="absolute inset-0 ai-orbit" style={{ animationDelay: '-5.3s' }}>
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-lg shadow-cyan-400/50" />
              </div>

              {/* Animated sparkles - green accent */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ai-sparkle" />
              <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
              <div className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-blue-400 rounded-full ai-sparkle" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Enhanced Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gradient-to-r from-[#1e3a7a] to-[#2d5a9e] text-white text-xs font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl border border-blue-500/30">
            <span className="flex items-center gap-2">
              <SparklesSolid className="h-3.5 w-3.5 text-emerald-400" />
              Ask AI Assistant
            </span>
            <div className="absolute top-full right-5 border-[6px] border-transparent border-t-[#2d5a9e]" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80' : 'w-[420px]'} transition-all duration-500 animate-in slide-in-from-bottom-4 fade-in`}>
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200/80 overflow-hidden backdrop-blur-sm" style={{ boxShadow: '0 10px 40px -10px rgba(30, 58, 122, 0.3), 0 20px 60px -20px rgba(0, 0, 0, 0.2)' }}>
            {/* Header with animated gradient - matching navbar */}
            <div className="relative bg-gradient-to-r from-[#1e3a7a] via-[#2d5a9e] to-[#1a2d54] px-4 py-3.5 ai-gradient overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.3),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.2),transparent_40%)]" />
                <div className="absolute inset-0 ai-shimmer" />
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-11 h-11 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
                    <div className="text-white">
                      {getContextIcon()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                      {getContextTitle()}
                      <span className="px-1.5 py-0.5 bg-white/20 rounded text-[9px] font-medium">AI</span>
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white/80 text-[10px]">AI-Powered • Ready</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ChevronDownIcon className={`h-4 w-4 text-white transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    onClick={() => { setIsOpen(false); setMessages([]); }}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area - matching navbar blue theme */}
            {!isMinimized && (
              <div className="h-96 overflow-y-auto p-4 bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
                {messages.length === 0 && !isTyping && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-[#1e3a7a]/20 rounded-2xl animate-pulse" />
                        <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-[#1e3a7a]/10 rounded-2xl flex items-center justify-center">
                          <CommandLineIcon className="h-10 w-10 text-[#1e3a7a]" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full ai-sparkle" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">Initializing AI Assistant...</p>
                      <p className="text-gray-400 text-xs mt-1">Preparing your personalized experience</p>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 animate-in fade-in slide-in-from-bottom-2 ${message.role === 'user' ? 'flex justify-end' : ''}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex gap-2.5">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#1e3a7a] via-[#2d5a9e] to-[#1a2d54] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                          <SparklesSolid className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 max-w-[85%]">
                          <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-3.5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed"
                                 dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>') }} />
                          </div>
                          {message.actions && (
                            <div className="flex flex-wrap gap-2 mt-2.5">
                              {message.actions.map((action, idx) => (
                                <button
                                  key={idx}
                                  onClick={action.action}
                                  className="group inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#1e3a7a] to-[#2d5a9e] text-white text-[11px] font-medium rounded-xl hover:from-[#1a2d54] hover:to-[#1e3a7a] transition-all shadow-md hover:shadow-lg hover:shadow-blue-900/25 hover:scale-[1.02]"
                                >
                                  {action.label}
                                  <ArrowRightIcon className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {message.role === 'user' && (
                      <div className="bg-gradient-to-r from-[#1e3a7a] via-[#2d5a9e] to-[#1a2d54] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] shadow-md">
                        <p className="text-xs leading-relaxed">{message.content}</p>
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2.5 mb-4 animate-in fade-in">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#1e3a7a] via-[#2d5a9e] to-[#1a2d54] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                      <SparklesSolid className="h-4 w-4 text-white ai-sparkle" />
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                      <div className="flex gap-1.5 items-center">
                        <div className="w-2 h-2 bg-gradient-to-r from-[#1e3a7a] to-[#2d5a9e] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gradient-to-r from-[#2d5a9e] to-[#3b82f6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gradient-to-r from-[#3b82f6] to-[#10b981] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="text-[10px] text-gray-400 ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Suggestions */}
            {!isMinimized && messages.length <= 1 && (
              <div className="px-4 pb-3 bg-gradient-to-b from-transparent to-blue-50/50">
                <p className="text-[10px] text-gray-500 mb-2.5 flex items-center gap-1.5 font-medium">
                  <LightBulbIcon className="h-3.5 w-3.5 text-emerald-500" />
                  Quick suggestions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {DEMO_RESPONSES[context].suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1.5 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-[#1e3a7a]/5 text-gray-700 hover:text-[#1e3a7a] text-[11px] rounded-xl transition-all border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            {!isMinimized && (
              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex gap-2.5">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask me anything about BCM..."
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a9e] focus:border-transparent focus:bg-white transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#1e3a7a] to-[#2d5a9e] text-white rounded-xl hover:from-[#1a2d54] hover:to-[#1e3a7a] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg hover:shadow-blue-900/25 hover:scale-105 disabled:hover:scale-100"
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[9px] text-gray-400">AI Ready</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-[9px] text-gray-400">Powered by BCM 360</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[9px] text-[#1e3a7a] font-medium">Demo Mode</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

