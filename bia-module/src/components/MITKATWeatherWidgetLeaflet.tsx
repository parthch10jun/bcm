'use client';

import { useState, useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  FireIcon,
  BoltIcon,
  CloudIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  MapPinIcon,
  SignalIcon
} from '@heroicons/react/24/outline';

interface DisasterEvent {
  id: string;
  type: 'earthquake' | 'hurricane' | 'flood' | 'wildfire' | 'tornado' | 'tsunami' | 'volcano' | 'storm';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    lat: number;
    lng: number;
    name: string;
    region: string;
    country: string;
  };
  probability: number;
  impact: string;
  timestamp: Date;
  magnitude?: number;
  windSpeed?: number;
  temperature?: number;
}

// Color-based severity colors
const severityColors = {
  low: '#10b981',      // green
  medium: '#f59e0b',   // amber
  high: '#f97316',     // orange
  critical: '#dc2626'  // red
};

// Enhanced disaster data generator
const generateMockDisasters = (): DisasterEvent[] => {
  const disasters: DisasterEvent[] = [
    {
      id: '1',
      type: 'earthquake',
      severity: 'high',
      location: { lat: 35.6762, lng: 139.6503, name: 'Tokyo', region: 'Asia-Pacific', country: 'Japan' },
      probability: 78,
      impact: 'Major infrastructure damage expected',
      timestamp: new Date(),
      magnitude: 7.2
    },
    {
      id: '2',
      type: 'hurricane',
      severity: 'critical',
      location: { lat: 25.7617, lng: -80.1918, name: 'Miami', region: 'North America', country: 'USA' },
      probability: 92,
      impact: 'Severe coastal flooding and wind damage',
      timestamp: new Date(),
      windSpeed: 165
    },
    {
      id: '3',
      type: 'wildfire',
      severity: 'high',
      location: { lat: -33.8688, lng: 151.2093, name: 'Sydney', region: 'Oceania', country: 'Australia' },
      probability: 85,
      impact: 'Widespread evacuations required',
      timestamp: new Date(),
      temperature: 42
    },
    {
      id: '4',
      type: 'flood',
      severity: 'medium',
      location: { lat: 51.5074, lng: -0.1278, name: 'London', region: 'Europe', country: 'UK' },
      probability: 65,
      impact: 'River overflow affecting low-lying areas',
      timestamp: new Date()
    },
    {
      id: '5',
      type: 'tornado',
      severity: 'critical',
      location: { lat: 35.4676, lng: -97.5164, name: 'Oklahoma City', region: 'North America', country: 'USA' },
      probability: 88,
      impact: 'EF4 tornado with destructive path',
      timestamp: new Date(),
      windSpeed: 210
    },
    {
      id: '6',
      type: 'tsunami',
      severity: 'high',
      location: { lat: -6.2088, lng: 106.8456, name: 'Jakarta', region: 'Asia-Pacific', country: 'Indonesia' },
      probability: 72,
      impact: 'Coastal areas at severe risk',
      timestamp: new Date()
    },
    {
      id: '7',
      type: 'volcano',
      severity: 'medium',
      location: { lat: 64.1466, lng: -21.9426, name: 'Reykjavik', region: 'Europe', country: 'Iceland' },
      probability: 58,
      impact: 'Volcanic activity increasing',
      timestamp: new Date()
    },
    {
      id: '8',
      type: 'storm',
      severity: 'low',
      location: { lat: 40.7128, lng: -74.0060, name: 'New York', region: 'North America', country: 'USA' },
      probability: 45,
      impact: 'Moderate rainfall and wind',
      timestamp: new Date()
    },
    {
      id: '9',
      type: 'earthquake',
      severity: 'critical',
      location: { lat: -33.4489, lng: -70.6693, name: 'Santiago', region: 'South America', country: 'Chile' },
      probability: 94,
      impact: 'Major seismic event imminent',
      timestamp: new Date(),
      magnitude: 8.1
    },
    {
      id: '10',
      type: 'flood',
      severity: 'high',
      location: { lat: 22.3193, lng: 114.1694, name: 'Hong Kong', region: 'Asia-Pacific', country: 'China' },
      probability: 81,
      impact: 'Severe monsoon flooding',
      timestamp: new Date()
    }
  ];
  return disasters;
};

const getDisasterEmoji = (type: string): string => {
  const emojis: Record<string, string> = {
    earthquake: '🌍',
    hurricane: '🌀',
    flood: '🌊',
    wildfire: '🔥',
    tornado: '🌪️',
    tsunami: '🌊',
    volcano: '🌋',
    storm: '⛈️'
  };
  return emojis[type] || '⚠️';
};

export default function MITKATWeatherWidgetLeaflet() {
  const [disasters, setDisasters] = useState<DisasterEvent[]>([]);
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterEvent | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setDisasters(generateMockDisasters());
  }, []);

  // Calculate stats
  const stats = {
    total: disasters.length,
    critical: disasters.filter(d => d.severity === 'critical').length,
    high: disasters.filter(d => d.severity === 'high').length,
    avgProbability: Math.round(disasters.reduce((sum, d) => sum + d.probability, 0) / disasters.length)
  };

  if (!isClient) {
    return (
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">MITKAT Weather Intelligence</h2>
          <p className="text-xs text-gray-500 mt-1">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">MITKAT Weather Intelligence</h2>
            <p className="text-xs text-gray-500 mt-1">Real-time global threat monitoring with weather simulation</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-sm hover:bg-gray-200">
            <ArrowPathIcon className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-200">
        <div className="bg-red-50 border border-red-200 rounded-sm p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-600 font-medium">Critical Threats</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{stats.critical}</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500 opacity-30" />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-sm p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-600 font-medium">High Risk</p>
              <p className="text-2xl font-bold text-orange-700 mt-1">{stats.high}</p>
            </div>
            <FireIcon className="h-8 w-8 text-orange-500 opacity-30" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">Total Events</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{stats.total}</p>
            </div>
            <GlobeAltIcon className="h-8 w-8 text-blue-500 opacity-30" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-sm p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 font-medium">Avg Probability</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{stats.avgProbability}%</p>
            </div>
            <SignalIcon className="h-8 w-8 text-purple-500 opacity-30" />
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="p-6">
        <div className="relative rounded-sm border border-gray-300 shadow-inner overflow-hidden" style={{ height: '600px' }}>
          <iframe
            src="/examples/maps/leaflet_weather_animated.html"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="MITKAT Weather Map"
          />
        </div>
      </div>

      {/* Threat List */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Active Threat Monitoring</h3>
        <div className="grid grid-cols-2 gap-3">
          {disasters.map((disaster) => {
            const emoji = getDisasterEmoji(disaster.type);
            return (
              <div
                key={disaster.id}
                className="bg-white border border-gray-200 rounded-sm p-3 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedDisaster(disaster)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{emoji}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{disaster.location.name}</div>
                      <div className="text-xs text-gray-500">{disaster.location.country}</div>
                    </div>
                  </div>
                  <span
                    className="px-2 py-0.5 text-xs font-medium rounded-sm"
                    style={{
                      backgroundColor: `${severityColors[disaster.severity]}20`,
                      color: severityColors[disaster.severity],
                      border: `1px solid ${severityColors[disaster.severity]}40`
                    }}
                  >
                    {disaster.severity.toUpperCase()}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-600">{disaster.type.toUpperCase()}</div>
                <div className="mt-1 text-xs text-gray-500">Probability: {disaster.probability}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

