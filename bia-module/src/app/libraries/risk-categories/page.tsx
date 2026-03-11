'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiskCategory,
  Threat,
  RiskCategoryCode
} from '@/types/risk-assessment';
import {
  riskCategoryService,
  threatService
} from '@/services/riskAssessmentService';
import Pagination from '@/components/Pagination';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 10;

export default function RiskCategoriesPage() {
  const router = useRouter();
  const [riskCategories, setRiskCategories] = useState<RiskCategory[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showThreatModal, setShowThreatModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<RiskCategory | null>(null);
  const [selectedCategoryForThreats, setSelectedCategoryForThreats] = useState<RiskCategory | null>(null);
  const [selectedThreatIds, setSelectedThreatIds] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    code: '' as RiskCategoryCode,
    name: '',
    description: '',
    displayOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching risk categories and threats...');
      const [categoriesData, threatsData] = await Promise.all([
        riskCategoryService.getAllRiskCategories(),
        threatService.getAll()
      ]);
      console.log('Risk categories received:', categoriesData);
      console.log('Threats received:', threatsData);
      setRiskCategories(categoriesData);
      setThreats(threatsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(`Error fetching data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category?: RiskCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        code: category.code,
        name: category.name,
        description: category.description || '',
        displayOrder: category.displayOrder || 0,
        isActive: category.isActive
      });
    } else {
      setEditingCategory(null);
      setFormData({
        code: '' as RiskCategoryCode,
        name: '',
        description: '',
        displayOrder: 0,
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleOpenThreatModal = (category: RiskCategory) => {
    setSelectedCategoryForThreats(category);
    // Extract threat IDs from riskCategoryThreats
    const threatIds = category.riskCategoryThreats?.map(rct => rct.threat?.id || 0).filter(id => id > 0) || [];
    setSelectedThreatIds(threatIds);
    setShowThreatModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await riskCategoryService.updateRiskCategory(editingCategory.id, formData);
      } else {
        await riskCategoryService.createRiskCategory(formData);
      }
      await fetchData();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving risk category:', error);
      alert('Failed to save risk category');
    }
  };

  const handleAssignThreats = async () => {
    if (!selectedCategoryForThreats) return;
    
    try {
      await riskCategoryService.assignThreats(selectedCategoryForThreats.id, selectedThreatIds);
      await fetchData();
      setShowThreatModal(false);
    } catch (error) {
      console.error('Error assigning threats:', error);
      alert('Failed to assign threats');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this risk category?')) return;
    
    try {
      await riskCategoryService.deleteRiskCategory(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting risk category:', error);
      alert('Failed to delete risk category');
    }
  };

  const toggleThreatSelection = (threatId: number) => {
    setSelectedThreatIds(prev =>
      prev.includes(threatId)
        ? prev.filter(id => id !== threatId)
        : [...prev, threatId]
    );
  };

  // Filter categories
  const filteredCategories = riskCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus ||
      (selectedStatus === 'active' && category.isActive) ||
      (selectedStatus === 'inactive' && !category.isActive);

    return matchesSearch && matchesStatus;
  });

  // Debug logging
  console.log('Risk categories state:', riskCategories);
  console.log('Filtered categories:', filteredCategories);
  console.log('Search term:', searchTerm);
  console.log('Selected status:', selectedStatus);

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getAssignedThreatsCount = (category: RiskCategory) => {
    return category.riskCategoryThreats?.length || 0;
  };

  const riskCategoryCodes: RiskCategoryCode[] = [
    RiskCategoryCode.LOCATION,
    RiskCategoryCode.ORG_UNIT,
    RiskCategoryCode.PROCESS,
    RiskCategoryCode.SUPPLIER,
    RiskCategoryCode.APPLICATION,
    RiskCategoryCode.ASSET,
    RiskCategoryCode.PROJECT,
    RiskCategoryCode.PEOPLE,
    RiskCategoryCode.DATA
  ];

  const getRiskCategoryCodeLabel = (code: RiskCategoryCode) => {
    const labels: Record<RiskCategoryCode, string> = {
      LOCATION: 'Location Level',
      ORG_UNIT: 'Organizational Unit',
      PROCESS: 'Process',
      SUPPLIER: 'Supplier/Vendor',
      APPLICATION: 'Application/Software',
      ASSET: 'Asset',
      PROJECT: 'Project',
      PEOPLE: 'People/Personnel',
      DATA: 'Data Assets'
    };
    return labels[code] || code;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">Loading risk categories...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Risk Category Library</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Define assessment contexts and assign applicable threats
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
          >
            <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
            Add Risk Category
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search risk categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Assigned Threats
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCategories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <div className="text-xs font-medium text-gray-900">{category.name}</div>
                  <div className="text-[10px] text-gray-500 line-clamp-1">{category.description}</div>
                </td>
                <td className="px-3 py-2 text-xs text-gray-500">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {category.code}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => handleOpenThreatModal(category)}
                    className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                  >
                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                    {getAssignedThreatsCount(category)} Threats
                  </button>
                </td>
                <td className="px-3 py-2">
                  {category.isActive ? (
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
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <PencilIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No risk categories found</h3>
            <p className="mt-1 text-xs text-gray-500">
              {searchTerm || selectedStatus ? 'Try adjusting your filters' : 'Get started by creating a new risk category'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredCategories.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl mx-4">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  {editingCategory ? 'Edit Risk Category' : 'Add Risk Category'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Category Code *
                  </label>
                  <select
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value as RiskCategoryCode })}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    required
                    disabled={!!editingCategory}
                  >
                    <option value="">Select a code</option>
                    {riskCategoryCodes.map(code => (
                      <option key={code} value={code}>
                        {getRiskCategoryCodeLabel(code)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-3.5 w-3.5 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-xs text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-200 px-6 py-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Threats Modal */}
      {showThreatModal && selectedCategoryForThreats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Assign Threats to {selectedCategoryForThreats.name}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Select which threats are applicable for this risk category
                  </p>
                </div>
                <button
                  onClick={() => setShowThreatModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto px-6 py-4">
              <div className="space-y-2">
                {threats.map((threat) => (
                  <div
                    key={threat.id}
                    className={`border rounded-sm p-3 cursor-pointer transition-colors ${
                      selectedThreatIds.includes(threat.id)
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleThreatSelection(threat.id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedThreatIds.includes(threat.id)}
                        onChange={() => toggleThreatSelection(threat.id)}
                        className="mt-0.5 h-3.5 w-3.5 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-900">{threat.name}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {threat.threatType?.name || 'N/A'}
                          </span>
                        </div>
                        {threat.description && (
                          <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                            {threat.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {selectedThreatIds.length} threat{selectedThreatIds.length !== 1 ? 's' : ''} selected
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowThreatModal(false)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignThreats}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800"
                >
                  Assign Threats
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


