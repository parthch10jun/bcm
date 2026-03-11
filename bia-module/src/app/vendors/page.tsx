'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Vendor, LibrarySearchFilters } from '@/types/centralLibraries';
import {
  MagnifyingGlassIcon,
  BuildingOffice2Icon,
  PhoneIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  FunnelIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

// Mock data for vendors library
const mockVendors: Vendor[] = [
  {
    id: 'vendor-001',
    name: 'Salesforce Inc.',
    type: 'Technology',
    status: 'Active',
    primaryContact: {
      name: 'John Smith',
      title: 'Account Manager',
      email: 'john.smith@salesforce.com',
      phone: '+1-800-667-6389'
    },
    address: {
      street: '415 Mission Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94105'
    },
    contractDetails: {
      contractNumber: 'SF-2024-001',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      value: 250000,
      currency: 'USD',
      renewalTerms: 'Auto-renewal with 90-day notice'
    },
    servicesProvided: ['CRM Platform', 'Sales Automation', 'Customer Support'],
    supportedProcesses: ['proc-002', 'proc-003'],
    criticality: 'Critical',
    riskRating: 'Low',
    riskFactors: ['Single vendor dependency'],
    hasBCPlan: true,
    alternativeVendors: ['vendor-002'],
    escalationProcedure: 'Contact Account Manager → Technical Support → Executive Escalation',
    slaMetrics: {
      availability: 99.9,
      responseTime: '4 hours',
      resolutionTime: '24 hours'
    },
    lastUpdated: '2024-01-15'
  },
  {
    id: 'vendor-002',
    name: 'Microsoft Corporation',
    type: 'Technology',
    status: 'Active',
    primaryContact: {
      name: 'Sarah Johnson',
      title: 'Enterprise Account Executive',
      email: 'sarah.johnson@microsoft.com',
      phone: '+1-425-882-8080'
    },
    address: {
      street: 'One Microsoft Way',
      city: 'Redmond',
      state: 'WA',
      country: 'USA',
      postalCode: '98052'
    },
    contractDetails: {
      contractNumber: 'MS-2024-002',
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      value: 500000,
      currency: 'USD',
      renewalTerms: 'Annual renewal'
    },
    servicesProvided: ['Office 365', 'Azure Cloud Services', 'Windows Licensing'],
    supportedProcesses: ['proc-001', 'proc-002', 'proc-004'],
    criticality: 'Critical',
    riskRating: 'Low',
    riskFactors: ['Market leader', 'Strong financial position'],
    hasBCPlan: true,
    escalationProcedure: 'Premier Support → Account Team → Microsoft Executive',
    slaMetrics: {
      availability: 99.95,
      responseTime: '2 hours',
      resolutionTime: '8 hours'
    },
    lastUpdated: '2024-01-15'
  },
  {
    id: 'vendor-003',
    name: 'SecureClean Services',
    type: 'Service',
    status: 'Active',
    primaryContact: {
      name: 'Raj Patel',
      title: 'Operations Manager',
      email: 'raj.patel@secureclean.com',
      phone: '+91-11-4567-8900'
    },
    address: {
      street: 'Sector 18',
      city: 'Gurugram',
      state: 'Haryana',
      country: 'India',
      postalCode: '122015'
    },
    contractDetails: {
      contractNumber: 'SC-2024-003',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      value: 50000,
      currency: 'INR',
      renewalTerms: 'Annual renewal with price adjustment'
    },
    servicesProvided: ['Office Cleaning', 'Sanitization', 'Waste Management'],
    supportedProcesses: ['proc-005'],
    criticality: 'Medium',
    riskRating: 'Medium',
    riskFactors: ['Local vendor', 'Limited backup options'],
    hasBCPlan: false,
    alternativeVendors: ['vendor-004'],
    escalationProcedure: 'Site Supervisor → Operations Manager → General Manager',
    lastUpdated: '2024-01-15'
  }
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<LibrarySearchFilters>({});

  useEffect(() => {
    setVendors(mockVendors);
    setFilteredVendors(mockVendors);
  }, []);

  useEffect(() => {
    let filtered = vendors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.servicesProvided.some(service => 
          service.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        vendor.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(vendor => vendor.type === filters.type);
    }

    // Criticality filter
    if (filters.criticality) {
      filtered = filtered.filter(vendor => vendor.criticality === filters.criticality);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(vendor => vendor.status === filters.status);
    }

    setFilteredVendors(filtered);
  }, [vendors, searchTerm, filters]);

  const types = [...new Set(vendors.map(v => v.type))];
  const criticalityLevels = ['Critical', 'High', 'Medium', 'Low'];
  const statusOptions = ['Active', 'Inactive', 'Under Review'];

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
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
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="mt-2 text-lg text-gray-600">Central repository of suppliers and service providers</p>
        </div>
        <Link
          href="/vendors/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Vendor
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                placeholder="Search vendors..."
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

      {/* Vendors List */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Vendor Directory</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filteredVendors.length} of {vendors.length} vendors
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BuildingOffice2Icon className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{vendor.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCriticalityColor(vendor.criticality)}`}>
                        {vendor.criticality}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(vendor.riskRating)}`}>
                        Risk: {vendor.riskRating}
                      </span>
                      {!vendor.hasBCPlan && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                          No BCP
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {vendor.servicesProvided.join(', ')}
                    </p>
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Type: {vendor.type}</span>
                      <span>•</span>
                      <span>Status: {vendor.status}</span>
                      <span>•</span>
                      <span>Supports {vendor.supportedProcesses.length} process(es)</span>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        {vendor.primaryContact.email}
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        {vendor.primaryContact.phone}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                        {vendor.contractDetails.value.toLocaleString()} {vendor.contractDetails.currency}
                      </div>
                      <span>•</span>
                      <span>Contract: {vendor.contractDetails.startDate} - {vendor.contractDetails.endDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 flex items-center space-x-3">
                  {(vendor.criticality === 'Critical' || vendor.criticality === 'High') && (
                    <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-orange-600 hover:bg-orange-700">
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
          ))}
        </div>
      </div>

      {filteredVendors.length === 0 && vendors.length > 0 && (
        <div className="text-center py-12">
          <BuildingOffice2Icon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vendors found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}
