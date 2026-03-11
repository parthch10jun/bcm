'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';

interface User {
  id: number;
  fullName: string;
  email: string;
  contactNumber?: string;
  role: string;
  unitId?: number;
  unitName?: string;
}

interface BIADelegationModalProps {
  isOpen: boolean;
  onClose: () => void;
  biaId: number;
  biaName: string;
  championId: number;
  onSuccess: () => void;
}

/**
 * BIA Delegation Modal
 * 
 * Allows Champions to assign BIAs to SMEs
 * - SME selection dropdown (filtered by department/unit)
 * - Assignment reason/notes
 * - Due date (optional)
 * - Priority level
 */
export default function BIADelegationModal({
  isOpen,
  onClose,
  biaId,
  biaName,
  championId,
  onSuccess
}: BIADelegationModalProps) {
  const [smes, setSmes] = useState<User[]>([]);
  const [selectedSmeId, setSelectedSmeId] = useState<number | null>(null);
  const [assignmentReason, setAssignmentReason] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSMEs();
    }
  }, [isOpen]);

  const fetchSMEs = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call filtered by role=SME and same department
      const response = await fetch('http://localhost:8080/api/users?role=SME');
      if (response.ok) {
        const data = await response.json();
        setSmes(data);
      }
    } catch (error) {
      console.error('Error fetching SMEs:', error);
      // Use mock data for now
      setSmes([
        { id: 101, fullName: 'John Smith', email: 'john.smith@company.com', role: 'SME', unitName: 'Finance' },
        { id: 102, fullName: 'Sarah Johnson', email: 'sarah.johnson@company.com', role: 'SME', unitName: 'Finance' },
        { id: 103, fullName: 'Michael Chen', email: 'michael.chen@company.com', role: 'SME', unitName: 'Operations' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSmeId) {
      alert('Please select an SME');
      return;
    }

    if (!assignmentReason.trim()) {
      alert('Please provide an assignment reason');
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch('http://localhost:8080/api/bia-workflow/delegate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          biaId,
          championId,
          smeId: selectedSmeId,
          assignmentReason,
          dueDate: dueDate || null,
          priority
        })
      });

      if (response.ok) {
        alert('BIA successfully assigned to SME!');
        onSuccess();
        handleClose();
      } else {
        const error = await response.text();
        alert(`Failed to assign BIA: ${error}`);
      }
    } catch (error) {
      console.error('Error delegating BIA:', error);
      alert('Failed to assign BIA. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedSmeId(null);
    setAssignmentReason('');
    setDueDate('');
    setPriority('MEDIUM');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-sm shadow-lg max-w-lg w-full mx-4">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlusIcon className="h-4 w-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-900">Assign BIA to SME</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={submitting}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-3">
            {/* BIA Name */}
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                BIA Name
              </label>
              <p className="text-xs text-gray-900 font-medium">{biaName}</p>
            </div>

            {/* SME Selection */}
            <div>
              <label htmlFor="sme" className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                Select SME <span className="text-red-600">*</span>
              </label>
              {loading ? (
                <p className="text-xs text-gray-500">Loading SMEs...</p>
              ) : (
                <select
                  id="sme"
                  value={selectedSmeId || ''}
                  onChange={(e) => setSelectedSmeId(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  required
                  disabled={submitting}
                >
                  <option value="">-- Select SME --</option>
                  {smes.map((sme) => (
                    <option key={sme.id} value={sme.id}>
                      {sme.fullName} ({sme.email}) {sme.unitName ? `- ${sme.unitName}` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                disabled={submitting}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                Due Date (Optional)
              </label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                disabled={submitting}
              />
            </div>

            {/* Assignment Reason */}
            <div>
              <label htmlFor="reason" className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                Assignment Reason / Notes <span className="text-red-600">*</span>
              </label>
              <textarea
                id="reason"
                value={assignmentReason}
                onChange={(e) => setAssignmentReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Explain why this SME is being assigned this BIA..."
                required
                disabled={submitting}
              />
              <p className="mt-1 text-[10px] text-gray-500">
                This will be included in the notification sent to the SME
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gray-900 border border-transparent rounded-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Assigning...
                </>
              ) : (
                <>
                  <UserPlusIcon className="h-3.5 w-3.5 mr-1" />
                  Assign to SME
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

