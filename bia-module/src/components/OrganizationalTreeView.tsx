'use client';

import React, { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon, BuildingOfficeIcon, UserGroupIcon, CheckBadgeIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { OrganizationalUnitTree, UNIT_TYPE_LABELS, UNIT_TYPE_COLORS } from '@/types/organizationalUnit';
import Link from 'next/link';

interface OrganizationalTreeViewProps {
  tree: OrganizationalUnitTree;
  onSelectUnit?: (unit: OrganizationalUnitTree) => void;
  onDeleteUnit?: (unit: OrganizationalUnitTree) => void;
  selectedUnitId?: string;
  showBiaEligibleOnly?: boolean;
  searchQuery?: string;
}

interface TreeNodeProps {
  node: OrganizationalUnitTree;
  level: number;
  onSelectUnit?: (unit: OrganizationalUnitTree) => void;
  onDeleteUnit?: (unit: OrganizationalUnitTree) => void;
  selectedUnitId?: string;
  showBiaEligibleOnly?: boolean;
  expandedNodes?: Set<string>;
  onToggleExpand?: (nodeId: string) => void;
  searchQuery?: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  level,
  onSelectUnit,
  onDeleteUnit,
  selectedUnitId,
  showBiaEligibleOnly,
  expandedNodes,
  onToggleExpand,
  searchQuery = ''
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedUnitId === node.id;

  // Check if this node or any descendant matches the search
  const matchesSearch = (n: OrganizationalUnitTree, query: string): boolean => {
    if (!query) return true;
    const lowerQuery = query.toLowerCase();
    const nameMatch = n.unitName.toLowerCase().includes(lowerQuery);
    const codeMatch = n.unitCode?.toLowerCase().includes(lowerQuery);
    const childMatch = n.children?.some(child => matchesSearch(child, query));
    return nameMatch || codeMatch || childMatch || false;
  };

  const nodeMatches = matchesSearch(node, searchQuery);

  // Filter children if showBiaEligibleOnly is true
  const visibleChildren = showBiaEligibleOnly
    ? node.children?.filter(child => child.isBiaEligible || (child.children && child.children.length > 0))
    : node.children;

  // Don't render if doesn't match search
  if (!nodeMatches) {
    return null;
  }

  // Don't render if showBiaEligibleOnly and not eligible and no eligible children
  if (showBiaEligibleOnly && !node.isBiaEligible && (!visibleChildren || visibleChildren.length === 0)) {
    return null;
  }

  const isExpanded = expandedNodes?.has(node.id.toString()) || searchQuery !== '' || false;

  const handleToggle = () => {
    if (hasChildren && onToggleExpand) {
      onToggleExpand(node.id.toString());
    }
  };

  const handleSelect = () => {
    if (onSelectUnit) {
      onSelectUnit(node);
    }
  };

  return (
    <div className="select-none group">
      <div
        className={`
          flex items-center py-1.5 px-2 rounded-sm cursor-pointer transition-colors
          ${isSelected ? 'bg-gray-100 border border-gray-300' : 'hover:bg-gray-50'}
        `}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
      >
        {/* Expand/Collapse Icon */}
        <div className="w-4 h-4 mr-1.5 flex-shrink-0" onClick={handleToggle}>
          {hasChildren ? (
            isExpanded ? (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 text-gray-500" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </div>

        {/* Unit Icon */}
        <div className="mr-2 flex-shrink-0">
          {node.unitType === 'ORGANIZATION' ? (
            <BuildingOfficeIcon className="h-4 w-4 text-gray-600" />
          ) : (
            <UserGroupIcon className="h-4 w-4 text-gray-500" />
          )}
        </div>

        {/* Unit Info */}
        <div className="flex-1 min-w-0" onClick={handleSelect}>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium text-gray-900 ${isSelected ? 'text-gray-900' : ''}`}>
              {node.unitName}
            </span>

            {/* Unit Type Badge */}
            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm border ${UNIT_TYPE_COLORS[node.unitType]}`}>
              {UNIT_TYPE_LABELS[node.unitType]}
            </span>

            {/* REMOVED: BIA Eligible badge - all units can now have BIAs */}
          </div>

          {/* Unit Code Only */}
          {node.unitCode && (
            <div className="mt-0.5 text-[10px] text-gray-500 font-mono">
              {node.unitCode}
            </div>
          )}
        </div>

        {/* Kebab Menu - Shows on hover */}
        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-sm hover:bg-gray-200"
          >
            <EllipsisVerticalIcon className="h-4 w-4 text-gray-500" />
          </button>

          {showMenu && (
            <>
              {/* Backdrop to close menu */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 mt-1 w-40 rounded-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                <div className="py-1">
                  <Link
                    href={`/libraries/organizational-units/${node.id}/edit`}
                    className="flex items-center px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    <PencilIcon className="h-3.5 w-3.5 mr-2 text-gray-400" />
                    Edit Unit
                  </Link>
                  <Link
                    href={`/libraries/organizational-units/new?parentId=${node.id}`}
                    className="flex items-center px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    <PlusIcon className="h-3.5 w-3.5 mr-2 text-gray-400" />
                    Add Sub-unit
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      if (onDeleteUnit) {
                        onDeleteUnit(node);
                      }
                    }}
                    className="flex items-center w-full px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
                  >
                    <TrashIcon className="h-3.5 w-3.5 mr-2 text-red-400" />
                    Delete Unit
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && visibleChildren && (
        <div className="mt-1">
          {visibleChildren.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelectUnit={onSelectUnit}
              onDeleteUnit={onDeleteUnit}
              selectedUnitId={selectedUnitId}
              showBiaEligibleOnly={showBiaEligibleOnly}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const OrganizationalTreeView: React.FC<OrganizationalTreeViewProps> = ({
  tree,
  onSelectUnit,
  onDeleteUnit,
  selectedUnitId,
  showBiaEligibleOnly = false,
  searchQuery = '',
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleExpandAll = () => {
    const allNodeIds = new Set<string>();
    const collectNodeIds = (node: OrganizationalUnitTree) => {
      allNodeIds.add(node.id.toString());
      node.children?.forEach(child => collectNodeIds(child));
    };
    collectNodeIds(tree);
    setExpandedNodes(allNodeIds);
  };

  const handleCollapseAll = () => {
    setExpandedNodes(new Set());
  };

  return (
    <div className="bg-white rounded-sm border border-gray-200 p-3">
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-gray-900">Organizational Structure</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">
              {searchQuery ? (
                <>Showing results for: <span className="font-medium">"{searchQuery}"</span></>
              ) : showBiaEligibleOnly ? (
                'Showing only BIA-eligible units (departments and teams where BIAs can be conducted)'
              ) : (
                'Complete organizational hierarchy'
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExpandAll}
              className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded-sm border border-gray-300"
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded-sm border border-gray-300"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-0.5">
        <TreeNode
          node={tree}
          level={0}
          onSelectUnit={onSelectUnit}
          onDeleteUnit={onDeleteUnit}
          selectedUnitId={selectedUnitId}
          showBiaEligibleOnly={showBiaEligibleOnly}
          expandedNodes={expandedNodes}
          onToggleExpand={handleToggleExpand}
          searchQuery={searchQuery}
        />
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <h4 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Legend</h4>
        <div className="flex items-center gap-3 text-[10px] text-gray-600">
          {/* REMOVED: BIA Eligible legend - all units can now have BIAs */}
          <div className="flex items-center gap-1.5">
            <ChevronRightIcon className="h-3.5 w-3.5 text-gray-500" />
            <span>Click to expand/collapse</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationalTreeView;

