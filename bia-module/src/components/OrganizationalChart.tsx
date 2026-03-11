'use client';

import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useOrganizationalChart } from '@/contexts/OrganizationalChartContext';
import { OrgNode as OrgNodeType } from '@/types/organizational-chart';

// Custom node types
interface OrgNodeData {
  id: string;
  label: string;
  type: 'location' | 'department' | 'subdepartment';
  description?: string;
  manager?: string;
  employeeCount?: number;
  isEditing?: boolean;
}

// Custom Node Component
const OrgNode = ({ data, selected }: { data: OrgNodeData; selected: boolean }) => {
  const [isEditing, setIsEditing] = useState(data.isEditing || false);
  const [editData, setEditData] = useState({
    label: data.label,
    description: data.description || '',
    manager: data.manager || '',
    employeeCount: data.employeeCount || 0,
  });

  const getNodeIcon = () => {
    switch (data.type) {
      case 'location':
        return <BuildingOfficeIcon className="h-5 w-5" />;
      case 'department':
        return <BuildingOffice2Icon className="h-5 w-5" />;
      case 'subdepartment':
        return <UserGroupIcon className="h-5 w-5" />;
      default:
        return <BuildingOffice2Icon className="h-5 w-5" />;
    }
  };

  const getNodeColor = () => {
    switch (data.type) {
      case 'location':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'department':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'subdepartment':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const handleSave = () => {
    // Update the node data
    Object.assign(data, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      label: data.label,
      description: data.description || '',
      manager: data.manager || '',
      employeeCount: data.employeeCount || 0,
    });
    setIsEditing(false);
  };

  return (
    <div className={`px-4 py-3 shadow-md rounded-lg border-2 min-w-[200px] ${getNodeColor()} ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editData.label}
            onChange={(e) => setEditData({ ...editData, label: e.target.value })}
            className="w-full px-2 py-1 text-sm border rounded"
            placeholder="Name"
          />
          <input
            type="text"
            value={editData.manager}
            onChange={(e) => setEditData({ ...editData, manager: e.target.value })}
            className="w-full px-2 py-1 text-sm border rounded"
            placeholder="Manager"
          />
          <input
            type="number"
            value={editData.employeeCount}
            onChange={(e) => setEditData({ ...editData, employeeCount: parseInt(e.target.value) || 0 })}
            className="w-full px-2 py-1 text-sm border rounded"
            placeholder="Employee Count"
          />
          <div className="flex space-x-1">
            <button
              onClick={handleSave}
              className="flex-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
            >
              <CheckIcon className="h-3 w-3 mx-auto" />
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
            >
              <XMarkIcon className="h-3 w-3 mx-auto" />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getNodeIcon()}
              <div className="font-medium text-sm">{data.label}</div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-white hover:bg-opacity-50 rounded"
            >
              <PencilIcon className="h-3 w-3" />
            </button>
          </div>
          
          {data.manager && (
            <div className="text-xs text-gray-600 mb-1">
              Manager: {data.manager}
            </div>
          )}
          
          {data.employeeCount !== undefined && data.employeeCount > 0 && (
            <div className="text-xs text-gray-600">
              Employees: {data.employeeCount}
            </div>
          )}
          
          <div className="text-xs font-medium mt-2 capitalize">
            {data.type.replace('subdepartment', 'Sub-Department')}
          </div>
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  orgNode: OrgNode,
};

interface OrganizationalChartProps {
  onSave?: (orgData: any) => void;
}

export default function OrganizationalChart({ onSave }: OrganizationalChartProps) {
  const {
    nodes: orgNodes,
    edges: orgEdges,
    updateNode,
    addNode,
    deleteNode,
    addEdge: addOrgEdge,
    deleteEdge,
    structure,
    error
  } = useOrganizationalChart();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeType, setSelectedNodeType] = useState<'location' | 'department' | 'subdepartment'>('location');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNodeData, setNewNodeData] = useState({
    label: '',
    description: '',
    manager: '',
    employeeCount: 0,
  });

  // Initialize with sample data
  useEffect(() => {
    const initialNodes: Node[] = [
      {
        id: 'loc-1',
        type: 'orgNode',
        position: { x: 400, y: 50 },
        data: {
          id: 'loc-1',
          label: 'Bengaluru Headquarters',
          type: 'location',
          manager: 'Rajesh Kumar',
          employeeCount: 500,
        },
      },
      {
        id: 'dept-1',
        type: 'orgNode',
        position: { x: 200, y: 200 },
        data: {
          id: 'dept-1',
          label: 'Finance Department',
          type: 'department',
          manager: 'Priya Sharma',
          employeeCount: 45,
        },
      },
      {
        id: 'dept-2',
        type: 'orgNode',
        position: { x: 600, y: 200 },
        data: {
          id: 'dept-2',
          label: 'IT Department',
          type: 'department',
          manager: 'Amit Singh',
          employeeCount: 80,
        },
      },
      {
        id: 'subdept-1',
        type: 'orgNode',
        position: { x: 100, y: 350 },
        data: {
          id: 'subdept-1',
          label: 'Accounts Payable',
          type: 'subdepartment',
          manager: 'Neha Patel',
          employeeCount: 15,
        },
      },
      {
        id: 'subdept-2',
        type: 'orgNode',
        position: { x: 300, y: 350 },
        data: {
          id: 'subdept-2',
          label: 'Financial Planning',
          type: 'subdepartment',
          manager: 'Vikram Gupta',
          employeeCount: 12,
        },
      },
    ];

    const initialEdges: Edge[] = [
      { id: 'e1', source: 'loc-1', target: 'dept-1', type: 'smoothstep' },
      { id: 'e2', source: 'loc-1', target: 'dept-2', type: 'smoothstep' },
      { id: 'e3', source: 'dept-1', target: 'subdept-1', type: 'smoothstep' },
      { id: 'e4', source: 'dept-1', target: 'subdept-2', type: 'smoothstep' },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNewNode = () => {
    const newId = `${selectedNodeType}-${Date.now()}`;
    const newNode: Node = {
      id: newId,
      type: 'orgNode',
      position: { x: Math.random() * 400 + 200, y: Math.random() * 200 + 300 },
      data: {
        id: newId,
        label: newNodeData.label,
        type: selectedNodeType,
        description: newNodeData.description,
        manager: newNodeData.manager,
        employeeCount: newNodeData.employeeCount,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setShowAddModal(false);
    setNewNodeData({ label: '', description: '', manager: '', employeeCount: 0 });
  };

  const deleteSelectedNodes = () => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => {
      const sourceExists = nodes.some(node => node.id === edge.source && !node.selected);
      const targetExists = nodes.some(node => node.id === edge.target && !node.selected);
      return sourceExists && targetExists;
    }));
  };

  const handleSave = () => {
    const orgData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.data.type,
        label: node.data.label,
        manager: node.data.manager,
        employeeCount: node.data.employeeCount,
        position: node.position,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    };
    
    if (onSave) {
      onSave(orgData);
    }
  };

  return (
    <div className="h-[600px] w-full border border-gray-200 rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-gray-900">Organizational Chart</h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedNodeType}
              onChange={(e) => setSelectedNodeType(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="location">Location</option>
              <option value="department">Department</option>
              <option value="subdepartment">Sub-Department</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add {selectedNodeType}
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={deleteSelectedNodes}
            className="inline-flex items-center px-3 py-1 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete Selected
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Save Chart
          </button>
        </div>
      </div>

      {/* React Flow Chart */}
      <div className="h-[calc(100%-80px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Add Node Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add New {selectedNodeType.replace('subdepartment', 'Sub-Department')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newNodeData.label}
                  onChange={(e) => setNewNodeData({ ...newNodeData, label: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`Enter ${selectedNodeType} name`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Manager</label>
                <input
                  type="text"
                  value={newNodeData.manager}
                  onChange={(e) => setNewNodeData({ ...newNodeData, manager: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Manager name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee Count</label>
                <input
                  type="number"
                  value={newNodeData.employeeCount}
                  onChange={(e) => setNewNodeData({ ...newNodeData, employeeCount: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Number of employees"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addNewNode}
                disabled={!newNodeData.label}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                Add {selectedNodeType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
