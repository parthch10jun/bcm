'use client';

import { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  CheckCircleIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import Pagination from '@/components/Pagination';
import { Vulnerability, VulnerabilityCategory } from '@/types/risk-assessment';

const ITEMS_PER_PAGE = 10;

// Mock data
const mockVulnerabilities: Vulnerability[] = [
  { id: 1, vulnerabilityId: 'VUL-001', name: 'Unpatched Software Systems', description: 'Systems running outdated software without security patches', category: VulnerabilityCategory.TECHNICAL, status: 'ACTIVE', relatedThreatIds: [1, 2], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 2, vulnerabilityId: 'VUL-002', name: 'Weak Access Controls', description: 'Insufficient authentication and authorization mechanisms', category: VulnerabilityCategory.TECHNICAL, status: 'ACTIVE', relatedThreatIds: [3], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 3, vulnerabilityId: 'VUL-003', name: 'Inadequate Backup Procedures', description: 'Lack of regular backup and recovery testing', category: VulnerabilityCategory.PROCESS, status: 'ACTIVE', relatedThreatIds: [4, 5], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 4, vulnerabilityId: 'VUL-004', name: 'Physical Security Gaps', description: 'Inadequate physical access controls to sensitive areas', category: VulnerabilityCategory.PHYSICAL, status: 'ACTIVE', relatedThreatIds: [6], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 5, vulnerabilityId: 'VUL-005', name: 'Lack of Security Awareness', description: 'Employees not trained on security best practices', category: VulnerabilityCategory.HUMAN, status: 'ACTIVE', relatedThreatIds: [7, 8], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 6, vulnerabilityId: 'VUL-006', name: 'Single Vendor Dependency', description: 'Critical services dependent on single supplier', category: VulnerabilityCategory.SUPPLIER, status: 'ACTIVE', relatedThreatIds: [9], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 7, vulnerabilityId: 'VUL-007', name: 'Legacy System Integration', description: 'Outdated systems with limited security capabilities', category: VulnerabilityCategory.TECHNICAL, status: 'INACTIVE', relatedThreatIds: [1], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 8, vulnerabilityId: 'VUL-008', name: 'Insufficient Network Segmentation', description: 'Flat network architecture allowing lateral movement', category: VulnerabilityCategory.TECHNICAL, status: 'ACTIVE', relatedThreatIds: [1, 2], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 9, vulnerabilityId: 'VUL-009', name: 'Missing Encryption', description: 'Sensitive data transmitted or stored without encryption', category: VulnerabilityCategory.TECHNICAL, status: 'ACTIVE', relatedThreatIds: [3, 4], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 10, vulnerabilityId: 'VUL-010', name: 'Inadequate Change Management', description: 'Poor controls over system and configuration changes', category: VulnerabilityCategory.PROCESS, status: 'ACTIVE', relatedThreatIds: [5], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 11, vulnerabilityId: 'VUL-011', name: 'Insufficient Logging', description: 'Lack of comprehensive audit trails and monitoring', category: VulnerabilityCategory.PROCESS, status: 'ACTIVE', relatedThreatIds: [6, 7], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 12, vulnerabilityId: 'VUL-012', name: 'Weak Password Policies', description: 'Inadequate password complexity and rotation requirements', category: VulnerabilityCategory.HUMAN, status: 'ACTIVE', relatedThreatIds: [8], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 13, vulnerabilityId: 'VUL-013', name: 'Unsecured Remote Access', description: 'VPN and remote desktop vulnerabilities', category: VulnerabilityCategory.TECHNICAL, status: 'ACTIVE', relatedThreatIds: [1, 9], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 14, vulnerabilityId: 'VUL-014', name: 'Inadequate Disaster Recovery', description: 'Untested or incomplete DR procedures', category: VulnerabilityCategory.PROCESS, status: 'ACTIVE', relatedThreatIds: [4, 5], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 15, vulnerabilityId: 'VUL-015', name: 'Contractor Access Management', description: 'Poor controls over third-party system access', category: VulnerabilityCategory.SUPPLIER, status: 'INACTIVE', relatedThreatIds: [9], createdAt: '', updatedAt: '', version: 1, isDeleted: false },
];

const categoryColors: Record<VulnerabilityCategory, string> = {
  [VulnerabilityCategory.TECHNICAL]: 'bg-blue-100 text-blue-700 border-blue-200',
  [VulnerabilityCategory.PROCESS]: 'bg-purple-100 text-purple-700 border-purple-200',
  [VulnerabilityCategory.PHYSICAL]: 'bg-orange-100 text-orange-700 border-orange-200',
  [VulnerabilityCategory.HUMAN]: 'bg-green-100 text-green-700 border-green-200',
  [VulnerabilityCategory.SUPPLIER]: 'bg-pink-100 text-pink-700 border-pink-200',
};

export default function VulnerabilitiesPage() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(mockVulnerabilities);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingVulnerability, setEditingVulnerability] = useState<Vulnerability | null>(null);
  const [formData, setFormData] = useState({
    vulnerabilityId: '',
    name: '',
    description: '',
    category: VulnerabilityCategory.TECHNICAL,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const filteredVulnerabilities = vulnerabilities.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         v.vulnerabilityId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || v.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredVulnerabilities.length / ITEMS_PER_PAGE);
  const paginatedVulnerabilities = filteredVulnerabilities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleOpenModal = (vulnerability?: Vulnerability) => {
    if (vulnerability) {
      setEditingVulnerability(vulnerability);
      setFormData({
        vulnerabilityId: vulnerability.vulnerabilityId,
        name: vulnerability.name,
        description: vulnerability.description || '',
        category: vulnerability.category,
        status: vulnerability.status
      });
    } else {
      setEditingVulnerability(null);
      const nextId = `VUL-${String(vulnerabilities.length + 1).padStart(3, '0')}`;
      setFormData({ vulnerabilityId: nextId, name: '', description: '', category: VulnerabilityCategory.TECHNICAL, status: 'ACTIVE' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingVulnerability) {
      setVulnerabilities(prev => prev.map(v => v.id === editingVulnerability.id ? { ...v, ...formData } : v));
    } else {
      const newVulnerability: Vulnerability = {
        id: vulnerabilities.length + 1,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        isDeleted: false
      };
      setVulnerabilities(prev => [...prev, newVulnerability]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this vulnerability?')) {
      setVulnerabilities(prev => prev.filter(v => v.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Vulnerability Library</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage vulnerabilities and their threat relationships</p>
          </div>
          <button onClick={() => handleOpenModal()} className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800">
            <PlusIcon className="h-3.5 w-3.5 mr-1.5" />Add Vulnerability
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search vulnerabilities..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:ring-1 focus:ring-gray-900" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm">
            <option value="ALL">All Categories</option>
            {Object.values(VulnerabilityCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm">
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">ID</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Name</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Category</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Status</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Related Threats</th>
              <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedVulnerabilities.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-xs font-medium text-gray-900">{v.vulnerabilityId}</td>
                <td className="px-3 py-2"><div className="text-xs font-medium text-gray-900">{v.name}</div><div className="text-[10px] text-gray-500">{v.description}</div></td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${categoryColors[v.category]}`}>{v.category}</span></td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${v.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{v.status}</span></td>
                <td className="px-3 py-2 text-xs text-gray-500">{v.relatedThreatIds?.length || 0} threats</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => handleOpenModal(v)} className="p-1 text-gray-400 hover:text-gray-600"><PencilIcon className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(v.id)} className="p-1 text-gray-400 hover:text-red-600 ml-1"><TrashIcon className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVulnerabilities.length > ITEMS_PER_PAGE && (
          <div className="mt-4"><Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredVulnerabilities.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} /></div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">{editingVulnerability ? 'Edit Vulnerability' : 'Add Vulnerability'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-5 w-5" /></button>
            </div>
            <div className="px-4 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Vulnerability ID</label>
                <input type="text" value={formData.vulnerabilityId} onChange={(e) => setFormData({...formData, vulnerabilityId: e.target.value})}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as VulnerabilityCategory})}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm">
                    {Object.values(VulnerabilityCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE'})}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={!formData.name} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800 disabled:opacity-50">
                {editingVulnerability ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

