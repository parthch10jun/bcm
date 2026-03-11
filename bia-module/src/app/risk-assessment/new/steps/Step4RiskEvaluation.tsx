'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, PlusIcon, XMarkIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface Control {
  id: number;
  controlId: string;
  name: string;
  controlType: string;
  controlCategory: string;
  effectivenessRating: number;
}

interface Threat {
  id: number;
  threatId: number;
  threatName: string;
  threatDescription: string;
  likelihood: string | null;
  impact: string | null;
  riskScore: number | null;
  riskLevel: string | null;
  existingControls: string | null;
  controlEffectiveness: string | null;
  selectedControls: Control[];
  residualRiskScore: number | null;
  residualRiskLevel: string | null;
}

// Mock controls from library
const mockControls: Control[] = [
  { id: 1, controlId: 'CTL-001', name: 'Multi-Factor Authentication', controlType: 'PREVENTIVE', controlCategory: 'TECHNICAL', effectivenessRating: 5 },
  { id: 2, controlId: 'CTL-002', name: 'Security Monitoring', controlType: 'DETECTIVE', controlCategory: 'TECHNICAL', effectivenessRating: 4 },
  { id: 3, controlId: 'CTL-003', name: 'Incident Response Plan', controlType: 'CORRECTIVE', controlCategory: 'ADMINISTRATIVE', effectivenessRating: 4 },
  { id: 4, controlId: 'CTL-004', name: 'Access Control Policy', controlType: 'PREVENTIVE', controlCategory: 'ADMINISTRATIVE', effectivenessRating: 4 },
  { id: 5, controlId: 'CTL-005', name: 'Backup & Recovery', controlType: 'CORRECTIVE', controlCategory: 'OPERATIONAL', effectivenessRating: 5 },
  { id: 6, controlId: 'CTL-006', name: 'Physical Access Controls', controlType: 'PREVENTIVE', controlCategory: 'PHYSICAL', effectivenessRating: 4 },
  { id: 7, controlId: 'CTL-007', name: 'Security Awareness Training', controlType: 'PREVENTIVE', controlCategory: 'ADMINISTRATIVE', effectivenessRating: 3 },
  { id: 8, controlId: 'CTL-008', name: 'Vulnerability Scanning', controlType: 'DETECTIVE', controlCategory: 'TECHNICAL', effectivenessRating: 4 },
];

interface Step4Props {
  assessmentId: number | null;
  data: any;
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onBack: () => void;
  isDemoMode?: boolean;
}

// Mock threats for demo mode
const DEMO_THREATS: Threat[] = [
  { id: 1, threatId: 1, threatName: 'Cyber Attack / Ransomware', threatDescription: 'Malicious actors compromise systems through malware or ransomware attacks', likelihood: null, impact: null, riskScore: null, riskLevel: null, existingControls: null, controlEffectiveness: null, selectedControls: [], residualRiskScore: null, residualRiskLevel: null },
  { id: 2, threatId: 2, threatName: 'System Failure', threatDescription: 'Critical systems experience unexpected downtime or failure', likelihood: null, impact: null, riskScore: null, riskLevel: null, existingControls: null, controlEffectiveness: null, selectedControls: [], residualRiskScore: null, residualRiskLevel: null },
  { id: 3, threatId: 3, threatName: 'Data Breach', threatDescription: 'Unauthorized access to sensitive data or information leakage', likelihood: null, impact: null, riskScore: null, riskLevel: null, existingControls: null, controlEffectiveness: null, selectedControls: [], residualRiskScore: null, residualRiskLevel: null },
  { id: 4, threatId: 4, threatName: 'Key Personnel Loss', threatDescription: 'Loss of key staff due to resignation, illness, or other factors', likelihood: null, impact: null, riskScore: null, riskLevel: null, existingControls: null, controlEffectiveness: null, selectedControls: [], residualRiskScore: null, residualRiskLevel: null },
  { id: 5, threatId: 5, threatName: 'Vendor/Supplier Failure', threatDescription: 'Critical vendor or supplier unable to provide services', likelihood: null, impact: null, riskScore: null, riskLevel: null, existingControls: null, controlEffectiveness: null, selectedControls: [], residualRiskScore: null, residualRiskLevel: null },
];

