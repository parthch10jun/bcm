'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ServerIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function NewIncidentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Infrastructure',
    priority: 'Medium',
    affectedService: '',
    businessImpact: '',
    reportedBy: 'Current User',
    technicalDetails: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to backend
    console.log('Creating incident:', formData);
    router.push('/itsm/incidents');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/itsm/incidents"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Back to Incidents
            </Link>
          </div>

          <div className="flex items-start gap-4">
            <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <ExclamationTriangleIcon className="h-7 w-7 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Report New Incident</h1>
              <p className="mt-1 text-sm text-gray-500">
                Create a new IT service incident with ITSCM integration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incident Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Brief description of the incident"
              />
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Application">Application</option>
                  <option value="Database">Database</option>
                  <option value="Network">Network</option>
                  <option value="Security">Security</option>
                  <option value="Service Outage">Service Outage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Affected Service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affected IT Service *
              </label>
              <select
                required
                value={formData.affectedService}
                onChange={(e) => setFormData({ ...formData, affectedService: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select a service...</option>
                <option value="ITS-001">Core Insurance Platform</option>
                <option value="ITS-002">Claims Processing System</option>
                <option value="ITS-003">Customer Portal</option>
                <option value="ITS-004">Policy Management System</option>
                <option value="ITS-005">Document Management</option>
                <option value="ITS-006">Email System</option>
                <option value="ITS-007">Payment Gateway</option>
                <option value="ITS-008">CRM System</option>
                <option value="ITS-009">Data Warehouse</option>
                <option value="ITS-010">Network Infrastructure</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Detailed description of the incident..."
              />
            </div>

            {/* Technical Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technical Details
              </label>
              <textarea
                value={formData.technicalDetails}
                onChange={(e) => setFormData({ ...formData, technicalDetails: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Error messages, logs, system metrics, etc..."
              />
            </div>

            {/* Business Impact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Impact *
              </label>
              <textarea
                required
                value={formData.businessImpact}
                onChange={(e) => setFormData({ ...formData, businessImpact: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Describe the impact on business operations, users affected, revenue impact, etc..."
              />
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <DocumentTextIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">ITSCM Integration</h3>
                  <p className="text-sm text-blue-800">
                    This incident will be automatically linked to the affected IT service's BIA record and DR plan.
                    If the incident is critical, you can escalate it to trigger the IT DR plan activation.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <Link
                href="/itsm/incidents"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Create Incident
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

