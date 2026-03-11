'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ServerStackIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

interface ITService {
  id: string;
  name: string;
  description: string;
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
  category: string;
  owner: string;
  rto: number; // in hours
  rpo: number; // in hours
  status: 'Operational' | 'At Risk' | 'Critical' | 'Under Maintenance';
  recoveryStrategy: 'Hot Site' | 'Warm Site' | 'Cold Site' | 'Cloud Failover';
  lastTestDate: string;
  nextTestDate: string;
  dependencies: number;
  criticalityScore: number;
}

const ITEMS_PER_PAGE = 15;

// Mock data
const mockServices: ITService[] = [
  { id: '1', name: 'Core Banking System', description: 'Primary banking transaction processing system', tier: 'Tier 1', category: 'Banking', owner: 'John Smith', rto: 2, rpo: 1, status: 'Operational', recoveryStrategy: 'Hot Site', lastTestDate: '2024-02-10', nextTestDate: '2024-05-10', dependencies: 12, criticalityScore: 95 },
  { id: '2', name: 'Payment Gateway', description: 'Online payment processing service', tier: 'Tier 1', category: 'Payments', owner: 'Sarah Johnson', rto: 2, rpo: 1, status: 'At Risk', recoveryStrategy: 'Hot Site', lastTestDate: '2023-12-15', nextTestDate: '2024-03-15', dependencies: 8, criticalityScore: 92 },
  { id: '3', name: 'Customer Portal', description: 'Customer-facing web application', tier: 'Tier 2', category: 'Customer Service', owner: 'Mike Chen', rto: 4, rpo: 2, status: 'Operational', recoveryStrategy: 'Warm Site', lastTestDate: '2024-02-08', nextTestDate: '2024-05-08', dependencies: 15, criticalityScore: 85 },
  { id: '4', name: 'Email Services', description: 'Corporate email infrastructure', tier: 'Tier 2', category: 'Communication', owner: 'Lisa Anderson', rto: 4, rpo: 4, status: 'Critical', recoveryStrategy: 'Warm Site', lastTestDate: '2023-11-20', nextTestDate: '2024-02-20', dependencies: 5, criticalityScore: 78 },
  { id: '5', name: 'Data Warehouse', description: 'Business intelligence and analytics platform', tier: 'Tier 3', category: 'Analytics', owner: 'David Lee', rto: 8, rpo: 24, status: 'Operational', recoveryStrategy: 'Cold Site', lastTestDate: '2024-02-05', nextTestDate: '2024-05-05', dependencies: 6, criticalityScore: 70 },
  { id: '6', name: 'Mobile Banking App', description: 'Mobile application for banking services', tier: 'Tier 1', category: 'Banking', owner: 'Emma Wilson', rto: 2, rpo: 1, status: 'Operational', recoveryStrategy: 'Cloud Failover', lastTestDate: '2024-01-28', nextTestDate: '2024-04-28', dependencies: 10, criticalityScore: 90 },
  { id: '7', name: 'ATM Network', description: 'Automated teller machine network', tier: 'Tier 1', category: 'Banking', owner: 'Robert Brown', rto: 2, rpo: 1, status: 'Operational', recoveryStrategy: 'Hot Site', lastTestDate: '2024-02-12', nextTestDate: '2024-05-12', dependencies: 7, criticalityScore: 88 },
  { id: '8', name: 'CRM System', description: 'Customer relationship management platform', tier: 'Tier 2', category: 'Customer Service', owner: 'Jennifer Davis', rto: 4, rpo: 4, status: 'Operational', recoveryStrategy: 'Warm Site', lastTestDate: '2024-01-15', nextTestDate: '2024-04-15', dependencies: 9, criticalityScore: 82 },
  { id: '9', name: 'Document Management', description: 'Enterprise document storage and retrieval', tier: 'Tier 3', category: 'Infrastructure', owner: 'Tom Martinez', rto: 8, rpo: 24, status: 'Operational', recoveryStrategy: 'Cold Site', lastTestDate: '2024-01-20', nextTestDate: '2024-04-20', dependencies: 4, criticalityScore: 65 },
  { id: '10', name: 'HR Portal', description: 'Human resources management system', tier: 'Tier 3', category: 'HR', owner: 'Amy Taylor', rto: 8, rpo: 24, status: 'Under Maintenance', recoveryStrategy: 'Warm Site', lastTestDate: '2024-01-10', nextTestDate: '2024-04-10', dependencies: 3, criticalityScore: 60 },
  { id: '11', name: 'Trading Platform', description: 'Securities trading and settlement system', tier: 'Tier 1', category: 'Trading', owner: 'Chris Anderson', rto: 2, rpo: 0.5, status: 'Operational', recoveryStrategy: 'Hot Site', lastTestDate: '2024-02-14', nextTestDate: '2024-05-14', dependencies: 14, criticalityScore: 98 },
  { id: '12', name: 'Loan Origination', description: 'Loan application and approval system', tier: 'Tier 2', category: 'Lending', owner: 'Patricia White', rto: 4, rpo: 2, status: 'Operational', recoveryStrategy: 'Warm Site', lastTestDate: '2024-01-25', nextTestDate: '2024-04-25', dependencies: 11, criticalityScore: 80 },
  { id: '13', name: 'Fraud Detection', description: 'Real-time fraud monitoring and prevention', tier: 'Tier 1', category: 'Security', owner: 'Kevin Harris', rto: 2, rpo: 1, status: 'Operational', recoveryStrategy: 'Hot Site', lastTestDate: '2024-02-11', nextTestDate: '2024-05-11', dependencies: 8, criticalityScore: 94 },
  { id: '14', name: 'Backup Services', description: 'Enterprise backup and recovery infrastructure', tier: 'Tier 2', category: 'Infrastructure', owner: 'Laura Clark', rto: 4, rpo: 12, status: 'Operational', recoveryStrategy: 'Warm Site', lastTestDate: '2024-02-01', nextTestDate: '2024-05-01', dependencies: 2, criticalityScore: 75 },
  { id: '15', name: 'Reporting Engine', description: 'Business reporting and analytics', tier: 'Tier 3', category: 'Analytics', owner: 'Mark Thompson', rto: 8, rpo: 24, status: 'Operational', recoveryStrategy: 'Cold Site', lastTestDate: '2024-01-18', nextTestDate: '2024-04-18', dependencies: 5, criticalityScore: 68 }
];

