'use client';

import { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ExclamationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Pagination from '@/components/Pagination';
import { Risk, RiskLevel, RISK_LEVEL_COLORS } from '@/types/risk-assessment';

const ITEMS_PER_PAGE = 10;

const riskCategories = ['Operational', 'Financial', 'Strategic', 'Compliance', 'Reputational', 'Technology', 'Environmental', 'Human Resources'];

const mockRisks: Risk[] = [
  { id: 1, riskId: 'RSK-001', name: 'Data Breach', category: 'Technology', description: 'Unauthorized access to sensitive data', causes: 'Weak security controls, phishing attacks', consequences: 'Financial loss, reputational damage, regulatory penalties', defaultRiskRating: RiskLevel.HIGH, status: 'ACTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 2, riskId: 'RSK-002', name: 'Supply Chain Disruption', category: 'Operational', description: 'Interruption in supply chain operations', causes: 'Vendor failure, natural disasters', consequences: 'Production delays, revenue loss', defaultRiskRating: RiskLevel.MEDIUM, status: 'ACTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 3, riskId: 'RSK-003', name: 'Regulatory Non-Compliance', category: 'Compliance', description: 'Failure to meet regulatory requirements', causes: 'Lack of awareness, inadequate processes', consequences: 'Fines, legal action, license revocation', defaultRiskRating: RiskLevel.HIGH, status: 'ACTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 4, riskId: 'RSK-004', name: 'Key Personnel Loss', category: 'Human Resources', description: 'Loss of critical staff members', causes: 'Resignation, illness, poaching', consequences: 'Knowledge loss, operational disruption', defaultRiskRating: RiskLevel.MEDIUM, status: 'ACTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 5, riskId: 'RSK-005', name: 'System Outage', category: 'Technology', description: 'Critical system unavailability', causes: 'Hardware failure, software bugs, cyberattacks', consequences: 'Business interruption, customer impact', defaultRiskRating: RiskLevel.VERY_HIGH, status: 'ACTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 6, riskId: 'RSK-006', name: 'Financial Fraud', category: 'Financial', description: 'Internal or external financial fraud activities', causes: 'Weak internal controls, collusion, identity theft', consequences: 'Direct financial loss, legal liability, reputation damage', defaultRiskRating: RiskLevel.HIGH, status: 'ACTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 7, riskId: 'RSK-007', name: 'Natural Disaster', category: 'Environmental', description: 'Impact from earthquakes, floods, or severe weather', causes: 'Geographic location, climate change, inadequate preparation', consequences: 'Facility damage, business interruption, employee safety', defaultRiskRating: RiskLevel.MEDIUM, status: 'ACTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 8, riskId: 'RSK-008', name: 'Reputational Damage', category: 'Reputational', description: 'Negative public perception affecting brand value', causes: 'Poor customer service, social media incidents, product failures', consequences: 'Customer loss, stock price decline, talent attrition', defaultRiskRating: RiskLevel.HIGH, status: 'ACTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 9, riskId: 'RSK-009', name: 'Cyber Ransomware Attack', category: 'Technology', description: 'Malicious encryption of critical business data', causes: 'Phishing emails, unpatched systems, weak passwords', consequences: 'Data loss, ransom payment, extended downtime', defaultRiskRating: RiskLevel.VERY_HIGH, status: 'ACTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 10, riskId: 'RSK-010', name: 'Market Volatility', category: 'Strategic', description: 'Sudden changes in market conditions affecting business', causes: 'Economic downturn, competitor actions, regulatory changes', consequences: 'Revenue decline, market share loss, strategic pivot required', defaultRiskRating: RiskLevel.MEDIUM, status: 'ACTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 11, riskId: 'RSK-011', name: 'Third-Party Vendor Failure', category: 'Operational', description: 'Critical vendor unable to deliver services', causes: 'Vendor bankruptcy, quality issues, contract disputes', consequences: 'Service disruption, increased costs, customer impact', defaultRiskRating: RiskLevel.HIGH, status: 'ACTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 12, riskId: 'RSK-012', name: 'Workplace Safety Incident', category: 'Human Resources', description: 'Employee injury or safety violation', causes: 'Inadequate training, equipment failure, unsafe practices', consequences: 'Employee harm, legal liability, regulatory fines', defaultRiskRating: RiskLevel.MEDIUM, status: 'INACTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
];

export default function RisksPage() {
  const [risks, setRisks] = useState<Risk[]>(mockRisks);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [formData, setFormData] = useState({
    riskId: '', name: '', category: 'Operational', description: '', causes: '', consequences: '', defaultRiskRating: RiskLevel.MEDIUM, status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const filteredRisks = risks.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.riskId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || r.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRisks.length / ITEMS_PER_PAGE);
  const paginatedRisks = filteredRisks.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleOpenModal = (risk?: Risk) => {
    if (risk) {
      setEditingRisk(risk);
      setFormData({ riskId: risk.riskId, name: risk.name, category: risk.category, description: risk.description || '', causes: risk.causes || '', consequences: risk.consequences || '', defaultRiskRating: risk.defaultRiskRating || RiskLevel.MEDIUM, status: risk.status });
    } else {
      setEditingRisk(null);
      const nextId = `RSK-${String(risks.length + 1).padStart(3, '0')}`;
      setFormData({ riskId: nextId, name: '', category: 'Operational', description: '', causes: '', consequences: '', defaultRiskRating: RiskLevel.MEDIUM, status: 'ACTIVE' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingRisk) {
      setRisks(prev => prev.map(r => r.id === editingRisk.id ? { ...r, ...formData } : r));
    } else {
      const newRisk: Risk = { id: risks.length + 1, ...formData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1, isDeleted: false };
      setRisks(prev => [...prev, newRisk]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this risk?')) {
      setRisks(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-semibold text-gray-900">Risk Library</h1><p className="text-xs text-gray-500 mt-0.5">Manage risk definitions with causes and consequences</p></div>
          <button onClick={() => handleOpenModal()} className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800">
            <PlusIcon className="h-3.5 w-3.5 mr-1.5" />Add Risk
          </button>
        </div>
      </div>

      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search risks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm">
            <option value="ALL">All Categories</option>
            {riskCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm">
            <option value="ALL">All Status</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">ID</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Name</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Category</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Default Rating</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Status</th>
              <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedRisks.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-xs font-medium text-gray-900">{r.riskId}</td>
                <td className="px-3 py-2"><div className="text-xs font-medium text-gray-900">{r.name}</div><div className="text-[10px] text-gray-500 truncate max-w-xs">{r.description}</div></td>
                <td className="px-3 py-2 text-xs text-gray-700">{r.category}</td>
                <td className="px-3 py-2">{r.defaultRiskRating && <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${RISK_LEVEL_COLORS[r.defaultRiskRating]}`}>{r.defaultRiskRating.replace('_', ' ')}</span>}</td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${r.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{r.status}</span></td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => handleOpenModal(r)} className="p-1 text-gray-400 hover:text-gray-600"><PencilIcon className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(r.id)} className="p-1 text-gray-400 hover:text-red-600 ml-1"><TrashIcon className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRisks.length > ITEMS_PER_PAGE && <div className="mt-4"><Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredRisks.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} /></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">{editingRisk ? 'Edit Risk' : 'Add Risk'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-5 w-5" /></button>
            </div>
            <div className="px-4 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Risk ID</label><input type="text" value={formData.riskId} onChange={(e) => setFormData({...formData, riskId: e.target.value})} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Category</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm">{riskCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm" /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm" /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Causes</label><textarea value={formData.causes} onChange={(e) => setFormData({...formData, causes: e.target.value})} rows={2} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm" /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Consequences</label><textarea value={formData.consequences} onChange={(e) => setFormData({...formData, consequences: e.target.value})} rows={2} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Default Rating</label><select value={formData.defaultRiskRating} onChange={(e) => setFormData({...formData, defaultRiskRating: e.target.value as RiskLevel})} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm">{Object.values(RiskLevel).map(level => <option key={level} value={level}>{level.replace('_', ' ')}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE'})} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={!formData.name} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800 disabled:opacity-50">{editingRisk ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

