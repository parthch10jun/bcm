'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeftIcon,
  CheckIcon,
  ArrowPathIcon,
  CalculatorIcon,
  AdjustmentsHorizontalIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

type ResidualRiskMethod = 'FORMULA_BASED' | 'FACTOR_BASED' | 'WEIGHTED';

interface ResidualRiskConfig {
  method: ResidualRiskMethod;
  riskAppetiteThreshold: number;
  formulaConfig: {
    baseReduction: number;
    effectivenessMultiplier: number;
    maxReduction: number;
  };
  factorConfig: {
    factors: { effectiveness: number; reduction: number }[];
  };
  weightedConfig: {
    preventiveWeight: number;
    detectiveWeight: number;
    correctiveWeight: number;
  };
}

const METHOD_INFO = {
  FORMULA_BASED: {
    title: 'Formula-Based',
    description: 'Residual = Inherent × (1 - (Effectiveness × Multiplier))',
    icon: CalculatorIcon,
    color: 'blue'
  },
  FACTOR_BASED: {
    title: 'Factor-Based',
    description: 'Maps control effectiveness to fixed reduction percentages',
    icon: AdjustmentsHorizontalIcon,
    color: 'green'
  },
  WEIGHTED: {
    title: 'Weighted by Control Type',
    description: 'Different weights for preventive, detective, and corrective controls',
    icon: ScaleIcon,
    color: 'purple'
  }
};