export default function ServiceCatalogPage() {
  const [services, setServices] = useState<ITService[]>(mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedService, setSelectedService] = useState<ITService | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Get unique categories
  const categories = Array.from(new Set(services.map(s => s.category))).sort();

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = !selectedTier || service.tier === selectedTier;
    const matchesStatus = !selectedStatus || service.status === selectedStatus;
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    
    return matchesSearch && matchesTier && matchesStatus && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTier, selectedStatus, selectedCategory]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Operational': return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'At Risk': return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'Critical': return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default: return <CheckCircleIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational': return 'bg-green-100 text-green-700 border-green-200';
      case 'At Risk': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Tier 1': return 'bg-red-100 text-red-700 border-red-200';
      case 'Tier 2': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Tier 3': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Tier 4': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this IT service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleEdit = (service: ITService) => {
    setSelectedService(service);
    setShowModal(true);
  };

  // Statistics
  const stats = {
    total: services.length,
    tier1: services.filter(s => s.tier === 'Tier 1').length,
    operational: services.filter(s => s.status === 'Operational').length,
    atRisk: services.filter(s => s.status === 'At Risk' || s.status === 'Critical').length,
    avgRTO: (services.reduce((sum, s) => sum + s.rto, 0) / services.length).toFixed(1)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link
                  href="/libraries"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Back to Libraries
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <ServerStackIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">IT Services Library</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage IT services, recovery objectives, and continuity strategies
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/libraries/it-services/application-mapping"
                className="inline-flex items-center px-4 py-2 border border-purple-600 rounded-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50"
              >
                <CubeIcon className="h-4 w-4 mr-2" />
                Application Mapping
              </Link>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add IT Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Services</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-sm p-4">
            <p className="text-xs font-medium text-red-700 uppercase tracking-wider">Tier 1 Critical</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.tier1}</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-sm p-4">
            <p className="text-xs font-medium text-green-700 uppercase tracking-wider">Operational</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.operational}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-sm p-4">
            <p className="text-xs font-medium text-yellow-700 uppercase tracking-wider">At Risk</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.atRisk}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-sm p-4">
            <p className="text-xs font-medium text-blue-700 uppercase tracking-wider">Avg RTO</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.avgRTO}h</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 pb-4">
        <div className="bg-white border border-gray-200 rounded-sm p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services by name, description, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2 border rounded-sm text-sm font-medium ${
                showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Service Tier</label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-sm px-3 py-2 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Tiers</option>
                  <option value="Tier 1">Tier 1 - Critical</option>
                  <option value="Tier 2">Tier 2 - Important</option>
                  <option value="Tier 3">Tier 3 - Standard</option>
                  <option value="Tier 4">Tier 4 - Low Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-sm px-3 py-2 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="Operational">Operational</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Critical">Critical</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded-sm px-3 py-2 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Services Table */}
      <div className="px-6 pb-6">
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          {/* Table Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                IT Services ({filteredServices.length})
              </h2>
              <span className="text-xs text-gray-500">
                Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredServices.length)} of {filteredServices.length}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Service Name</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">RTO</th>
                  <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">RPO</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Recovery Strategy</th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 text-center text-[10px] font-medium text-gray-500 uppercase tracking-wider">Last Test</th>
                  <th className="px-3 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div>
                        <p className="text-xs font-medium text-gray-900">{service.name}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{service.description}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getTierColor(service.tier)}`}>
                        {service.tier}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-600">{service.category}</td>
                    <td className="px-3 py-3 text-xs text-gray-600">{service.owner}</td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-xs font-medium text-gray-900">{service.rto}h</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="text-xs font-medium text-gray-900">{service.rpo}h</span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-600">{service.recoveryStrategy}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(service.status)}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-gray-600">{service.lastTestDate}</td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => handleEdit(service)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-xs font-medium rounded-sm ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add IT Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Add New IT Service</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Service Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Core Banking System"
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Category *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select category</option>
                      <option value="Core Systems">Core Systems</option>
                      <option value="Customer Facing">Customer Facing</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Security">Security</option>
                      <option value="Analytics">Analytics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the IT service"
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Service Tier *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Tier 1">Tier 1 - Critical</option>
                      <option value="Tier 2">Tier 2 - Important</option>
                      <option value="Tier 3">Tier 3 - Standard</option>
                      <option value="Tier 4">Tier 4 - Low Priority</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">RTO (hours) *</label>
                    <input
                      type="number"
                      placeholder="e.g., 4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">RPO (hours) *</label>
                    <input
                      type="number"
                      placeholder="e.g., 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Service Owner *</label>
                    <input
                      type="text"
                      placeholder="e.g., John Smith"
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Recovery Strategy *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Hot Site">Hot Site</option>
                      <option value="Warm Site">Warm Site</option>
                      <option value="Cold Site">Cold Site</option>
                      <option value="Cloud Failover">Cloud Failover</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('IT Service added successfully!');
                      setShowAddModal(false);
                    }}
                    className="px-4 py-2 border border-blue-600 rounded-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

