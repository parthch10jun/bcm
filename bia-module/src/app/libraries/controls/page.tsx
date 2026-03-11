'use client';

import { useState } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Pagination from '@/components/Pagination';
import { Control, ControlType, ControlCategory } from '@/types/risk-assessment';

const ITEMS_PER_PAGE = 10;

const mockControls: Control[] = [
  { id: 1, controlId: 'CTL-001', name: 'Multi-Factor Authentication', description: 'Require MFA for all system access', controlType: ControlType.PREVENTIVE, controlCategory: ControlCategory.TECHNICAL, effectivenessRating: 5, controlOwner: 'IT Security', controlOwnerEmail: 'it.security@company.com', status: 'ACTIVE', frequency: 'CONTINUOUS', lastTestDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 5, implementationDate: '2023-01-15', cost: 25000, effectiveness: 'EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 2, controlId: 'CTL-002', name: 'Security Monitoring', description: 'Real-time security event monitoring and alerting', controlType: ControlType.DETECTIVE, controlCategory: ControlCategory.TECHNICAL, effectivenessRating: 4, controlOwner: 'SOC Team', controlOwnerEmail: 'soc@company.com', status: 'ACTIVE', frequency: 'CONTINUOUS', lastTestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() + 83 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 6, implementationDate: '2023-03-20', cost: 75000, effectiveness: 'EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 3, controlId: 'CTL-003', name: 'Incident Response Plan', description: 'Documented procedures for incident handling', controlType: ControlType.CORRECTIVE, controlCategory: ControlCategory.ADMINISTRATIVE, effectivenessRating: 4, controlOwner: 'IT Operations', controlOwnerEmail: 'it.ops@company.com', status: 'UNDER_REVIEW', frequency: 'QUARTERLY', lastTestDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 10, implementationDate: '2022-08-01', cost: 30000, effectiveness: 'NOT_TESTED', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 4, controlId: 'CTL-004', name: 'Access Control Policy', description: 'Role-based access control policies', controlType: ControlType.PREVENTIVE, controlCategory: ControlCategory.ADMINISTRATIVE, effectivenessRating: 4, controlOwner: 'IT Security', controlOwnerEmail: 'it.security@company.com', status: 'ACTIVE', frequency: 'MONTHLY', lastTestDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 3, implementationDate: '2022-12-15', cost: 10000, effectiveness: 'EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 5, controlId: 'CTL-005', name: 'Backup & Recovery', description: 'Regular backup and tested recovery procedures', controlType: ControlType.CORRECTIVE, controlCategory: ControlCategory.OPERATIONAL, effectivenessRating: 5, controlOwner: 'IT Operations', controlOwnerEmail: 'it.ops@company.com', status: 'ACTIVE', frequency: 'DAILY', lastTestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 8, implementationDate: '2022-11-01', cost: 50000, effectiveness: 'EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 6, controlId: 'CTL-006', name: 'Physical Access Controls', description: 'Badge access and security guards', controlType: ControlType.PREVENTIVE, controlCategory: ControlCategory.PHYSICAL, effectivenessRating: 4, controlOwner: 'Facilities', controlOwnerEmail: 'facilities@company.com', status: 'ACTIVE', frequency: 'CONTINUOUS', lastTestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 2, implementationDate: '2021-05-20', cost: 40000, effectiveness: 'EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 7, controlId: 'CTL-007', name: 'Security Awareness Training', description: 'Annual security training for all employees', controlType: ControlType.DIRECTIVE, controlCategory: ControlCategory.ADMINISTRATIVE, effectivenessRating: 3, controlOwner: 'HR', controlOwnerEmail: 'hr@company.com', status: 'ACTIVE', frequency: 'ANNUALLY', lastTestDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 12, implementationDate: '2022-06-01', cost: 15000, effectiveness: 'PARTIALLY_EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 8, controlId: 'CTL-008', name: 'Vulnerability Scanning', description: 'Weekly automated vulnerability scans', controlType: ControlType.DETECTIVE, controlCategory: ControlCategory.TECHNICAL, effectivenessRating: 4, controlOwner: 'IT Security', controlOwnerEmail: 'it.security@company.com', status: 'ACTIVE', frequency: 'WEEKLY', lastTestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 7, implementationDate: '2023-02-10', cost: 20000, effectiveness: 'EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 9, controlId: 'CTL-009', name: 'Data Encryption', description: 'Encryption of data at rest and in transit', controlType: ControlType.PREVENTIVE, controlCategory: ControlCategory.TECHNICAL, effectivenessRating: 5, controlOwner: 'IT Security', controlOwnerEmail: 'it.security@company.com', status: 'ACTIVE', frequency: 'CONTINUOUS', lastTestDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 4, implementationDate: '2023-04-01', cost: 35000, effectiveness: 'EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 10, controlId: 'CTL-010', name: 'Network Segmentation', description: 'Logical separation of network zones', controlType: ControlType.PREVENTIVE, controlCategory: ControlCategory.TECHNICAL, effectivenessRating: 4, controlOwner: 'Network Team', controlOwnerEmail: 'network@company.com', status: 'ACTIVE', frequency: 'QUARTERLY', lastTestDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 5, implementationDate: '2022-09-15', cost: 45000, effectiveness: 'EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 11, controlId: 'CTL-011', name: 'Vendor Risk Assessment', description: 'Third-party vendor security evaluation', controlType: ControlType.PREVENTIVE, controlCategory: ControlCategory.MANAGERIAL, effectivenessRating: 3, controlOwner: 'Procurement', controlOwnerEmail: 'procurement@company.com', status: 'ACTIVE', frequency: 'ANNUALLY', lastTestDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() + 185 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 6, implementationDate: '2023-01-01', cost: 20000, effectiveness: 'PARTIALLY_EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 12, controlId: 'CTL-012', name: 'Business Continuity Plan', description: 'Documented BCP with regular testing', controlType: ControlType.CORRECTIVE, controlCategory: ControlCategory.OPERATIONAL, effectivenessRating: 4, controlOwner: 'BCM Team', controlOwnerEmail: 'bcm@company.com', status: 'ACTIVE', frequency: 'QUARTERLY', lastTestDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 15, implementationDate: '2022-03-01', cost: 60000, effectiveness: 'EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 13, controlId: 'CTL-013', name: 'Patch Management', description: 'Systematic patching of systems and applications', controlType: ControlType.PREVENTIVE, controlCategory: ControlCategory.OPERATIONAL, effectivenessRating: 4, controlOwner: 'IT Operations', controlOwnerEmail: 'it.ops@company.com', status: 'ACTIVE', frequency: 'MONTHLY', lastTestDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 8, implementationDate: '2022-07-01', cost: 25000, effectiveness: 'EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 14, controlId: 'CTL-014', name: 'Log Management', description: 'Centralized logging and retention', controlType: ControlType.DETECTIVE, controlCategory: ControlCategory.TECHNICAL, effectivenessRating: 4, controlOwner: 'SOC Team', controlOwnerEmail: 'soc@company.com', status: 'ACTIVE', frequency: 'CONTINUOUS', lastTestDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() + 76 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 9, implementationDate: '2023-05-01', cost: 40000, effectiveness: 'EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
  { id: 15, controlId: 'CTL-015', name: 'Change Management Process', description: 'Formal change approval and documentation', controlType: ControlType.PREVENTIVE, controlCategory: ControlCategory.ADMINISTRATIVE, effectivenessRating: 3, controlOwner: 'IT Governance', controlOwnerEmail: 'it.governance@company.com', status: 'UNDER_REVIEW', frequency: 'CONTINUOUS', lastTestDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(), nextTestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), linkedRisks: 7, implementationDate: '2022-04-01', cost: 15000, effectiveness: 'PARTIALLY_EFFECTIVE', createdAt: '', updatedAt: '', version: 1, isDeleted: false },
];

