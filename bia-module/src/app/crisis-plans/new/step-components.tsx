// Additional step components for crisis plan wizard
// This file contains the remaining steps (3-6) to keep the main file manageable

export const mockProcesses = [
  'Core Trading Platform',
  'Market Data Dissemination',
  'Clearing & Settlement',
  'Member Onboarding',
  'Surveillance & Monitoring',
  'Reporting & Analytics'
];

export const mockBETH3VData = {
  buildings: ['Mumbai HQ - Main Building', 'Mumbai HQ - Data Center', 'Bangalore DR Site', 'Delhi Office Tower'],
  equipment: ['Trading Servers (20 units)', 'Network Switches (15 units)', 'UPS Systems (5 units)', 'Backup Generators (3 units)'],
  technology: ['Trading Platform', 'Market Data System', 'Clearing System', 'Member Portal', 'Surveillance System'],
  humanResources: ['IT Operations Team (15)', 'Trading Support (10)', 'Network Engineers (8)', 'Security Team (6)'],
  thirdPartyVendors: ['Cloud Provider - AWS', 'Network Provider - Tata', 'Security Vendor - Palo Alto', 'Backup Service - Veeam'],
  vitalRecords: ['Trading Records', 'Member Data', 'Financial Transactions', 'Audit Logs', 'Compliance Reports']
};

export const defaultTeamRoles = [
  'Crisis Commander',
  'IT Lead',
  'Communications Lead',
  'Facilities Lead',
  'Security Lead',
  'Business Continuity Lead',
  'Legal & Compliance Lead',
  'HR Lead'
];

export const defaultActivationCriteria = [
  'Complete loss of primary data center',
  'Cyber attack affecting critical systems',
  'Natural disaster impacting facilities',
  'Prolonged power outage (>4 hours)',
  'Critical vendor failure',
  'Pandemic affecting >30% of workforce'
];

export const defaultResponsePhases = [
  {
    name: 'Detection & Assessment',
    duration: '0-30 min',
    actions: [
      'Confirm incident and assess severity',
      'Notify Crisis Commander',
      'Activate crisis management team',
      'Establish communication channels'
    ]
  },
  {
    name: 'Immediate Response',
    duration: '30 min - 2 hours',
    actions: [
      'Implement immediate containment measures',
      'Activate backup systems if needed',
      'Notify stakeholders and regulators',
      'Set up crisis command center'
    ]
  },
  {
    name: 'Stabilization',
    duration: '2-8 hours',
    actions: [
      'Execute recovery procedures',
      'Monitor system restoration',
      'Provide regular status updates',
      'Coordinate with external parties'
    ]
  },
  {
    name: 'Recovery & Resumption',
    duration: '8-24 hours',
    actions: [
      'Restore normal operations',
      'Validate system integrity',
      'Debrief team and stakeholders',
      'Document lessons learned'
    ]
  }
];

