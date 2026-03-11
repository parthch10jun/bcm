'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
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

// Dynamically import Globe3D to avoid SSR issues
const Globe3D = dynamic(() => import('./Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[389px] bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-sm flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-sm">Loading 3D Globe...</p>
      </div>
    </div>
  ),
});

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

// Color-based severity colors for 3D globe
const severityColors = {
  low: '#10b981',      // green
  medium: '#f59e0b',   // amber
  high: '#f97316',     // orange
  critical: '#dc2626'  // red
};

// Enhanced disaster data generator with more realistic data
const generateMockDisasters = (): DisasterEvent[] => {
  const disasters: DisasterEvent[] = [
    {
      id: '1',
      type: 'earthquake',
      severity: 'high',
      location: { lat: 35.6762, lng: 139.6503, name: 'Tokyo', region: 'Asia-Pacific', country: 'Japan' },
      probability: 78,
      impact: 'M6.8 earthquake detected - Major infrastructure disruption expected',
      timestamp: new Date(),
      magnitude: 6.8
    },
    {
      id: '2',
      type: 'hurricane',
      severity: 'critical',
      location: { lat: 25.7617, lng: -80.1918, name: 'Miami', region: 'North America', country: 'USA' },
      probability: 92,
      impact: 'Category 4 hurricane approaching - Winds 140mph - Evacuations ordered',
      timestamp: new Date(),
      windSpeed: 140
    },
    {
      id: '3',
      type: 'flood',
      severity: 'medium',
      location: { lat: 51.5074, lng: -0.1278, name: 'London', region: 'Europe', country: 'UK' },
      probability: 65,
      impact: 'Heavy rainfall 85mm/24h - Thames flood barriers activated',
      timestamp: new Date()
    },
    {
      id: '4',
      type: 'wildfire',
      severity: 'high',
      location: { lat: -33.8688, lng: 151.2093, name: 'Sydney', region: 'Australia', country: 'Australia' },
      probability: 85,
      impact: 'Extreme fire danger - Temperature 42°C - Multiple active fires',
      timestamp: new Date(),
      temperature: 42
    },
    {
      id: '5',
      type: 'tornado',
      severity: 'medium',
      location: { lat: 35.4676, lng: -97.5164, name: 'Oklahoma City', region: 'North America', country: 'USA' },
      probability: 70,
      impact: 'Severe thunderstorm warnings - Tornado watch in effect',
      timestamp: new Date()
    },
    {
      id: '6',
      type: 'tsunami',
      severity: 'low',
      location: { lat: -6.2088, lng: 106.8456, name: 'Jakarta', region: 'Asia-Pacific', country: 'Indonesia' },
      probability: 45,
      impact: 'Coastal monitoring active - Wave height 1.2m expected',
      timestamp: new Date()
    },
    {
      id: '7',
      type: 'volcano',
      severity: 'medium',
      location: { lat: 64.1466, lng: -21.9426, name: 'Reykjavik', region: 'Europe', country: 'Iceland' },
      probability: 60,
      impact: 'Increased seismic activity - Volcanic alert level raised to Orange',
      timestamp: new Date()
    },
    {
      id: '8',
      type: 'storm',
      severity: 'high',
      location: { lat: 40.7128, lng: -74.0060, name: 'New York', region: 'North America', country: 'USA' },
      probability: 82,
      impact: 'Winter storm warning - Heavy snow 18-24 inches expected',
      timestamp: new Date()
    },
    {
      id: '9',
      type: 'earthquake',
      severity: 'critical',
      location: { lat: 37.7749, lng: -122.4194, name: 'San Francisco', region: 'North America', country: 'USA' },
      probability: 88,
      impact: 'M7.2 earthquake - Major structural damage - Aftershocks likely',
      timestamp: new Date(),
      magnitude: 7.2
    },
    {
      id: '10',
      type: 'flood',
      severity: 'high',
      location: { lat: 22.3193, lng: 114.1694, name: 'Hong Kong', region: 'Asia-Pacific', country: 'China' },
      probability: 79,
      impact: 'Typhoon-related flooding - Storm surge 2.5m above normal',
      timestamp: new Date()
    }
  ];
  return disasters;
};

