'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, PlusIcon, BuildingOfficeIcon, MapPinIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Workspace {
  id: string;
  name: string;
  type: 'Primary' | 'Alternate' | 'Remote';
  address: string;
  capacity: number;
  distance: string;
  activationTime: string;
  facilities: string[];
  isSelected: boolean;
}

export default function WorkspacePage() {
  const router = useRouter();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    {
      id: '1', name: 'Headquarters - Riyadh', type: 'Primary', address: 'King Fahd Road, Riyadh 12345',
      capacity: 500, distance: '0 km', activationTime: 'N/A',
      facilities: ['Full IT Infrastructure', 'Conference Rooms', 'Cafeteria', 'Parking'], isSelected: true
    },
    {
      id: '2', name: 'Disaster Recovery Site - Jeddah', type: 'Alternate', address: 'Al Madinah Road, Jeddah 54321',
      capacity: 150, distance: '950 km', activationTime: '4 hours',
      facilities: ['Basic IT Infrastructure', 'Meeting Rooms', 'Hot Desks'], isSelected: true
    },
    {
      id: '3', name: 'Partner Co-working Space', type: 'Alternate', address: 'Olaya District, Riyadh 67890',
      capacity: 50, distance: '15 km', activationTime: '2 hours',
      facilities: ['Internet', 'Meeting Rooms', 'Hot Desks'], isSelected: false
    },
    {
      id: '4', name: 'Work From Home', type: 'Remote', address: 'Employee Residences',
      capacity: 200, distance: 'Various', activationTime: 'Immediate',
      facilities: ['VPN Access', 'Collaboration Tools'], isSelected: true
    }
  ]);

  const handleClose = () => router.push('/it-dr-plans');
  const handleBack = () => router.push('/it-dr-plans/create/resources');
  const handleNext = () => router.push('/it-dr-plans/create/communications');
  const handleSaveDraft = () => alert('Draft saved successfully');

  const toggleWorkspace = (id: string) => {
    setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, isSelected: !w.isSelected } : w));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Primary': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Alternate': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Remote': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const selectedCount = workspaces.filter(w => w.isSelected).length;

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
                <div key={step} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${step === 8 ? 'bg-gray-900 text-white' : step < 8 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step < 8 ? '✓' : step}
                </div>
              ))}
            </div>
            <div className="text-center mt-2"><span className="text-[10px] text-gray-600 uppercase tracking-wider">Step 8 of 12: Alternate Workspaces</span></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Alternate Workspaces</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">Select recovery locations for this BCP ({selectedCount} selected)</p>
              </div>
              <button className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
                <PlusIcon className="h-3 w-3" /> Add Workspace
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              {workspaces.map((ws) => (
                <div key={ws.id} onClick={() => toggleWorkspace(ws.id)}
                  className={`relative border rounded-sm p-3 cursor-pointer transition-all ${ws.isSelected ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-400'}`}>
                  <div className={`absolute top-2 right-2 w-4 h-4 rounded-sm border flex items-center justify-center ${ws.isSelected ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-300'}`}>
                    {ws.isSelected && <CheckCircleIcon className="h-3 w-3" />}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <BuildingOfficeIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-900">{ws.name}</span>
                  </div>
                  <span className={`inline-flex px-1.5 py-0.5 text-[9px] font-medium rounded-sm border ${getTypeColor(ws.type)}`}>{ws.type}</span>
                  <div className="mt-2 space-y-1 text-[10px] text-gray-500">
                    <div className="flex items-center gap-1"><MapPinIcon className="h-3 w-3" />{ws.address}</div>
                    <div className="flex items-center gap-1"><UserGroupIcon className="h-3 w-3" />Capacity: {ws.capacity} seats</div>
                    <div>Distance: {ws.distance} | Activation: {ws.activationTime}</div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {ws.facilities.slice(0, 3).map((f, idx) => (
                      <span key={idx} className="px-1 py-0.5 text-[8px] bg-gray-100 text-gray-600 rounded">{f}</span>
                    ))}
                    {ws.facilities.length > 3 && <span className="px-1 py-0.5 text-[8px] bg-gray-100 text-gray-600 rounded">+{ws.facilities.length - 3}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={handleBack} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">← Back</button>
            <button onClick={handleSaveDraft} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">Save Draft</button>
            <button onClick={handleNext} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">Next: Communications</button>
          </div>
        </div>
      </div>
    </div>
  );
}

