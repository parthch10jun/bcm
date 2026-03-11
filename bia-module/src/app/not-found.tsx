'use client';

import Link from 'next/link';
import { 
  WrenchScrewdriverIcon, 
  HomeIcon,
  ArrowLeftIcon,
  CogIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Construction Icon */}
        <div className="relative mx-auto w-40 h-40 mb-8">
          {/* Rotating gears background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <CogIcon className="h-32 w-32 text-blue-100 animate-spin-slow" />
          </div>
          <div className="absolute top-2 right-2">
            <CogIcon className="h-16 w-16 text-indigo-100 animate-spin-reverse" />
          </div>
          {/* Main icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform">
              <WrenchScrewdriverIcon className="h-16 w-16 text-blue-600" />
            </div>
          </div>
        </div>

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <BeakerIcon className="h-4 w-4" />
          <span>Page Not Available</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Implementation in Progress
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-4 max-w-md mx-auto">
          This feature is currently under development. Our team is working hard to bring you an amazing experience.
        </p>

        {/* Progress indicator */}
        <div className="max-w-xs mx-auto mb-8">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Development Progress</span>
            <span className="font-medium text-blue-600">Coming Soon</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-progress" style={{ width: '65%' }}></div>
          </div>
        </div>

        {/* Features coming */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 max-w-md mx-auto">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">What we're building:</h3>
          <ul className="text-left text-sm text-gray-600 space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</span>
              <span>Core BCM infrastructure</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">✓</span>
              <span>Business Impact Analysis modules</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs animate-pulse">●</span>
              <span>Advanced reporting features</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center text-xs">○</span>
              <span>Integration capabilities</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Go Back
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <HomeIcon className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-gray-400">
          Need assistance? Contact your BCM administrator for support.
        </p>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes progress {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        :global(.animate-spin-slow) {
          animation: spin-slow 20s linear infinite;
        }
        :global(.animate-spin-reverse) {
          animation: spin-reverse 15s linear infinite;
        }
        :global(.animate-progress) {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

