'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  ChevronLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  PlayIcon,
  ArrowDownTrayIcon,
  CubeIcon,
  ServerStackIcon,
  CircleStackIcon,
  CpuChipIcon,
  CloudIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Mock data for ITSCM Application Mapping
const mockApplications = [
  // Business Processes (Layer 1)
  { id: 'bp-1', name: 'Claims Processing', type: 'businessProcess', tier: 'Tier 1', rto: '2h', dependencies: ['app-1', 'app-2'] },
  { id: 'bp-2', name: 'Policy Underwriting', type: 'businessProcess', tier: 'Tier 1', rto: '4h', dependencies: ['app-1', 'app-3'] },
  { id: 'bp-3', name: 'Customer Portal', type: 'businessProcess', tier: 'Tier 2', rto: '8h', dependencies: ['app-4', 'app-5'] },
  { id: 'bp-4', name: 'Payment Processing', type: 'businessProcess', tier: 'Tier 1', rto: '2h', dependencies: ['app-6'] },
  { id: 'bp-5', name: 'Risk Assessment', type: 'businessProcess', tier: 'Tier 2', rto: '8h', dependencies: ['app-7'] },
  
  // IT Applications (Layer 2)
  { id: 'app-1', name: 'Core Insurance Platform', type: 'application', tier: 'Tier 1', rto: '2h', dependencies: ['db-1', 'db-2'] },
  { id: 'app-2', name: 'Claims Management System', type: 'application', tier: 'Tier 1', rto: '2h', dependencies: ['db-1'] },
  { id: 'app-3', name: 'Policy Admin System', type: 'application', tier: 'Tier 1', rto: '4h', dependencies: ['db-2'] },
  { id: 'app-4', name: 'Customer Portal App', type: 'application', tier: 'Tier 2', rto: '8h', dependencies: ['db-3'] },
  { id: 'app-5', name: 'CRM System', type: 'application', tier: 'Tier 2', rto: '8h', dependencies: ['db-3'] },
  { id: 'app-6', name: 'Payment Gateway', type: 'application', tier: 'Tier 1', rto: '2h', dependencies: ['db-4', 'vendor-1'] },
  { id: 'app-7', name: 'Analytics Platform', type: 'application', tier: 'Tier 2', rto: '8h', dependencies: ['db-5'] },
  
  // Databases (Layer 3)
  { id: 'db-1', name: 'Claims Database', type: 'database', tier: 'Tier 1', rpo: '1h', dependencies: ['infra-1'] },
  { id: 'db-2', name: 'Policy Database', type: 'database', tier: 'Tier 1', rpo: '1h', dependencies: ['infra-1'] },
  { id: 'db-3', name: 'Customer Database', type: 'database', tier: 'Tier 2', rpo: '4h', dependencies: ['infra-2'] },
  { id: 'db-4', name: 'Payment Database', type: 'database', tier: 'Tier 1', rpo: '30min', dependencies: ['infra-1'] },
  { id: 'db-5', name: 'Data Warehouse', type: 'database', tier: 'Tier 3', rpo: '24h', dependencies: ['infra-2'] },
  
  // Infrastructure (Layer 4)
  { id: 'infra-1', name: 'Primary Data Center', type: 'infrastructure', tier: 'Tier 1', location: 'Munich', dependencies: ['cloud-1'] },
  { id: 'infra-2', name: 'Secondary Data Center', type: 'infrastructure', tier: 'Tier 2', location: 'Frankfurt', dependencies: ['cloud-1'] },
  { id: 'infra-3', name: 'Network Infrastructure', type: 'infrastructure', tier: 'Tier 1', location: 'Munich', dependencies: [] },
  
  // Third-Party Services (Layer 5)
  { id: 'cloud-1', name: 'AWS DR Site', type: 'cloud', tier: 'Tier 1', sla: '99.99%', dependencies: [] },
  { id: 'vendor-1', name: 'Payment Processor', type: 'cloud', tier: 'Tier 1', sla: '99.95%', dependencies: [] },
  { id: 'vendor-2', name: 'Email Service', type: 'cloud', tier: 'Tier 2', sla: '99.9%', dependencies: [] }
];