const typeColors: Record<ControlType, string> = {
  [ControlType.PREVENTIVE]: 'bg-blue-100 text-blue-700 border-blue-200',
  [ControlType.DETECTIVE]: 'bg-amber-100 text-amber-700 border-amber-200',
  [ControlType.CORRECTIVE]: 'bg-green-100 text-green-700 border-green-200',
  [ControlType.DIRECTIVE]: 'bg-purple-100 text-purple-700 border-purple-200',
};

const categoryColors: Record<ControlCategory, string> = {
  [ControlCategory.OPERATIONAL]: 'bg-purple-100 text-purple-700 border-purple-200',
  [ControlCategory.TECHNICAL]: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  [ControlCategory.ADMINISTRATIVE]: 'bg-orange-100 text-orange-700 border-orange-200',
  [ControlCategory.PHYSICAL]: 'bg-pink-100 text-pink-700 border-pink-200',
  [ControlCategory.MANAGERIAL]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const effectivenessLabels = ['', 'Very Low', 'Low', 'Medium', 'High', 'Very High'];

export default function ControlsPage() {
  const [controls, setControls] = useState<Control[]>(mockControls);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [effectivenessFilter, setEffectivenessFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingControl, setEditingControl] = useState<Control | null>(null);
  const [formData, setFormData] = useState({
    controlId: '', name: '', description: '', controlType: ControlType.PREVENTIVE, controlCategory: ControlCategory.TECHNICAL, effectivenessRating: 3, controlOwner: '', controlOwnerEmail: '', status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'UNDER_REVIEW', frequency: 'MONTHLY' as 'CONTINUOUS' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY', lastTestDate: '', nextTestDate: '', linkedRisks: 0, implementationDate: '', cost: 0, effectiveness: 'EFFECTIVE' as 'EFFECTIVE' | 'PARTIALLY_EFFECTIVE' | 'INEFFECTIVE' | 'NOT_TESTED'
  });

  const filteredControls = controls.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.controlId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || c.controlType === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.controlCategory === categoryFilter;
    const matchesEffectiveness = effectivenessFilter === 'ALL' || c.effectiveness === effectivenessFilter;
    return matchesSearch && matchesType && matchesCategory && matchesEffectiveness;
  });

  const totalPages = Math.ceil(filteredControls.length / ITEMS_PER_PAGE);
  const paginatedControls = filteredControls.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleOpenModal = (control?: Control) => {
    if (control) {
      setEditingControl(control);
      setFormData({
        controlId: control.controlId,
        name: control.name,
        description: control.description || '',
        controlType: control.controlType,
        controlCategory: control.controlCategory,
        effectivenessRating: control.effectivenessRating,
        controlOwner: control.controlOwner || '',
        controlOwnerEmail: control.controlOwnerEmail || '',
        status: control.status,
        frequency: control.frequency || 'MONTHLY',
        lastTestDate: control.lastTestDate || '',
        nextTestDate: control.nextTestDate || '',
        linkedRisks: control.linkedRisks || 0,
        implementationDate: control.implementationDate || '',
        cost: control.cost || 0,
        effectiveness: control.effectiveness || 'NOT_TESTED'
      });
    } else {
      setEditingControl(null);
      const nextId = `CTL-${String(controls.length + 1).padStart(3, '0')}`;
      setFormData({
        controlId: nextId,
        name: '',
        description: '',
        controlType: ControlType.PREVENTIVE,
        controlCategory: ControlCategory.TECHNICAL,
        effectivenessRating: 3,
        controlOwner: '',
        controlOwnerEmail: '',
        status: 'ACTIVE',
        frequency: 'MONTHLY',
        lastTestDate: '',
        nextTestDate: '',
        linkedRisks: 0,
        implementationDate: '',
        cost: 0,
        effectiveness: 'NOT_TESTED'
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (editingControl) {
      setControls(prev => prev.map(c => c.id === editingControl.id ? { ...c, ...formData } : c));
    } else {
      const newControl: Control = { id: controls.length + 1, ...formData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1, isDeleted: false };
      setControls(prev => [...prev, newControl]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this control?')) {
      setControls(prev => prev.filter(c => c.id !== id));
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isOverdue = (nextTestDate?: string) => {
    if (!nextTestDate) return false;
    return new Date(nextTestDate) < new Date();
  };

  const getEffectivenessColor = (effectiveness?: string) => {
    switch (effectiveness) {
      case 'EFFECTIVE':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'PARTIALLY_EFFECTIVE':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'INEFFECTIVE':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'NOT_TESTED':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-semibold text-gray-900">Control Library</h1><p className="text-xs text-gray-500 mt-0.5">Manage preventive, detective, and corrective controls</p></div>
          <button onClick={() => handleOpenModal()} className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800">
            <PlusIcon className="h-3.5 w-3.5 mr-1.5" />Add Control
          </button>
        </div>
      </div>

      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search controls..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm">
            <option value="ALL">All Types</option>{Object.values(ControlType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm">
            <option value="ALL">All Categories</option>{Object.values(ControlCategory).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={effectivenessFilter} onChange={(e) => setEffectivenessFilter(e.target.value)} className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm">
            <option value="ALL">All Effectiveness</option>
            <option value="EFFECTIVE">Effective</option>
            <option value="PARTIALLY_EFFECTIVE">Partially Effective</option>
            <option value="INEFFECTIVE">Ineffective</option>
            <option value="NOT_TESTED">Not Tested</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">ID</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Name</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Type</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Category</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Effectiveness</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Owner</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Next Test</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Linked Risks</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase">Status</th>
              <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedControls.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-xs font-medium text-gray-900">{c.controlId}</td>
                <td className="px-3 py-2"><div className="text-xs font-medium text-gray-900">{c.name}</div><div className="text-[10px] text-gray-500 truncate max-w-xs">{c.description}</div></td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${typeColors[c.controlType]}`}>{c.controlType}</span></td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${categoryColors[c.controlCategory]}`}>{c.controlCategory}</span></td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${getEffectivenessColor(c.effectiveness)}`}>
                    {c.effectiveness?.replace('_', ' ') || '-'}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-gray-700">{c.controlOwner || '-'}</td>
                <td className="px-3 py-2 text-xs">
                  <span className={isOverdue(c.nextTestDate) ? 'text-red-600 font-medium' : 'text-gray-600'}>
                    {formatDate(c.nextTestDate)}
                    {isOverdue(c.nextTestDate) && ' (Overdue)'}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    {c.linkedRisks || 0}
                  </span>
                </td>
                <td className="px-3 py-2"><span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border-green-200' : c.status === 'UNDER_REVIEW' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{c.status.replace('_', ' ')}</span></td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => handleOpenModal(c)} className="p-1 text-gray-400 hover:text-gray-600"><PencilIcon className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-1 text-gray-400 hover:text-red-600 ml-1"><TrashIcon className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredControls.length > ITEMS_PER_PAGE && <div className="mt-4"><Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredControls.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setCurrentPage} /></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">{editingControl ? 'Edit Control' : 'Add Control'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-5 w-5" /></button>
            </div>
            <div className="px-4 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Control ID</label><input type="text" value={formData.controlId} onChange={(e) => setFormData({...formData, controlId: e.target.value})} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm" /></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Control Owner</label><input type="text" value={formData.controlOwner} onChange={(e) => setFormData({...formData, controlOwner: e.target.value})} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm" /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm" /></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Description</label><textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Control Type</label><select value={formData.controlType} onChange={(e) => setFormData({...formData, controlType: e.target.value as ControlType})} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm">{Object.values(ControlType).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Control Category</label><select value={formData.controlCategory} onChange={(e) => setFormData({...formData, controlCategory: e.target.value as ControlCategory})} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm">{Object.values(ControlCategory).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Effectiveness Rating (1-5)</label>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(i => (<button key={i} type="button" onClick={() => setFormData({...formData, effectivenessRating: i})} className={`w-8 h-8 rounded-full border-2 text-xs font-medium ${formData.effectivenessRating >= i ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>{i}</button>))}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">{effectivenessLabels[formData.effectivenessRating]}</p>
                </div>
                <div><label className="block text-xs font-medium text-gray-700 mb-1">Status</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE'})} className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={!formData.name} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800 disabled:opacity-50">{editingControl ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

