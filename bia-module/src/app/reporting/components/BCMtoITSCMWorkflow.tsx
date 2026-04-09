'use client';

import {
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ServerStackIcon,
  CogIcon,
  ShieldCheckIcon,
  BeakerIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface WorkflowStage {
  id: string;
  name: string;
  module: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  outputs: string[];
  status: 'complete' | 'in-progress' | 'pending';
  completionRate: number;
}

export default function BCMtoITSCMWorkflow() {
  const bcmStages: WorkflowStage[] = [
    {
      id: 'bia',
      name: 'Business Impact Analysis',
      module: 'BCM',
      icon: ClipboardDocumentListIcon,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      outputs: ['RTO/RPO Requirements', 'Critical Processes', 'IT Dependencies'],
      status: 'complete',
      completionRate: 95
    },
    {
      id: 'risk',
      name: 'Risk Assessment',
      module: 'BCM',
      icon: ExclamationTriangleIcon,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      outputs: ['Risk Scenarios', 'Threat Landscape', 'Vulnerability Analysis'],
      status: 'complete',
      completionRate: 88
    },
    {
      id: 'bcp',
      name: 'Business Continuity Plans',
      module: 'BCM',
      icon: DocumentTextIcon,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      outputs: ['Recovery Strategies', 'Business Procedures', 'IT Requirements'],
      status: 'complete',
      completionRate: 92
    }
  ];

  const itscmStages: WorkflowStage[] = [
    {
      id: 'it-service-analysis',
      name: 'IT Service Continuity Analysis',
      module: 'ITSCM',
      icon: ServerStackIcon,
      color: 'text-cyan-700',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-300',
      outputs: ['IT Service Catalog', 'Dependency Mapping', 'Recovery Capability Assessment'],
      status: 'complete',
      completionRate: 90
    },
    {
      id: 'recovery-strategy',
      name: 'IT Recovery Strategies',
      module: 'ITSCM',
      icon: CogIcon,
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-300',
      outputs: ['Hot/Warm/Cold Site', 'Cloud DR', 'Failover Procedures'],
      status: 'in-progress',
      completionRate: 85
    },
    {
      id: 'it-dr-plans',
      name: 'IT DR Plans',
      module: 'ITSCM',
      icon: ShieldCheckIcon,
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      outputs: ['Application Recovery Plans', 'Infrastructure Recovery Plans', 'Data Recovery Plans'],
      status: 'in-progress',
      completionRate: 87
    },
    {
      id: 'testing',
      name: 'Integrated Testing',
      module: 'BCM + ITSCM',
      icon: BeakerIcon,
      color: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-300',
      outputs: ['Tabletop Exercises', 'DR Simulations', 'Full DR Tests'],
      status: 'in-progress',
      completionRate: 78
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <ClockIcon className="h-4 w-4 text-amber-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-900">BCM → ITSCM Integration Workflow</h2>
        <p className="text-xs text-gray-500 mt-1">
          End-to-end lifecycle showing how Business Continuity Management feeds into IT Service Continuity Management
        </p>
      </div>

      {/* BCM Lifecycle */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-1 rounded-full bg-blue-600"></div>
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">BCM Lifecycle</h3>
        </div>
        <div className="flex items-start gap-3">
          {bcmStages.map((stage, index) => (
            <div key={stage.id} className="flex items-start flex-1">
              <StageCard stage={stage} getStatusIcon={getStatusIcon} />
              {index < bcmStages.length - 1 && (
                <div className="flex items-center justify-center px-2 pt-8">
                  <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Integration Arrow */}
      <div className="flex items-center justify-center my-6">
        <div className="flex flex-col items-center">
          <div className="h-8 w-0.5 bg-gradient-to-b from-purple-400 to-cyan-400"></div>
          <div className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-md">
            BCM Outputs Feed ITSCM Inputs
          </div>
          <div className="h-8 w-0.5 bg-gradient-to-b from-cyan-400 to-indigo-400"></div>
        </div>
      </div>

      {/* ITSCM Lifecycle */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-1 rounded-full bg-cyan-600"></div>
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">ITSCM Lifecycle</h3>
        </div>
        <div className="flex items-start gap-3">
          {itscmStages.map((stage, index) => (
            <div key={stage.id} className="flex items-start flex-1">
              <StageCard stage={stage} getStatusIcon={getStatusIcon} />
              {index < itscmStages.length - 1 && (
                <div className="flex items-center justify-center px-2 pt-8">
                  <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StageCard({ stage, getStatusIcon }: { stage: WorkflowStage; getStatusIcon: (status: string) => JSX.Element }) {
  const Icon = stage.icon;
  
  return (
    <div className={`border-2 ${stage.borderColor} ${stage.bgColor} rounded-sm p-4 flex-1`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-sm ${stage.bgColor} border ${stage.borderColor}`}>
          <Icon className={`h-5 w-5 ${stage.color}`} />
        </div>
        {getStatusIcon(stage.status)}
      </div>
      <h4 className={`text-xs font-semibold ${stage.color} mb-1`}>{stage.name}</h4>
      <p className="text-[10px] text-gray-600 mb-3">{stage.module}</p>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-500">Completion</span>
          <span className="text-[10px] font-semibold text-gray-700">{stage.completionRate}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${stage.bgColor.replace('50', '500')} transition-all duration-500`}
            style={{ width: `${stage.completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Outputs */}
      <div>
        <p className="text-[10px] font-medium text-gray-500 mb-1.5">Key Outputs:</p>
        <ul className="space-y-1">
          {stage.outputs.map((output, idx) => (
            <li key={idx} className="text-[10px] text-gray-600 flex items-start gap-1">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>{output}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

