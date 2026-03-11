// Organizational Chart Types

export interface OrgNode {
  id: string;
  label: string;
  type: 'location' | 'department' | 'subdepartment';
  description?: string;
  manager?: string;
  employeeCount?: number;
  position: {
    x: number;
    y: number;
  };
  parentId?: string;
  children?: string[];
  level?: number; // Hierarchy level (0 = location, 1 = department, 2+ = subdepartments)
  canHaveBIA?: boolean; // Whether this node can have a Department BIA (all except locations)
  subDepartmentLevel?: number; // For tracking nested sub-departments (1, 2, 3, etc.)
}

export interface OrgEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface OrganizationalStructure {
  nodes: OrgNode[];
  edges: OrgEdge[];
  lastUpdated: Date;
  version: number;
}

export interface OrgChartSelection {
  nodeId: string;
  nodeName: string;
  nodeType: 'location' | 'department' | 'subdepartment';
  fullPath: string; // e.g., "Bengaluru HQ > Finance Department > Accounts Payable"
  manager?: string;
  employeeCount?: number;
}

// BIA Integration Types
export interface DepartmentBIAContext {
  selectedNode: OrgChartSelection;
  scope: 'node-only' | 'node-and-children' | 'custom';
  includedNodes: OrgChartSelection[];
  excludedNodes?: OrgChartSelection[];
}

// Utility functions for organizational chart operations
export class OrgChartUtils {
  static getNodePath(nodeId: string, nodes: OrgNode[], edges: OrgEdge[]): string {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return '';

    const path: string[] = [node.label];
    let currentNode = node;

    // Traverse up the hierarchy
    while (currentNode) {
      const parentEdge = edges.find(e => e.target === currentNode.id);
      if (!parentEdge) break;
      
      const parentNode = nodes.find(n => n.id === parentEdge.source);
      if (!parentNode) break;
      
      path.unshift(parentNode.label);
      currentNode = parentNode;
    }

    return path.join(' > ');
  }

  static getChildNodes(nodeId: string, nodes: OrgNode[], edges: OrgEdge[]): OrgNode[] {
    const childEdges = edges.filter(e => e.source === nodeId);
    return childEdges
      .map(edge => nodes.find(n => n.id === edge.target))
      .filter(Boolean) as OrgNode[];
  }

  static getAllDescendants(nodeId: string, nodes: OrgNode[], edges: OrgEdge[]): OrgNode[] {
    const descendants: OrgNode[] = [];
    const visited = new Set<string>();

    const traverse = (currentNodeId: string) => {
      if (visited.has(currentNodeId)) return;
      visited.add(currentNodeId);

      const children = this.getChildNodes(currentNodeId, nodes, edges);
      descendants.push(...children);

      children.forEach(child => traverse(child.id));
    };

    traverse(nodeId);
    return descendants;
  }

  static getParentNode(nodeId: string, nodes: OrgNode[], edges: OrgEdge[]): OrgNode | null {
    const parentEdge = edges.find(e => e.target === nodeId);
    if (!parentEdge) return null;
    
    return nodes.find(n => n.id === parentEdge.source) || null;
  }

  static validateHierarchy(nodes: OrgNode[], edges: OrgEdge[]): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check for cycles
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const children = this.getChildNodes(nodeId, nodes, edges);
      for (const child of children) {
        if (hasCycle(child.id)) return true;
      }

