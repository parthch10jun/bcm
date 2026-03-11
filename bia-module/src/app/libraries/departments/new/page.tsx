'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  BuildingOfficeIcon,
  UsersIcon,
  CogIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function NewDepartmentLibraryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    departmentHead: '',
    bcmChampion: '',
    primaryLocation: '',
    departmentMission: '',
    strategicImpact: '',
    businessFunction: '',
    riskProfile: 'Medium'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // TODO: Integrate with BIA store
      console.log('Department data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push('/libraries/departments');
    } catch (error) {
      console.error('Error creating department:', error);
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
            href="/libraries/departments"
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to Departments Library
          </Link>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Add New Department</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Create a new department in the master library
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
                    Department Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., Information Technology"
                  />
                </div>

                <div>
                  <label htmlFor="primaryLocation" className="block text-xs font-medium text-gray-700 mb-1">
                    Primary Location
                  </label>
                  <select
                    id="primaryLocation"
                    name="primaryLocation"
                    value={formData.primaryLocation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="">Select Location</option>
                    <option value="loc-001">Gurugram Head Office</option>
                    <option value="loc-002">Mumbai Branch Office</option>
                    <option value="loc-003">Singapore Regional Hub</option>
                    <option value="loc-004">London Office</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="departmentHead" className="block text-xs font-medium text-gray-700 mb-1">
                    Department Head *
                  </label>
                  <input
                    type="text"
                    id="departmentHead"
                    name="departmentHead"
                    required
                    value={formData.departmentHead}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., John Smith"
                  />
                </div>

                <div>
                  <label htmlFor="bcmChampion" className="block text-xs font-medium text-gray-700 mb-1">
                    BCM Champion
                  </label>
                  <input
                    type="text"
                    id="bcmChampion"
                    name="bcmChampion"
                    value={formData.bcmChampion}
                    onChange={handleInputChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., Jane Doe"
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
                    placeholder="Brief description of the department's role and responsibilities"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Information */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Strategic Information</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="departmentMission" className="block text-xs font-medium text-gray-700 mb-1">
                  Department Mission
                </label>
                <textarea
                  id="departmentMission"
                  name="departmentMission"
                  rows={3}
                  value={formData.departmentMission}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Define the department's mission and purpose"
                />
              </div>

              <div>
                <label htmlFor="strategicImpact" className="block text-xs font-medium text-gray-700 mb-1">
                  Strategic Impact
                </label>
                <textarea
                  id="strategicImpact"
                  name="strategicImpact"
                  rows={3}
                  value={formData.strategicImpact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Describe the department's strategic impact on the organization"
                />
              </div>

              <div>
                <label htmlFor="businessFunction" className="block text-xs font-medium text-gray-700 mb-1">
                  Primary Business Function
                </label>
                <select
                  id="businessFunction"
                  name="businessFunction"
                  value={formData.businessFunction}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="">Select Function</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Legal">Legal</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Risk Profile */}
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Risk Profile</h3>
            </div>
            <div className="p-4">
              <div>
                <label htmlFor="riskProfile" className="block text-xs font-medium text-gray-700 mb-1">
                  Initial Risk Rating
                </label>
                <select
                  id="riskProfile"
                  name="riskProfile"
                  value={formData.riskProfile}
                  onChange={handleInputChange}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Critical">Critical Risk</option>
                </select>
                <p className="mt-0.5 text-[10px] text-gray-500">
                  This can be refined later through detailed BIA analysis
                </p>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4">
            <Link
              href="/libraries/departments"
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
                  Create Department
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
