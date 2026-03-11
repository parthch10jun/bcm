'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { userService } from '@/services/userService';
import { User, UserStatus } from '@/types/user';

export default function PersonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getById(Number(userId));
      setUser(data);
    } catch (err) {
      setError('Failed to load user details');
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/libraries/people/${userId}/edit`);
  };

  const handleDelete = async () => {
    if (!user) return;
    
    if (confirm(`Are you sure you want to delete "${user.fullName}"? This action cannot be undone.`)) {
      try {
        await userService.delete(user.id);
        router.push('/libraries/people');
      } catch (err) {
        alert('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const getStatusBadgeClass = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'bg-green-50 text-green-700 border-green-200';
      case UserStatus.INACTIVE:
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case UserStatus.TERMINATED:
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-sm text-gray-500">{error || 'User not found'}</p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/libraries/people')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to People Library
            </button>
          </div>
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <PencilIcon className="h-3.5 w-3.5 mr-1" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-sm text-red-700 bg-white hover:bg-red-50"
            >
              <TrashIcon className="h-3.5 w-3.5 mr-1" />
              Delete
            </button>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{user.fullName}</h1>
          <p className="mt-0.5 text-xs text-gray-500">People Library</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
              Basic Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                <p className="text-sm text-gray-900">{user.fullName}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-medium border ${getStatusBadgeClass(user.status)}`}>
                  {user.status}
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {user.email}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Contact Number</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {user.contactNumber || '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Organizational Information */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-500" />
              Organizational Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                <p className="text-sm text-gray-900 flex items-center">
                  <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {(user as any).role || '—'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Organizational Unit</label>
                <p className="text-sm text-gray-900">{user.organizationalUnitName || '—'}</p>
                {user.organizationalUnitCode && (
                  <p className="text-xs text-gray-500 mt-0.5">{user.organizationalUnitCode}</p>
                )}
              </div>
              {user.hrmsEmployeeId && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">HRMS Employee ID</label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                    {user.hrmsEmployeeId}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Synced from HRMS</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

