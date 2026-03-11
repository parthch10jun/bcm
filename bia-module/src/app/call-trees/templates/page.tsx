'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  PlusIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  UsersIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface CallTreeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'IT Emergency' | 'Facility Emergency' | 'Security Incident' | 'Business Continuity' | 'Custom';
  estimatedParticipants: number;
  estimatedDuration: number; // in minutes
  structure: {
    levels: number;
    maxBranching: number;
    hasEscalation: boolean;
  };
  applicableScenarios: string[];
  createdBy: string;
  createdAt: Date;
  usageCount: number;
  lastUsed?: Date;
}

// Mock templates data
const mockTemplates: CallTreeTemplate[] = [
  {
    id: 'template-001',
    name: 'IT Infrastructure Emergency',
    description: 'Standard template for critical IT system failures and cyber security incidents',
    category: 'IT Emergency',
    estimatedParticipants: 15,
    estimatedDuration: 30,
    structure: {
      levels: 3,
      maxBranching: 4,
      hasEscalation: true
    },
    applicableScenarios: ['Server outage', 'Network failure', 'Database corruption', 'Cyber attack'],
    createdBy: 'John Doe',
    createdAt: new Date('2024-01-10'),
    usageCount: 8,
    lastUsed: new Date('2024-02-15')
  },
  {
    id: 'template-002',
    name: 'Building Evacuation',
    description: 'Emergency evacuation communication for office buildings and facilities',
    category: 'Facility Emergency',
    estimatedParticipants: 25,
    estimatedDuration: 15,
    structure: {
      levels: 2,
      maxBranching: 6,
      hasEscalation: false
    },
    applicableScenarios: ['Fire alarm', 'Gas leak', 'Structural damage', 'Security threat'],
    createdBy: 'Sarah Wilson',
    createdAt: new Date('2024-01-15'),
    usageCount: 3,
    lastUsed: new Date('2024-01-28')
  },
  {
    id: 'template-003',
    name: 'Data Breach Response',
    description: 'Coordinated response for data security incidents and privacy breaches',
    category: 'Security Incident',
    estimatedParticipants: 12,
    estimatedDuration: 45,
    structure: {
      levels: 4,
      maxBranching: 3,
      hasEscalation: true
    },
    applicableScenarios: ['Data breach', 'Unauthorized access', 'Privacy violation', 'Compliance incident'],
    createdBy: 'Mike Johnson',
    createdAt: new Date('2024-01-20'),
    usageCount: 2,
    lastUsed: new Date('2024-02-10')
  },
  {
    id: 'template-004',
    name: 'Business Continuity Activation',
    description: 'General business continuity plan activation for operational disruptions',
    category: 'Business Continuity',
    estimatedParticipants: 20,
    estimatedDuration: 60,
    structure: {
      levels: 3,
      maxBranching: 5,
      hasEscalation: true
    },
    applicableScenarios: ['Natural disaster', 'Pandemic response', 'Supply chain disruption', 'Key personnel unavailable'],
    createdBy: 'Lisa Chen',
    createdAt: new Date('2024-01-25'),
    usageCount: 5,
    lastUsed: new Date('2024-02-20')
  }
];

export default function CallTreeTemplatesPage() {
  const [templates, setTemplates] = useState<CallTreeTemplate[]>(mockTemplates);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'IT Emergency', 'Facility Emergency', 'Security Incident', 'Business Continuity', 'Custom'];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'IT Emergency': return 'bg-blue-100 text-blue-800';
      case 'Facility Emergency': return 'bg-red-100 text-red-800';
      case 'Security Incident': return 'bg-orange-100 text-orange-800';
      case 'Business Continuity': return 'bg-green-100 text-green-800';
      case 'Custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUseTemplate = (templateId: string) => {
    // This would redirect to create new call tree with template pre-filled
    console.log('Using template:', templateId);
  };

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/call-trees"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Call Trees
            </Link>
          </div>
          <Link
            href="/call-trees/templates/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Template
          </Link>
        </div>
        
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900">Call Tree Templates</h1>
          <p className="mt-2 text-lg text-gray-600">Pre-built communication structures for common emergency scenarios</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <DocumentDuplicateIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Templates</p>
              <p className="text-2xl font-semibold text-gray-900">{templates.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Participants</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(templates.reduce((sum, t) => sum + t.estimatedParticipants, 0) / templates.length)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Duration</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(templates.reduce((sum, t) => sum + t.estimatedDuration, 0) / templates.length)}m
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <PhoneIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Usage</p>
              <p className="text-2xl font-semibold text-gray-900">
                {templates.reduce((sum, t) => sum + t.usageCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                  {template.category}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <UsersIcon className="h-4 w-4 mr-2" />
                {template.estimatedParticipants} participants
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="h-4 w-4 mr-2" />
                ~{template.estimatedDuration} minutes
              </div>
              <div className="text-sm text-gray-500">
                Used {template.usageCount} times
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Applicable Scenarios:</p>
              <div className="flex flex-wrap gap-1">
                {template.applicableScenarios.slice(0, 3).map((scenario, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                    {scenario}
                  </span>
                ))}
                {template.applicableScenarios.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                    +{template.applicableScenarios.length - 3} more
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                >
                  <DocumentDuplicateIcon className="h-3 w-3 mr-1" />
                  Use Template
                </button>
                <Link
                  href={`/call-trees/templates/${template.id}`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  <EyeIcon className="h-3 w-3 mr-1" />
                  View
                </Link>
              </div>
              <div className="flex space-x-1">
                <Link
                  href={`/call-trees/templates/${template.id}/edit`}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <PencilIcon className="h-4 w-4" />
                </Link>
                <button className="text-gray-400 hover:text-red-600">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No templates match the selected category.
          </p>
        </div>
      )}
    </div>
  );
}
