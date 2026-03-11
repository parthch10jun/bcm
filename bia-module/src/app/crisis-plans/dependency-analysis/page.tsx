'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  BuildingOfficeIcon,
  CpuChipIcon,
  ServerIcon,
  UsersIcon,
  TruckIcon,
  DocumentTextIcon,
  PlayIcon,
  XMarkIcon,
  ArrowPathIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

// Mock data representing BIA linkages - In production, this comes from BIA records
const mockDependencyGraph = {
  locations: [
    {
      id: 'LOC-001',
      name: 'Riyadh Operations Center',
      type: 'PRIMARY',
      buildings: ['BLD-001', 'BLD-002'],
      equipment: ['EQP-001', 'EQP-002', 'EQP-003'],
      technology: ['TECH-001', 'TECH-002'],
      people: ['PEOPLE-001', 'PEOPLE-002'],
      vendors: ['VENDOR-001', 'VENDOR-002'],
      vitalRecords: ['VR-001', 'VR-002']
    },
    {
      id: 'LOC-002',
      name: 'Jeddah Water Treatment Plant',
      type: 'TREATMENT',
      buildings: ['BLD-003'],
      equipment: ['EQP-004', 'EQP-005'],
      technology: ['TECH-003'],
      people: ['PEOPLE-003'],
      vendors: ['VENDOR-003'],
      vitalRecords: ['VR-003']
    },
    {
      id: 'LOC-003',
      name: 'Dammam Distribution Hub',
      type: 'DISTRIBUTION',
      buildings: ['BLD-004'],
      equipment: ['EQP-006'],
      technology: ['TECH-004'],
      people: ['PEOPLE-004'],
      vendors: [],
      vitalRecords: ['VR-004']
    }
  ],
  buildings: [
    { id: 'BLD-001', name: 'SCADA Control Center', location: 'LOC-001', equipment: ['EQP-001', 'EQP-002'] },
    { id: 'BLD-002', name: 'Customer Service Building', location: 'LOC-001', equipment: ['EQP-003'] },
    { id: 'BLD-003', name: 'Main Treatment Facility', location: 'LOC-002', equipment: ['EQP-004', 'EQP-005'] },
    { id: 'BLD-004', name: 'Pumping Station', location: 'LOC-003', equipment: ['EQP-006'] }
  ],
  equipment: [
    { id: 'EQP-001', name: 'SCADA Servers', building: 'BLD-001', technology: ['TECH-001'], criticality: 'CRITICAL' },
    { id: 'EQP-002', name: 'Network Infrastructure', building: 'BLD-001', technology: ['TECH-001', 'TECH-002'], criticality: 'CRITICAL' },
    { id: 'EQP-003', name: 'Billing System Servers', building: 'BLD-002', technology: ['TECH-002'], criticality: 'HIGH' },
    { id: 'EQP-004', name: 'Water Filtration Systems', building: 'BLD-003', technology: ['TECH-003'], criticality: 'CRITICAL' },
    { id: 'EQP-005', name: 'Chlorination Equipment', building: 'BLD-003', technology: ['TECH-003'], criticality: 'CRITICAL' },
    { id: 'EQP-006', name: 'Distribution Pumps', building: 'BLD-004', technology: ['TECH-004'], criticality: 'CRITICAL' }
  ],
  technology: [
    { id: 'TECH-001', name: 'SCADA Control System', equipment: ['EQP-001', 'EQP-002'], processes: ['PROC-001', 'PROC-004'], rto: 30, criticality: 'CRITICAL' },
    { id: 'TECH-002', name: 'Customer Billing Platform', equipment: ['EQP-002', 'EQP-003'], processes: ['PROC-003'], rto: 240, criticality: 'HIGH' },
    { id: 'TECH-003', name: 'Water Quality Monitoring', equipment: ['EQP-004', 'EQP-005'], processes: ['PROC-002'], rto: 60, criticality: 'CRITICAL' },
    { id: 'TECH-004', name: 'Distribution Management', equipment: ['EQP-006'], processes: ['PROC-001', 'PROC-004'], rto: 30, criticality: 'CRITICAL' }
  ],
  people: [
    { id: 'PEOPLE-001', name: 'Control Room Operators', count: 35, location: 'LOC-001', processes: ['PROC-001', 'PROC-004'] },
    { id: 'PEOPLE-002', name: 'IT Operations Team', count: 20, location: 'LOC-001', processes: ['PROC-001', 'PROC-003'] },
    { id: 'PEOPLE-003', name: 'Plant Operators', count: 45, location: 'LOC-002', processes: ['PROC-002'] },
    { id: 'PEOPLE-004', name: 'Field Technicians', count: 25, location: 'LOC-003', processes: ['PROC-001', 'PROC-004'] }
  ],
  vendors: [
    { id: 'VENDOR-001', name: 'Chemical Supplier (Chlorine)', location: 'LOC-001', technology: ['TECH-003'], criticality: 'CRITICAL' },
    { id: 'VENDOR-002', name: 'Equipment Maintenance Contractor', location: 'LOC-001', technology: ['TECH-001', 'TECH-004'], criticality: 'HIGH' },
    { id: 'VENDOR-003', name: 'Lab Testing Services', location: 'LOC-002', technology: ['TECH-003'], criticality: 'CRITICAL' }
  ],
  vitalRecords: [
    { id: 'VR-001', name: 'Water Quality Reports', location: 'LOC-001', processes: ['PROC-002'], criticality: 'CRITICAL' },
    { id: 'VR-002', name: 'Customer Database', location: 'LOC-001', processes: ['PROC-003'], criticality: 'CRITICAL' },
    { id: 'VR-003', name: 'Regulatory Compliance Documents', location: 'LOC-002', processes: ['PROC-002'], criticality: 'CRITICAL' },
    { id: 'VR-004', name: 'Asset Maintenance Logs', location: 'LOC-003', processes: ['PROC-001', 'PROC-004'], criticality: 'HIGH' }
  ],
  processes: [
    { id: 'PROC-001', name: 'Water Distribution Control', department: 'Operations', rto: 30, rpo: 0, criticality: 'CRITICAL', tier: 1 },
    { id: 'PROC-002', name: 'Water Quality Testing', department: 'Quality Control', rto: 60, rpo: 15, criticality: 'CRITICAL', tier: 1 },
    { id: 'PROC-003', name: 'Customer Billing', department: 'Finance', rto: 240, rpo: 60, criticality: 'HIGH', tier: 2 },
    { id: 'PROC-004', name: 'Emergency Response', department: 'Operations', rto: 15, rpo: 0, criticality: 'CRITICAL', tier: 1 }
  ]
};

