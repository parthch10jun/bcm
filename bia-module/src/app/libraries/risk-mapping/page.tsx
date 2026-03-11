'use client';

import { useState } from 'react';
import {
  PlusIcon,
  TrashIcon,
  ChartBarIcon,
  ArrowRightIcon,
  XMarkIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

// Mock data for threats, vulnerabilities, and risks
const mockThreats = [
  { id: 1, name: 'Cyber Attack' },
  { id: 2, name: 'Natural Disaster' },
  { id: 3, name: 'Power Failure' },
  { id: 4, name: 'Supply Chain Disruption' },
  { id: 5, name: 'Data Breach' },
  { id: 6, name: 'Insider Threat' },
  { id: 7, name: 'Ransomware' },
  { id: 8, name: 'Social Engineering' },
  { id: 9, name: 'Hardware Failure' },
  { id: 10, name: 'Pandemic' },
];

const mockVulnerabilities = [
  { id: 1, name: 'Unpatched Software Systems', vulnerabilityId: 'VUL-001' },
  { id: 2, name: 'Weak Access Controls', vulnerabilityId: 'VUL-002' },
  { id: 3, name: 'Inadequate Backup Procedures', vulnerabilityId: 'VUL-003' },
  { id: 4, name: 'Physical Security Gaps', vulnerabilityId: 'VUL-004' },
  { id: 5, name: 'Lack of Security Awareness', vulnerabilityId: 'VUL-005' },
  { id: 6, name: 'Single Vendor Dependency', vulnerabilityId: 'VUL-006' },
  { id: 7, name: 'Insufficient Network Segmentation', vulnerabilityId: 'VUL-008' },
  { id: 8, name: 'Missing Encryption', vulnerabilityId: 'VUL-009' },
  { id: 9, name: 'Inadequate Change Management', vulnerabilityId: 'VUL-010' },
  { id: 10, name: 'Weak Password Policies', vulnerabilityId: 'VUL-012' },
];

const mockRisks = [
  { id: 1, name: 'Data Breach', riskId: 'RSK-001' },
  { id: 2, name: 'Supply Chain Disruption', riskId: 'RSK-002' },
  { id: 3, name: 'Regulatory Non-Compliance', riskId: 'RSK-003' },
  { id: 4, name: 'System Outage', riskId: 'RSK-005' },
  { id: 5, name: 'Key Personnel Loss', riskId: 'RSK-004' },
  { id: 6, name: 'Financial Fraud', riskId: 'RSK-006' },
  { id: 7, name: 'Natural Disaster', riskId: 'RSK-007' },
  { id: 8, name: 'Reputational Damage', riskId: 'RSK-008' },
  { id: 9, name: 'Cyber Ransomware Attack', riskId: 'RSK-009' },
  { id: 10, name: 'Third-Party Vendor Failure', riskId: 'RSK-011' },
];

interface Mapping {
  id: number;
  sourceType: 'THREAT' | 'VULNERABILITY';
  sourceId: number;
  sourceName: string;
  targetType: 'VULNERABILITY' | 'RISK';
  targetId: number;
  targetName: string;
}

const initialMappings: Mapping[] = [
  // Threat → Vulnerability mappings
  { id: 1, sourceType: 'THREAT', sourceId: 1, sourceName: 'Cyber Attack', targetType: 'VULNERABILITY', targetId: 1, targetName: 'Unpatched Software Systems' },
  { id: 2, sourceType: 'THREAT', sourceId: 1, sourceName: 'Cyber Attack', targetType: 'VULNERABILITY', targetId: 2, targetName: 'Weak Access Controls' },
  { id: 3, sourceType: 'THREAT', sourceId: 7, sourceName: 'Ransomware', targetType: 'VULNERABILITY', targetId: 1, targetName: 'Unpatched Software Systems' },
  { id: 4, sourceType: 'THREAT', sourceId: 7, sourceName: 'Ransomware', targetType: 'VULNERABILITY', targetId: 8, targetName: 'Missing Encryption' },
  { id: 5, sourceType: 'THREAT', sourceId: 8, sourceName: 'Social Engineering', targetType: 'VULNERABILITY', targetId: 5, targetName: 'Lack of Security Awareness' },
  { id: 6, sourceType: 'THREAT', sourceId: 8, sourceName: 'Social Engineering', targetType: 'VULNERABILITY', targetId: 10, targetName: 'Weak Password Policies' },
  { id: 7, sourceType: 'THREAT', sourceId: 6, sourceName: 'Insider Threat', targetType: 'VULNERABILITY', targetId: 2, targetName: 'Weak Access Controls' },
  { id: 8, sourceType: 'THREAT', sourceId: 4, sourceName: 'Supply Chain Disruption', targetType: 'VULNERABILITY', targetId: 6, targetName: 'Single Vendor Dependency' },
  // Threat → Risk mappings
  { id: 9, sourceType: 'THREAT', sourceId: 1, sourceName: 'Cyber Attack', targetType: 'RISK', targetId: 1, targetName: 'Data Breach' },
  { id: 10, sourceType: 'THREAT', sourceId: 7, sourceName: 'Ransomware', targetType: 'RISK', targetId: 9, targetName: 'Cyber Ransomware Attack' },
  { id: 11, sourceType: 'THREAT', sourceId: 2, sourceName: 'Natural Disaster', targetType: 'RISK', targetId: 7, targetName: 'Natural Disaster' },
  { id: 12, sourceType: 'THREAT', sourceId: 3, sourceName: 'Power Failure', targetType: 'RISK', targetId: 4, targetName: 'System Outage' },
  { id: 13, sourceType: 'THREAT', sourceId: 4, sourceName: 'Supply Chain Disruption', targetType: 'RISK', targetId: 2, targetName: 'Supply Chain Disruption' },
  { id: 14, sourceType: 'THREAT', sourceId: 4, sourceName: 'Supply Chain Disruption', targetType: 'RISK', targetId: 10, targetName: 'Third-Party Vendor Failure' },
  // Vulnerability → Risk mappings
  { id: 15, sourceType: 'VULNERABILITY', sourceId: 1, sourceName: 'Unpatched Software Systems', targetType: 'RISK', targetId: 1, targetName: 'Data Breach' },
  { id: 16, sourceType: 'VULNERABILITY', sourceId: 3, sourceName: 'Inadequate Backup Procedures', targetType: 'RISK', targetId: 4, targetName: 'System Outage' },
  { id: 17, sourceType: 'VULNERABILITY', sourceId: 2, sourceName: 'Weak Access Controls', targetType: 'RISK', targetId: 1, targetName: 'Data Breach' },
  { id: 18, sourceType: 'VULNERABILITY', sourceId: 5, sourceName: 'Lack of Security Awareness', targetType: 'RISK', targetId: 8, targetName: 'Reputational Damage' },
  { id: 19, sourceType: 'VULNERABILITY', sourceId: 6, sourceName: 'Single Vendor Dependency', targetType: 'RISK', targetId: 10, targetName: 'Third-Party Vendor Failure' },
  { id: 20, sourceType: 'VULNERABILITY', sourceId: 8, sourceName: 'Missing Encryption', targetType: 'RISK', targetId: 3, targetName: 'Regulatory Non-Compliance' },
];

type TabType = 'threat-vuln' | 'threat-risk' | 'vuln-risk';

export default function RiskMappingPage() {
  const [mappings, setMappings] = useState<Mapping[]>(initialMappings);
  const [activeTab, setActiveTab] = useState<TabType>('threat-vuln');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ sourceId: 0, targetId: 0 });

  const tabs = [
    { id: 'threat-vuln' as TabType, label: 'Threat → Vulnerability', sourceType: 'THREAT', targetType: 'VULNERABILITY' },
    { id: 'threat-risk' as TabType, label: 'Threat → Risk', sourceType: 'THREAT', targetType: 'RISK' },
    { id: 'vuln-risk' as TabType, label: 'Vulnerability → Risk', sourceType: 'VULNERABILITY', targetType: 'RISK' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab)!;
  const filteredMappings = mappings.filter(m => 
    m.sourceType === currentTab.sourceType && m.targetType === currentTab.targetType
  );

  const getSourceOptions = () => {
    if (currentTab.sourceType === 'THREAT') return mockThreats;
    return mockVulnerabilities;
  };

  const getTargetOptions = () => {
    if (currentTab.targetType === 'VULNERABILITY') return mockVulnerabilities;
    return mockRisks;
  };

  const handleAddMapping = () => {
    const sourceItem = getSourceOptions().find(s => s.id === formData.sourceId);
    const targetItem = getTargetOptions().find(t => t.id === formData.targetId);
    if (!sourceItem || !targetItem) return;

    const newMapping: Mapping = {
      id: mappings.length + 1,
      sourceType: currentTab.sourceType as 'THREAT' | 'VULNERABILITY',
      sourceId: formData.sourceId,
      sourceName: sourceItem.name,
      targetType: currentTab.targetType as 'VULNERABILITY' | 'RISK',
      targetId: formData.targetId,
      targetName: targetItem.name,
    };
    setMappings([...mappings, newMapping]);
    setShowModal(false);
    setFormData({ sourceId: 0, targetId: 0 });
  };

  const handleDelete = (id: number) => {
    if (confirm('Remove this mapping?')) {
      setMappings(mappings.filter(m => m.id !== id));
    }
  };

  const getStats = () => ({
    threatVuln: mappings.filter(m => m.sourceType === 'THREAT' && m.targetType === 'VULNERABILITY').length,
    threatRisk: mappings.filter(m => m.sourceType === 'THREAT' && m.targetType === 'RISK').length,
    vulnRisk: mappings.filter(m => m.sourceType === 'VULNERABILITY' && m.targetType === 'RISK').length,
  });

  const stats = getStats();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Threat–Vulnerability–Risk Mapping</h1>
            <p className="text-xs text-gray-500 mt-0.5">Map relationships between threats, vulnerabilities, and risks</p>
          </div>
          <button onClick={() => { setFormData({ sourceId: 0, targetId: 0 }); setShowModal(true); }} className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800">
            <PlusIcon className="h-3.5 w-3.5 mr-1.5" />Add Mapping
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-sm p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.threatVuln}</div>
            <div className="text-[10px] text-gray-500">Threat → Vulnerability</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.threatRisk}</div>
            <div className="text-[10px] text-gray-500">Threat → Risk</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.vulnRisk}</div>
            <div className="text-[10px] text-gray-500">Vulnerability → Risk</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex gap-4">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-1 text-xs font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mapping List */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {filteredMappings.length === 0 ? (
          <div className="text-center py-12">
            <LinkIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No mappings found for this category</p>
            <button onClick={() => setShowModal(true)} className="mt-3 text-xs text-gray-900 font-medium hover:underline">Add your first mapping</button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMappings.map(mapping => (
              <div key={mapping.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-sm hover:bg-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 text-[10px] font-medium rounded-sm ${mapping.sourceType === 'THREAT' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {mapping.sourceType}
                  </div>
                  <span className="text-xs font-medium text-gray-900">{mapping.sourceName}</span>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                  <div className={`px-2 py-1 text-[10px] font-medium rounded-sm ${mapping.targetType === 'VULNERABILITY' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                    {mapping.targetType}
                  </div>
                  <span className="text-xs font-medium text-gray-900">{mapping.targetName}</span>
                </div>
                <button onClick={() => handleDelete(mapping.id)} className="p-1 text-gray-400 hover:text-red-600">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Mapping Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Add {currentTab.label} Mapping</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-5 w-5" /></button>
            </div>
            <div className="px-4 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{currentTab.sourceType === 'THREAT' ? 'Threat' : 'Vulnerability'}</label>
                <select value={formData.sourceId} onChange={(e) => setFormData({...formData, sourceId: Number(e.target.value)})} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm">
                  <option value={0}>Select {currentTab.sourceType.toLowerCase()}...</option>
                  {getSourceOptions().map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="flex justify-center"><ArrowRightIcon className="h-5 w-5 text-gray-400" /></div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">{currentTab.targetType === 'VULNERABILITY' ? 'Vulnerability' : 'Risk'}</label>
                <select value={formData.targetId} onChange={(e) => setFormData({...formData, targetId: Number(e.target.value)})} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm">
                  <option value={0}>Select {currentTab.targetType.toLowerCase()}...</option>
                  {getTargetOptions().map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleAddMapping} disabled={!formData.sourceId || !formData.targetId} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800 disabled:opacity-50">Add Mapping</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

