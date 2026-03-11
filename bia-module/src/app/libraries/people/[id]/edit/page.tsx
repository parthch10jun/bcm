'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { userService } from '@/services/userService';
import { UserStatus } from '@/types/user';
import { 
  UserIcon,
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface OrganizationalUnit {
  id: number;
  unitName: string;
  unitCode: string;
}

export default function EditPersonPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;
  
  const [organizationalUnits, setOrganizationalUnits] = useState<OrganizationalUnit[]>([]);
  const [loading, setLoading] = useState(true);
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
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [user, units] = await Promise.all([
        userService.getById(Number(userId)),
        fetch('http://localhost:8080/api/organizational-units').then(r => r.json())
      ]);
      
      setOrganizationalUnits(units);
      
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        role: (user as any).role || '',
        organizationalUnitId: user.organizationalUnitId?.toString() || '',
        hrmsEmployeeId: user.hrmsEmployeeId || '',
        status: user.status || UserStatus.ACTIVE
      });
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        contactNumber: formData.contactNumber || undefined,
        role: formData.role || undefined,
        organizationalUnitId: formData.organizationalUnitId ? parseInt(formData.organizationalUnitId) : undefined,
        hrmsEmployeeId: formData.hrmsEmployeeId || undefined,
        status: formData.status
      };

      await userService.update(Number(userId), updateData);
      router.push('/libraries/people');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.push('/libraries/people')}
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1" />
            Back to People
          </button>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Edit Person</h1>
          <p className="mt-0.5 text-xs text-gray-500">Update user information</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
                Basic Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`block w-full px-2.5 py-1.5 border ${errors.fullName ? 'border-red-300' : 'border-gray-300'} rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full px-2.5 py-1.5 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
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
                    onChange={handleChange}
                    className="block w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="block w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value={UserStatus.ACTIVE}>Active</option>
                    <option value={UserStatus.INACTIVE}>Inactive</option>
                    <option value={UserStatus.TERMINATED}>Terminated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Organizational Information */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Organizational Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="role" className="block text-xs font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
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
                    onChange={handleChange}
                    className="block w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    <option value="">Select unit...</option>
                    {organizationalUnits.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.unitName} ({unit.unitCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label htmlFor="hrmsEmployeeId" className="block text-xs font-medium text-gray-700 mb-1">
                    HRMS Employee ID
                  </label>
                  <input
                    type="text"
                    id="hrmsEmployeeId"
                    name="hrmsEmployeeId"
                    value={formData.hrmsEmployeeId}
                    onChange={handleChange}
                    className="block w-full px-2.5 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Leave empty if not synced from HRMS"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push('/libraries/people')}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

