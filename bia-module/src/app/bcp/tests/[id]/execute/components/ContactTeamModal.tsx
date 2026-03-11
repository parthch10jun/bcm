'use client';

import { useState } from 'react';
import {
  XMarkIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  UserIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';

interface ContactTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  testId: string;
  onContact: (contact: ContactRequest) => void;
}

export interface ContactRequest {
  id: string;
  recipients: string[];
  method: 'call' | 'sms' | 'email' | 'broadcast';
  message: string;
  priority: 'urgent' | 'normal';
  timestamp: string;
}

const teamMembers = [
  { id: 'tm-1', name: 'Sarah Johnson', role: 'Test Coordinator', phone: '+966 50 123 4567', email: 'sarah.johnson@company.com', status: 'Active' },
  { id: 'tm-2', name: 'Ahmed Al-Mansouri', role: 'IT Lead', phone: '+966 50 234 5678', email: 'ahmed.almansouri@company.com', status: 'Active' },
  { id: 'tm-3', name: 'Mohammed Hassan', role: 'Business Lead', phone: '+966 50 345 6789', email: 'mohammed.hassan@company.com', status: 'Active' },
  { id: 'tm-4', name: 'Fatima Al-Rashid', role: 'Observer', phone: '+966 50 456 7890', email: 'fatima.alrashid@company.com', status: 'Standby' },
  { id: 'tm-5', name: 'Omar Al-Dosari', role: 'Facilities Manager', phone: '+966 50 567 8901', email: 'omar.aldosari@company.com', status: 'Active' },
  { id: 'tm-6', name: 'Layla Al-Qassim', role: 'HR Representative', phone: '+966 50 678 9012', email: 'layla.alqassim@company.com', status: 'Standby' }
];

const contactMethods = [
  { value: 'call', label: 'Phone Call', icon: PhoneIcon, description: 'Direct voice call' },
  { value: 'sms', label: 'SMS', icon: ChatBubbleLeftRightIcon, description: 'Text message' },
  { value: 'email', label: 'Email', icon: EnvelopeIcon, description: 'Email notification' },
  { value: 'broadcast', label: 'Broadcast All', icon: MegaphoneIcon, description: 'Contact all at once' }
];

export default function ContactTeamModal({ isOpen, onClose, testId, onContact }: ContactTeamModalProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [contactMethod, setContactMethod] = useState<ContactRequest['method']>('call');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'urgent' | 'normal'>('normal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAll = () => {
    setSelectedMembers(teamMembers.map(m => m.id));
  };

  const clearSelection = () => {
    setSelectedMembers([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const contactRequest: ContactRequest = {
      id: `CONT-${Date.now()}`,
      recipients: selectedMembers,
      method: contactMethod,
      message,
      priority,
      timestamp: new Date().toISOString()
    };

    onContact(contactRequest);
    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setSelectedMembers([]);
      setMessage('');
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-sm">
          {/* Header */}
          <div className="bg-green-50 px-6 py-4 border-b border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-sm">
                  <UserGroupIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Contact Team</h2>
                  <p className="text-xs text-gray-600">Test: {testId} | Send urgent communications</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {isSuccess ? (
            <div className="px-6 py-12 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Message Sent Successfully</h3>
              <p className="text-sm text-gray-600">
                {selectedMembers.length} team member(s) have been contacted via {contactMethod}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Contact Method */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Contact Method
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {contactMethods.map((method) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setContactMethod(method.value as ContactRequest['method'])}
                        className={`p-3 rounded-sm border text-center transition-colors ${
                          contactMethod === method.value
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <method.icon className="h-5 w-5 mx-auto mb-1" />
                        <span className="text-xs font-medium block">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Priority
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value="urgent"
                        checked={priority === 'urgent'}
                        onChange={() => setPriority('urgent')}
                        className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">🚨 Urgent</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value="normal"
                        checked={priority === 'normal'}
                        onChange={() => setPriority('normal')}
                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">📋 Normal</span>
                    </label>
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Select Recipients ({selectedMembers.length} selected)
                    </label>
                    <div className="flex gap-2">
                      <button type="button" onClick={selectAll} className="text-xs text-green-600 hover:text-green-700">
                        Select All
                      </button>
                      <span className="text-gray-300">|</span>
                      <button type="button" onClick={clearSelection} className="text-xs text-gray-600 hover:text-gray-700">
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-sm divide-y divide-gray-100 max-h-48 overflow-y-auto">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => toggleMember(member.id)}
                        className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                          selectedMembers.includes(member.id) ? 'bg-green-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(member.id)}
                            onChange={() => {}}
                            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <div className="p-1.5 bg-gray-100 rounded-full">
                            <UserIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] px-2 py-0.5 rounded-sm ${
                            member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                    Message {contactMethod !== 'call' && '*'}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    required={contactMethod !== 'call'}
                    placeholder={contactMethod === 'call' ? 'Optional: Talking points for the call...' : 'Enter your message...'}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Quick Messages */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Quick Messages
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Please join the test immediately',
                      'Awaiting your input for current phase',
                      'Test paused - standby for update',
                      'Critical deviation - need assistance'
                    ].map((quick, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setMessage(quick)}
                        className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-sm hover:bg-gray-200 transition-colors"
                      >
                        {quick}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || selectedMembers.length === 0 || (contactMethod !== 'call' && !message)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <PhoneIcon className="h-4 w-4" />
                      Contact {selectedMembers.length} Member(s)
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

