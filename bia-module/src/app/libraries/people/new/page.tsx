'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { userService } from '@/services/userService';
import { organizationalUnitService } from '@/services/organizationalUnitService';
import { OrganizationalUnit } from '@/types/organizationalUnit';
import { UserStatus } from '@/types/user';
import { 
  UserGroupIcon,
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function NewPersonPage() {
  const router = useRouter();
  const [organizationalUnits, setOrganizationalUnits] = useState<OrganizationalUnit[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    role: '',
    organizationalUnitId: '',
    hrmsEmployeeId: '',
    status: UserStatus.ACTIVE
  });

  useEffect(() => {
    loadOrganizationalUnits();
  }, []);

  const loadOrganizationalUnits = async () => {
    try {
      const units = await organizationalUnitService.getAll();
      setOrganizationalUnits(units);
    } catch (error) {
      console.error('Error loading organizational units:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Email must be valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      await userService.create({
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber || undefined,
        organizationalUnitId: formData.organizationalUnitId ? parseInt(formData.organizationalUnitId) : undefined,
        hrmsEmployeeId: formData.hrmsEmployeeId || undefined,
        status: formData.status
      });
      
      router.push('/libraries/people');
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create user. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="mb-2">
          <Link
            href="/libraries/people"
            className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to People Library
          </Link>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Add New Person</h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Create a new user record in the People Library
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="ml-2">
              <h3 className="text-xs font-medium text-blue-900">
                Recommended: Use Bulk Import
              </h3>
              <div className="mt-0.5 text-xs text-blue-800">
                <p>
                  For adding multiple users, consider using <strong>Bulk Upload</strong> (CSV file) or
                  <strong> Sync with HRMS</strong> instead of manual entry. This form is best for
                  adding individual users or making quick updates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-5xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
                <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Basic Information</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      className={`w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${errors.fullName ? 'border-red-300' : ''}`}
                      placeholder="e.g., John Doe"
                    />
                    {errors.fullName && (
                      <p className="mt-0.5 text-[10px] text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={`w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 ${errors.email ? 'border-red-300' : ''}`}
                      placeholder="e.g., john.doe@acme.com"
                    />
                    {errors.email && (
                      <p className="mt-0.5 text-[10px] text-red-600">{errors.email}</p>
                    )}
                    <p className="mt-0.5 text-[10px] text-gray-500">Must be unique in the system</p>
                  </div>

                  <div>
                    <label htmlFor="contactNumber" className="block text-xs font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={(e) => handleChange('contactNumber', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., +1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-xs font-medium text-gray-700 mb-1">
                      Role / Job Title
                    </label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., Senior Manager"
                    />
                  </div>

                  <div>
                    <label htmlFor="organizationalUnitId" className="block text-xs font-medium text-gray-700 mb-1">
                      Organizational Unit
                    </label>
                    <select
                      id="organizationalUnitId"
                      name="organizationalUnitId"
                      value={formData.organizationalUnitId}
                      onChange={(e) => handleChange('organizationalUnitId', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="">Select Organizational Unit</option>
                      {organizationalUnits.map(unit => (
                        <option key={unit.id} value={unit.id}>
                          {unit.unitName} ({unit.unitCode})
                        </option>
                      ))}
                    </select>
                    <p className="mt-0.5 text-[10px] text-gray-500">Optional - can be assigned later</p>
                  </div>

                  <div>
                    <label htmlFor="hrmsEmployeeId" className="block text-xs font-medium text-gray-700 mb-1">
                      HRMS Employee ID
                    </label>
                    <input
                      type="text"
                      id="hrmsEmployeeId"
                      name="hrmsEmployeeId"
                      value={formData.hrmsEmployeeId}
                      onChange={(e) => handleChange('hrmsEmployeeId', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="e.g., HRMS-001"
                    />
                    <p className="mt-0.5 text-[10px] text-gray-500">External HRMS system identifier</p>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value as UserStatus)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value={UserStatus.ACTIVE}>Active - Currently employed</option>
                      <option value={UserStatus.INACTIVE}>Inactive - Temporarily inactive</option>
                      <option value={UserStatus.TERMINATED}>Terminated - Employment ended</option>
                    </select>
                  </div>
                </div>
            </div>
          </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-600 mr-2" />
                  <p className="text-xs text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <div className="flex items-center justify-end space-x-2">
                <Link
                  href="/libraries/people"
                  className="px-4 py-2 border border-gray-300 rounded-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-sm text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-3.5 w-3.5 mr-1.5" />
                      Create Person
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