// Crisis scenario types that map to enabler failures
const scenarioTypes = [
  { id: 'location_failure', name: 'Location Unavailable', icon: MapPinIcon, color: 'bg-red-500', description: 'Complete loss of a location' },
  { id: 'building_failure', name: 'Building Unavailable', icon: BuildingOfficeIcon, color: 'bg-orange-500', description: 'Loss of specific building' },
  { id: 'equipment_failure', name: 'Equipment Failure', icon: CpuChipIcon, color: 'bg-yellow-500', description: 'Critical equipment unavailable' },
  { id: 'technology_failure', name: 'Technology/IT Failure', icon: ServerIcon, color: 'bg-purple-500', description: 'System or application down' },
  { id: 'people_unavailable', name: 'People Unavailable', icon: UsersIcon, color: 'bg-blue-500', description: 'Key personnel unavailable' },
  { id: 'vendor_failure', name: 'Vendor Failure', icon: TruckIcon, color: 'bg-pink-500', description: 'Critical vendor disruption' },
  { id: 'data_loss', name: 'Data/Records Loss', icon: DocumentTextIcon, color: 'bg-gray-500', description: 'Vital records compromised' }
];

// Node colors by type
const nodeColors: Record<string, { bg: string; border: string; text: string }> = {
  location: { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' },
  building: { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
  equipment: { bg: '#D1FAE5', border: '#10B981', text: '#065F46' },
  technology: { bg: '#EDE9FE', border: '#8B5CF6', text: '#5B21B6' },
  people: { bg: '#CFFAFE', border: '#06B6D4', text: '#155E75' },
  vendor: { bg: '#FCE7F3', border: '#EC4899', text: '#9D174D' },
  vitalRecord: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  process: { bg: '#FFEDD5', border: '#F97316', text: '#9A3412' }
};

// Generate React Flow nodes and edges from dependency data
function generateGraphElements(graph: typeof mockDependencyGraph, affectedIds?: Set<string>) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Positioning - radial layout
  const centerX = 400;
  const centerY = 300;

  // Add location nodes (center)
  graph.locations.forEach((loc, i) => {
    const angle = (i * 2 * Math.PI) / graph.locations.length - Math.PI / 2;
    const radius = 80;
    nodes.push({
      id: loc.id,
      data: { label: loc.name, type: 'location' },
      position: { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius },
      style: {
        background: affectedIds?.has(loc.id) ? '#FCA5A5' : nodeColors.location.bg,
        border: `2px solid ${affectedIds?.has(loc.id) ? '#DC2626' : nodeColors.location.border}`,
        borderRadius: '8px',
        padding: '10px',
        fontSize: '11px',
        fontWeight: 600,
        color: nodeColors.location.text,
        width: 120,
        boxShadow: affectedIds?.has(loc.id) ? '0 0 10px rgba(220, 38, 38, 0.5)' : 'none'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    });
  });

  // Add building nodes (second ring)
  graph.buildings.forEach((bld, i) => {
    const angle = (i * 2 * Math.PI) / graph.buildings.length - Math.PI / 4;
    const radius = 200;
    nodes.push({
      id: bld.id,
      data: { label: bld.name, type: 'building' },
      position: { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius },
      style: {
        background: affectedIds?.has(bld.id) ? '#FCA5A5' : nodeColors.building.bg,
        border: `2px solid ${affectedIds?.has(bld.id) ? '#DC2626' : nodeColors.building.border}`,
        borderRadius: '8px',
        padding: '8px',
        fontSize: '10px',
        fontWeight: 500,
        color: nodeColors.building.text,
        width: 100,
        boxShadow: affectedIds?.has(bld.id) ? '0 0 10px rgba(220, 38, 38, 0.5)' : 'none'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    });
    // Edge from location to building
    edges.push({
      id: `${bld.location}-${bld.id}`,
      source: bld.location,
      target: bld.id,
      type: 'straight',
      animated: affectedIds?.has(bld.id),
      style: { stroke: affectedIds?.has(bld.id) ? '#DC2626' : '#94A3B8', strokeWidth: affectedIds?.has(bld.id) ? 2 : 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: affectedIds?.has(bld.id) ? '#DC2626' : '#94A3B8' }
    });
  });

  // Add equipment nodes (third ring)
  graph.equipment.forEach((eqp, i) => {
    const angle = (i * 2 * Math.PI) / graph.equipment.length;
    const radius = 320;
    nodes.push({
      id: eqp.id,
      data: { label: eqp.name, type: 'equipment' },
      position: { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius },
      style: {
        background: affectedIds?.has(eqp.id) ? '#FCA5A5' : nodeColors.equipment.bg,
        border: `2px solid ${affectedIds?.has(eqp.id) ? '#DC2626' : nodeColors.equipment.border}`,
        borderRadius: '8px',
        padding: '6px',
        fontSize: '9px',
        fontWeight: 500,
        color: nodeColors.equipment.text,
        width: 90,
        boxShadow: affectedIds?.has(eqp.id) ? '0 0 10px rgba(220, 38, 38, 0.5)' : 'none'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    });
    // Edge from building to equipment
    edges.push({
      id: `${eqp.building}-${eqp.id}`,
      source: eqp.building,
      target: eqp.id,
      type: 'straight',
      animated: affectedIds?.has(eqp.id),
      style: { stroke: affectedIds?.has(eqp.id) ? '#DC2626' : '#94A3B8', strokeWidth: affectedIds?.has(eqp.id) ? 2 : 1 },
      markerEnd: { type: MarkerType.ArrowClosed, color: affectedIds?.has(eqp.id) ? '#DC2626' : '#94A3B8' }
    });
  });

  // Add technology nodes (fourth ring)
  graph.technology.forEach((tech, i) => {
    const angle = (i * 2 * Math.PI) / graph.technology.length + Math.PI / 6;
    const radius = 450;
    nodes.push({
      id: tech.id,
      data: { label: tech.name, type: 'technology' },
      position: { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius },
      style: {
        background: affectedIds?.has(tech.id) ? '#FCA5A5' : nodeColors.technology.bg,
        border: `2px solid ${affectedIds?.has(tech.id) ? '#DC2626' : nodeColors.technology.border}`,
        borderRadius: '8px',
        padding: '6px',
        fontSize: '9px',
        fontWeight: 500,
        color: nodeColors.technology.text,
        width: 100,
        boxShadow: affectedIds?.has(tech.id) ? '0 0 10px rgba(220, 38, 38, 0.5)' : 'none'
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    });
    // Edges from equipment to technology
    tech.equipment.forEach(eqpId => {
      edges.push({
        id: `${eqpId}-${tech.id}`,
        source: eqpId,
        target: tech.id,
        type: 'straight',
        animated: affectedIds?.has(tech.id),
        style: { stroke: affectedIds?.has(tech.id) ? '#DC2626' : '#94A3B8', strokeWidth: affectedIds?.has(tech.id) ? 2 : 1 },
        markerEnd: { type: MarkerType.ArrowClosed, color: affectedIds?.has(tech.id) ? '#DC2626' : '#94A3B8' }
      });
    });
  });

  // Add process nodes (outer ring)
  graph.processes.forEach((proc, i) => {
    const angle = (i * 2 * Math.PI) / graph.processes.length + Math.PI / 3;
    const radius = 580;
    const isAffected = affectedIds?.has(proc.id);
    nodes.push({
      id: proc.id,
      data: { label: `${proc.name}\nRTO: ${proc.rto}min`, type: 'process' },
      position: { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius },
      style: {
        background: isAffected ? '#FCA5A5' : nodeColors.process.bg,
        border: `3px solid ${isAffected ? '#DC2626' : nodeColors.process.border}`,
        borderRadius: '12px',
        padding: '8px',
        fontSize: '10px',
        fontWeight: 600,
        color: nodeColors.process.text,
        width: 110,
        boxShadow: isAffected ? '0 0 15px rgba(220, 38, 38, 0.6)' : 'none',
        whiteSpace: 'pre-line' as const,
        textAlign: 'center' as const
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left
    });
  });

  // Add edges from technology to processes
  graph.technology.forEach(tech => {
    tech.processes.forEach(procId => {
      const isAffected = affectedIds?.has(procId);
      edges.push({
        id: `${tech.id}-${procId}`,
        source: tech.id,
        target: procId,
        type: 'straight',
        animated: isAffected,
        style: { stroke: isAffected ? '#DC2626' : '#94A3B8', strokeWidth: isAffected ? 2 : 1 },
        markerEnd: { type: MarkerType.ArrowClosed, color: isAffected ? '#DC2626' : '#94A3B8' }
      });
    });
  });

  return { nodes, edges };
}

export default function DependencyAnalysisPage() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedEnabler, setSelectedEnabler] = useState<string | null>(null);
  const [simulationActive, setSimulationActive] = useState(false);

  // Calculate impact propagation when an enabler is selected
  const impactAnalysis = useMemo(() => {
    if (!selectedEnabler || !simulationActive) return null;

    const graph = mockDependencyGraph;
    const affected = {
      locations: [] as string[],
      buildings: [] as string[],
      equipment: [] as string[],
      technology: [] as string[],
      people: [] as string[],
      vendors: [] as string[],
      vitalRecords: [] as string[],
      processes: [] as any[]
    };

    // Parse the selected enabler
    const [type, id] = selectedEnabler.split(':');

    // Propagate impact based on type
    if (type === 'location') {
      const location = graph.locations.find(l => l.id === id);
      if (location) {
        affected.locations.push(location.id);
        affected.buildings.push(...location.buildings);
        affected.equipment.push(...location.equipment);
        affected.technology.push(...location.technology);
        affected.people.push(...location.people);
        affected.vendors.push(...location.vendors);
        affected.vitalRecords.push(...location.vitalRecords);
      }
    } else if (type === 'building') {
      const building = graph.buildings.find(b => b.id === id);
      if (building) {
        affected.buildings.push(building.id);
        affected.equipment.push(...building.equipment);
        // Get technology from equipment
        building.equipment.forEach(eqpId => {
          const eqp = graph.equipment.find(e => e.id === eqpId);
          if (eqp) affected.technology.push(...eqp.technology);
        });
      }
    } else if (type === 'equipment') {
      const equipment = graph.equipment.find(e => e.id === id);
      if (equipment) {
        affected.equipment.push(equipment.id);
        affected.technology.push(...equipment.technology);
      }
    } else if (type === 'technology') {
      const tech = graph.technology.find(t => t.id === id);
      if (tech) {
        affected.technology.push(tech.id);
      }
    } else if (type === 'vendor') {
      const vendor = graph.vendors.find(v => v.id === id);
      if (vendor) {
        affected.vendors.push(vendor.id);
        affected.technology.push(...vendor.technology);
      }
    } else if (type === 'people') {
      const people = graph.people.find(p => p.id === id);
      if (people) {
        affected.people.push(people.id);
      }
    } else if (type === 'vitalrecord') {
      const vr = graph.vitalRecords.find(v => v.id === id);
      if (vr) {
        affected.vitalRecords.push(vr.id);
      }
    }

    // Deduplicate technology
    affected.technology = [...new Set(affected.technology)];

    // Get affected processes from technology
    affected.technology.forEach(techId => {
      const tech = graph.technology.find(t => t.id === techId);
      if (tech) {
        tech.processes.forEach(procId => {
          const proc = graph.processes.find(p => p.id === procId);
          if (proc && !affected.processes.find(p => p.id === procId)) {
            affected.processes.push(proc);
          }
        });
      }
    });

    // Also get processes from people
    affected.people.forEach(peopleId => {
      const people = graph.people.find(p => p.id === peopleId);
      if (people) {
        people.processes.forEach(procId => {
          const proc = graph.processes.find(p => p.id === procId);
          if (proc && !affected.processes.find(p => p.id === procId)) {
            affected.processes.push(proc);
          }
        });
      }
    });

    // Get processes from vital records
    affected.vitalRecords.forEach(vrId => {
      const vr = graph.vitalRecords.find(v => v.id === vrId);
      if (vr) {
        vr.processes.forEach(procId => {
          const proc = graph.processes.find(p => p.id === procId);
          if (proc && !affected.processes.find(p => p.id === procId)) {
            affected.processes.push(proc);
          }
        });
      }
    });

    // Calculate metrics
    const criticalProcesses = affected.processes.filter(p => p.criticality === 'CRITICAL');
    const tier1Processes = affected.processes.filter(p => p.tier === 1);
    const maxRTO = affected.processes.length > 0 ? Math.max(...affected.processes.map(p => p.rto)) : 0;
    const minRTO = affected.processes.length > 0 ? Math.min(...affected.processes.map(p => p.rto)) : 0;

    return {
      affected,
      metrics: {
        totalProcesses: affected.processes.length,
        criticalProcesses: criticalProcesses.length,
        tier1Affected: tier1Processes.length,
        maxRTO,
        minRTO,
        totalPeople: affected.people.reduce((sum, pId) => {
          const p = graph.people.find(x => x.id === pId);
          return sum + (p?.count || 0);
        }, 0)
      },
      cascadePath: buildCascadePath(type, id, affected)
    };
  }, [selectedEnabler, simulationActive]);

  // Build cascade path for visualization
  function buildCascadePath(type: string, id: string, affected: any) {
    const path: any[] = [];
    const graph = mockDependencyGraph;

    if (type === 'location') {
      const loc = graph.locations.find(l => l.id === id);
      path.push({ level: 0, type: 'location', items: [loc?.name || id] });
      path.push({ level: 1, type: 'building', items: affected.buildings.map((bId: string) => graph.buildings.find(b => b.id === bId)?.name || bId) });
      path.push({ level: 2, type: 'equipment', items: affected.equipment.map((eId: string) => graph.equipment.find(e => e.id === eId)?.name || eId) });
      path.push({ level: 3, type: 'technology', items: affected.technology.map((tId: string) => graph.technology.find(t => t.id === tId)?.name || tId) });
      path.push({ level: 4, type: 'process', items: affected.processes.map((p: any) => p.name) });
    } else if (type === 'building') {
      const bld = graph.buildings.find(b => b.id === id);
      path.push({ level: 0, type: 'building', items: [bld?.name || id] });
      path.push({ level: 1, type: 'equipment', items: affected.equipment.map((eId: string) => graph.equipment.find(e => e.id === eId)?.name || eId) });
      path.push({ level: 2, type: 'technology', items: affected.technology.map((tId: string) => graph.technology.find(t => t.id === tId)?.name || tId) });
      path.push({ level: 3, type: 'process', items: affected.processes.map((p: any) => p.name) });
    } else if (type === 'equipment') {
      const eqp = graph.equipment.find(e => e.id === id);
      path.push({ level: 0, type: 'equipment', items: [eqp?.name || id] });
      path.push({ level: 1, type: 'technology', items: affected.technology.map((tId: string) => graph.technology.find(t => t.id === tId)?.name || tId) });
      path.push({ level: 2, type: 'process', items: affected.processes.map((p: any) => p.name) });
    } else if (type === 'technology') {
      const tech = graph.technology.find(t => t.id === id);
      path.push({ level: 0, type: 'technology', items: [tech?.name || id] });
      path.push({ level: 1, type: 'process', items: affected.processes.map((p: any) => p.name) });
    } else if (type === 'vendor') {
      const vendor = graph.vendors.find(v => v.id === id);
      path.push({ level: 0, type: 'vendor', items: [vendor?.name || id] });
      path.push({ level: 1, type: 'technology', items: affected.technology.map((tId: string) => graph.technology.find(t => t.id === tId)?.name || tId) });
      path.push({ level: 2, type: 'process', items: affected.processes.map((p: any) => p.name) });
    }

    return path.filter(p => p.items.length > 0);
  }

  // Get enablers based on selected scenario
  const getEnablerOptions = () => {
    const graph = mockDependencyGraph;
    switch (selectedScenario) {
      case 'location_failure':
        return graph.locations.map(l => ({ id: `location:${l.id}`, name: l.name, type: l.type }));
      case 'building_failure':
        return graph.buildings.map(b => ({ id: `building:${b.id}`, name: b.name }));
      case 'equipment_failure':
        return graph.equipment.map(e => ({ id: `equipment:${e.id}`, name: e.name, criticality: e.criticality }));
      case 'technology_failure':
        return graph.technology.map(t => ({ id: `technology:${t.id}`, name: t.name, criticality: t.criticality }));
      case 'people_unavailable':
        return graph.people.map(p => ({ id: `people:${p.id}`, name: p.name, count: p.count }));
      case 'vendor_failure':
        return graph.vendors.map(v => ({ id: `vendor:${v.id}`, name: v.name, criticality: v.criticality }));
      case 'data_loss':
        return graph.vitalRecords.map(v => ({ id: `vitalrecord:${v.id}`, name: v.name, criticality: v.criticality }));
      default:
        return [];
    }
  };

  const resetSimulation = () => {
    setSimulationActive(false);
    setSelectedEnabler(null);
  };

  // Generate affected IDs set for graph highlighting
  const affectedIdsSet = useMemo(() => {
    if (!impactAnalysis) return new Set<string>();
    const ids = new Set<string>();
    impactAnalysis.affected.locations.forEach(id => ids.add(id));
    impactAnalysis.affected.buildings.forEach(id => ids.add(id));
    impactAnalysis.affected.equipment.forEach(id => ids.add(id));
    impactAnalysis.affected.technology.forEach(id => ids.add(id));
    impactAnalysis.affected.processes.forEach((p: any) => ids.add(p.id));
    return ids;
  }, [impactAnalysis]);

  // Generate graph elements
  const graphElements = useMemo(() => {
    return generateGraphElements(mockDependencyGraph, simulationActive ? affectedIdsSet : undefined);
  }, [simulationActive, affectedIdsSet]);

  // Navigate to create crisis plan with pre-filled data
  const handleCreateCrisisPlan = () => {
    if (!impactAnalysis || !selectedEnabler) return;

    const [type, id] = selectedEnabler.split(':');
    const graph = mockDependencyGraph;

    // Build pre-fill data
    const prefillData = {
      scenarioType: selectedScenario,
      enablerType: type,
      enablerId: id,
      affectedLocations: impactAnalysis.affected.locations.map(locId =>
        graph.locations.find(l => l.id === locId)?.name
      ).filter(Boolean),
      affectedProcesses: impactAnalysis.affected.processes.map((p: any) => p.name),
      affectedBuildings: impactAnalysis.affected.buildings.map(bId =>
        graph.buildings.find(b => b.id === bId)?.name
      ).filter(Boolean),
      affectedEquipment: impactAnalysis.affected.equipment.map(eId =>
        graph.equipment.find(e => e.id === eId)?.name
      ).filter(Boolean),
      affectedTechnology: impactAnalysis.affected.technology.map(tId =>
        graph.technology.find(t => t.id === tId)?.name
      ).filter(Boolean),
      affectedPeople: impactAnalysis.affected.people.map(pId =>
        graph.people.find(p => p.id === pId)?.name
      ).filter(Boolean),
      affectedVendors: impactAnalysis.affected.vendors.map(vId =>
        graph.vendors.find(v => v.id === vId)?.name
      ).filter(Boolean),
      affectedVitalRecords: impactAnalysis.affected.vitalRecords.map(vrId =>
        graph.vitalRecords.find(v => v.id === vrId)?.name
      ).filter(Boolean),
      metrics: impactAnalysis.metrics
    };

    // Store in sessionStorage and navigate
    sessionStorage.setItem('crisisPlanPrefill', JSON.stringify(prefillData));
    router.push('/crisis-plans/new?from=analysis');
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      location: 'bg-red-100 border-red-300 text-red-800',
      building: 'bg-blue-100 border-blue-300 text-blue-800',
      equipment: 'bg-green-100 border-green-300 text-green-800',
      technology: 'bg-purple-100 border-purple-300 text-purple-800',
      process: 'bg-orange-100 border-orange-300 text-orange-800',
      vendor: 'bg-pink-100 border-pink-300 text-pink-800',
      people: 'bg-cyan-100 border-cyan-300 text-cyan-800',
      vitalrecord: 'bg-yellow-100 border-yellow-300 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      location: BuildingOfficeIcon,
      building: BuildingOfficeIcon,
      equipment: CpuChipIcon,
      technology: ServerIcon,
      process: ArrowPathIcon,
      vendor: TruckIcon,
      people: UsersIcon,
      vitalrecord: DocumentTextIcon
    };
    return icons[type] || ArrowPathIcon;
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/crisis-plans" className="p-2 hover:bg-gray-100 rounded-sm">
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dependency Analysis & Impact Simulator</h1>
            <p className="text-xs text-gray-500">Visualize cascade effects when enablers fail - powered by BIA data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Scenario Selection */}
          <div className="lg:col-span-1 space-y-4">
            {/* Step 1: Select Scenario Type */}
            <div className="bg-white border border-gray-200 rounded-sm p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">1</span>
                Select Failure Type
              </h3>
              <div className="space-y-2">
                {scenarioTypes.map((scenario) => {
                  const Icon = scenario.icon;
                  return (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        setSelectedScenario(scenario.id);
                        setSelectedEnabler(null);
                        setSimulationActive(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-sm border transition-all ${
                        selectedScenario === scenario.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2 rounded-sm ${scenario.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-gray-900">{scenario.name}</p>
                        <p className="text-[10px] text-gray-500">{scenario.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Specific Enabler */}
            {selectedScenario && (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">2</span>
                  Select Specific {scenarioTypes.find(s => s.id === selectedScenario)?.name.split(' ')[0]}
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {getEnablerOptions().map((enabler: any) => (
                    <button
                      key={enabler.id}
                      onClick={() => setSelectedEnabler(enabler.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-sm border transition-all ${
                        selectedEnabler === enabler.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs font-medium text-gray-900">{enabler.name}</span>
                      {enabler.criticality && (
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                          enabler.criticality === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                          enabler.criticality === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {enabler.criticality}
                        </span>
                      )}
                      {enabler.type && (
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded-sm">
                          {enabler.type}
                        </span>
                      )}
                      {enabler.count && (
                        <span className="text-[10px] text-gray-500">{enabler.count} people</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Run Simulation */}
            {selectedEnabler && (
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">3</span>
                  Run Impact Analysis
                </h3>
                {!simulationActive ? (
                  <button
                    onClick={() => setSimulationActive(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white text-sm font-medium rounded-sm hover:bg-red-700"
                  >
                    <PlayIcon className="h-4 w-4" />
                    Simulate Failure
                  </button>
                ) : (
                  <button
                    onClick={resetSimulation}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white text-sm font-medium rounded-sm hover:bg-gray-700"
                  >
                    <XMarkIcon className="h-4 w-4" />
                    Reset Simulation
                  </button>
                )}
              </div>
            )}
          </div>



          {/* Right Panel - Graph & Impact Analysis */}
          <div className="lg:col-span-2 space-y-4">
            {/* Dependency Graph - Always visible */}
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Dependency Network Graph</h3>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200 border border-red-400"></span> Location</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-200 border border-blue-400"></span> Building</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 border border-green-400"></span> Equipment</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-200 border border-purple-400"></span> Technology</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-200 border border-orange-400"></span> Process</span>
                </div>
              </div>
              <div style={{ height: '800px' }}>
                <ReactFlow
                  nodes={graphElements.nodes}
                  edges={graphElements.edges}
                  fitView
                  fitViewOptions={{ padding: 0.2 }}
                  minZoom={0.3}
                  maxZoom={1.5}
                  attributionPosition="bottom-left"
                >
                  <Background color="#E5E7EB" gap={20} />
                  <Controls position="top-right" />
                  <MiniMap
                    nodeColor={(node) => {
                      const type = node.data?.type;
                      if (type === 'location') return '#EF4444';
                      if (type === 'building') return '#3B82F6';
                      if (type === 'equipment') return '#10B981';
                      if (type === 'technology') return '#8B5CF6';
                      if (type === 'process') return '#F97316';
                      return '#94A3B8';
                    }}
                    maskColor="rgba(255,255,255,0.8)"
                    style={{ background: '#F8FAFC' }}
                  />
                </ReactFlow>
              </div>
              {simulationActive && (
                <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <span><strong>Simulation Active:</strong> Red highlighted nodes and animated edges show impact cascade</span>
                </div>
              )}
            </div>

            {/* Impact Metrics - Only show when simulation active */}
            {simulationActive && impactAnalysis && (
              <>
                {/* Impact Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-red-200 rounded-sm p-4">
                    <p className="text-[10px] text-red-600 font-medium mb-1">AFFECTED PROCESSES</p>
                    <p className="text-2xl font-bold text-red-700">{impactAnalysis.metrics.totalProcesses}</p>
                    <p className="text-[10px] text-gray-500">{impactAnalysis.metrics.criticalProcesses} critical</p>
                  </div>
                  <div className="bg-white border border-orange-200 rounded-sm p-4">
                    <p className="text-[10px] text-orange-600 font-medium mb-1">TIER 1 PROCESSES</p>
                    <p className="text-2xl font-bold text-orange-700">{impactAnalysis.metrics.tier1Affected}</p>
                    <p className="text-[10px] text-gray-500">Highest priority</p>
                  </div>
                  <div className="bg-white border border-purple-200 rounded-sm p-4">
                    <p className="text-[10px] text-purple-600 font-medium mb-1">MIN RTO</p>
                    <p className="text-2xl font-bold text-purple-700">{impactAnalysis.metrics.minRTO}</p>
                    <p className="text-[10px] text-gray-500">minutes to recover</p>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-sm p-4">
                    <p className="text-[10px] text-blue-600 font-medium mb-1">PEOPLE AFFECTED</p>
                    <p className="text-2xl font-bold text-blue-700">{impactAnalysis.metrics.totalPeople}</p>
                    <p className="text-[10px] text-gray-500">team members</p>
                  </div>
                </div>

                {/* Cascade Path Visualization */}
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Cascade Path</h3>
                  <div className="relative">
                    {impactAnalysis.cascadePath.map((level: any, index: number) => {
                      const Icon = getTypeIcon(level.type);
                      return (
                        <div key={index} className="mb-4 last:mb-0">
                          <div className="flex items-start gap-3">
                            {/* Level indicator */}
                            <div className="flex flex-col items-center">
                              <div className={`p-2 rounded-sm ${getTypeColor(level.type)} border`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              {index < impactAnalysis.cascadePath.length - 1 && (
                                <div className="w-0.5 h-8 bg-gray-300 mt-2" />
                              )}
                            </div>
                            {/* Items */}
                            <div className="flex-1">
                              <p className="text-[10px] font-medium text-gray-500 uppercase mb-2">
                                {level.type} ({level.items.length})
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {level.items.map((item: string, i: number) => (
                                  <span
                                    key={i}
                                    className={`px-2 py-1 text-xs rounded-sm border ${getTypeColor(level.type)}`}
                                  >
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Affected Processes Detail */}
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Affected Critical Processes</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-[10px] font-medium text-gray-500 uppercase py-2">Process</th>
                          <th className="text-left text-[10px] font-medium text-gray-500 uppercase py-2">Department</th>
                          <th className="text-left text-[10px] font-medium text-gray-500 uppercase py-2">Tier</th>
                          <th className="text-left text-[10px] font-medium text-gray-500 uppercase py-2">RTO</th>
                          <th className="text-left text-[10px] font-medium text-gray-500 uppercase py-2">RPO</th>
                          <th className="text-left text-[10px] font-medium text-gray-500 uppercase py-2">Criticality</th>
                        </tr>
                      </thead>
                      <tbody>
                        {impactAnalysis.affected.processes
                          .sort((a: any, b: any) => a.tier - b.tier || a.rto - b.rto)
                          .map((proc: any) => (
                          <tr key={proc.id} className="border-b border-gray-100">
                            <td className="py-2">
                              <span className="text-xs font-medium text-gray-900">{proc.name}</span>
                            </td>
                            <td className="py-2">
                              <span className="text-xs text-gray-600">{proc.department}</span>
                            </td>
                            <td className="py-2">
                              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                                proc.tier === 1 ? 'bg-red-100 text-red-700' :
                                proc.tier === 2 ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                Tier {proc.tier}
                              </span>
                            </td>
                            <td className="py-2">
                              <span className="text-xs font-medium text-gray-900">{proc.rto} min</span>
                            </td>
                            <td className="py-2">
                              <span className="text-xs text-gray-600">{proc.rpo} min</span>
                            </td>
                            <td className="py-2">
                              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-sm ${
                                proc.criticality === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                proc.criticality === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {proc.criticality}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* BETH3V Impact Summary */}
                <div className="bg-white border border-gray-200 rounded-sm p-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-4">BETH3V Impact Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="border border-blue-200 rounded-sm p-3 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <BuildingOfficeIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-[10px] font-medium text-blue-800">Buildings</span>
                      </div>
                      <p className="text-lg font-bold text-blue-700">{impactAnalysis.affected.buildings.length}</p>
                    </div>
                    <div className="border border-green-200 rounded-sm p-3 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <CpuChipIcon className="h-4 w-4 text-green-600" />
                        <span className="text-[10px] font-medium text-green-800">Equipment</span>
                      </div>
                      <p className="text-lg font-bold text-green-700">{impactAnalysis.affected.equipment.length}</p>
                    </div>
                    <div className="border border-purple-200 rounded-sm p-3 bg-purple-50">
                      <div className="flex items-center gap-2 mb-2">
                        <ServerIcon className="h-4 w-4 text-purple-600" />
                        <span className="text-[10px] font-medium text-purple-800">Technology</span>
                      </div>
                      <p className="text-lg font-bold text-purple-700">{impactAnalysis.affected.technology.length}</p>
                    </div>
                    <div className="border border-cyan-200 rounded-sm p-3 bg-cyan-50">
                      <div className="flex items-center gap-2 mb-2">
                        <UsersIcon className="h-4 w-4 text-cyan-600" />
                        <span className="text-[10px] font-medium text-cyan-800">People Groups</span>
                      </div>
                      <p className="text-lg font-bold text-cyan-700">{impactAnalysis.affected.people.length}</p>
                    </div>
                    <div className="border border-pink-200 rounded-sm p-3 bg-pink-50">
                      <div className="flex items-center gap-2 mb-2">
                        <TruckIcon className="h-4 w-4 text-pink-600" />
                        <span className="text-[10px] font-medium text-pink-800">Vendors</span>
                      </div>
                      <p className="text-lg font-bold text-pink-700">{impactAnalysis.affected.vendors.length}</p>
                    </div>
                    <div className="border border-yellow-200 rounded-sm p-3 bg-yellow-50">
                      <div className="flex items-center gap-2 mb-2">
                        <DocumentTextIcon className="h-4 w-4 text-yellow-600" />
                        <span className="text-[10px] font-medium text-yellow-800">Vital Records</span>
                      </div>
                      <p className="text-lg font-bold text-yellow-700">{impactAnalysis.affected.vitalRecords.length}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateCrisisPlan}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white text-sm font-medium rounded-sm hover:bg-red-700"
                  >
                    Create Crisis Plan for This Scenario
                  </button>
                  <button className="px-4 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-sm hover:bg-gray-50">
                    Export Impact Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
