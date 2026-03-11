'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface TreatmentPlan {
  id: number;
  riskId: string;
  riskName: string;
  category: string;
  owner: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'DELAYED';
  completionPercentage: number;
  budget: number;
  actualCost: number;
  milestones: number;
  completedMilestones: number;
}

export default function MitigationPerformancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockPlans: TreatmentPlan[] = [
        {
          id: 1,
          riskId: 'RISK-001',
          riskName: 'Ransomware Attack on Critical Systems',
          category: 'Cyber Security',
          owner: 'John Smith',
          plannedStartDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          plannedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          actualStartDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'IN_PROGRESS',
          completionPercentage: 65,
          budget: 50000,
          actualCost: 32000,
          milestones: 5,
          completedMilestones: 3
        },
        {
          id: 2,
          riskId: 'RISK-002',
          riskName: 'Data Center Power Failure',
          category: 'Infrastructure',
          owner: 'Sarah Johnson',
          plannedStartDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          plannedEndDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          actualStartDate: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000).toISOString(),
          actualEndDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          completionPercentage: 100,
          budget: 75000,
          actualCost: 72000,
          milestones: 4,
          completedMilestones: 4
        },
        {
          id: 3,
          riskId: 'RISK-003',
          riskName: 'Vendor Service Disruption',
          category: 'Third Party',
          owner: 'Michael Chen',
          plannedStartDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          plannedEndDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          actualStartDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'OVERDUE',
          completionPercentage: 80,
          budget: 30000,
          actualCost: 28000,
          milestones: 3,
          completedMilestones: 2
        },
        {
          id: 4,
          riskId: 'RISK-004',
          riskName: 'Employee Data Breach',
          category: 'Data Protection',
          owner: 'Emily Davis',
          plannedStartDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          plannedEndDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'NOT_STARTED',
          completionPercentage: 0,
          budget: 40000,
          actualCost: 0,
          milestones: 6,
          completedMilestones: 0
        },
        {
          id: 5,
          riskId: 'RISK-005',
          riskName: 'Network Infrastructure Failure',
          category: 'Infrastructure',
          owner: 'David Wilson',
          plannedStartDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          plannedEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          actualStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'DELAYED',
          completionPercentage: 40,
          budget: 60000,
          actualCost: 35000,
          milestones: 5,
          completedMilestones: 2
        },
        {
          id: 6,
          riskId: 'RISK-006',
          riskName: 'Compliance Violation Risk',
          category: 'Compliance',
          owner: 'John Smith',
          plannedStartDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
          plannedEndDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          actualStartDate: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000).toISOString(),
          actualEndDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'COMPLETED',
          completionPercentage: 100,
          budget: 25000,
          actualCost: 24500,
          milestones: 3,
          completedMilestones: 3
        }
      ];
      
      setTreatmentPlans(mockPlans);
    } catch (error) {
      console.error('Failed to load treatment plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = useMemo(() => {
    return treatmentPlans.filter(plan => {
      const matchesStatus = !filterStatus || plan.status === filterStatus;
      const matchesCategory = !filterCategory || plan.category === filterCategory;
      return matchesStatus && matchesCategory;
    });
  }, [treatmentPlans, filterStatus, filterCategory]);

  const kpis = useMemo(() => {
    const total = treatmentPlans.length;
    const completed = treatmentPlans.filter(p => p.status === 'COMPLETED').length;
    const onTime = treatmentPlans.filter(p => {
      if (p.status === 'COMPLETED' && p.actualEndDate && p.plannedEndDate) {
        return new Date(p.actualEndDate) <= new Date(p.plannedEndDate);
      }
      return false;
    }).length;
    const overdue = treatmentPlans.filter(p => p.status === 'OVERDUE').length;
    const inProgress = treatmentPlans.filter(p => p.status === 'IN_PROGRESS').length;

    const completedPlans = treatmentPlans.filter(p => p.status === 'COMPLETED' && p.actualStartDate && p.actualEndDate);
    const avgDays = completedPlans.length > 0
      ? Math.round(completedPlans.reduce((sum, p) => {
          const start = new Date(p.actualStartDate!).getTime();
          const end = new Date(p.actualEndDate!).getTime();
          return sum + (end - start) / (1000 * 60 * 60 * 24);
        }, 0) / completedPlans.length)
      : 0;

    const onTimeRate = completed > 0 ? Math.round((onTime / completed) * 100) : 0;
    const totalBudget = treatmentPlans.reduce((sum, p) => sum + p.budget, 0);
    const totalSpent = treatmentPlans.reduce((sum, p) => sum + p.actualCost, 0);
    const budgetUtilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    return { total, completed, onTime, overdue, inProgress, avgDays, onTimeRate, budgetUtilization, totalBudget, totalSpent };
  }, [treatmentPlans]);

  const categories = Array.from(new Set(treatmentPlans.map(p => p.category)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'DELAYED':
        return 'bg-orange-100 text-orange-800';
      case 'NOT_STARTED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Mitigation Performance</h1>
            <p className="mt-0.5 text-xs text-gray-500">Track treatment plan performance against planned timelines</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/risk-assessment')}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <ChevronLeftIcon className="h-3.5 w-3.5 mr-1" />
              Back
            </button>
            <button
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-3.5 w-3.5 mr-1" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-6 gap-3 mb-4">
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Plans</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{kpis.total}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-semibold text-green-600 mt-2">{kpis.completed}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">On-Time Rate</p>
            <p className="text-2xl font-semibold text-blue-600 mt-2">{kpis.onTimeRate}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Overdue</p>
            <p className="text-2xl font-semibold text-red-600 mt-2">{kpis.overdue}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Avg Days</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{kpis.avgDays}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-3">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Budget Used</p>
            <p className="text-2xl font-semibold text-purple-600 mt-2">{kpis.budgetUtilization}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 mb-4">
          <div className="grid grid-cols-3 gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-sm text-sm"
            >
              <option value="">All Statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="OVERDUE">Overdue</option>
              <option value="DELAYED">Delayed</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-sm text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Treatment Plans Table */}
        <div className="bg-white border border-gray-200 rounded-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Risk ID</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Risk Name</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                  <th className="px-4 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredPlans.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                      No treatment plans found
                    </td>
                  </tr>
                ) : (
                  filteredPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {plan.riskId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {plan.riskName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {plan.category}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {plan.owner}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 rounded-sm text-xs font-medium ${getStatusColor(plan.status)}`}>
                          {plan.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                plan.completionPercentage === 100 ? 'bg-green-600' :
                                plan.completionPercentage >= 50 ? 'bg-blue-600' : 'bg-orange-600'
                              }`}
                              style={{ width: `${plan.completionPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{plan.completionPercentage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                        <div>{formatDate(plan.plannedStartDate)} - {formatDate(plan.plannedEndDate)}</div>
                        {plan.actualEndDate && (
                          <div className="text-green-600">Completed: {formatDate(plan.actualEndDate)}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">
                        <div>{formatCurrency(plan.actualCost)} / {formatCurrency(plan.budget)}</div>
                        <div className={plan.actualCost > plan.budget ? 'text-red-600' : 'text-green-600'}>
                          {Math.round((plan.actualCost / plan.budget) * 100)}%
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