export default function ResidualRiskConfigPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [config, setConfig] = useState<ResidualRiskConfig>({
    method: 'FORMULA_BASED',
    riskAppetiteThreshold: 8,
    formulaConfig: {
      baseReduction: 0.2,
      effectivenessMultiplier: 0.15,
      maxReduction: 0.8
    },
    factorConfig: {
      factors: [
        { effectiveness: 1, reduction: 20 },
        { effectiveness: 2, reduction: 35 },
        { effectiveness: 3, reduction: 50 },
        { effectiveness: 4, reduction: 65 },
        { effectiveness: 5, reduction: 80 }
      ]
    },
    weightedConfig: {
      preventiveWeight: 1.2,
      detectiveWeight: 1.0,
      correctiveWeight: 0.8
    }
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Residual risk configuration saved successfully!');
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const calculateExample = () => {
    const inherent = 15;
    const effectiveness = 4;
    let residual = inherent;

    if (config.method === 'FORMULA_BASED') {
      const reduction = Math.min(
        config.formulaConfig.baseReduction + (effectiveness - 1) * config.formulaConfig.effectivenessMultiplier,
        config.formulaConfig.maxReduction
      );
      residual = Math.max(1, Math.round(inherent * (1 - reduction)));
    } else if (config.method === 'FACTOR_BASED') {
      const factor = config.factorConfig.factors.find(f => f.effectiveness === effectiveness);
      if (factor) {
        residual = Math.max(1, Math.round(inherent * (1 - factor.reduction / 100)));
      }
    } else {
      const avgWeight = config.weightedConfig.preventiveWeight;
      const reduction = (effectiveness / 5) * 0.8 * avgWeight;
      residual = Math.max(1, Math.round(inherent * (1 - reduction)));
    }

    return { inherent, effectiveness, residual };
  };

  const example = calculateExample();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Residual Risk Methodology</h1>
            <p className="mt-0.5 text-xs text-gray-500">Configure how residual risk is calculated from controls</p>
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

      {/* Content - continued in next edit */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Method Selection */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Calculation Method</h2>
            <div className="grid grid-cols-3 gap-4">
              {(Object.keys(METHOD_INFO) as ResidualRiskMethod[]).map((method) => {
                const info = METHOD_INFO[method];
                const Icon = info.icon;
                return (
                  <button
                    key={method}
                    onClick={() => setConfig({ ...config, method })}
                    className={`p-4 border-2 rounded-sm text-left transition-all ${
                      config.method === method
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mb-2 ${config.method === method ? 'text-gray-900' : 'text-gray-400'}`} />
                    <div className="text-sm font-semibold text-gray-900">{info.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{info.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Risk Appetite Threshold */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Risk Appetite Threshold</h2>
            <p className="text-xs text-gray-500 mb-4">Risks with residual score above this threshold require treatment plans</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="25"
                value={config.riskAppetiteThreshold}
                onChange={(e) => setConfig({ ...config, riskAppetiteThreshold: parseInt(e.target.value) })}
                className="flex-1"
              />
              <div className="w-16 text-center">
                <span className="text-2xl font-bold text-gray-900">{config.riskAppetiteThreshold}</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1 (Very Conservative)</span>
              <span>25 (Very Aggressive)</span>
            </div>
          </div>

          {/* Method-specific Configuration */}
          {config.method === 'FORMULA_BASED' && (
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Formula Parameters</h2>
              <div className="bg-gray-50 p-4 rounded-sm mb-4 font-mono text-sm">
                Residual = Inherent × (1 - min(BaseReduction + (Effectiveness - 1) × Multiplier, MaxReduction))
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Base Reduction</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={config.formulaConfig.baseReduction}
                    onChange={(e) => setConfig({
                      ...config,
                      formulaConfig: { ...config.formulaConfig, baseReduction: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Minimum reduction (0-1)</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Effectiveness Multiplier</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="0.5"
                    value={config.formulaConfig.effectivenessMultiplier}
                    onChange={(e) => setConfig({
                      ...config,
                      formulaConfig: { ...config.formulaConfig, effectivenessMultiplier: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Per effectiveness level</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Max Reduction</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={config.formulaConfig.maxReduction}
                    onChange={(e) => setConfig({
                      ...config,
                      formulaConfig: { ...config.formulaConfig, maxReduction: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Maximum reduction cap</p>
                </div>
              </div>
            </div>
          )}

          {config.method === 'FACTOR_BASED' && (
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Effectiveness to Reduction Mapping</h2>
              <div className="space-y-3">
                {config.factorConfig.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-32">
                      <span className="text-sm font-medium text-gray-700">Effectiveness {factor.effectiveness}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={factor.reduction}
                      onChange={(e) => {
                        const newFactors = [...config.factorConfig.factors];
                        newFactors[idx] = { ...factor, reduction: parseInt(e.target.value) };
                        setConfig({ ...config, factorConfig: { factors: newFactors } });
                      }}
                      className="flex-1"
                    />
                    <div className="w-16 text-right">
                      <span className="text-sm font-bold text-gray-900">{factor.reduction}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {config.method === 'WEIGHTED' && (
            <div className="bg-white border border-gray-200 rounded-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Control Type Weights</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Preventive Controls</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="2"
                    value={config.weightedConfig.preventiveWeight}
                    onChange={(e) => setConfig({
                      ...config,
                      weightedConfig: { ...config.weightedConfig, preventiveWeight: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Higher = more effective</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Detective Controls</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="2"
                    value={config.weightedConfig.detectiveWeight}
                    onChange={(e) => setConfig({
                      ...config,
                      weightedConfig: { ...config.weightedConfig, detectiveWeight: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Baseline weight</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Corrective Controls</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="2"
                    value={config.weightedConfig.correctiveWeight}
                    onChange={(e) => setConfig({
                      ...config,
                      weightedConfig: { ...config.weightedConfig, correctiveWeight: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Reactive controls</p>
                </div>
              </div>
            </div>
          )}

          {/* Example Calculation */}
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Example Calculation</h2>
            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Inherent Risk</div>
                <div className="text-3xl font-bold text-red-600">{example.inherent}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Control Effectiveness</div>
                <div className="text-3xl font-bold text-blue-600">{example.effectiveness}/5</div>
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Residual Risk</div>
                <div className={`text-3xl font-bold ${example.residual > config.riskAppetiteThreshold ? 'text-amber-600' : 'text-green-600'}`}>
                  {example.residual}
                </div>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500">
              {example.residual > config.riskAppetiteThreshold
                ? `⚠️ Exceeds threshold (${config.riskAppetiteThreshold}) - Treatment required`
                : `✓ Within threshold (${config.riskAppetiteThreshold}) - Acceptable`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

