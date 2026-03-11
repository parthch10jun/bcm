'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  BoltIcon,
  GlobeAltIcon,
  ShieldExclamationIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface Scenario {
  id: string;
  name: string;
  description: string;
  category: 'Facility' | 'Technology' | 'People' | 'Utilities' | 'External' | 'Cyber';
  impact: 'Critical' | 'High' | 'Medium' | 'Low';
  selected: boolean;
}

export default function ScenarioCatalogPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: '1', name: 'Facility Loss', description: 'Building unavailable due to damage or access restrictions', category: 'Facility', impact: 'High', selected: true },
    { id: '2', name: 'IT System Outage', description: 'Critical systems failure affecting operations', category: 'Technology', impact: 'Critical', selected: true },
    { id: '3', name: 'Pandemic', description: 'Mass staff absence due to health emergency', category: 'People', impact: 'Medium', selected: false },
    { id: '4', name: 'Power Outage', description: 'Extended electrical supply disruption', category: 'Utilities', impact: 'High', selected: false },
    { id: '5', name: 'Cyber Attack', description: 'Security breach or ransomware incident', category: 'Cyber', impact: 'Critical', selected: true },
    { id: '6', name: 'Natural Disaster', description: 'Earthquake, flood, or severe weather event', category: 'External', impact: 'High', selected: false },
    { id: '7', name: 'Key Personnel Loss', description: 'Unavailability of critical staff members', category: 'People', impact: 'Medium', selected: false },
    { id: '8', name: 'Network Failure', description: 'Internet or network connectivity disruption', category: 'Technology', impact: 'High', selected: true },
    { id: '9', name: 'Supplier Failure', description: 'Critical third-party service disruption', category: 'External', impact: 'High', selected: false }
  ]);

  const categories = ['All', 'Facility', 'Technology', 'People', 'Utilities', 'External', 'Cyber'];

  const handleClose = () => router.push('/it-dr-plans');
  const handleBack = () => router.push('/it-dr-plans/create/activation');
  const handleNext = () => router.push('/it-dr-plans/create/response');
  const handleSaveDraft = () => alert('Draft saved successfully');

  const toggleScenario = (id: string) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-200';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Facility': return <BuildingOfficeIcon className="h-5 w-5" />;
      case 'Technology': return <ComputerDesktopIcon className="h-5 w-5" />;
      case 'People': return <UserGroupIcon className="h-5 w-5" />;
      case 'Utilities': return <BoltIcon className="h-5 w-5" />;
      case 'External': return <GlobeAltIcon className="h-5 w-5" />;
      case 'Cyber': return <ShieldExclamationIcon className="h-5 w-5" />;
      default: return <BuildingOfficeIcon className="h-5 w-5" />;
    }
  };

  const filteredScenarios = scenarios.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const selectedCount = scenarios.filter(s => s.selected).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-6">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-4">
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">BCP: Customer Service Operations</h1>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 py-3 bg-gray-50">
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${
                    step === 4 ? 'bg-gray-900 text-white' :
                    step < 4 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < 4 ? '✓' : step}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">Step 4 of 12: Scenario Catalog</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-4">
          {/* Disruption Scenarios Section */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Disruption Scenarios</h2>
                  <p className="text-[10px] text-gray-500 mt-0.5">Select scenarios that could disrupt this business service</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-medium rounded-sm">
                  {selectedCount} selected
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search scenarios..."
                    className="w-full pl-8 pr-3 h-[30px] text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="appearance-none pl-3 pr-8 h-[30px] text-xs border border-gray-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Scenarios Grid */}
            <div className="p-4">
              <div className="grid grid-cols-3 gap-3">
                {filteredScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    onClick={() => toggleScenario(scenario.id)}
                    className={`relative border rounded-sm p-3 cursor-pointer transition-all ${
                      scenario.selected
                        ? 'border-gray-900 bg-gray-50 ring-1 ring-gray-900'
                        : 'border-gray-200 bg-white hover:border-gray-400'
                    }`}
                  >
                    {/* Checkbox indicator */}
                    <div className={`absolute top-2 right-2 w-4 h-4 rounded-sm border flex items-center justify-center ${
                      scenario.selected
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'border-gray-300'
                    }`}>
                      {scenario.selected && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center mb-2 ${
                      scenario.selected ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {getCategoryIcon(scenario.category)}
                    </div>

                    {/* Content */}
                    <h3 className="text-xs font-medium text-gray-900 mb-1">{scenario.name}</h3>
                    <p className="text-[10px] text-gray-500 mb-2 line-clamp-2">{scenario.description}</p>

                    {/* Impact badge */}
                    <span className={`inline-flex px-1.5 py-0.5 text-[9px] font-medium rounded-sm border ${getImpactBadgeColor(scenario.impact)}`}>
                      Impact: {scenario.impact}
                    </span>

                    {/* View Details link */}
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="block mt-2 text-[10px] text-gray-500 hover:text-gray-900 underline"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              {filteredScenarios.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xs text-gray-500">No scenarios match your search criteria</p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Scenarios Summary */}
          {selectedCount > 0 && (
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4">
              <h3 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">Selected Scenarios ({selectedCount})</h3>
              <div className="flex flex-wrap gap-2">
                {scenarios.filter(s => s.selected).map(s => (
                  <span key={s.id} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-sm">
                    {s.name}
                    <button
                      onClick={() => toggleScenario(s.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={handleBack} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              ← Back
            </button>
            <button onClick={handleSaveDraft} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              Save Draft
            </button>
            <button onClick={handleNext} className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-sm hover:bg-gray-800">
              Next: Response Procedures
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

