'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CheckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface LocationFormData {
  name: string;
  address: string;
  locationType: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  capacity: {
    maxOccupancy: number;
    currentOccupancy: number;
  };
  facilityManager: {
    name: string;
    phone: string;
    email: string;
  };
  emergencyContacts: {
    localEmergencyServices: string;
    security: string;
    facilities: string;
  };
  infrastructure: {
    powerBackup: boolean;
    internetRedundancy: boolean;
    hvacSystem: boolean;
    securitySystems: string[];
  };
}

export default function NewLocationLibraryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<LocationFormData>({
    name: '',
    address: '',
    locationType: 'Office',
    description: '',
    coordinates: {
      latitude: 0,
      longitude: 0
    },
    capacity: {
      maxOccupancy: 0,
      currentOccupancy: 0
    },
    facilityManager: {
      name: '',
      phone: '',
      email: ''
    },
    emergencyContacts: {
      localEmergencyServices: '',
      security: '',
      facilities: ''
    },
    infrastructure: {
      powerBackup: false,
      internetRedundancy: false,
      hvacSystem: false,
      securitySystems: []
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof LocationFormData] as object || {}),
          [child]: type === 'number' ? parseFloat(value) || 0 : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      infrastructure: {
        ...prev.infrastructure,
        [name]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // TODO: Integrate with location store
      console.log('Location data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/libraries/locations');
    } catch (error) {
      console.error('Error creating location:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <Link
            href="/libraries/locations"
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to Locations Library
          </Link>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Add New Location</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Create a new physical location in the master library
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Basic Information</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                    Location Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., Gurugram Head Office"
                  />
                </div>

                <div>
                  <label htmlFor="locationType" className="block text-xs font-medium text-gray-700 mb-1">
                    Location Type
                  </label>
                  <select
                    id="locationType"
                    name="locationType"
                    value={formData.locationType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="Office">Office</option>
                    <option value="Data Center">Data Center</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Full address including city, state, and country"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Brief description of the location and its purpose"
                  />
                </div>

                <div>
                  <label htmlFor="coordinates.latitude" className="block text-xs font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    id="coordinates.latitude"
                    name="coordinates.latitude"
                    value={formData.coordinates.latitude}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., 28.4595"
                  />
                </div>

                <div>
                  <label htmlFor="coordinates.longitude" className="block text-xs font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    id="coordinates.longitude"
                    name="coordinates.longitude"
                    value={formData.coordinates.longitude}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., 77.0266"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Capacity Information */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Capacity Information</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="capacity.maxOccupancy" className="block text-xs font-medium text-gray-700 mb-1">
                    Maximum Occupancy
                  </label>
                  <input
                    type="number"
                    id="capacity.maxOccupancy"
                    name="capacity.maxOccupancy"
                    value={formData.capacity.maxOccupancy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., 500"
                  />
                </div>

                <div>
                  <label htmlFor="capacity.currentOccupancy" className="block text-xs font-medium text-gray-700 mb-1">
                    Current Occupancy
                  </label>
                  <input
                    type="number"
                    id="capacity.currentOccupancy"
                    name="capacity.currentOccupancy"
                    value={formData.capacity.currentOccupancy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., 450"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Facility Manager */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Facility Manager</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="facilityManager.name" className="block text-xs font-medium text-gray-700 mb-1">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    id="facilityManager.name"
                    name="facilityManager.name"
                    value={formData.facilityManager.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., John Smith"
                  />
                </div>

                <div>
                  <label htmlFor="facilityManager.phone" className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="facilityManager.phone"
                    name="facilityManager.phone"
                    value={formData.facilityManager.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., +1-555-123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="facilityManager.email" className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="facilityManager.email"
                    name="facilityManager.email"
                    value={formData.facilityManager.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., john.smith@company.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Infrastructure</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="powerBackup"
                      name="powerBackup"
                      type="checkbox"
                      checked={formData.infrastructure.powerBackup}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                    />
                    <label htmlFor="powerBackup" className="ml-2 block text-xs text-gray-900">
                      Power Backup Available
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="internetRedundancy"
                      name="internetRedundancy"
                      type="checkbox"
                      checked={formData.infrastructure.internetRedundancy}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                    />
                    <label htmlFor="internetRedundancy" className="ml-2 block text-xs text-gray-900">
                      Internet Redundancy
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="hvacSystem"
                      name="hvacSystem"
                      type="checkbox"
                      checked={formData.infrastructure.hvacSystem}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                    />
                    <label htmlFor="hvacSystem" className="ml-2 block text-xs text-gray-900">
                      HVAC System
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4">
            <Link
              href="/libraries/locations"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-1.5"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckIcon className="h-3.5 w-3.5 mr-1" />
                  Create Location
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
