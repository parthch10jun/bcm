'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  CheckIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface LikelihoodLevel {
  score: number;
  label: string;
  description: string;
  probability: string;
  color: string;
}

interface ImpactLevel {
  score: number;
  label: string;
  description: string;
  examples: string;
  color: string;
}

interface RiskThreshold {
  minScore: number;
  maxScore: number;
  level: string;
  color: string;
  action: string;
}

interface ScoringModel {
  id: number;
  name: string;
  description: string;
  isDefault: boolean;
  likelihoodLevels: LikelihoodLevel[];
  impactLevels: ImpactLevel[];
  thresholds: RiskThreshold[];
  matrixSize: number;
}

export default function RiskScoringConfigPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Default 5x5 scoring model
  const [scoringModel, setScoringModel] = useState<ScoringModel>({
    id: 1,
    name: 'Standard 5x5 Risk Matrix',
    description: 'Industry-standard 5x5 likelihood and impact matrix',
    isDefault: true,
    matrixSize: 5,
    likelihoodLevels: [
      { score: 1, label: 'Rare', description: 'May occur only in exceptional circumstances', probability: '< 10%', color: 'bg-green-100 text-green-800' },
      { score: 2, label: 'Unlikely', description: 'Could occur at some time', probability: '10-30%', color: 'bg-blue-100 text-blue-800' },
      { score: 3, label: 'Possible', description: 'Might occur at some time', probability: '30-50%', color: 'bg-yellow-100 text-yellow-800' },
      { score: 4, label: 'Likely', description: 'Will probably occur in most circumstances', probability: '50-80%', color: 'bg-orange-100 text-orange-800' },
      { score: 5, label: 'Almost Certain', description: 'Expected to occur in most circumstances', probability: '> 80%', color: 'bg-red-100 text-red-800' }
    ],
    impactLevels: [
      { score: 1, label: 'Insignificant', description: 'Minimal impact on operations', examples: 'Minor delays, < $10K loss', color: 'bg-green-100 text-green-800' },
      { score: 2, label: 'Minor', description: 'Limited impact on operations', examples: 'Short delays, $10K-$50K loss', color: 'bg-blue-100 text-blue-800' },
      { score: 3, label: 'Moderate', description: 'Noticeable impact on operations', examples: 'Moderate delays, $50K-$250K loss', color: 'bg-yellow-100 text-yellow-800' },
      { score: 4, label: 'Major', description: 'Significant impact on operations', examples: 'Major delays, $250K-$1M loss', color: 'bg-orange-100 text-orange-800' },
      { score: 5, label: 'Catastrophic', description: 'Severe impact threatening viability', examples: 'Critical failure, > $1M loss', color: 'bg-red-100 text-red-800' }
    ],
    thresholds: [
      { minScore: 1, maxScore: 4, level: 'LOW', color: 'bg-green-500', action: 'Monitor and review periodically' },
      { minScore: 5, maxScore: 9, level: 'MEDIUM', color: 'bg-yellow-500', action: 'Develop mitigation plan within 90 days' },
      { minScore: 10, maxScore: 15, level: 'HIGH', color: 'bg-orange-500', action: 'Immediate mitigation required within 30 days' },
      { minScore: 16, maxScore: 25, level: 'CRITICAL', color: 'bg-red-500', action: 'Urgent action required within 7 days' }
    ]
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // In real implementation, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Scoring model saved successfully!');
      setEditingSection(null);
    } catch (error) {
      console.error('Failed to save scoring model:', error);
      alert('Failed to save scoring model');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default values? This will discard all changes.')) {
      // Reset to default - in real implementation, fetch from backend
      window.location.reload();
    }
  };

  const updateLikelihoodLevel = (index: number, field: keyof LikelihoodLevel, value: any) => {
    const updated = [...scoringModel.likelihoodLevels];
    updated[index] = { ...updated[index], [field]: value };
    setScoringModel({ ...scoringModel, likelihoodLevels: updated });
  };

  const updateImpactLevel = (index: number, field: keyof ImpactLevel, value: any) => {
    const updated = [...scoringModel.impactLevels];
    updated[index] = { ...updated[index], [field]: value };
    setScoringModel({ ...scoringModel, impactLevels: updated });
  };

  const updateThreshold = (index: number, field: keyof RiskThreshold, value: any) => {
    const updated = [...scoringModel.thresholds];
    updated[index] = { ...updated[index], [field]: value };
    setScoringModel({ ...scoringModel, thresholds: updated });
  };

  const getRiskScore = (likelihood: number, impact: number) => likelihood * impact;

  const getRiskLevel = (score: number) => {
    const threshold = scoringModel.thresholds.find(t => score >= t.minScore && score <= t.maxScore);
    return threshold || scoringModel.thresholds[0];
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Risk Scoring Configuration</h1>
            <p className="mt-0.5 text-xs text-gray-500">Customize likelihood/impact matrices, thresholds, and scoring algorithms</p>
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
              onClick={handleReset}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowPathIcon className="h-3.5 w-3.5 mr-1" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-sm text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50"
            >
              <CheckIcon className="h-3.5 w-3.5 mr-1" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="space-y-4">
            {/* Model Info */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Scoring Model Information</h2>
                <button
                  onClick={() => setEditingSection(editingSection === 'info' ? null : 'info')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {editingSection === 'info' ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
                  {editingSection === 'info' ? (
                    <input
                      type="text"
                      value={scoringModel.name}
                      onChange={(e) => setScoringModel({ ...scoringModel, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{scoringModel.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Matrix Size</label>
                  {editingSection === 'info' ? (
                    <select
                      value={scoringModel.matrixSize}
                      onChange={(e) => setScoringModel({ ...scoringModel, matrixSize: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm"
                    >
                      <option value={3}>3x3</option>
                      <option value={4}>4x4</option>
                      <option value={5}>5x5</option>
                    </select>
                  ) : (
                    <p className="text-sm text-gray-900">{scoringModel.matrixSize}x{scoringModel.matrixSize}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  {editingSection === 'info' ? (
                    <textarea
                      value={scoringModel.description}
                      onChange={(e) => setScoringModel({ ...scoringModel, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{scoringModel.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Likelihood Levels */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Likelihood Levels</h2>
                <button
                  onClick={() => setEditingSection(editingSection === 'likelihood' ? null : 'likelihood')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {editingSection === 'likelihood' ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <div className="space-y-3">
                {scoringModel.likelihoodLevels.map((level, index) => (
                  <div key={index} className="border border-gray-200 rounded-sm p-4">
                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Score</label>
                        <input
                          type="number"
                          value={level.score}
                          disabled={editingSection !== 'likelihood'}
                          onChange={(e) => updateLikelihoodLevel(index, 'score', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                        <input
                          type="text"
                          value={level.label}
                          disabled={editingSection !== 'likelihood'}
                          onChange={(e) => updateLikelihoodLevel(index, 'label', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm disabled:bg-gray-50"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={level.description}
                          disabled={editingSection !== 'likelihood'}
                          onChange={(e) => updateLikelihoodLevel(index, 'description', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Probability</label>
                        <input
                          type="text"
                          value={level.probability}
                          disabled={editingSection !== 'likelihood'}
                          onChange={(e) => updateLikelihoodLevel(index, 'probability', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Levels */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Impact Levels</h2>
                <button
                  onClick={() => setEditingSection(editingSection === 'impact' ? null : 'impact')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {editingSection === 'impact' ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <div className="space-y-3">
                {scoringModel.impactLevels.map((level, index) => (
                  <div key={index} className="border border-gray-200 rounded-sm p-4">
                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Score</label>
                        <input
                          type="number"
                          value={level.score}
                          disabled={editingSection !== 'impact'}
                          onChange={(e) => updateImpactLevel(index, 'score', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                        <input
                          type="text"
                          value={level.label}
                          disabled={editingSection !== 'impact'}
                          onChange={(e) => updateImpactLevel(index, 'label', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm disabled:bg-gray-50"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={level.description}
                          disabled={editingSection !== 'impact'}
                          onChange={(e) => updateImpactLevel(index, 'description', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Examples</label>
                        <input
                          type="text"
                          value={level.examples}
                          disabled={editingSection !== 'impact'}
                          onChange={(e) => updateImpactLevel(index, 'examples', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Thresholds */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Risk Thresholds & Actions</h2>
                <button
                  onClick={() => setEditingSection(editingSection === 'thresholds' ? null : 'thresholds')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {editingSection === 'thresholds' ? 'Cancel' : 'Edit'}
                </button>
              </div>
              <div className="space-y-3">
                {scoringModel.thresholds.map((threshold, index) => (
                  <div key={index} className="border border-gray-200 rounded-sm p-4">
                    <div className="grid grid-cols-6 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Min Score</label>
                        <input
                          type="number"
                          value={threshold.minScore}
                          disabled={editingSection !== 'thresholds'}
                          onChange={(e) => updateThreshold(index, 'minScore', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Max Score</label>
                        <input
                          type="number"
                          value={threshold.maxScore}
                          disabled={editingSection !== 'thresholds'}
                          onChange={(e) => updateThreshold(index, 'maxScore', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Risk Level</label>
                        <input
                          type="text"
                          value={threshold.level}
                          disabled={editingSection !== 'thresholds'}
                          onChange={(e) => updateThreshold(index, 'level', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm disabled:bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded ${threshold.color}`}></div>
                          {editingSection === 'thresholds' && (
                            <input
                              type="text"
                              value={threshold.color}
                              onChange={(e) => updateThreshold(index, 'color', e.target.value)}
                              className="flex-1 px-2 py-1 border border-gray-300 rounded-sm text-xs"
                              placeholder="bg-red-500"
                            />
                          )}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Required Action</label>
                        <input
                          type="text"
                          value={threshold.action}
                          disabled={editingSection !== 'thresholds'}
                          onChange={(e) => updateThreshold(index, 'action', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Matrix Preview */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Matrix Preview</h2>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  <table className="border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700">
                          Likelihood →<br/>Impact ↓
                        </th>
                        {scoringModel.likelihoodLevels.map((level) => (
                          <th key={level.score} className="border border-gray-300 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700">
                            <div>{level.score}</div>
                            <div className="font-normal">{level.label}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...scoringModel.impactLevels].reverse().map((impactLevel) => (
                        <tr key={impactLevel.score}>
                          <td className="border border-gray-300 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700">
                            <div>{impactLevel.score}</div>
                            <div className="font-normal">{impactLevel.label}</div>
                          </td>
                          {scoringModel.likelihoodLevels.map((likelihoodLevel) => {
                            const score = getRiskScore(likelihoodLevel.score, impactLevel.score);
                            const riskLevel = getRiskLevel(score);
                            return (
                              <td
                                key={`${likelihoodLevel.score}-${impactLevel.score}`}
                                className={`border border-gray-300 px-4 py-3 text-center ${riskLevel.color} bg-opacity-20`}
                              >
                                <div className="text-lg font-bold text-gray-900">{score}</div>
                                <div className="text-xs font-medium text-gray-700 mt-1">{riskLevel.level}</div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 grid grid-cols-4 gap-4">
                {scoringModel.thresholds.map((threshold) => (
                  <div key={threshold.level} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded ${threshold.color}`}></div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{threshold.level}</div>
                      <div className="text-xs text-gray-600">{threshold.minScore}-{threshold.maxScore}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Guidelines */}
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Treatment Guidelines</h2>
              <div className="space-y-3">
                {scoringModel.thresholds.map((threshold) => (
                  <div key={threshold.level} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-sm">
                    <div className={`w-4 h-4 rounded mt-0.5 ${threshold.color}`}></div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">{threshold.level} Risk (Score: {threshold.minScore}-{threshold.maxScore})</div>
                      <div className="text-sm text-gray-600 mt-1">{threshold.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

