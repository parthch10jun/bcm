'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function EnablersPage() {
  const [enablers] = useState([
    {
      id: 1,
      name: 'Human Resources',
      icon: '👥',
      color: 'purple',
      description: 'Workforce availability and personnel continuity',
      strategies: ['Work from Home / Alternate Site', 'Temporary Staffing', 'Cross-Training & Succession'],
      activePlans: 12
    },
    {
      id: 2,
      name: 'Building',
      icon: '🏢',
      color: 'blue',
      description: 'Physical facility and workspace continuity',
      strategies: ['Alternate Facility Activation', 'Hot Site Relocation', 'Mobile Recovery Unit'],
      activePlans: 8
    },
    {
      id: 3,
      name: 'Technology',
      icon: '💻',
      color: 'cyan',
      description: 'IT systems and technology infrastructure',
      strategies: ['Failover to DR Site', 'Cloud-Based Recovery', 'Manual Workarounds'],
      activePlans: 15
    },
    {
      id: 4,
      name: 'Equipment',
      icon: '⚙️',
      color: 'orange',
      description: 'Critical equipment and machinery',
      strategies: ['Backup Equipment Deployment', 'Equipment Rental', 'Vendor Emergency Supply'],
      activePlans: 6
    },
    {
      id: 5,
      name: 'Vendors',
      icon: '🤝',
      color: 'pink',
      description: 'Third-party suppliers and service providers',
      strategies: ['Alternate Vendor Activation', 'Multi-Vendor Strategy', 'In-House Contingency'],
      activePlans: 10
    },
    {
      id: 6,
      name: 'Vital Records',
      icon: '📄',
      color: 'green',
      description: 'Critical documents and data records',
      strategies: ['Backup Restoration', 'Offsite Storage Retrieval', 'Cloud Backup Recovery'],
      activePlans: 4
    }
  ]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      pink: 'bg-pink-50 border-pink-200 text-pink-700',
      green: 'bg-green-50 border-green-200 text-green-700'
    };
    return colors[color] || 'bg-gray-50 border-gray-200 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/it-dr-plans/settings"
                className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-3.5 w-3.5 mr-1.5" />
                Back to Settings
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Enabler Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage enabler types and their continuity strategies</p>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-sm hover:bg-gray-800 transition-colors">
              <PlusIcon className="h-4 w-4" />
              Add Enabler Type
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Enablers</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{enablers.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Strategies</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{enablers.reduce((sum, e) => sum + e.strategies.length, 0)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Active BCP Plans</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{enablers.reduce((sum, e) => sum + e.activePlans, 0)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Avg Strategies</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{Math.round(enablers.reduce((sum, e) => sum + e.strategies.length, 0) / enablers.length)}</p>
          </div>
        </div>
      </div>

      {/* Enablers Grid */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {enablers.map((enabler) => (
            <div key={enabler.id} className="bg-white border border-gray-200 rounded-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-sm border flex items-center justify-center text-2xl ${getColorClasses(enabler.color)}`}>
                    {enabler.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{enabler.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{enabler.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-sm transition-colors">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-medium text-gray-700">Continuity Strategies</h4>
                    <span className="text-[10px] text-gray-500">{enabler.strategies.length} strategies</span>
                  </div>
                  <div className="space-y-1.5">
                    {enabler.strategies.map((strategy, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-sm text-xs">
                        <span className="text-gray-700">{strategy}</span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <PencilIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="mt-2 w-full py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-dashed border-gray-300 rounded-sm hover:border-gray-400 transition-colors">
                    + Add Strategy
                  </button>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Active BCP Plans</span>
                    <span className="font-semibold text-gray-900">{enabler.activePlans}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

