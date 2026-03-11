'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  OrganizationalStructure, 
  OrgNode, 
  OrgEdge, 
  OrgChartSelection,
  OrgChartUtils,
  DEFAULT_ORG_STRUCTURE 
} from '@/types/organizational-chart';

interface OrganizationalChartContextType {
  // Data
  structure: OrganizationalStructure;
  nodes: OrgNode[];
  edges: OrgEdge[];
  
  // Actions
  updateStructure: (newStructure: OrganizationalStructure) => void;
  addNode: (node: Omit<OrgNode, 'id'>) => string;
  updateNode: (nodeId: string, updates: Partial<OrgNode>) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (edge: Omit<OrgEdge, 'id'>) => string;
  deleteEdge: (edgeId: string) => void;
  
  // Utility functions
  getNodePath: (nodeId: string) => string;
  getChildNodes: (nodeId: string) => OrgNode[];
  getAllDescendants: (nodeId: string) => OrgNode[];
  getParentNode: (nodeId: string) => OrgNode | null;
  getBIASelectionOptions: () => OrgChartSelection[];
  searchNodes: (searchTerm: string) => OrgNode[];
  validateStructure: () => { isValid: boolean; errors: string[] };
  
  // Import/Export
  exportToJSON: () => string;
  importFromJSON: (jsonString: string) => boolean;
  
  // Loading state
  isLoading: boolean;
  error: string | null;
}

const OrganizationalChartContext = createContext<OrganizationalChartContextType | undefined>(undefined);

interface OrganizationalChartProviderProps {
  children: ReactNode;
}

export function OrganizationalChartProvider({ children }: OrganizationalChartProviderProps) {
  const [structure, setStructure] = useState<OrganizationalStructure>(DEFAULT_ORG_STRUCTURE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load organizational chart from localStorage on mount
  useEffect(() => {
    const loadStructure = () => {
      try {
        setIsLoading(true);
        const saved = localStorage.getItem('bcm-organizational-chart');
        if (saved) {
          const imported = OrgChartUtils.importFromJSON(saved);
          if (imported) {
            setStructure(imported);
          } else {
            setError('Failed to load saved organizational chart');
          }
        }
      } catch (err) {
        setError('Error loading organizational chart');
        console.error('Error loading organizational chart:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStructure();
  }, []);

  // Save to localStorage whenever structure changes
  useEffect(() => {
    try {
      localStorage.setItem('bcm-organizational-chart', OrgChartUtils.exportToJSON(structure));
      setError(null);
    } catch (err) {
      setError('Failed to save organizational chart');
      console.error('Error saving organizational chart:', err);
    }
  }, [structure]);

  const updateStructure = (newStructure: OrganizationalStructure) => {
    const validation = OrgChartUtils.validateHierarchy(newStructure.nodes, newStructure.edges);
    if (!validation.isValid) {
      setError(`Invalid structure: ${validation.errors.join(', ')}`);
      return;
    }
    
    setStructure({
      ...newStructure,
      lastUpdated: new Date(),
      version: structure.version + 1
    });
    setError(null);
  };

  const addNode = (nodeData: Omit<OrgNode, 'id'>): string => {
    const newId = `${nodeData.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNode: OrgNode = {
      ...nodeData,
      id: newId
    };

    setStructure(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      lastUpdated: new Date(),
      version: prev.version + 1
    }));

    return newId;
  };

  const updateNode = (nodeId: string, updates: Partial<OrgNode>) => {
    setStructure(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      ),
      lastUpdated: new Date(),
      version: prev.version + 1
    }));
  };

  const deleteNode = (nodeId: string) => {
    setStructure(prev => {
      // Remove the node and all edges connected to it
      const newNodes = prev.nodes.filter(node => node.id !== nodeId);
      const newEdges = prev.edges.filter(edge => 
        edge.source !== nodeId && edge.target !== nodeId
      );

      return {
        ...prev,
        nodes: newNodes,
        edges: newEdges,
        lastUpdated: new Date(),
        version: prev.version + 1
      };
    });
  };

  const addEdge = (edgeData: Omit<OrgEdge, 'id'>): string => {
    const newId = `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newEdge: OrgEdge = {
      ...edgeData,
      id: newId
    };

    setStructure(prev => {
      const newStructure = {
        ...prev,
        edges: [...prev.edges, newEdge],
        lastUpdated: new Date(),
        version: prev.version + 1
      };

      // Validate the new structure
      const validation = OrgChartUtils.validateHierarchy(newStructure.nodes, newStructure.edges);
      if (!validation.isValid) {
        setError(`Cannot add edge: ${validation.errors.join(', ')}`);
        return prev; // Don't update if invalid
      }

      setError(null);
      return newStructure;
    });

    return newId;
  };

  const deleteEdge = (edgeId: string) => {
    setStructure(prev => ({
      ...prev,
      edges: prev.edges.filter(edge => edge.id !== edgeId),
      lastUpdated: new Date(),
      version: prev.version + 1
    }));
  };

  // Utility functions
  const getNodePath = (nodeId: string): string => {
    return OrgChartUtils.getNodePath(nodeId, structure.nodes, structure.edges);
  };

  const getChildNodes = (nodeId: string): OrgNode[] => {
    return OrgChartUtils.getChildNodes(nodeId, structure.nodes, structure.edges);
  };

  const getAllDescendants = (nodeId: string): OrgNode[] => {
    return OrgChartUtils.getAllDescendants(nodeId, structure.nodes, structure.edges);
  };

  const getParentNode = (nodeId: string): OrgNode | null => {
    return OrgChartUtils.getParentNode(nodeId, structure.nodes, structure.edges);
  };

  const getBIASelectionOptions = (): OrgChartSelection[] => {
    return OrgChartUtils.generateBIASelectionOptions(structure.nodes, structure.edges);
  };

  const searchNodes = (searchTerm: string): OrgNode[] => {
    return OrgChartUtils.searchNodes(structure.nodes, searchTerm);
  };

  const validateStructure = () => {
    return OrgChartUtils.validateHierarchy(structure.nodes, structure.edges);
  };

  const exportToJSON = (): string => {
    return OrgChartUtils.exportToJSON(structure);
  };

  const importFromJSON = (jsonString: string): boolean => {
    try {
      const imported = OrgChartUtils.importFromJSON(jsonString);
      if (imported) {
        updateStructure(imported);
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to import organizational chart');
      return false;
    }
  };

  const contextValue: OrganizationalChartContextType = {
    // Data
    structure,
    nodes: structure.nodes,
    edges: structure.edges,
    
    // Actions
    updateStructure,
    addNode,
    updateNode,
    deleteNode,
    addEdge,
    deleteEdge,
    
    // Utility functions
    getNodePath,
    getChildNodes,
    getAllDescendants,
    getParentNode,
    getBIASelectionOptions,
    searchNodes,
    validateStructure,
    
    // Import/Export
    exportToJSON,
    importFromJSON,
    
    // Loading state
    isLoading,
    error
  };

  return (
    <OrganizationalChartContext.Provider value={contextValue}>
      {children}
    </OrganizationalChartContext.Provider>
  );
}

export function useOrganizationalChart() {
  const context = useContext(OrganizationalChartContext);
  if (context === undefined) {
    throw new Error('useOrganizationalChart must be used within an OrganizationalChartProvider');
  }
  return context;
}

export default OrganizationalChartContext;
