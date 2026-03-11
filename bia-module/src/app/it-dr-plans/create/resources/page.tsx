'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, PlusIcon, UserGroupIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  isBackup: boolean;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
}

export default function ResourcesPage() {
  const router = useRouter();

  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1', name: 'Crisis Management Team', description: 'Executive leadership for major incidents',
      members: [
        { id: '1a', name: 'John Smith', role: 'Incident Commander', phone: '+966 50 123 4567', email: 'john.smith@company.com', isBackup: false },
        { id: '1b', name: 'Sarah Johnson', role: 'Incident Commander (Backup)', phone: '+966 50 234 5678', email: 'sarah.j@company.com', isBackup: true }
      ]
    },
    {
      id: '2', name: 'IT Recovery Team', description: 'Technical recovery and system restoration',
      members: [
        { id: '2a', name: 'Ahmed Al-Hassan', role: 'IT Recovery Lead', phone: '+966 50 345 6789', email: 'ahmed.h@company.com', isBackup: false },
        { id: '2b', name: 'Mohammed Khan', role: 'Database Administrator', phone: '+966 50 456 7890', email: 'mohammed.k@company.com', isBackup: false },
        { id: '2c', name: 'Lisa Chen', role: 'Network Administrator', phone: '+966 50 567 8901', email: 'lisa.c@company.com', isBackup: false }
      ]
    },
    {
      id: '3', name: 'Business Recovery Team', description: 'Business operations continuity',
      members: [
        { id: '3a', name: 'Fatima Al-Rashid', role: 'Business Recovery Lead', phone: '+966 50 678 9012', email: 'fatima.r@company.com', isBackup: false },
        { id: '3b', name: 'Omar Mansour', role: 'Operations Coordinator', phone: '+966 50 789 0123', email: 'omar.m@company.com', isBackup: false }
      ]
    }
  ]);

  const handleClose = () => router.push('/it-dr-plans');
  const handleBack = () => router.push('/it-dr-plans/create/checklists');
  const handleNext = () => router.push('/it-dr-plans/create/workspace');
  const handleSaveDraft = () => alert('Draft saved successfully');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-6">
        {/* Header */}
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
                <div key={step} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${step === 7 ? 'bg-gray-900 text-white' : step < 7 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step < 7 ? '✓' : step}
                </div>
              ))}
            </div>
            <div className="text-center mt-2"><span className="text-[10px] text-gray-600 uppercase tracking-wider">Step 7 of 12: Resources & Teams</span></div>
          </div>
        </div>

        {/* Teams */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Recovery Teams</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">Define teams and personnel for BCP execution</p>
              </div>
              <button className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
                <PlusIcon className="h-3 w-3" /> Add Team
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {teams.map((team) => (
                <div key={team.id} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <UserGroupIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-900">{team.name}</span>
                    <span className="text-[10px] text-gray-500">— {team.description}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {team.members.map((member) => (
                      <div key={member.id} className={`flex items-center gap-3 p-2 rounded-sm border ${member.isBackup ? 'bg-gray-50 border-gray-200 border-dashed' : 'bg-white border-gray-200'}`}>
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-900">{member.name}</span>
                            {member.isBackup && <span className="px-1 py-0.5 text-[8px] bg-gray-200 text-gray-600 rounded">BACKUP</span>}
                          </div>
                          <span className="text-[10px] text-gray-500">{member.role}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1"><PhoneIcon className="h-3 w-3" />{member.phone}</span>
                          <span>{member.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-2 inline-flex items-center gap-1 px-2 py-1 text-[10px] text-gray-500 hover:text-gray-700">
                    <PlusIcon className="h-3 w-3" /> Add Member
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={handleBack} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">← Back</button>
            <button onClick={handleSaveDraft} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">Save Draft</button>
            <button onClick={handleNext} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">Next: Workspace</button>
          </div>
        </div>
      </div>
    </div>
  );
}

