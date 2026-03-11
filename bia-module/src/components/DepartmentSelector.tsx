'use client';

import { useState, useEffect } from 'react';
import { useOrganizationalChart } from '@/contexts/OrganizationalChartContext';
import { OrgChartSelection } from '@/types/organizational-chart';
import {
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

interface DepartmentSelectorProps {
  onSelectionChange: (selection: OrgChartSelection | null) => void;
  selectedDepartment?: OrgChartSelection | null;
}

export default function DepartmentSelector({ onSelectionChange, selectedDepartment }: DepartmentSelectorProps) {
  const { nodes, edges, getNodePath, getChildNodes, searchNodes } = useOrganizationalChart();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [filteredNodes, setFilteredNodes] = useState(nodes);

  // Filter nodes based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = searchNodes(searchTerm);
      setFilteredNodes(filtered);
      // Auto-expand all nodes when searching
      setExpandedNodes(new Set(nodes.map(n => n.id)));
    } else {
      setFilteredNodes(nodes);
      // Collapse all when not searching
      setExpandedNodes(new Set());
    }
  }, [searchTerm, nodes, searchNodes]);

  const getNodeIcon = (type: string) => {
    switch (type) {
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

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'location':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'department':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'subdepartment':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const toggleNodeExpansion = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleNodeSelect = (node: any) => {
    // Only allow selection of departments and subdepartments (not locations)
    if (node.type === 'location') {
      return; // Don't allow location selection for Department BIA
    }

    const selection: OrgChartSelection = {
      nodeId: node.id,
      nodeName: node.label,
      nodeType: node.type,
      fullPath: getNodePath(node.id),
      manager: node.manager,
      employeeCount: node.employeeCount,
    };
    onSelectionChange(selection);
  };

  const isNodeSelected = (nodeId: string) => {
    return selectedDepartment?.nodeId === nodeId;
  };

  // Build hierarchical structure for display
  const buildHierarchy = () => {
    const rootNodes = nodes.filter(node => {
      const hasParent = edges.some(edge => edge.target === node.id);
      return !hasParent;
    });

    const renderNode = (node: any, level: number = 0): JSX.Element => {
      const children = getChildNodes(node.id);
      const hasChildren = children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = isNodeSelected(node.id);
      const isVisible = searchTerm ? filteredNodes.some(n => n.id === node.id) : true;

      if (!isVisible) return <></>;

      return (
        <div key={node.id} className="space-y-1">
          <div
            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
              isSelected
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : `border-gray-200 hover:border-gray-300 ${getNodeColor(node.type)}`
            }`}
            style={{ marginLeft: `${level * 20}px` }}
            onClick={() => handleNodeSelect(node)}
          >
            {/* Expand/Collapse Button */}
            <div className="flex items-center mr-3">
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNodeExpansion(node.id);
                  }}
                  className="p-1 hover:bg-white hover:bg-opacity-50 rounded"
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <div className="w-6 h-6" />
              )}
            </div>

            {/* Node Icon */}
            <div className="mr-3">
              {getNodeIcon(node.type)}
            </div>

            {/* Node Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm text-gray-900">{node.label}</div>
                  {node.manager && (
                    <div className="text-xs text-gray-600">Manager: {node.manager}</div>
                  )}
                  {node.employeeCount !== undefined && node.employeeCount > 0 && (
                    <div className="text-xs text-gray-600">Employees: {node.employeeCount}</div>
                  )}
                </div>
                
                {isSelected && (
                  <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                )}
              </div>
              
              <div className="text-xs font-medium mt-1 capitalize text-gray-500">
                {node.type.replace('subdepartment', 'Sub-Department')}
              </div>
            </div>
          </div>

          {/* Render Children */}
          {hasChildren && isExpanded && (
            <div className="space-y-1">
              {children.map(child => renderNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    };

    return rootNodes.map(node => renderNode(node));
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-purple-900 mb-2">Select Department or Sub-Department</h3>
        <p className="text-sm text-purple-700">
          Choose any node from your organizational chart to conduct a Department Level BIA. 
          This will analyze the impact of disruption to the selected organizational unit.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search departments, managers, or descriptions..."
        />
      </div>

      {/* Selected Department Display */}
      {selectedDepartment && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-medium text-blue-900">Selected for BIA</h4>
            <button
              onClick={() => onSelectionChange(null)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Clear Selection
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {getNodeIcon(selectedDepartment.nodeType)}
              <span className="font-medium text-blue-900">{selectedDepartment.nodeName}</span>
            </div>
            
            <div className="text-sm text-blue-700">
              <strong>Full Path:</strong> {selectedDepartment.fullPath}
            </div>
            
            {selectedDepartment.manager && (
              <div className="text-sm text-blue-700">
                <strong>Manager:</strong> {selectedDepartment.manager}
              </div>
            )}
            
            {selectedDepartment.employeeCount !== undefined && selectedDepartment.employeeCount > 0 && (
              <div className="text-sm text-blue-700">
                <strong>Employee Count:</strong> {selectedDepartment.employeeCount}
              </div>
            )}
            
            <div className="text-sm text-blue-700">
              <strong>Type:</strong> {selectedDepartment.nodeType.replace('subdepartment', 'Sub-Department')}
            </div>
          </div>
        </div>
      )}

      {/* Organizational Chart Tree */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">Organizational Structure</h4>
        
        {filteredNodes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No departments found matching your search.' : 'No organizational structure defined.'}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {buildHierarchy()}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h5 className="text-sm font-medium text-gray-900 mb-2">Instructions</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Click on any department or sub-department to select it for BIA analysis</li>
          <li>• Use the search box to quickly find specific departments or managers</li>
          <li>• Click the expand/collapse arrows to navigate the organizational hierarchy</li>
          <li>• The selected unit will be the focus of your Department Level BIA</li>
        </ul>
      </div>
    </div>
  );
}
