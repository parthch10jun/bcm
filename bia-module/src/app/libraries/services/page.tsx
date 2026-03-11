'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { biaStore } from '@/store/bia-store';
import { Service, BusinessProcess } from '@/types/bia';
import { 
  GlobeAltIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function ServicesLibraryPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [processes, setProcesses] = useState<BusinessProcess[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    const allServices = biaStore.getAllServices();
    const allProcesses = biaStore.getAllProcesses();
    setServices(allServices);
    setProcesses(allProcesses);
    setFilteredServices(allServices);
  }, []);

  useEffect(() => {
    let filtered = services;
    
    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceOwner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredServices(filtered);
  }, [services, searchTerm]);

  const getRequiredProcesses = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return [];
    
    return service.requiredProcessIds
      .map(id => processes.find(p => p.id === id))
      .filter(p => p !== undefined) as BusinessProcess[];
  };

  const getServiceCriticality = (serviceId: string) => {
    const requiredProcesses = getRequiredProcesses(serviceId);
    if (requiredProcesses.length === 0) return 'Low';

    // Check if any process is critical
    const hasCritical = requiredProcesses.some(p => p.criticalityScore >= 4);
    if (hasCritical) return 'Critical';

    const hasHigh = requiredProcesses.some(p => p.criticalityScore >= 3);
    if (hasHigh) return 'High';

    const hasMedium = requiredProcesses.some(p => p.criticalityScore >= 2);
    if (hasMedium) return 'Medium';

    return 'Low';
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

  const handleDelete = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      // TODO: Implement delete functionality
      console.log('Delete service:', serviceId);
    }
  };

  return (
    <div className="px-6 py-6">
      {/* Page Header */}
      <div className="mb-8">
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
              <GlobeAltIcon className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Services Library</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Manage customer-facing services and their definitions
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/libraries/services/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Service
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GlobeAltIcon className="h-8 w-8 text-blue-400" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Services</div>
                <div className="text-2xl font-semibold text-gray-900">{services.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-green-400" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Total Customers</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {services.reduce((sum, s) => sum + s.customerCount, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-8 w-8 text-purple-400" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Revenue at Risk</div>
                <div className="text-2xl font-semibold text-gray-900">
                  ${services.reduce((sum, s) => sum + s.revenueImpact, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">High Risk Services</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {(services || []).filter(s => getServiceCriticality(s.id) === 'High').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Search & Filter</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Customer-Facing Services</h3>
              <p className="mt-1 text-sm text-gray-500">
                Services that directly impact customers and their SLA commitments ({filteredServices.length} of {services.length})
              </p>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredServices.map((service) => {
            const requiredProcesses = getRequiredProcesses(service.id);
            const serviceCriticality = getServiceCriticality(service.id);

            return (
              <div key={service.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <GlobeAltIcon className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/libraries/services/${service.id}/edit`}
                            className="text-lg font-medium text-blue-600 hover:text-blue-500 truncate"
                          >
                            {service.name}
                          </Link>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCriticalityColor(serviceCriticality)}`}>
                            {serviceCriticality} Service
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {service.description}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Owner: {service.serviceOwner}</span>
                          <span>•</span>
                          <span>Customers: {service.customerCount.toLocaleString()}</span>
                          <span>•</span>
                          <span>Revenue Impact: ${service.revenueImpact.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Segments */}
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Customer Segments</h5>
                      <div className="flex flex-wrap gap-2">
                        {service.customerSegments.map((segment, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {segment}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Linked Processes */}
                    {requiredProcesses.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">
                          Linked Processes ({requiredProcesses.length})
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {requiredProcesses.slice(0, 3).map((process) => (
                            <span
                              key={process.id}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                process.criticalityScore >= 4 ? 'bg-red-100 text-red-800' :
                                process.criticalityScore >= 3 ? 'bg-orange-100 text-orange-800' :
                                process.criticalityScore >= 2 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}
                            >
                              {process.name}
                            </span>
                          ))}
                          {requiredProcesses.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{requiredProcesses.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Key Metrics */}
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">RTO: {service.effectiveRTO}</div>
                            <div className="text-xs text-gray-500">Effective Recovery Time</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <ClockIcon className="h-5 w-5 text-purple-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">RPO: {service.effectiveRPO}</div>
                            <div className="text-xs text-gray-500">Effective Recovery Point</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <UserGroupIcon className="h-5 w-5 text-green-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{requiredProcesses.length}</div>
                            <div className="text-xs text-gray-500">Required Processes</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <ChatBubbleLeftRightIcon className="h-5 w-5 text-orange-500 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{service.slas.length}</div>
                            <div className="text-xs text-gray-500">SLA Commitments</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SLA Details - Moved from BIA Analytics */}
                    {service.slas.length > 0 && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Service Level Agreements (SLAs)</h5>
                        <div className="space-y-2">
                          {service.slas.map((sla, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{sla.metric}</span>
                              <span className="font-medium text-gray-900">{sla.target}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Communication Requirements */}
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Communication Requirements</h5>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div>
                          <span className="text-xs text-gray-500">Channels:</span>
                          <div className="text-sm text-gray-700">
                            {service.communicationRequirements.channels.join(', ')}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Timeline:</span>
                          <div className="text-sm text-gray-700">
                            {service.communicationRequirements.timeline}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Regulatory Requirements */}
                    {service.regulatoryRequirements.length > 0 && (
                      <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Regulatory Requirements</h5>
                        <div className="space-y-1">
                          {service.regulatoryRequirements.map((req, index) => (
                            <div key={index} className="text-sm text-red-700">
                              • {req}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 ml-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/libraries/services/${service.id}/edit`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredServices.length === 0 && services.length > 0 && (
        <div className="text-center py-12">
          <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
        </div>
      )}

      {services.length === 0 && (
        <div className="text-center py-12">
          <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No services</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first service.</p>
          <div className="mt-6">
            <Link
              href="/libraries/services/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Service
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
