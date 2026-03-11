'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ThreatWithPlan {
  id: number;
  threatId: number;
  threatName: string;
  riskScore: number;
  riskLevel: string;
  residualRiskScore?: number;
  residualRiskLevel?: string;
  controlCount: number;
  treatmentPlans: TreatmentPlan[];
}

// Risk appetite threshold - risks above this require treatment
const RISK_APPETITE_THRESHOLD = 8;

interface TreatmentPlan {
  id?: number;
  threatAssessmentId: number;
  threatName?: string;
  treatmentOption: string;
  actionDescription: string;
  actionOwner: string;
  targetDate: string;
  status: string;
}

interface Step6Props {
  assessmentId: number | null;
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
  isDemoMode?: boolean;
}

const TREATMENT_OPTIONS = [
  { value: 'MITIGATE', label: 'Mitigate', description: 'Implement controls to reduce risk' },
  { value: 'TRANSFER', label: 'Transfer', description: 'Transfer risk to third party' },
  { value: 'ACCEPT', label: 'Accept', description: 'Accept the risk as is' },
  { value: 'AVOID', label: 'Avoid', description: 'Eliminate the activity causing risk' }
];

// Mock threats requiring treatment for demo mode
const DEMO_THREATS_WITH_PLANS: ThreatWithPlan[] = [
  {
    id: 1, threatId: 1, threatName: 'Cyber Attack / Ransomware', riskScore: 20, riskLevel: 'HIGH',
    residualRiskScore: 12, residualRiskLevel: 'MEDIUM', controlCount: 2, treatmentPlans: []
  },
  {
    id: 3, threatId: 3, threatName: 'Data Breach', riskScore: 16, riskLevel: 'HIGH',
    residualRiskScore: 10, residualRiskLevel: 'MEDIUM', controlCount: 1, treatmentPlans: []
  },
];