      recursionStack.delete(nodeId);
      return false;
    };

    // Check each node for cycles
    for (const node of nodes) {
      if (!visited.has(node.id) && hasCycle(node.id)) {
        errors.push(`Cycle detected in organizational hierarchy involving node: ${node.label}`);
        break;
      }
    }

    // Check for orphaned edges
    for (const edge of edges) {
      const sourceExists = nodes.some(n => n.id === edge.source);
      const targetExists = nodes.some(n => n.id === edge.target);
      
      if (!sourceExists) {
        errors.push(`Edge ${edge.id} references non-existent source node: ${edge.source}`);
      }
      if (!targetExists) {
        errors.push(`Edge ${edge.id} references non-existent target node: ${edge.target}`);
      }
    }

    // Check for multiple parents (each node should have at most one parent)
    const nodeParentCount = new Map<string, number>();
    for (const edge of edges) {
      const count = nodeParentCount.get(edge.target) || 0;
      nodeParentCount.set(edge.target, count + 1);
    }

    for (const [nodeId, parentCount] of nodeParentCount.entries()) {
      if (parentCount > 1) {
        const node = nodes.find(n => n.id === nodeId);
        errors.push(`Node "${node?.label || nodeId}" has multiple parents, which is not allowed in organizational hierarchy`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static exportToJSON(structure: OrganizationalStructure): string {
    return JSON.stringify(structure, null, 2);
  }

  static importFromJSON(jsonString: string): OrganizationalStructure | null {
    try {
      const parsed = JSON.parse(jsonString);
      
      // Validate structure
      if (!parsed.nodes || !Array.isArray(parsed.nodes)) {
        throw new Error('Invalid structure: nodes array is required');
      }
      
      if (!parsed.edges || !Array.isArray(parsed.edges)) {
        throw new Error('Invalid structure: edges array is required');
      }

      return {
        nodes: parsed.nodes,
        edges: parsed.edges,
        lastUpdated: new Date(parsed.lastUpdated || Date.now()),
        version: parsed.version || 1
      };
    } catch (error) {
      console.error('Failed to import organizational chart:', error);
      return null;
    }
  }

  static generateBIASelectionOptions(
    nodes: OrgNode[],
    edges: OrgEdge[]
  ): OrgChartSelection[] {
    // Only include nodes that can have BIA (departments and subdepartments, not locations)
    return nodes
      .filter(node => node.type === 'department' || node.type === 'subdepartment')
      .map(node => ({
        nodeId: node.id,
        nodeName: node.label,
        nodeType: node.type,
        fullPath: this.getNodePath(node.id, nodes, edges),
        manager: node.manager,
        employeeCount: node.employeeCount
      }));
  }

  static calculateNodeLevel(nodeId: string, nodes: OrgNode[], edges: OrgEdge[]): number {
    let level = 0;
    let currentNodeId = nodeId;

    while (currentNodeId) {
      const parentEdge = edges.find(e => e.target === currentNodeId);
      if (!parentEdge) break;

      level++;
      currentNodeId = parentEdge.source;
    }

    return level;
  }

  static updateNodeLevels(nodes: OrgNode[], edges: OrgEdge[]): OrgNode[] {
    return nodes.map(node => ({
      ...node,
      level: this.calculateNodeLevel(node.id, nodes, edges),
      canHaveBIA: node.type !== 'location',
      subDepartmentLevel: node.type === 'subdepartment' ?
        Math.max(0, this.calculateNodeLevel(node.id, nodes, edges) - 1) : undefined
    }));
  }

  static canAddChildNode(parentNodeId: string, nodes: OrgNode[], edges: OrgEdge[]): boolean {
    const parentNode = nodes.find(n => n.id === parentNodeId);
    if (!parentNode) return false;

    // Locations can have departments
    // Departments can have subdepartments
    // Subdepartments can have more subdepartments (unlimited nesting)
    return parentNode.type === 'location' ||
           parentNode.type === 'department' ||
           parentNode.type === 'subdepartment';
  }

  static getValidChildTypes(parentNodeId: string, nodes: OrgNode[]): ('department' | 'subdepartment')[] {
    const parentNode = nodes.find(n => n.id === parentNodeId);
    if (!parentNode) return [];

    switch (parentNode.type) {
      case 'location':
        return ['department'];
      case 'department':
      case 'subdepartment':
        return ['subdepartment'];
      default:
        return [];
    }
  }

  static getNodesByType(
    nodes: OrgNode[], 
    type: 'location' | 'department' | 'subdepartment'
  ): OrgNode[] {
    return nodes.filter(node => node.type === type);
  }

  static searchNodes(nodes: OrgNode[], searchTerm: string): OrgNode[] {
    const term = searchTerm.toLowerCase();
    return nodes.filter(node => 
      node.label.toLowerCase().includes(term) ||
      node.manager?.toLowerCase().includes(term) ||
      node.description?.toLowerCase().includes(term)
    );
  }
}

// Default organizational structure for new installations
export const DEFAULT_ORG_STRUCTURE: OrganizationalStructure = {
  nodes: [
    {
      id: 'loc-1',
      label: 'Headquarters',
      type: 'location',
      description: 'Main office location',
      manager: 'CEO',
      employeeCount: 500,
      position: { x: 400, y: 50 }
    },
    {
      id: 'dept-1',
      label: 'Finance Department',
      type: 'department',
      description: 'Financial operations and accounting',
      manager: 'CFO',
      employeeCount: 45,
      position: { x: 200, y: 200 }
    },
    {
      id: 'dept-2',
      label: 'IT Department',
      type: 'department',
      description: 'Information technology and systems',
      manager: 'CTO',
      employeeCount: 80,
      position: { x: 600, y: 200 }
    }
  ],
  edges: [
    { id: 'e1', source: 'loc-1', target: 'dept-1' },
    { id: 'e2', source: 'loc-1', target: 'dept-2' }
  ],
  lastUpdated: new Date(),
  version: 1
};
