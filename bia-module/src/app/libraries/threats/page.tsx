'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Threat,
  ThreatType,
  EnablerType,
  CreateThreatRequest
} from '@/types/risk-assessment';
import {
  threatService,
  threatTypeService,
  enablerTypeService
} from '@/services/riskAssessmentService';
import Pagination from '@/components/Pagination';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 10;

export default function ThreatLibraryPage() {
  const router = useRouter();
  const [threats, setThreats] = useState<Threat[]>([]);
  const [threatTypes, setThreatTypes] = useState<ThreatType[]>([]);
  const [enablerTypes, setEnablerTypes] = useState<EnablerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThreatType, setSelectedThreatType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Create/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingThreat, setEditingThreat] = useState<Threat | null>(null);
  const [formData, setFormData] = useState<CreateThreatRequest>({
    name: '',
    description: '',
    threatTypeId: 0,
    displayOrder: 0,
    isActive: true,
    enablerTypeIds: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [threatsData, typesData, enablersData] = await Promise.all([
        threatService.getAll(),
        threatTypeService.getAll(),
        enablerTypeService.getAll()
      ]);
      setThreats(threatsData);
      setThreatTypes(typesData);
      setEnablerTypes(enablersData);
      setError(null);
    } catch (err) {
      console.error('Error loading threats:', err);
      setError('Failed to load threats');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this threat?')) {
      return;
    }

    try {
      await threatService.delete(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting threat:', err);
      alert('Failed to delete threat');
    }
  };

  const handleOpenModal = (threat?: Threat) => {
    if (threat) {
      setEditingThreat(threat);
      setFormData({
        name: threat.name,
        description: threat.description || '',
        threatTypeId: threat.threatType?.id || 0,
        displayOrder: threat.displayOrder || 0,
        isActive: !threat.isDeleted,
        enablerTypeIds: threat.threatEnablerTypes?.map(tet => tet.enablerType?.id || 0).filter(id => id > 0) || []
      });
    } else {
      setEditingThreat(null);
      setFormData({
        name: '',
        description: '',
        threatTypeId: 0,
        displayOrder: 0,
        isActive: true,
        enablerTypeIds: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingThreat(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingThreat) {
        await threatService.update(editingThreat.id, formData);
      } else {
        await threatService.create(formData);
      }
      await loadData();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving threat:', err);
      alert('Failed to save threat');
    }
  };

  const handleEnablerTypeToggle = (enablerTypeId: number) => {
    setFormData(prev => ({
      ...prev,
      enablerTypeIds: prev.enablerTypeIds.includes(enablerTypeId)
        ? prev.enablerTypeIds.filter(id => id !== enablerTypeId)
        : [...prev.enablerTypeIds, enablerTypeId]
    }));
  };

  // Filter threats
  const filteredThreats = threats.filter(threat => {
    const matchesSearch = threat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      threat.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedThreatType || threat.threatType?.id?.toString() === selectedThreatType;
    const isActive = !threat.isDeleted;
    const matchesStatus = !selectedStatus ||
      (selectedStatus === 'active' && isActive) ||
      (selectedStatus === 'inactive' && !isActive);

    return matchesSearch && matchesType && matchesStatus;
  });

  // Paginate
  const totalPages = Math.ceil(filteredThreats.length / ITEMS_PER_PAGE);
  const paginatedThreats = filteredThreats.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getThreatTypeName = (threatType?: ThreatType) => {
    return threatType?.name || 'N/A';
  };

  const getEnablerTypeNames = (threat: Threat) => {
    if (!threat.threatEnablerTypes || threat.threatEnablerTypes.length === 0) {
      return 'None';
    }
    return threat.threatEnablerTypes
      .map(tet => tet.enablerType?.name || 'Unknown')
      .join(', ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading threats...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Threat Library</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage threats and their impact on BETH3V enablers
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
          >
            <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
            Add Threat
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 px-6 py-3 bg-gray-50">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search threats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          {/* Threat Type Filter */}
          <select
            value={selectedThreatType}
            onChange={(e) => setSelectedThreatType(e.target.value)}
            className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          >
            <option value="">All Types</option>
            {threatTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {paginatedThreats.length === 0 ? (
          <div className="text-center py-12">
            <ShieldExclamationIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No threats found</h3>
            <p className="mt-1 text-xs text-gray-500">
              Get started by creating a new threat.
            </p>
            <div className="mt-6">
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
              >
                <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                Add Threat
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Threat Name
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Affected Enablers
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedThreats.map((threat) => (
                  <tr key={threat.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <div className="text-xs font-medium text-gray-900">{threat.name}</div>
                      {threat.description && (
                        <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                          {threat.description}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500">
                      {getThreatTypeName(threat.threatType)}
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500">
                      <div className="line-clamp-2">{getEnablerTypeNames(threat)}</div>
                    </td>
                    <td className="px-3 py-2">
                      {!threat.isDeleted ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-green-100 text-green-700 border border-green-200">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right text-xs">
                      <button
                        onClick={() => handleOpenModal(threat)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(threat.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredThreats.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingThreat ? 'Edit Threat' : 'Add New Threat'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Threat Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Threat Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., Earthquake, Cyber Attack, Power Outage"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Describe the threat and its potential impact..."
                  />
                </div>

                {/* Threat Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Threat Type *
                  </label>
                  <select
                    required
                    value={formData.threatTypeId}
                    onChange={(e) => setFormData({ ...formData, threatTypeId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="">Select a type...</option>
                    {threatTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>

                {/* Affected Enabler Types (BETH3V) */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Affected Enablers (BETH3V) *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {enablerTypes.map(enabler => (
                      <label
                        key={enabler.id}
                        className="flex items-center p-2 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.enablerTypeIds.includes(enabler.id)}
                          onChange={() => handleEnablerTypeToggle(enabler.id)}
                          className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                        />
                        <span className="ml-2 text-xs text-gray-700">{enabler.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Select which types of enablers this threat can impact
                  </p>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="0"
                  />
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <span className="ml-2 text-xs text-gray-700">Active</span>
                  </label>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Only active threats will be available for risk assessments
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800"
                >
                  {editingThreat ? 'Update Threat' : 'Create Threat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