export default function Step6TreatmentPlans({ assessmentId, data, onUpdate, onNext, onBack, isDemoMode = false }: Step6Props) {
  const [threats, setThreats] = useState<ThreatWithPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState<{ threatId: number; plan: Partial<TreatmentPlan> } | null>(null);

  useEffect(() => {
    if (isDemoMode) {
      console.log('🎬 Demo Mode: Using mock threats requiring treatment');
      setTimeout(() => {
        setThreats(DEMO_THREATS_WITH_PLANS);
        setLoading(false);
      }, 500);
    } else if (assessmentId) {
      loadThreatsAndPlans();
    }
  }, [assessmentId, isDemoMode]);

  const loadThreatsAndPlans = async () => {
    try {
      setLoading(true);

      // Load threat assessments
      const threatsResponse = await fetch(`http://localhost:8080/api/threat-assessments/by-risk-assessment/${assessmentId}`);
      if (!threatsResponse.ok) throw new Error('Failed to load threats');
      const threatsData = await threatsResponse.json();

      // Load existing treatment plans
      const plansResponse = await fetch(`http://localhost:8080/api/risk-assessments/wizard/${assessmentId}/treatment-plans`);
      if (!plansResponse.ok) throw new Error('Failed to load treatment plans');
      const plansData = await plansResponse.json();

      // Filter threats where residual risk exceeds threshold
      // If no residual risk calculated, use inherent risk
      const threatsRequiringTreatment = threatsData
        .filter((t: any) => {
          const effectiveRisk = t.residualRiskScore ?? t.riskScore;
          return effectiveRisk > RISK_APPETITE_THRESHOLD;
        })
        .map((t: any) => ({
          id: t.id,
          threatId: t.threatId,
          threatName: t.threatName,
          riskScore: t.riskScore,
          riskLevel: t.riskLevel,
          residualRiskScore: t.residualRiskScore,
          residualRiskLevel: t.residualRiskLevel,
          controlCount: t.controlCount || 0,
          treatmentPlans: plansData.filter((p: any) => p.threatAssessmentId === t.id)
        }));

      setThreats(threatsRequiringTreatment);
    } catch (err) {
      console.error('Error loading threats and plans:', err);
      alert('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = (threatAssessmentId: number) => {
    setEditingPlan({
      threatId: threatAssessmentId,
      plan: {
        threatAssessmentId,
        treatmentOption: 'MITIGATE',
        actionDescription: '',
        actionOwner: '',
        targetDate: '',
        status: 'PLANNED'
      }
    });
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;

    try {
      setSaving(true);

      // In demo mode, just update local state
      if (isDemoMode) {
        console.log('🎬 Demo Mode: Saving treatment plan locally');
        await new Promise(resolve => setTimeout(resolve, 300));
        const newPlan: TreatmentPlan = {
          id: Date.now(),
          ...editingPlan.plan as TreatmentPlan
        };
        setThreats(prev => prev.map(t =>
          t.id === editingPlan.threatId
            ? { ...t, treatmentPlans: [...t.treatmentPlans, newPlan] }
            : t
        ));
        setEditingPlan(null);
        setSaving(false);
        return;
      }

      const response = await fetch('http://localhost:8080/api/risk-assessments/wizard/treatment-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPlan.plan)
      });

      if (!response.ok) throw new Error('Failed to save treatment plan');

      await loadThreatsAndPlans();
      setEditingPlan(null);
    } catch (err) {
      console.error('Error saving treatment plan:', err);
      alert('Failed to save treatment plan. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm('Are you sure you want to delete this treatment plan?')) return;

    try {
      // In demo mode, just update local state
      if (isDemoMode) {
        console.log('🎬 Demo Mode: Deleting treatment plan locally');
        setThreats(prev => prev.map(t => ({
          ...t,
          treatmentPlans: t.treatmentPlans.filter(p => p.id !== planId)
        })));
        return;
      }

      const response = await fetch(`http://localhost:8080/api/risk-assessments/wizard/treatment-plans/${planId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete treatment plan');

      await loadThreatsAndPlans();
    } catch (err) {
      console.error('Error deleting treatment plan:', err);
      alert('Failed to delete treatment plan. Please try again.');
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Treatment Plans</h1>
            <p className="text-xs text-gray-500 mt-0.5">Step 6 of 7: Define mitigation strategies for high-risk threats</p>
          </div>
          <button
            onClick={onBack}
            className="px-2.5 py-1.5 text-xs text-gray-700 hover:text-gray-900 border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
              <p className="text-sm text-gray-500 mt-3">Loading high-risk threats...</p>
            </div>
          ) : threats.length === 0 ? (
            <div className="border border-green-200 bg-green-50 rounded-sm p-4">
              <p className="text-sm text-green-900">
                <strong>Good news!</strong> All risks are within acceptable levels (below threshold of {RISK_APPETITE_THRESHOLD}). No treatment plans required.
              </p>
              <p className="text-xs text-green-700 mt-2">
                You can proceed to the next step. If you want to add treatment plans anyway, you can do so from the Risk Assessment detail view.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Info Banner */}
              <div className="border border-amber-200 bg-amber-50 rounded-sm p-4">
                <p className="text-xs text-amber-900">
                  <strong>{threats.length} risk{threats.length !== 1 ? 's' : ''}</strong> exceed{threats.length === 1 ? 's' : ''} the risk appetite threshold of <strong>{RISK_APPETITE_THRESHOLD}</strong> and require{threats.length === 1 ? 's' : ''} treatment plans.
                </p>
                <p className="text-[10px] text-amber-700 mt-1">
                  Residual risk (after controls) is used when available, otherwise inherent risk is considered.
                </p>
              </div>

              {/* Threats List */}
              {threats.map((threat) => (
                <div key={threat.id} className="border border-gray-200 rounded-sm p-4">
                  {/* Threat Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">{threat.threatName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${
                          (threat.residualRiskScore ?? threat.riskScore) >= 15 ? 'bg-red-100 text-red-800' :
                          (threat.residualRiskScore ?? threat.riskScore) >= 10 ? 'bg-orange-100 text-orange-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {threat.residualRiskScore ? 'RESIDUAL' : 'INHERENT'}: {threat.residualRiskScore ?? threat.riskScore}
                        </span>
                        {threat.residualRiskScore && (
                          <span className="text-[10px] text-gray-500 line-through">
                            Inherent: {threat.riskScore}
                          </span>
                        )}
                        {threat.controlCount > 0 && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded">
                            {threat.controlCount} control{threat.controlCount !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddPlan(threat.id)}
                      className="px-2.5 py-1.5 text-xs bg-gray-900 text-white rounded-sm hover:bg-gray-800 flex items-center gap-1"
                    >
                      <PlusIcon className="h-3 w-3" />
                      Add Plan
                    </button>
                  </div>

                  {/* Existing Plans */}
                  {threat.treatmentPlans.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {threat.treatmentPlans.map((plan) => (
                        <div key={plan.id} className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-medium rounded">
                                  {plan.treatmentOption}
                                </span>
                                <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] font-medium rounded">
                                  {plan.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-900 mb-1">{plan.actionDescription}</p>
                              <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                <span>Owner: {plan.actionOwner}</span>
                                <span>Due: {plan.targetDate}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => plan.id && handleDeletePlan(plan.id)}
                              className="px-2 py-1 text-xs text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* No Plans Message */}
                  {threat.treatmentPlans.length === 0 && (
                    <div className="text-xs text-gray-500 italic mt-2">
                      No treatment plans defined yet. Click "Add Plan" to create one.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add/Edit Plan Modal */}
          {editingPlan && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-sm shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
                <div className="border-b px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Add Treatment Plan</h2>
                </div>
                <div className="px-6 py-4 space-y-4">
                  {/* Treatment Option */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Treatment Option <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {TREATMENT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setEditingPlan({
                            ...editingPlan,
                            plan: { ...editingPlan.plan, treatmentOption: option.value }
                          })}
                          className={`p-3 border rounded-sm text-left transition-all ${
                            editingPlan.plan.treatmentOption === option.value
                              ? 'border-gray-900 bg-gray-900 text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="text-xs font-medium">{option.label}</div>
                          <div className="text-[10px] mt-1 opacity-75">{option.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Action Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={editingPlan.plan.actionDescription || ''}
                      onChange={(e) => setEditingPlan({
                        ...editingPlan,
                        plan: { ...editingPlan.plan, actionDescription: e.target.value }
                      })}
                      rows={3}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                      placeholder="Describe the actions to be taken..."
                    />
                  </div>

                  {/* Action Owner */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Action Owner <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingPlan.plan.actionOwner || ''}
                      onChange={(e) => setEditingPlan({
                        ...editingPlan,
                        plan: { ...editingPlan.plan, actionOwner: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                      placeholder="Person or team responsible"
                    />
                  </div>

                  {/* Target Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Target Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={editingPlan.plan.targetDate || ''}
                      onChange={(e) => setEditingPlan({
                        ...editingPlan,
                        plan: { ...editingPlan.plan, targetDate: e.target.value }
                      })}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                </div>
                <div className="border-t px-6 py-3 flex justify-end gap-2">
                  <button
                    onClick={() => setEditingPlan(null)}
                    className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePlan}
                    disabled={saving || !editingPlan.plan.actionDescription || !editingPlan.plan.actionOwner || !editingPlan.plan.targetDate}
                    className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-sm hover:bg-gray-800 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Plan'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white px-6 py-3">
        <div className="max-w-4xl mx-auto flex justify-between">
          <button
            onClick={onBack}
            className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-sm hover:bg-gray-800"
          >
            Next: Review & Approval
          </button>
        </div>
      </div>
    </>
  );
}