const LIKELIHOOD_OPTIONS = [
  { value: 'RARE', label: 'Rare', score: 1, description: '< 10%' },
  { value: 'UNLIKELY', label: 'Unlikely', score: 2, description: '10-30%' },
  { value: 'POSSIBLE', label: 'Possible', score: 3, description: '30-50%' },
  { value: 'LIKELY', label: 'Likely', score: 4, description: '50-80%' },
  { value: 'ALMOST_CERTAIN', label: 'Almost Certain', score: 5, description: '> 80%' }
];

const IMPACT_OPTIONS = [
  { value: 'INSIGNIFICANT', label: 'Insignificant', score: 1, description: 'Minimal impact' },
  { value: 'MINOR', label: 'Minor', score: 2, description: 'Minor impact' },
  { value: 'MODERATE', label: 'Moderate', score: 3, description: 'Moderate impact' },
  { value: 'MAJOR', label: 'Major', score: 4, description: 'Major impact' },
  { value: 'CATASTROPHIC', label: 'Catastrophic', score: 5, description: 'Catastrophic impact' }
];

export default function Step4RiskEvaluation({ assessmentId, data, onUpdate, onNext, onBack, isDemoMode = false }: Step4Props) {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [currentThreatIndex, setCurrentThreatIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showControlModal, setShowControlModal] = useState(false);
  const [availableControls] = useState<Control[]>(mockControls);

  useEffect(() => {
    if (isDemoMode) {
      // Use mock threats in demo mode
      console.log('🎬 Demo Mode: Using mock threats');
      setTimeout(() => {
        setThreats(DEMO_THREATS);
        setLoading(false);
      }, 500);
    } else if (assessmentId) {
      loadThreats();
    }
  }, [assessmentId, isDemoMode]);

  const loadThreats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/threat-assessments/by-risk-assessment/${assessmentId}`);

      if (!response.ok) {
        throw new Error('Failed to load threats');
      }

      const data = await response.json();

      // Transform backend DTO to match our Threat interface
      const transformedThreats: Threat[] = data.map((ta: any) => ({
        id: ta.id,
        threatId: ta.threatId || 0,
        threatName: ta.threatName || 'Unknown Threat',
        threatDescription: ta.threatDescription || '',
        likelihood: ta.likelihood,
        impact: ta.impact,
        riskScore: ta.riskScore,
        riskLevel: ta.riskLevel,
        existingControls: ta.existingControls,
        controlEffectiveness: ta.controlEffectiveness,
        selectedControls: [],
        residualRiskScore: null,
        residualRiskLevel: null
      }));

      setThreats(transformedThreats);
    } catch (err) {
      console.error('Error loading threats:', err);
      alert('Failed to load threats. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentThreat = threats[currentThreatIndex];

  const handleAssessThreat = async () => {
    if (!currentThreat || !currentThreat.likelihood || !currentThreat.impact) {
      alert('Please select both likelihood and impact');
      return;
    }

    try {
      setSaving(true);

      // In demo mode, skip API call
      if (isDemoMode) {
        console.log('🎬 Demo Mode: Skipping API call for threat assessment');
        await new Promise(resolve => setTimeout(resolve, 300));
      } else {
        const response = await fetch(`http://localhost:8080/api/risk-assessments/wizard/threat-assessments/${currentThreat.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            likelihood: currentThreat.likelihood,
            impact: currentThreat.impact,
            existingControls: currentThreat.existingControls || '',
            controlEffectiveness: currentThreat.controlEffectiveness || 'MODERATE'
          })
        });

        if (!response.ok) throw new Error('Failed to assess threat');
      }

      // Update the threat in local state with calculated values
      const riskScore = getRiskScore();
      const riskLevel = getRiskLevel(riskScore);

      setThreats(prev => prev.map((t, idx) =>
        idx === currentThreatIndex
          ? { ...t, riskScore, riskLevel: riskLevel?.label || null }
          : t
      ));

      // Move to next threat or finish
      if (currentThreatIndex < threats.length - 1) {
        setCurrentThreatIndex(currentThreatIndex + 1);
      } else {
        // All threats assessed
        onNext();
      }
    } catch (err) {
      console.error('Error assessing threat:', err);
      alert('Failed to save assessment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateCurrentThreat = (field: string, value: any) => {
    setThreats(prev => prev.map((t, idx) => 
      idx === currentThreatIndex ? { ...t, [field]: value } : t
    ));
  };

  const getRiskScore = () => {
    if (!currentThreat?.likelihood || !currentThreat?.impact) return null;
    const likelihoodScore = LIKELIHOOD_OPTIONS.find(o => o.value === currentThreat.likelihood)?.score || 0;
    const impactScore = IMPACT_OPTIONS.find(o => o.value === currentThreat.impact)?.score || 0;
    return likelihoodScore * impactScore;
  };

  const getRiskLevel = (score: number | null) => {
    if (!score) return null;
    if (score <= 6) return { label: 'LOW', color: 'bg-green-100 text-green-800' };
    if (score <= 14) return { label: 'MEDIUM', color: 'bg-amber-100 text-amber-800' };
    return { label: 'HIGH', color: 'bg-red-100 text-red-800' };
  };

  // Calculate residual risk based on controls
  const calculateResidualRisk = (inherentScore: number, controls: Control[]) => {
    if (controls.length === 0) return inherentScore;
    // Average effectiveness rating (1-5 scale)
    const avgEffectiveness = controls.reduce((sum, c) => sum + c.effectivenessRating, 0) / controls.length;
    // Reduction factor: effectiveness 5 = 80% reduction, 1 = 20% reduction
    const reductionFactor = 0.2 + (avgEffectiveness - 1) * 0.15;
    return Math.max(1, Math.round(inherentScore * (1 - reductionFactor)));
  };

  const addControl = (control: Control) => {
    if (!currentThreat) return;
    const alreadyAdded = currentThreat.selectedControls?.some(c => c.id === control.id);
    if (!alreadyAdded) {
      const updatedControls = [...(currentThreat.selectedControls || []), control];
      const inherentScore = getRiskScore() || 0;
      const residualScore = calculateResidualRisk(inherentScore, updatedControls);
      const residualLevel = getRiskLevel(residualScore);
      setThreats(prev => prev.map((t, idx) =>
        idx === currentThreatIndex
          ? { ...t, selectedControls: updatedControls, residualRiskScore: residualScore, residualRiskLevel: residualLevel?.label || null }
          : t
      ));
    }
    setShowControlModal(false);
  };

  const removeControl = (controlId: number) => {
    if (!currentThreat) return;
    const updatedControls = currentThreat.selectedControls?.filter(c => c.id !== controlId) || [];
    const inherentScore = getRiskScore() || 0;
    const residualScore = updatedControls.length > 0 ? calculateResidualRisk(inherentScore, updatedControls) : null;
    const residualLevel = residualScore ? getRiskLevel(residualScore) : null;
    setThreats(prev => prev.map((t, idx) =>
      idx === currentThreatIndex
        ? { ...t, selectedControls: updatedControls, residualRiskScore: residualScore, residualRiskLevel: residualLevel?.label || null }
        : t
    ));
  };

  const riskScore = getRiskScore();
  const riskLevel = getRiskLevel(riskScore);
  const residualScore = currentThreat?.residualRiskScore;
  const residualLevel = getRiskLevel(residualScore || null);

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Risk Evaluation</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Step 4 of 7: Assess threat {currentThreatIndex + 1} of {threats.length}
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-2.5 py-1.5 text-xs text-gray-700 hover:text-gray-900 border border-gray-300 rounded-sm hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        </div>
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-900 transition-all duration-300"
              style={{ width: `${((currentThreatIndex + 1) / threats.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
              <p className="text-sm text-gray-500 mt-3">Loading threats...</p>
            </div>
          ) : currentThreat ? (
            <div className="space-y-4">
              {/* Threat Info */}
              <div className="border border-gray-200 rounded-sm p-4">
                <h3 className="text-base font-semibold text-gray-900">{currentThreat.threatName}</h3>
                <p className="text-sm text-gray-600 mt-1">{currentThreat.threatDescription}</p>
              </div>

              {/* Likelihood Selection */}
              <div className="border border-gray-200 rounded-sm p-4">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Likelihood <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {LIKELIHOOD_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateCurrentThreat('likelihood', option.value)}
                      className={`p-3 border rounded-sm text-center transition-all ${
                        currentThreat.likelihood === option.value
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

              {/* Impact Selection */}
              <div className="border border-gray-200 rounded-sm p-4">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Impact <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {IMPACT_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => updateCurrentThreat('impact', option.value)}
                      className={`p-3 border rounded-sm text-center transition-all ${
                        currentThreat.impact === option.value
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

              {/* Risk Score Display */}
              {currentThreat.likelihood && currentThreat.impact && riskScore && riskLevel && (
                <div className={`border-2 rounded-sm p-4 ${
                  riskLevel.label === 'HIGH' ? 'border-red-300 bg-red-50' :
                  riskLevel.label === 'MEDIUM' ? 'border-amber-300 bg-amber-50' :
                  'border-green-300 bg-green-50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-gray-900">Risk Calculation</div>
                    <span className={`px-3 py-1.5 text-sm font-bold rounded-sm ${riskLevel.color}`}>
                      {riskLevel.label} RISK
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <div className="text-center">
                      <div className="text-xs text-gray-600">Likelihood</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {LIKELIHOOD_OPTIONS.find(o => o.value === currentThreat.likelihood)?.score || 0}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-600">×</div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600">Impact</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {IMPACT_OPTIONS.find(o => o.value === currentThreat.impact)?.score || 0}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-600">=</div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600">Risk Score</div>
                      <div className="text-3xl font-bold text-gray-900">{riskScore}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center text-xs text-gray-600">
                    {riskLevel.label === 'LOW' && 'Score ≤ 6: Low Risk - Acceptable with routine monitoring'}
                    {riskLevel.label === 'MEDIUM' && 'Score 7-14: Medium Risk - Requires management attention'}
                    {riskLevel.label === 'HIGH' && 'Score ≥ 15: High Risk - Requires immediate action'}
                  </div>
                </div>
              )}

              {/* Controls from Library */}
              {currentThreat.likelihood && currentThreat.impact && riskScore && (
                <div className="border border-gray-200 rounded-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-900">
                      <ShieldCheckIcon className="h-4 w-4 inline mr-1" />
                      Assign Controls from Library
                    </label>
                    <button
                      onClick={() => setShowControlModal(true)}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                    >
                      <PlusIcon className="h-3 w-3 mr-1" />
                      Add Control
                    </button>
                  </div>

                  {currentThreat.selectedControls && currentThreat.selectedControls.length > 0 ? (
                    <div className="space-y-2">
                      {currentThreat.selectedControls.map(control => (
                        <div key={control.id} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-gray-500">{control.controlId}</span>
                            <span className="text-xs font-medium text-gray-900">{control.name}</span>
                            <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-sm ${
                              control.controlType === 'PREVENTIVE' ? 'bg-blue-100 text-blue-700' :
                              control.controlType === 'DETECTIVE' ? 'bg-amber-100 text-amber-700' :
                              'bg-green-100 text-green-700'
                            }`}>{control.controlType}</span>
                            <div className="flex items-center gap-0.5">
                              {[1,2,3,4,5].map(i => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= control.effectivenessRating ? 'bg-green-500' : 'bg-gray-200'}`} />
                              ))}
                            </div>
                          </div>
                          <button onClick={() => removeControl(control.id)} className="text-gray-400 hover:text-red-600">
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-4">No controls assigned. Add controls to calculate residual risk.</p>
                  )}
                </div>
              )}

              {/* Residual Risk Display */}
              {currentThreat.selectedControls && currentThreat.selectedControls.length > 0 && residualScore && residualLevel && (
                <div className={`border-2 rounded-sm p-4 ${
                  residualLevel.label === 'HIGH' ? 'border-red-300 bg-red-50' :
                  residualLevel.label === 'MEDIUM' ? 'border-amber-300 bg-amber-50' :
                  'border-green-300 bg-green-50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-gray-900">Residual Risk (After Controls)</div>
                    <span className={`px-3 py-1.5 text-sm font-bold rounded-sm ${residualLevel.color}`}>
                      {residualLevel.label} RISK
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-xs text-gray-600">Inherent Risk</div>
                      <div className="text-xl font-bold text-gray-400 line-through">{riskScore}</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-400">→</div>
                    <div className="text-center">
                      <div className="text-xs text-gray-600">Residual Risk</div>
                      <div className="text-3xl font-bold text-gray-900">{residualScore}</div>
                    </div>
                    <div className="text-center border-l pl-6">
                      <div className="text-xs text-gray-600">Risk Reduction</div>
                      <div className="text-xl font-bold text-green-600">
                        -{Math.round(((riskScore! - residualScore) / riskScore!) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Existing Controls (Text) */}
              <div className="border border-gray-200 rounded-sm p-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={currentThreat.existingControls || ''}
                  onChange={(e) => updateCurrentThreat('existingControls', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Additional notes about controls or mitigation..."
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No threats to assess</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-white px-6 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50"
            >
              Back to Threats
            </button>
            {currentThreatIndex > 0 && (
              <button
                onClick={() => setCurrentThreatIndex(currentThreatIndex - 1)}
                className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50"
              >
                ← Previous Threat
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onNext}
              className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50"
            >
              Skip to Summary
            </button>
            <button
              onClick={handleAssessThreat}
              disabled={saving || !currentThreat?.likelihood || !currentThreat?.impact}
              className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-sm hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : currentThreatIndex < threats.length - 1 ? 'Save & Next Threat →' : 'Save & Continue to Summary'}
            </button>
          </div>
        </div>
      </div>

      {/* Control Selection Modal */}
      {showControlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Select Control from Library</h3>
              <button onClick={() => setShowControlModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-2">
                {availableControls.filter(c => !currentThreat?.selectedControls?.some(sc => sc.id === c.id)).map(control => (
                  <button
                    key={control.id}
                    onClick={() => addControl(control)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-sm hover:bg-gray-100 hover:border-gray-300 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] font-medium text-gray-500">{control.controlId}</span>
                        <div className="text-xs font-medium text-gray-900">{control.name}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-sm ${
                        control.controlType === 'PREVENTIVE' ? 'bg-blue-100 text-blue-700' :
                        control.controlType === 'DETECTIVE' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>{control.controlType}</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-700 rounded-sm">{control.controlCategory}</span>
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i <= control.effectivenessRating ? 'bg-green-500' : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <PlusIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
              {availableControls.filter(c => !currentThreat?.selectedControls?.some(sc => sc.id === c.id)).length === 0 && (
                <p className="text-center text-sm text-gray-500 py-8">All available controls have been assigned</p>
              )}
            </div>
            <div className="flex justify-end px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowControlModal(false)} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

