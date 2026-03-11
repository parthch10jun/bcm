'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, PlusIcon, PhoneIcon, EnvelopeIcon, DevicePhoneMobileIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  sms: boolean;
  order: number;
}

export default function CommunicationsPage() {
  const router = useRouter();

  const [callTree, setCallTree] = useState<Contact[]>([
    { id: '1', name: 'John Smith', role: 'Incident Commander', phone: '+966 50 123 4567', email: 'john.smith@company.com', sms: true, order: 1 },
    { id: '2', name: 'Sarah Johnson', role: 'BCM Manager', phone: '+966 50 234 5678', email: 'sarah.j@company.com', sms: true, order: 2 },
    { id: '3', name: 'Ahmed Al-Hassan', role: 'IT Recovery Lead', phone: '+966 50 345 6789', email: 'ahmed.h@company.com', sms: true, order: 3 },
    { id: '4', name: 'Fatima Al-Rashid', role: 'Business Recovery Lead', phone: '+966 50 678 9012', email: 'fatima.r@company.com', sms: true, order: 4 },
    { id: '5', name: 'External: Hotline', role: 'Regulator', phone: '+966 11 466 6000', email: 'bcm@sama.gov.sa', sms: false, order: 5 }
  ]);

  const [templates] = useState([
    { id: '1', name: 'Initial Incident Alert', type: 'SMS', subject: '', body: 'ALERT: BCP activated for [Service]. Report to [Location]. Contact IC for instructions.' },
    { id: '2', name: 'Stakeholder Update', type: 'Email', subject: 'BCP Status Update - [Service]', body: 'Dear Stakeholder,\n\nThis is to inform you that our BCP has been activated...' },
    { id: '3', name: 'Stand-down Notice', type: 'Email', subject: 'BCP Stand-down Notice', body: 'The incident has been resolved and normal operations have resumed...' }
  ]);

  const handleClose = () => router.push('/it-dr-plans');
  const handleBack = () => router.push('/it-dr-plans/create/workspace');
  const handleNext = () => router.push('/it-dr-plans/create/testing');
  const handleSaveDraft = () => alert('Draft saved successfully');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-6">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-4">
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">BCP: Customer Service Operations</h1>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-50">
            <div className="flex items-center justify-center gap-1.5">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((step) => (
                <div key={step} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${step === 9 ? 'bg-gray-900 text-white' : step < 9 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step < 9 ? '✓' : step}
                </div>
              ))}
            </div>
            <div className="text-center mt-2"><span className="text-[10px] text-gray-600 uppercase tracking-wider">Step 9 of 12: Communications</span></div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Call Tree */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Call Tree</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">Define notification sequence for incident communication</p>
              </div>
              <button className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
                <PlusIcon className="h-3 w-3" /> Add Contact
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {callTree.map((contact, idx) => (
                  <div key={contact.id}>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-200">
                      <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-[10px] font-medium flex items-center justify-center">{contact.order}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900">{contact.name}</div>
                        <div className="text-[10px] text-gray-500">{contact.role}</div>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-gray-500">
                        <span className="flex items-center gap-1"><PhoneIcon className="h-3 w-3" />{contact.phone}</span>
                        <span className="flex items-center gap-1"><EnvelopeIcon className="h-3 w-3" />{contact.email}</span>
                        {contact.sms && <span className="flex items-center gap-1"><DevicePhoneMobileIcon className="h-3 w-3 text-green-600" />SMS</span>}
                      </div>
                    </div>
                    {idx < callTree.length - 1 && (
                      <div className="flex justify-center py-1"><ArrowDownIcon className="h-4 w-4 text-gray-300" /></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notification Templates */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Notification Templates</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">Pre-defined messages for different scenarios</p>
              </div>
              <button className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm border border-gray-300">
                <PlusIcon className="h-3 w-3" /> Add Template
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {templates.map((tmpl) => (
                <div key={tmpl.id} className="p-3 hover:bg-gray-50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-900">{tmpl.name}</span>
                    <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded-sm ${tmpl.type === 'SMS' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>{tmpl.type}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{tmpl.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={handleBack} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">← Back</button>
            <button onClick={handleSaveDraft} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">Save Draft</button>
            <button onClick={handleNext} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">Next: Testing</button>
          </div>
        </div>
      </div>
    </div>
  );
}

