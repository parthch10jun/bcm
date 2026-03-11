'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Asset, AssetType, AssetCategory, AssetStatus, CriticalityTier, getCriticalityTierName, getAssetCriticalityName, getAssetCriticalityColor, formatRecoveryTime } from '@/types/asset';
import { assetService } from '@/services/assetService';
import Pagination from '@/components/Pagination';
import { PageHeaderActions } from '@/components/PageHeaderActions';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ServerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 10;

export default function AssetLibraryPage() {
  const router = useRouter();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [assetCategories, setAssetCategories] = useState<AssetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('');
  const [selectedAssetCriticality, setSelectedAssetCriticality] = useState<string>('');
  const [rtoMin, setRtoMin] = useState<string>('');
  const [rtoMax, setRtoMax] = useState<string>('');

  // Bulk upload state
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    successCount: number;
    errorCount: number;
    messages: string[];
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [assetsData, typesData, categoriesData] = await Promise.all([
        assetService.getAll(),
        assetService.getTypes(),
        assetService.getCategories()
      ]);
      setAssets(assetsData);
      setAssetTypes(typesData);
      setAssetCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error('Error loading assets:', err);
      setError('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) {
      return;
    }

    try {
      await assetService.delete(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting asset:', err);
      alert('Failed to delete asset');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/assets/bulk-upload/template');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'asset_bulk_upload_template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading template:', err);
      alert('Failed to download template');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
      setUploadResult(null);
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', uploadFile);

      const response = await fetch('http://localhost:8080/api/assets/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setUploadResult(result);

      if (result.successCount > 0) {
        await loadData();
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const closeBulkUploadModal = () => {
    setShowBulkUploadModal(false);
    setUploadFile(null);
    setUploadResult(null);
  };

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    if (searchTerm && !asset.assetName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedType && asset.assetTypeId?.toString() !== selectedType) {
      return false;
    }
    if (selectedCategory && asset.categoryId?.toString() !== selectedCategory) {
      return false;
    }
    if (selectedStatus && asset.status !== selectedStatus) {
      return false;
    }
    if (selectedCriticality && asset.inheritedCriticality !== selectedCriticality) {
      return false;
    }
    if (selectedAssetCriticality && asset.assetCriticality !== selectedAssetCriticality) {
      return false;
    }
    if (rtoMin && asset.rtoHours !== undefined && asset.rtoHours < parseInt(rtoMin)) {
      return false;
    }
    if (rtoMax && asset.rtoHours !== undefined && asset.rtoHours > parseInt(rtoMax)) {
      return false;
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, selectedCategory, selectedStatus, selectedCriticality, selectedAssetCriticality, rtoMin, rtoMax]);

  // Calculate insights
  const criticalAssets = assets.filter(a => a.isCritical).length;
  const assetsWithProcesses = assets.filter(a => a.processCount > 0).length;
  const assetsWithDependencies = assets.filter(a => a.dependencyCount > 0).length;
  const orphanedAssets = assets.filter(a => a.processCount === 0).length;
  const assetsWithRTO = assets.filter(a => a.rtoHours !== undefined && a.rtoHours !== null).length;
  const criticalRTOAssets = assets.filter(a => a.assetCriticality === 'CRITICAL').length;

  const getCriticalityBadgeColor = (tier: CriticalityTier) => {
    switch (tier) {
      case CriticalityTier.TIER_1:
        return 'bg-red-50 text-red-700 border-red-200';
      case CriticalityTier.TIER_2:
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case CriticalityTier.TIER_3:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case CriticalityTier.TIER_4:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case CriticalityTier.TIER_5:
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: AssetStatus) => {
    switch (status) {
      case AssetStatus.ACTIVE:
        return 'bg-green-50 text-green-700 border-green-200';
      case AssetStatus.INACTIVE:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case AssetStatus.RETIRED:
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case AssetStatus.MAINTENANCE:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getAssetCriticalityBadgeColor = (criticality: string | undefined) => {
    switch (criticality) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'LOW':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Asset Library</h1>
            <p className="mt-0.5 text-xs text-gray-500">Buildings, equipment, technology, and infrastructure inventory</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBulkUploadModal(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <ArrowUpTrayIcon className="h-3.5 w-3.5 mr-1" />
              Bulk Upload
            </button>
            <button
              onClick={() => router.push('/libraries/assets/new')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <PlusIcon className="h-3.5 w-3.5 mr-1" />
              Add Asset
            </button>
            <PageHeaderActions />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {/* Insight Cards */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {/* Critical Assets */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Critical Assets</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{criticalAssets}</p>
                  <span className="ml-1 text-xs text-gray-500">assets</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Tier 1 (Mission Critical)</span>
                    <span className="font-medium text-red-600">{assets.filter(a => a.inheritedCriticality === CriticalityTier.TIER_1).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Tier 2 (Critical)</span>
                    <span className="font-medium text-orange-600">{assets.filter(a => a.inheritedCriticality === CriticalityTier.TIER_2).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Tier 3+ (Lower Priority)</span>
                    <span className="font-medium text-gray-600">{assets.filter(a => !a.isCritical).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Process Support */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Process Support</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{assetsWithProcesses}</p>
                  <span className="ml-1 text-xs text-gray-500">linked</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Supporting Processes</span>
                    <span className="font-medium text-gray-900">{assetsWithProcesses}/{assets.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Orphaned Assets</span>
                    <span className="font-medium text-amber-600">{orphanedAssets}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Avg Processes/Asset</span>
                    <span className="font-medium text-gray-900">
                      {assets.length > 0 ? (assets.reduce((sum, a) => sum + a.processCount, 0) / assets.length).toFixed(1) : '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dependencies */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Dependencies</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{assetsWithDependencies}</p>
                  <span className="ml-1 text-xs text-gray-500">assets</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">With Dependencies</span>
                    <span className="font-medium text-gray-900">{assetsWithDependencies}/{assets.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Total Dependencies</span>
                    <span className="font-medium text-gray-900">{assets.reduce((sum, a) => sum + a.dependencyCount, 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Avg Dependencies</span>
                    <span className="font-medium text-gray-900">
                      {assets.length > 0 ? (assets.reduce((sum, a) => sum + a.dependencyCount, 0) / assets.length).toFixed(1) : '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Overview</p>
                <div className="mt-2 flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{assets.length}</p>
                  <span className="ml-1 text-xs text-gray-500">total</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Active</span>
                    <span className="font-medium text-green-600">{assets.filter(a => a.status === AssetStatus.ACTIVE).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Inactive/Maintenance</span>
                    <span className="font-medium text-yellow-600">{assets.filter(a => a.status === AssetStatus.INACTIVE || a.status === AssetStatus.MAINTENANCE).length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-600">Retired</span>
                    <span className="font-medium text-gray-600">{assets.filter(a => a.status === AssetStatus.RETIRED).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-sm p-3 mb-3">
          <div className="grid grid-cols-6 gap-3 mb-2">
            <div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">All Types</option>
                {assetTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.typeName}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">All Categories</option>
                {assetCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.categoryName}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">All Statuses</option>
                <option value={AssetStatus.ACTIVE}>Active</option>
                <option value={AssetStatus.INACTIVE}>Inactive</option>
                <option value={AssetStatus.MAINTENANCE}>Maintenance</option>
                <option value={AssetStatus.RETIRED}>Retired</option>
              </select>
            </div>
            <div>
              <select
                value={selectedCriticality}
                onChange={(e) => setSelectedCriticality(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">Inherited Criticality</option>
                <option value={CriticalityTier.TIER_1}>Tier 1 - Mission Critical</option>
                <option value={CriticalityTier.TIER_2}>Tier 2 - Critical</option>
                <option value={CriticalityTier.TIER_3}>Tier 3 - Important</option>
                <option value={CriticalityTier.TIER_4}>Tier 4 - Standard</option>
                <option value={CriticalityTier.TIER_5}>Tier 5 - Non-Critical</option>
              </select>
            </div>
            <div>
              <select
                value={selectedAssetCriticality}
                onChange={(e) => setSelectedAssetCriticality(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value="">Asset Criticality</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-2 flex items-center gap-2">
              <span className="text-xs text-gray-500">RTO Range:</span>
              <input
                type="number"
                placeholder="Min hrs"
                value={rtoMin}
                onChange={(e) => setRtoMin(e.target.value)}
                className="w-20 px-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
              <span className="text-xs text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max hrs"
                value={rtoMax}
                onChange={(e) => setRtoMax(e.target.value)}
                className="w-20 px-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
            <div className="col-span-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('');
                  setSelectedCategory('');
                  setSelectedStatus('');
                  setSelectedCriticality('');
                  setSelectedAssetCriticality('');
                  setRtoMin('');
                  setRtoMax('');
                }}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear all filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ServerIcon className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No assets found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Asset Criticality</th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">RTO</th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">RPO</th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Inherited Criticality</th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Supports</th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedAssets.map((asset) => (
                    <tr
                      key={asset.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/libraries/assets/${asset.id}`)}
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-xs font-medium text-gray-900">{asset.assetName}</div>
                        {asset.vendor && <div className="text-[10px] text-gray-500">{asset.vendor} {asset.model}</div>}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{asset.assetTypeName || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {asset.assetCriticality ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getAssetCriticalityBadgeColor(asset.assetCriticality)}`}>
                            {getAssetCriticalityName(asset.assetCriticality)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                        {formatRecoveryTime(asset.rtoHours)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                        {formatRecoveryTime(asset.rpoHours)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getCriticalityBadgeColor(asset.inheritedCriticality)}`}>
                          {getCriticalityTierName(asset.inheritedCriticality)}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                        {asset.processCount > 0 ? (
                          <span className="font-medium">{asset.processCount} process{asset.processCount !== 1 ? 'es' : ''}</span>
                        ) : (
                          <span className="text-amber-600">No processes</span>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusBadgeColor(asset.status)}`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => router.push(`/libraries/assets/${asset.id}/edit`)}
                          className="text-gray-600 hover:text-gray-900 mr-3"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4 inline" />
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
        {!loading && !error && filteredAssets.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAssets.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Bulk Upload Assets</h2>
              <button
                onClick={closeBulkUploadModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* Instructions */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-sm">
                <p className="text-xs text-blue-800 font-medium mb-2">Instructions:</p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Download the CSV template using the button below</li>
                  <li>Fill in the asset information following the template format</li>
                  <li>Upload the completed CSV file</li>
                  <li>Review the results and fix any errors if needed</li>
                </ol>
              </div>

              {/* Download Template Button */}
              <div className="mb-4">
                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download CSV Template
                </button>
              </div>

              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-sm cursor-pointer bg-gray-50 focus:outline-none"
                />
                {uploadFile && (
                  <p className="mt-2 text-xs text-gray-500">
                    Selected file: {uploadFile.name}
                  </p>
                )}
              </div>

              {/* Upload Results */}
              {uploadResult && (
                <div className="mb-4">
                  <div className={`p-3 rounded-sm border ${
                    uploadResult.errorCount === 0
                      ? 'bg-green-50 border-green-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <p className="text-sm font-medium mb-2">
                      {uploadResult.errorCount === 0 ? (
                        <span className="text-green-800">✓ Upload Successful</span>
                      ) : (
                        <span className="text-amber-800">⚠ Upload Completed with Errors</span>
                      )}
                    </p>
                    <p className="text-xs mb-2">
                      <span className="text-green-700">Success: {uploadResult.successCount}</span>
                      {' | '}
                      <span className="text-red-700">Errors: {uploadResult.errorCount}</span>
                    </p>
                    {uploadResult.messages && uploadResult.messages.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        <p className="text-xs font-medium mb-1">Messages:</p>
                        <ul className="text-xs space-y-1">
                          {uploadResult.messages.map((msg, idx) => (
                            <li key={idx} className="text-gray-700">{msg}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={closeBulkUploadModal}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              >
                Close
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={!uploadFile || uploading}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

