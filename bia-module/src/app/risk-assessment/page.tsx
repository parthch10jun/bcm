'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CalculatorIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import StrategicOverview from './components/StrategicOverview';
import RiskAssessmentRecords from './components/RiskAssessmentRecords';
import AIAgent from '@/components/AIAgent';
import { riskAssessmentService } from '@/services/riskAssessmentService';
import { RiskAssessment } from '@/types/risk-assessment';

export default function RiskAssessmentPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<{
    impact?: string;
    likelihood?: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Initial loading animation effect
  useEffect(() => {
    const stages = [
      { text: 'Initializing Risk Assessment Framework...', duration: 700 },
      { text: 'Loading Risk Matrix & Heat Maps...', duration: 650 },
      { text: 'Analyzing Threat Intelligence...', duration: 600 },
      { text: 'Calculating Risk Scores...', duration: 650 },
      { text: 'Preparing Dashboard Analytics...', duration: 600 },
      { text: 'Assessment Ready', duration: 400 }
    ];

    let currentStage = 0;
    let progress = 0;

    const progressInterval = setInterval(() => {
      progress += 2.5;
      setLoadingProgress(Math.min(progress, 100));
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => setIsInitialLoading(false), 400);
      }
    }, 50);

    const stageInterval = setInterval(() => {
      if (currentStage < stages.length) {
        setLoadingStage(stages[currentStage].text);
        currentStage++;
      } else {
        clearInterval(stageInterval);
      }
    }, 600);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await riskAssessmentService.getAll();
      setAssessments(data);
    } catch (err) {
      console.error('Error loading risk assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRiskAssessment = () => {
    router.push('/risk-assessment/new');
  };

  const handleHeatMapCellClick = (impact: string, likelihood: string) => {
    setSelectedRiskFilter({ impact, likelihood });
  };

  const clearRiskFilter = () => {
    setSelectedRiskFilter(null);
  };

  // Initial Loading Screen
  if (isInitialLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 items-center justify-center overflow-hidden relative">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-30">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Animated grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            animation: 'gridFloat 25s linear infinite'
          }}></div>
        </div>

        {/* Main loading content */}
        <div className="relative z-10 text-center max-w-3xl px-8">
          {/* Icon with orbiting elements */}
          <div className="relative inline-flex items-center justify-center mb-10">
            {/* Outer rotating ring */}
            <div className="absolute w-40 h-40 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            
            {/* Middle counter-rotating ring */}
            <div className="absolute w-32 h-32 border-4 border-indigo-400 border-r-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
            
            {/* Inner ring */}
            <div className="absolute w-24 h-24 border-3 border-purple-300 border-b-transparent rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
            
            {/* Central icon container */}
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            {/* Orbiting dots */}
            <div className="absolute w-3 h-3 bg-blue-500 rounded-full top-0 left-1/2 -translate-x-1/2 animate-ping"></div>
            <div className="absolute w-3 h-3 bg-indigo-500 rounded-full bottom-0 left-1/2 -translate-x-1/2 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute w-3 h-3 bg-purple-500 rounded-full left-0 top-1/2 -translate-y-1/2 animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute w-3 h-3 bg-cyan-500 rounded-full right-0 top-1/2 -translate-y-1/2 animate-ping" style={{ animationDelay: '1.5s' }}></div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 tracking-tight">
            Risk Assessment
          </h1>
          <p className="text-xl text-gray-600 mb-14 font-medium">
            Comprehensive Risk Analysis & Management
          </p>

          {/* Progress bar with gradient */}
          <div className="mb-8">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out relative"
                style={{ width: `${loadingProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer"></div>
                <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm font-semibold text-gray-700">{loadingProgress}%</span>
              <span className="text-sm font-mono text-indigo-600 font-medium">{loadingProgress === 100 ? '✓ Complete' : 'Loading...'}</span>
            </div>
          </div>

          {/* Loading stage text with icon */}
          <div className="h-10 flex items-center justify-center mb-12">
            <p className="text-base text-gray-700 font-semibold flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              {loadingStage}
            </p>
          </div>

          {/* System status cards */}
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium mb-1">Risk Matrix</p>
              <p className="text-green-600 font-bold text-xs">Ready</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium mb-1">Analytics</p>
              <p className="text-green-600 font-bold text-xs">Active</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium mb-1">Threat Intel</p>
              <p className="text-green-600 font-bold text-xs">Synced</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium mb-1">Security</p>
              <p className="text-green-600 font-bold text-xs">Verified</p>
            </div>
          </div>
        </div>

        {/* Add keyframes for animations */}
        <style jsx>{`
          @keyframes gridFloat {
            0% { transform: translate(0, 0); }
            100% { transform: translate(60px, 60px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 sm:px-8">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  Risk Assessment
                </h1>
                <p className="mt-1 text-sm text-gray-500 truncate">
                  Comprehensive risk analysis and management dashboard
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => router.push('/risk-assessment/risk-register')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                  Risk Register
                </button>
                <button
                  onClick={handleNewRiskAssessment}
                  className="bcm-button-primary"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Risk Assessment
                </button>

                {/* Demo Mode Dropdown */}
                <div className="relative inline-block text-left">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        router.push(`/risk-assessment/new?demo=${e.target.value}`);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                    defaultValue=""
                  >
                    <option value="">🎬 Demo Mode</option>
                    <option value="PROCESS">Process Risk Demo</option>
                    <option value="LOCATION">Location Risk Demo</option>
                    <option value="SUPPLIER">Supplier Risk Demo</option>
                    <option value="APPLICATION">Application Risk Demo</option>
                    <option value="PEOPLE">People Risk Demo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-6 py-6 sm:px-8 space-y-6">
            {/* Strategic Overview Section */}
            <StrategicOverview
              onHeatMapCellClick={handleHeatMapCellClick}
              assessments={assessments}
              loading={loading}
            />

            {/* Risk Assessment Records Section */}
            <RiskAssessmentRecords
              riskFilter={selectedRiskFilter}
              onClearFilter={clearRiskFilter}
              assessments={assessments}
              loading={loading}
              onRefresh={loadData}
            />
          </div>
        </main>
      </div>

      {/* AI Agent */}
      <AIAgent context="risk-assessment" />
    </div>
  );
}
