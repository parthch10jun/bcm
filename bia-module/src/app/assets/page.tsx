'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Asset, LibrarySearchFilters } from '@/types/centralLibraries';
import {
  MagnifyingGlassIcon,
  ComputerDesktopIcon,
  ServerIcon,
  CloudIcon,
  CpuChipIcon,
  PlusIcon,
  FunnelIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

// Mock data for assets library
const mockAssets: Asset[] = [
  {
    id: 'asset-001',
    name: 'SAP Finance Server',
    type: 'Hardware',
    category: 'Server',
    description: 'Primary server hosting SAP Finance modules',
    location: 'Gurugram Data Center',
    owner: 'person-001',
    custodian: 'person-003',
    criticality: 'Critical',
    specifications: {
      vendor: 'Dell',
      model: 'PowerEdge R750',
      version: '2.1',
      serialNumber: 'DL001234',
    },
    operationalStatus: 'Active',
    maintenanceSchedule: 'Monthly',
    supportContract: 'Dell ProSupport Plus',
    dependencies: ['asset-002', 'asset-003'],
    supportedProcesses: ['proc-001', 'proc-004'],
    recoveryPriority: 1,
    backupLocation: 'Mumbai Data Center',
    alternativeAssets: ['asset-005'],
    lastUpdated: '2024-01-15'
  },
  {
    id: 'asset-002',
    name: 'Oracle Database',
    type: 'Software',
    category: 'Database',
    description: 'Primary database for financial applications',
    location: 'Gurugram Data Center',
    owner: 'person-002',
    criticality: 'Critical',
    specifications: {
      vendor: 'Oracle',
      version: '19c',
      licenseInfo: 'Enterprise Edition - 50 cores'
    },
    operationalStatus: 'Active',
    supportContract: 'Oracle Premier Support',
    dependencies: ['asset-001'],
    supportedProcesses: ['proc-001', 'proc-002', 'proc-004'],
    recoveryPriority: 1,
    lastUpdated: '2024-01-15'
  },
  {
    id: 'asset-003',
    name: 'Network Switch Core-01',
    type: 'Infrastructure',
    category: 'Network',
    description: 'Core network switch for data center',
    location: 'Gurugram Data Center',
    owner: 'person-003',
    criticality: 'High',
    specifications: {
      vendor: 'Cisco',
      model: 'Catalyst 9500',
      serialNumber: 'CS001234'
    },
    operationalStatus: 'Active',
    maintenanceSchedule: 'Quarterly',
    supportContract: 'Cisco SmartNet',
    dependencies: [],
    supportedProcesses: ['proc-001', 'proc-002', 'proc-003'],
    recoveryPriority: 2,
    alternativeAssets: ['asset-006'],
    lastUpdated: '2024-01-15'
  }
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<LibrarySearchFilters>({});

  useEffect(() => {
    setAssets(mockAssets);
    setFilteredAssets(mockAssets);
  }, []);

  useEffect(() => {
    let filtered = assets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(asset => asset.type === filters.type);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(asset => asset.location === filters.location);
    }

    // Criticality filter
    if (filters.criticality) {
      filtered = filtered.filter(asset => asset.criticality === filters.criticality);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(asset => asset.operationalStatus === filters.status);
    }

    setFilteredAssets(filtered);
  }, [assets, searchTerm, filters]);

  const types = [...new Set(assets.map(a => a.type))];
  const locations = [...new Set(assets.map(a => a.location))];
  const criticalityLevels = ['Critical', 'High', 'Medium', 'Low'];
  const statusOptions = ['Active', 'Inactive', 'Maintenance', 'Retired'];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Hardware': return ServerIcon;
      case 'Software': return ComputerDesktopIcon;
      case 'Infrastructure': return CloudIcon;
      default: return CpuChipIcon;
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-6 py-6">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asset Inventory</h1>
          <p className="mt-2 text-lg text-gray-600">Central repository of organizational assets</p>
        </div>
        <Link
          href="/assets/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Asset
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search assets..."
              />
            </div>
          </div>

          {/* Type Filter */}
          <select
            value={filters.type || ''}
            onChange={(e) => setFilters({...filters, type: e.target.value || undefined})}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Location Filter */}
          <select
            value={filters.location || ''}
            onChange={(e) => setFilters({...filters, location: e.target.value || undefined})}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          {/* Criticality Filter */}
          <select
            value={filters.criticality || ''}
            onChange={(e) => setFilters({...filters, criticality: e.target.value || undefined})}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Criticality</option>
            {criticalityLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({});
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Clear
          </button>
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Asset Inventory</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filteredAssets.length} of {assets.length} assets
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAssets.map((asset) => {
            const TypeIcon = getTypeIcon(asset.type);
            return (
              <div key={asset.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TypeIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-medium text-gray-900">{asset.name}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCriticalityColor(asset.criticality)}`}>
                          {asset.criticality}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          asset.operationalStatus === 'Active' ? 'bg-green-100 text-green-800' :
                          asset.operationalStatus === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {asset.operationalStatus}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">{asset.description}</p>
                      
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Type: {asset.type}</span>
                        <span>•</span>
                        <span>Category: {asset.category}</span>
                        <span>•</span>
                        <span>Location: {asset.location}</span>
                      </div>
                      
                      {asset.specifications && (
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          {asset.specifications.vendor && <span>Vendor: {asset.specifications.vendor}</span>}
                          {asset.specifications.model && <span>• Model: {asset.specifications.model}</span>}
                          {asset.specifications.version && <span>• Version: {asset.specifications.version}</span>}
                        </div>
                      )}
                      
                      <div className="mt-3">
                        <span className="text-sm text-gray-500">
                          Supports {asset.supportedProcesses.length} process(es)
                        </span>
                        {asset.dependencies.length > 0 && (
                          <span className="text-sm text-gray-500 ml-4">
                            • {asset.dependencies.length} dependencies
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 flex items-center space-x-3">
                    {(asset.criticality === 'Critical' || asset.criticality === 'High') && (
                      <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700">
                        <PlayIcon className="h-3 w-3 mr-1" />
                        Run Scenario
                      </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredAssets.length === 0 && assets.length > 0 && (
        <div className="text-center py-12">
          <ComputerDesktopIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}
