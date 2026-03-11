'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Location, LocationBIA } from '@/types/location';
import {
  BuildingOfficeIcon,
  PlusIcon,
  MapPinIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  MapIcon,
  ListBulletIcon,
  CogIcon,
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Mock data for demonstration with coordinates
const mockLocations: Location[] = [
  {
    id: 'loc-001',
    name: 'Gurugram Head Office',
    address: '123 Cyber City, Gurugram, Haryana 122002',
    locationType: 'Office',
    description: 'Primary corporate headquarters with executive offices and main data center',
    coordinates: { latitude: 28.4595, longitude: 77.0266 },
    capacity: {
      maxOccupancy: 500,
      currentOccupancy: 450
    },
    facilityManager: {
      name: 'Rajesh Kumar',
      phone: '+91-9876543210',
      email: 'rajesh.kumar@company.com'
    },
    emergencyContacts: {
      localEmergencyServices: '112',
      security: '+91-9876543211',
      facilities: '+91-9876543212'
    },
    infrastructure: {
      powerBackup: true,
      internetRedundancy: true,
      hvacSystem: true,
      securitySystems: ['CCTV', 'Access Control', 'Fire Suppression']
    },
    businessContinuity: {
      evacuationPlan: '/documents/evacuation-plan-ggn.pdf',
      alternateWorkSite: 'loc-002',
      recoveryResources: ['Backup generators', 'Satellite internet', 'Mobile command center']
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'loc-002',
    name: 'Mumbai Branch Office',
    address: '456 Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    locationType: 'Office',
    description: 'Regional office serving western India operations',
    coordinates: { latitude: 19.0760, longitude: 72.8777 },
    capacity: {
      maxOccupancy: 200,
      currentOccupancy: 180
    },
    facilityManager: {
      name: 'Priya Sharma',
      phone: '+91-9876543213',
      email: 'priya.sharma@company.com'
    },
    emergencyContacts: {
      localEmergencyServices: '112',
      security: '+91-9876543214',
      facilities: '+91-9876543215'
    },
    infrastructure: {
      powerBackup: true,
      internetRedundancy: false,
      hvacSystem: true,
      securitySystems: ['CCTV', 'Access Control']
    },
    businessContinuity: {
      evacuationPlan: '/documents/evacuation-plan-mum.pdf',
      recoveryResources: ['Backup generators', 'Mobile hotspots']
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'loc-003',
    name: 'Singapore Regional Hub',
    address: '1 Marina Bay, Singapore 018989',
    locationType: 'Office',
    description: 'Asia-Pacific regional headquarters and data center',
    coordinates: { latitude: 1.2966, longitude: 103.8764 },
    capacity: {
      maxOccupancy: 300,
      currentOccupancy: 275
    },
    facilityManager: {
      name: 'Li Wei',
      phone: '+65-9123-4567',
      email: 'li.wei@company.com'
    },
    emergencyContacts: {
      localEmergencyServices: '995',
      security: '+65-9123-4568',
      facilities: '+65-9123-4569'
    },
    infrastructure: {
      powerBackup: true,
      internetRedundancy: true,
      hvacSystem: true,
      securitySystems: ['CCTV', 'Access Control', 'Fire Suppression', 'Biometric']
    },
    businessContinuity: {
      evacuationPlan: '/documents/evacuation-plan-sg.pdf',
      alternateWorkSite: 'loc-004',
      recoveryResources: ['Backup generators', 'Satellite internet', 'Mobile command center']
    },
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'loc-004',
    name: 'London Office',
    address: '25 Bank Street, London E14 5JP, UK',
    locationType: 'Office',
    description: 'European operations center and backup facility',
    coordinates: { latitude: 51.5074, longitude: -0.1278 },
    capacity: {
      maxOccupancy: 150,
      currentOccupancy: 120
    },
    facilityManager: {
      name: 'James Wilson',
      phone: '+44-20-7946-0958',
      email: 'james.wilson@company.com'
    },
    emergencyContacts: {
      localEmergencyServices: '999',
      security: '+44-20-7946-0959',
      facilities: '+44-20-7946-0960'
    },
    infrastructure: {
      powerBackup: true,
      internetRedundancy: true,
      hvacSystem: true,
      securitySystems: ['CCTV', 'Access Control', 'Fire Suppression']
    },
    businessContinuity: {
      evacuationPlan: '/documents/evacuation-plan-ldn.pdf',
      recoveryResources: ['Backup generators', 'Redundant internet', 'Emergency supplies']
    },
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2024-01-10')
  }
];

const mockLocationBIAs: LocationBIA[] = [
  {
    id: 'loc-bia-001',
    locationId: 'loc-001',
    name: 'Gurugram Head Office BIA 2024',
    description: 'Comprehensive location-level business impact analysis for primary headquarters',
    analysisDate: new Date('2024-02-15'),
    analyst: 'John Doe',
    criticalProcesses: [
      {
        processId: 'proc-001',
        processName: 'Payroll Processing',
        criticalityTier: 'Tier 1',
        rto: 24,
        rpo: 4,
        keyPersonnelCount: 5
      },
      {
        processId: 'proc-002',
        processName: 'Customer Support',
        criticalityTier: 'Tier 1',
        rto: 4,
        rpo: 1,
        keyPersonnelCount: 12
      }
    ],
    staffAnalysis: {
      totalStaff: 450,
      keyPersonnel: 85,
      criticalRoles: ['IT Manager', 'Finance Director', 'Operations Head'],
      skillConcentrationRisks: ['Database Administration', 'Network Security']
    },
    technologyAssets: [
      {
        assetId: 'srv-001',
        assetName: 'Primary Database Server',
        assetType: 'Server',
        criticality: 'Critical',
        dependentProcesses: ['proc-001', 'proc-002']
      }
    ],
    locationRisks: [
      {
        riskType: 'Natural Disaster',
        likelihood: 'Low',
        impact: 'Severe',
        mitigationMeasures: ['Earthquake-resistant building', 'Emergency supplies']
      }
    ],
    recoveryStrategies: [
      {
        strategy: 'Relocate to Mumbai office',
        timeframe: '24-48 hours',
        resources: ['Transportation', 'Temporary workstations'],
        cost: 500000,
        feasibility: 'High'
      }
    ],
    overallRiskRating: 'Medium',
    maxAcceptableDowntime: 48,
    recommendedActions: ['Implement redundant internet connection', 'Cross-train critical personnel'],
    status: 'Approved',
    approvedBy: 'Jane Smith',
    approvedDate: new Date('2024-02-20'),
    nextReviewDate: new Date('2024-08-20')
  }
];

export default function LocationsLibraryPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationBIAs, setLocationBIAs] = useState<LocationBIA[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

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
    setLocations(mockLocations);
    setLocationBIAs(mockLocationBIAs);
  }, []);

  const getLocationBIA = (locationId: string) => {
    return locationBIAs.find(bia => bia.locationId === locationId);
  };

  // Bulk upload handlers
  const handleBulkUpload = async () => {
    if (!uploadFile) return;

    setUploading(true);
    try {
      // Simulate upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setUploadResult({
        successCount: 10,
        errorCount: 0,
        messages: ['Successfully uploaded 10 locations']
      });

      // Refresh locations list
      // await fetchLocations();
    } catch (error) {
      setUploadResult({
        successCount: 0,
        errorCount: 1,
        messages: ['Failed to upload file']
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCloseUploadModal = () => {
    setShowBulkUploadModal(false);
    setUploadFile(null);
    setUploadResult(null);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-50 text-red-700 border border-red-200';
      case 'High': return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'Low': return 'bg-green-50 text-green-700 border border-green-200';
      case 'Completed': return 'bg-green-50 text-green-700 border border-green-200';
      case 'Approved': return 'bg-green-50 text-green-700 border border-green-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Draft': return 'bg-gray-50 text-gray-700 border border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  // Calculate KPIs
  const totalLocations = locations.length;
  const biasCompleted = locationBIAs.filter(bia => bia.status === 'Approved').length;
  const highRiskLocations = locationBIAs.filter(bia =>
    bia.overallRiskRating === 'High' || bia.overallRiskRating === 'Critical'
  ).length;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/libraries"
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to Libraries
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Locations Library</h1>
            <p className="mt-0.5 text-xs text-gray-500">
              Manage physical locations and their business continuity profiles
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBulkUploadModal(true)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              <ArrowUpTrayIcon className="h-3.5 w-3.5 mr-1.5" />
              Bulk Upload
            </button>
            <Link
              href="/libraries/locations/new"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
            >
              <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
              Add Location
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="flex-shrink-0 px-6 py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-xs text-gray-500">Total Locations</p>
                <p className="text-base font-semibold text-gray-900">{totalLocations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-xs text-gray-500">BIAs Completed</p>
                <p className="text-base font-semibold text-gray-900">{biasCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-xs text-gray-500">High Risk Locations</p>
                <p className="text-base font-semibold text-gray-900">{highRiskLocations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-xs text-gray-500">Total Occupancy</p>
                <p className="text-base font-semibold text-gray-900">{locations.reduce((sum, loc) => sum + loc.capacity.currentOccupancy, 0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">View:</span>
            <div className="flex rounded-sm border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-xs font-medium ${
                  viewMode === 'list'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ListBulletIcon className="h-3.5 w-3.5 mr-1 inline" />
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 text-xs font-medium border-l border-gray-300 ${
                  viewMode === 'map'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MapIcon className="h-3.5 w-3.5 mr-1 inline" />
                Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {viewMode === 'list' ? (
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Manager
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BIA Status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locations.map((location) => {
                  const locationBIA = getLocationBIA(location.id);
                  const criticalProcessCount = locationBIA ?
                    locationBIA.criticalProcesses.filter(p => p.criticalityTier === 'Tier 1').length : 0;

                  return (
                    <tr key={location.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center min-w-0">
                          <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/libraries/locations/${location.id}`}
                              className="text-xs font-medium text-gray-900 hover:text-gray-700 truncate block"
                            >
                              {location.name}
                            </Link>
                            <div className="text-xs text-gray-500 truncate">
                              {location.address}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-900">{location.locationType}</div>
                        <div className="text-xs text-gray-500">
                          {location.capacity.currentOccupancy}/{location.capacity.maxOccupancy} staff
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-900">{location.facilityManager.name}</div>
                        <div className="text-xs text-gray-500">{location.facilityManager.phone}</div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {locationBIA ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${getRiskColor(locationBIA.status)}`}>
                            {locationBIA.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                            Not Started
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {locationBIA ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium ${getRiskColor(locationBIA.overallRiskRating)}`}>
                            {locationBIA.overallRiskRating}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/libraries/locations/${location.id}/edit`}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                          >
                            <PencilIcon className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Link>
                          {locationBIA ? (
                            <Link
                              href={`/bia-records?location=${location.id}`}
                              className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                            >
                              <EyeIcon className="h-3.5 w-3.5 mr-1" />
                              View BIA
                            </Link>
                          ) : (
                            <Link
                              href={`/bia-records/new?location=${location.id}`}
                              className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800"
                            >
                              <PlusIcon className="h-3.5 w-3.5 mr-1" />
                              Add BIA
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </div>
        ) : (
          // Map View - Same as BIA page
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Global Locations Map</h3>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span>Low Risk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                  <span>Medium Risk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
                  <span>High Risk</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span>Critical Risk</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* World Map SVG */}
            <div className="relative bg-blue-50 rounded-lg p-8" style={{ height: '500px' }}>
              <svg viewBox="0 0 1000 500" className="w-full h-full">
                {/* Simple world map outline */}
                <rect width="1000" height="500" fill="#e0f2fe" />

                {/* Continents (simplified shapes) */}
                {/* North America */}
                <path d="M100 150 L250 120 L280 180 L200 220 L120 200 Z" fill="#94a3b8" />

                {/* Europe */}
                <path d="M450 120 L520 110 L540 150 L480 160 Z" fill="#94a3b8" />

                {/* Asia */}
                <path d="M550 100 L750 90 L800 180 L600 200 L520 150 Z" fill="#94a3b8" />

                {/* Africa */}
                <path d="M450 200 L550 190 L580 320 L480 340 L440 280 Z" fill="#94a3b8" />

                {/* Australia */}
                <path d="M700 350 L780 340 L790 380 L720 390 Z" fill="#94a3b8" />

                {/* Location pins */}
                {locations.map((location) => {
                  const x = ((location.coordinates?.longitude || 0) + 180) * (1000 / 360);
                  const y = (90 - (location.coordinates?.latitude || 0)) * (500 / 180);

                  // Get risk level based on location BIA
                  const locationBIA = locationBIAs.find(bia => bia.locationId === location.id);
                  const riskLevel = locationBIA?.overallRiskRating || 'Low';

                  const pinColor =
                    riskLevel === 'Critical' ? '#ef4444' :
                    riskLevel === 'High' ? '#f97316' :
                    riskLevel === 'Medium' ? '#eab308' : '#22c55e';

                  return (
                    <g key={location.id}>
                      {/* Pin shadow */}
                      <circle cx={x + 1} cy={y + 1} r="8" fill="rgba(0,0,0,0.2)" />
                      {/* Pin */}
                      <circle cx={x} cy={y} r="8" fill={pinColor} stroke="white" strokeWidth="2" />
                      {/* Location label */}
                      <text
                        x={x}
                        y={y - 15}
                        textAnchor="middle"
                        className="text-xs font-medium fill-gray-700"
                        style={{ fontSize: '10px' }}
                      >
                        {location.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Location details overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {locations.map((location) => {
                    const locationBIA = locationBIAs.find(bia => bia.locationId === location.id);
                    const riskLevel = locationBIA?.overallRiskRating || 'Low';

                    return (
                      <div key={location.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{location.name}</h4>
                          <div className={`w-3 h-3 rounded-full ${
                            riskLevel === 'Critical' ? 'bg-red-500' :
                            riskLevel === 'High' ? 'bg-orange-500' :
                            riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{location.locationType}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            {location.capacity.currentOccupancy}/{location.capacity.maxOccupancy} staff
                          </span>
                          <Link
                            href={`/libraries/locations/${location.id}/edit`}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Bulk Upload Locations</h3>
              <button
                onClick={() => {
                  setShowBulkUploadModal(false);
                  setUploadFile(null);
                  setUploadResult(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4">
              {!uploadResult ? (
                <>
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-3">
                      Upload a CSV or Excel file with location data. Download the template to see the required format.
                    </p>
                    <button
                      onClick={() => {/* TODO: Implement template download */}}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    >
                      <ArrowDownTrayIcon className="h-3.5 w-3.5 mr-1.5" />
                      Download Template
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-sm p-6">
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="bulk-upload-input"
                    />
                    <label
                      htmlFor="bulk-upload-input"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <ArrowUpTrayIcon className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-xs font-medium text-gray-700">
                        {uploadFile ? uploadFile.name : 'Click to select file or drag and drop'}
                      </span>
                      <span className="text-xs text-gray-500 mt-1">CSV or Excel up to 10MB</span>
                    </label>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-sm">
                    <span className="text-xs font-medium text-green-800">
                      Successfully uploaded {uploadResult.successCount} location(s)
                    </span>
                  </div>
                  {uploadResult.errorCount > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-sm">
                      <span className="text-xs font-medium text-red-800">
                        {uploadResult.errorCount} error(s) occurred
                      </span>
                      <ul className="mt-2 text-xs text-red-700 list-disc list-inside">
                        {uploadResult.messages.map((msg, idx) => (
                          <li key={idx}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowBulkUploadModal(false);
                  setUploadFile(null);
                  setUploadResult(null);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              >
                {uploadResult ? 'Close' : 'Cancel'}
              </button>
              {!uploadResult && (
                <button
                  onClick={() => {
                    // TODO: Implement bulk upload
                    setUploading(true);
                    setTimeout(() => {
                      setUploading(false);
                      setUploadResult({
                        successCount: 5,
                        errorCount: 0,
                        messages: []
                      });
                    }, 1500);
                  }}
                  disabled={!uploadFile || uploading}
                  className="px-3 py-1.5 text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