interface MITKATWeatherWidgetProps {
  visiblePins?: string[];
  droppingPins?: string[];
}

export default function MITKATWeatherWidget({ visiblePins = [], droppingPins = [] }: MITKATWeatherWidgetProps) {
  const [disasters, setDisasters] = useState<DisasterEvent[]>(generateMockDisasters());
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterEvent | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setDisasters(generateMockDisasters());
      setIsRefreshing(false);
    }, 1000);
  };

  const getDisasterIcon = (type: string) => {
    switch (type) {
      case 'wildfire':
        return FireIcon;
      case 'hurricane':
      case 'tornado':
      case 'storm':
        return CloudIcon;
      case 'earthquake':
      case 'volcano':
        return BoltIcon;
      case 'flood':
      case 'tsunami':
        return SignalIcon;
      default:
        return ExclamationTriangleIcon;
    }
  };

  const getDisasterEmoji = (type: string) => {
    switch (type) {
      case 'wildfire': return '🔥';
      case 'hurricane': return '🌀';
      case 'tornado': return '🌪️';
      case 'storm': return '⛈️';
      case 'earthquake': return '🌍';
      case 'volcano': return '🌋';
      case 'flood': return '🌊';
      case 'tsunami': return '🌊';
      default: return '⚠️';
    }
  };

  // Convert lat/lng to SVG coordinates (simplified projection)
  const projectToMap = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const stats = {
    total: disasters.length,
    critical: disasters.filter(d => d.severity === 'critical').length,
    high: disasters.filter(d => d.severity === 'high').length,
    avgProbability: Math.round(disasters.reduce((sum, d) => sum + d.probability, 0) / disasters.length)
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-sm overflow-hidden">
      {/* Stats Bar - Compact */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 px-4 py-2">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Live Monitoring</span>
            </div>
            <div className="h-3 w-px bg-white/20"></div>
            <div className="text-xs">
              <span className="text-white/60">Events:</span> <span className="font-bold">{stats.total}</span>
            </div>
            <div className="text-xs">
              <span className="text-white/60">Critical:</span> <span className="font-bold text-red-400">{stats.critical}</span>
            </div>
            <div className="text-xs">
              <span className="text-white/60">High:</span> <span className="font-bold text-orange-400">{stats.high}</span>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-white/10 hover:bg-white/20 disabled:opacity-50 transition-colors"
          >
            <ArrowPathIcon className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* 3D Globe with Disaster Markers */}
      <div className="p-0">
        <div className="relative overflow-hidden">
          {/* Map Controls - Overlay on Globe */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
              <p className="text-xs font-bold text-gray-900 mb-1">🌍 Interactive Globe</p>
              <p className="text-[10px] text-gray-500">Drag to rotate • Scroll to zoom</p>
            </div>
          </div>

          {/* Legend - Bottom Left */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
            <p className="text-xs font-bold text-gray-900 mb-2">Severity Levels</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-[10px] text-gray-700">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-[10px] text-gray-700">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-[10px] text-gray-700">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-[10px] text-gray-700">Low</span>
              </div>
            </div>
          </div>

          {/* Time Display - Top Right */}
          <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Last Updated</p>
            <p className="text-xs font-bold text-gray-900">{isClient ? currentTime : '--:--:--'}</p>
          </div>

          {/* 3D Globe Component */}
          <Suspense fallback={
            <div className="w-full h-[454px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-white text-sm font-medium">Loading 3D Globe...</p>
                <p className="text-blue-200 text-xs mt-1">Initializing visualization</p>
              </div>
            </div>
          }>
            <Globe3D
              disasters={disasters.map(d => ({
                id: d.id,
                lat: d.location.lat,
                lng: d.location.lng,
                type: d.type,
                severity: d.severity,
                emoji: getDisasterEmoji(d.type),
                name: d.location.name
              }))}
              onMarkerClick={(id) => {
                const disaster = disasters.find(d => d.id === id);
                if (disaster) setSelectedDisaster(disaster);
              }}
              selectedId={selectedDisaster?.id}
              visiblePins={visiblePins}
              droppingPins={droppingPins}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