// Helper function to generate nodes with proper positioning
const generateNodes = (apps: typeof mockApplications, selectedId: string | null): Node[] => {
  const nodesByType: Record<string, any[]> = {
    businessProcess: [],
    application: [],
    database: [],
    infrastructure: [],
    cloud: []
  };

  apps.forEach(app => {
    nodesByType[app.type]?.push(app);
  });

  const nodes: Node[] = [];
  let yOffset = 0;
  const layerSpacing = 200;
  const nodeSpacing = 180;

  // Layer 1: Business Processes (Blue)
  nodesByType.businessProcess.forEach((app, idx) => {
    const isSelected = selectedId === app.id;
    const isDependency = selectedId && mockApplications.find(a => a.id === selectedId)?.dependencies?.includes(app.id);

    nodes.push({
      id: app.id,
      type: 'default',
      position: { x: idx * nodeSpacing, y: yOffset },
      data: { label: app.name },
      style: {
        background: isSelected ? '#3B82F6' : isDependency ? '#FCD34D' : '#DBEAFE',
        color: isSelected || isDependency ? '#fff' : '#1E40AF',
        border: `2px solid ${isSelected ? '#1E40AF' : isDependency ? '#F59E0B' : '#93C5FD'}`,
        borderRadius: '4px',
        padding: '12px',
        fontSize: '12px',
        fontWeight: '500',
        width: 160
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top
    });
  });

  // Layer 2: Applications (Purple)
  yOffset += layerSpacing;
  nodesByType.application.forEach((app, idx) => {
    const isSelected = selectedId === app.id;
    const isDependency = selectedId && mockApplications.find(a => a.id === selectedId)?.dependencies?.includes(app.id);

    nodes.push({
      id: app.id,
      type: 'default',
      position: { x: idx * nodeSpacing, y: yOffset },
      data: { label: app.name },
      style: {
        background: isSelected ? '#9333EA' : isDependency ? '#FCD34D' : '#F3E8FF',
        color: isSelected || isDependency ? '#fff' : '#6B21A8',
        border: `2px solid ${isSelected ? '#6B21A8' : isDependency ? '#F59E0B' : '#C084FC'}`,
        borderRadius: '4px',
        padding: '12px',
        fontSize: '12px',
        fontWeight: '500',
        width: 160
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top
    });
  });

  // Layer 3: Databases (Green)
  yOffset += layerSpacing;
  nodesByType.database.forEach((app, idx) => {
    const isSelected = selectedId === app.id;
    const isDependency = selectedId && mockApplications.find(a => a.id === selectedId)?.dependencies?.includes(app.id);

    nodes.push({
      id: app.id,
      type: 'default',
      position: { x: idx * nodeSpacing + 90, y: yOffset },
      data: { label: app.name },
      style: {
        background: isSelected ? '#10B981' : isDependency ? '#FCD34D' : '#D1FAE5',
        color: isSelected || isDependency ? '#fff' : '#065F46',
        border: `2px solid ${isSelected ? '#065F46' : isDependency ? '#F59E0B' : '#6EE7B7'}`,
        borderRadius: '4px',
        padding: '12px',
        fontSize: '12px',
        fontWeight: '500',
        width: 160
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top
    });
  });

  // Layer 4: Infrastructure (Orange)
  yOffset += layerSpacing;
  nodesByType.infrastructure.forEach((app, idx) => {
    const isSelected = selectedId === app.id;
    const isDependency = selectedId && mockApplications.find(a => a.id === selectedId)?.dependencies?.includes(app.id);

    nodes.push({
      id: app.id,
      type: 'default',
      position: { x: idx * nodeSpacing + 180, y: yOffset },
      data: { label: app.name },
      style: {
        background: isSelected ? '#F97316' : isDependency ? '#FCD34D' : '#FFEDD5',
        color: isSelected || isDependency ? '#fff' : '#9A3412',
        border: `2px solid ${isSelected ? '#9A3412' : isDependency ? '#F59E0B' : '#FB923C'}`,
        borderRadius: '4px',
        padding: '12px',
        fontSize: '12px',
        fontWeight: '500',
        width: 160
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top
    });
  });

  // Layer 5: Third-Party Services (Gray)
  yOffset += layerSpacing;
  nodesByType.cloud.forEach((app, idx) => {
    const isSelected = selectedId === app.id;
    const isDependency = selectedId && mockApplications.find(a => a.id === selectedId)?.dependencies?.includes(app.id);

    nodes.push({
      id: app.id,
      type: 'default',
      position: { x: idx * nodeSpacing + 270, y: yOffset },
      data: { label: app.name },
      style: {
        background: isSelected ? '#6B7280' : isDependency ? '#FCD34D' : '#F3F4F6',
        color: isSelected || isDependency ? '#fff' : '#374151',
        border: `2px solid ${isSelected ? '#374151' : isDependency ? '#F59E0B' : '#9CA3AF'}`,
        borderRadius: '4px',
        padding: '12px',
        fontSize: '12px',
        fontWeight: '500',
        width: 160
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top
    });
  });

  return nodes;
};

// Helper function to generate edges
const generateEdges = (apps: typeof mockApplications, selectedId: string | null): Edge[] => {
  const edges: Edge[] = [];

  apps.forEach(app => {
    app.dependencies?.forEach(depId => {
      const isHighlighted = selectedId === app.id || selectedId === depId;

      edges.push({
        id: `${app.id}-${depId}`,
        source: app.id,
        target: depId,
        type: 'smoothstep',
        animated: isHighlighted,
        style: {
          stroke: isHighlighted ? '#3B82F6' : '#D1D5DB',
          strokeWidth: isHighlighted ? 2 : 1
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isHighlighted ? '#3B82F6' : '#D1D5DB',
          width: 20,
          height: 20
        },
        label: 'depends on',
        labelStyle: { fontSize: 10, fill: '#6B7280' }
      });
    });
  });

  return edges;
};

interface ApplicationMappingPageProps {}

export default function ApplicationMappingPage({}: ApplicationMappingPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Initialize nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes and edges when filters or selection changes
  useEffect(() => {
    const filteredApps = mockApplications.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || app.type === selectedType;
      const matchesTier = !selectedTier || app.tier === selectedTier;
      return matchesSearch && matchesType && matchesTier;
    });

    setNodes(generateNodes(filteredApps, selectedNode));
    setEdges(generateEdges(filteredApps, selectedNode));
  }, [searchTerm, selectedType, selectedTier, selectedNode, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id === selectedNode ? null : node.id);
  }, [selectedNode]);

  const selectedApp = selectedNode ? mockApplications.find(a => a.id === selectedNode) : null;

  // Run impact simulation
  const runSimulation = (componentId?: string) => {
    const targetId = componentId || selectedNode;
    if (!targetId) return;

    const component = mockApplications.find(a => a.id === targetId);
    if (!component) return;

    // Calculate impact
    const affectedComponents: any[] = [];
    const visited = new Set<string>();

    const findUpstreamImpact = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      mockApplications.forEach(app => {
        if (app.dependencies?.includes(id)) {
          affectedComponents.push({
            id: app.id,
            name: app.name,
            type: app.type,
            tier: app.tier,
            impactLevel: app.tier === 'Tier 1' ? 'Critical' : app.tier === 'Tier 2' ? 'High' : 'Medium'
          });
          findUpstreamImpact(app.id);
        }
      });
    };

    findUpstreamImpact(targetId);

    setSimulationResults({
      component: component.name,
      componentType: component.type,
      totalAffected: affectedComponents.length,
      criticalImpact: affectedComponents.filter(c => c.impactLevel === 'Critical').length,
      highImpact: affectedComponents.filter(c => c.impactLevel === 'High').length,
      mediumImpact: affectedComponents.filter(c => c.impactLevel === 'Medium').length,
      affectedComponents
    });
    setShowSimulation(true);
  };

  // Export to crisis plan
  const exportToCrisisPlan = () => {
    setShowExportModal(true);
  };

  const confirmExport = () => {
    // In production, this would create a new crisis plan with the dependency data
    alert('Dependency map exported to Crisis Plans successfully!');
    setShowExportModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link
                  href="/libraries/it-services"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Back to IT Services
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <CubeIcon className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Application Dependency Mapping</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Visualize IT service dependencies and impact relationships
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => runSimulation()}
                disabled={!selectedNode}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayIcon className="h-4 w-4 mr-2" />
                Run Impact Simulation
              </button>
              <button
                onClick={exportToCrisisPlan}
                className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export to Crisis Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Total Components</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mockApplications.length}</p>
              </div>
              <CubeIcon className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white border border-blue-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase">Business Processes</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {mockApplications.filter(a => a.type === 'businessProcess').length}
                </p>
              </div>
              <CubeIcon className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white border border-purple-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 uppercase">Applications</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">
                  {mockApplications.filter(a => a.type === 'application').length}
                </p>
              </div>
              <ServerStackIcon className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-white border border-green-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 uppercase">Databases</p>
                <p className="text-2xl font-bold text-green-900 mt-1">
                  {mockApplications.filter(a => a.type === 'database').length}
                </p>
              </div>
              <CircleStackIcon className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white border border-orange-200 rounded-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600 uppercase">Infrastructure</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">
                  {mockApplications.filter(a => a.type === 'infrastructure').length}
                </p>
              </div>
              <CpuChipIcon className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>

            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Reset View
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Component Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="businessProcess">Business Processes</option>
                  <option value="application">Applications</option>
                  <option value="database">Databases</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="cloud">Third-Party Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Service Tier</label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Tiers</option>
                  <option value="Tier 1">Tier 1 - Critical</option>
                  <option value="Tier 2">Tier 2 - Important</option>
                  <option value="Tier 3">Tier 3 - Standard</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Dependency Graph and Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* React Flow Graph */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden" style={{ height: '700px' }}>
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">5-Layer Dependency Map</h3>
                <p className="text-xs text-gray-500 mt-1">Click on any component to highlight dependencies</p>
              </div>

              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                fitView
                attributionPosition="bottom-left"
              >
                <Background color="#E5E7EB" gap={16} />
                <Controls />
                <MiniMap
                  nodeColor={(node) => {
                    const app = mockApplications.find(a => a.id === node.id);
                    if (!app) return '#9CA3AF';
                    switch (app.type) {
                      case 'businessProcess': return '#3B82F6';
                      case 'application': return '#9333EA';
                      case 'database': return '#10B981';
                      case 'infrastructure': return '#F97316';
                      case 'cloud': return '#6B7280';
                      default: return '#9CA3AF';
                    }
                  }}
                  maskColor="rgba(0, 0, 0, 0.1)"
                />
              </ReactFlow>
            </div>

            {/* Legend */}
            <div className="bg-white border border-gray-200 rounded-sm p-4 mt-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-3">Layer Legend</h4>
              <div className="grid grid-cols-5 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 border-2 border-blue-400 rounded"></div>
                  <span className="text-xs text-gray-600">Business Processes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-200 border-2 border-purple-400 rounded"></div>
                  <span className="text-xs text-gray-600">Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border-2 border-green-400 rounded"></div>
                  <span className="text-xs text-gray-600">Databases</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-200 border-2 border-orange-400 rounded"></div>
                  <span className="text-xs text-gray-600">Infrastructure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 border-2 border-gray-400 rounded"></div>
                  <span className="text-xs text-gray-600">Third-Party</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel - Component Details */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden sticky top-6">
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">Component Details</h3>
              </div>

              {selectedApp ? (
                <div className="p-4 space-y-4">
                  {/* Component Info */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{selectedApp.name}</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Type:</span>
                        <span className="font-medium text-gray-900 capitalize">
                          {selectedApp.type.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Tier:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedApp.tier === 'Tier 1' ? 'bg-red-100 text-red-700' :
                          selectedApp.tier === 'Tier 2' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {selectedApp.tier}
                        </span>
                      </div>
                      {selectedApp.rto && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">RTO:</span>
                          <span className="font-medium text-gray-900">{selectedApp.rto}</span>
                        </div>
                      )}
                      {selectedApp.rpo && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">RPO:</span>
                          <span className="font-medium text-gray-900">{selectedApp.rpo}</span>
                        </div>
                      )}
                      {selectedApp.location && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Location:</span>
                          <span className="font-medium text-gray-900">{selectedApp.location}</span>
                        </div>
                      )}
                      {selectedApp.sla && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">SLA:</span>
                          <span className="font-medium text-gray-900">{selectedApp.sla}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dependencies */}
                  {selectedApp.dependencies && selectedApp.dependencies.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      <h5 className="text-xs font-semibold text-gray-700 mb-2">
                        Downstream Dependencies ({selectedApp.dependencies.length})
                      </h5>
                      <div className="space-y-2">
                        {selectedApp.dependencies.map(depId => {
                          const dep = mockApplications.find(a => a.id === depId);
                          if (!dep) return null;
                          return (
                            <div
                              key={depId}
                              className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded text-xs cursor-pointer hover:bg-yellow-100"
                              onClick={() => setSelectedNode(depId)}
                            >
                              <span className="font-medium text-gray-900">{dep.name}</span>
                              <span className="text-gray-500 capitalize">{dep.type}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Upstream Dependencies */}
                  <div className="pt-4 border-t border-gray-200">
                    <h5 className="text-xs font-semibold text-gray-700 mb-2">
                      Upstream Dependencies
                    </h5>
                    <div className="space-y-2">
                      {mockApplications
                        .filter(app => app.dependencies?.includes(selectedApp.id))
                        .map(app => (
                          <div
                            key={app.id}
                            className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded text-xs cursor-pointer hover:bg-blue-100"
                            onClick={() => setSelectedNode(app.id)}
                          >
                            <span className="font-medium text-gray-900">{app.name}</span>
                            <span className="text-gray-500 capitalize">{app.type}</span>
                          </div>
                        ))}
                      {mockApplications.filter(app => app.dependencies?.includes(selectedApp.id)).length === 0 && (
                        <p className="text-xs text-gray-500 italic">No upstream dependencies</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => runSimulation(selectedNode!)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-blue-600 rounded-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Simulate Impact
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <CubeIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    Click on any component in the graph to view its details and dependencies
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Results Modal */}
      {showSimulation && simulationResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Impact Simulation Results</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Analyzing failure impact of: <span className="font-medium text-gray-900">{simulationResults.component}</span>
                </p>
              </div>
              <button
                onClick={() => setShowSimulation(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Impact Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-200 rounded-sm p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase">Total Affected</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{simulationResults.totalAffected}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-sm p-4">
                  <p className="text-xs font-medium text-red-600 uppercase">Critical Impact</p>
                  <p className="text-2xl font-bold text-red-900 mt-1">{simulationResults.criticalImpact}</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-4">
                  <p className="text-xs font-medium text-yellow-600 uppercase">High Impact</p>
                  <p className="text-2xl font-bold text-yellow-900 mt-1">{simulationResults.highImpact}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-4">
                  <p className="text-xs font-medium text-blue-600 uppercase">Medium Impact</p>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{simulationResults.mediumImpact}</p>
                </div>
              </div>

              {/* Affected Components List */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Affected Components</h4>
                {simulationResults.affectedComponents.length > 0 ? (
                  <div className="space-y-2">
                    {simulationResults.affectedComponents.map((comp: any) => (
                      <div
                        key={comp.id}
                        className={`flex items-center justify-between p-3 rounded-sm border ${
                          comp.impactLevel === 'Critical' ? 'bg-red-50 border-red-200' :
                          comp.impactLevel === 'High' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{comp.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{comp.type.replace(/([A-Z])/g, ' $1').trim()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">{comp.tier}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            comp.impactLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                            comp.impactLevel === 'High' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {comp.impactLevel} Impact
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No upstream dependencies affected</p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowSimulation(false)}
                  className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    exportToCrisisPlan();
                    setShowSimulation(false);
                  }}
                  className="px-4 py-2 border border-blue-600 rounded-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Export to Crisis Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm shadow-xl max-w-md w-full mx-4">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Export to Crisis Plan</h3>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                This will create a new crisis plan with the current application dependency mapping data.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Crisis Plan Name</label>
                  <input
                    type="text"
                    defaultValue={`IT Service Dependency Map - ${new Date().toLocaleDateString()}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    defaultValue="Application dependency mapping exported from ITSCM module"
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmExport}
                  className="px-4 py-2 border border-blue-600 rounded-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Crisis Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

