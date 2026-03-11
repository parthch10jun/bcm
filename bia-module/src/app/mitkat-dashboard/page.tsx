'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Lottie from 'lottie-react';
import {
  GlobeAltIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  SignalIcon,
  BoltIcon,
  FireIcon,
  CloudIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ChartBarIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

// Dynamically import MITKAT Weather Widget to avoid SSR issues
const MITKATWeatherWidget = dynamic(() => import('@/components/MITKATWeatherWidget'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[454px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-sm flex items-center justify-center border border-gray-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto mb-3"></div>
        <p className="text-white text-sm font-medium">Loading Global Threat Map...</p>
        <p className="text-blue-200 text-xs mt-1">Initializing 3D Earth visualization</p>
      </div>
    </div>
  ),
});

interface ThreatEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  region: string;
  timestamp: string;
  impact: string;
  source: 'social-media' | 'news' | 'twitter' | 'verified' | 'satellite';
  probability: number;
  details?: string;
  magnitude?: number;
  windSpeed?: number;
  temperature?: number;
}

/**
 * MITKAT Integration Dashboard
 *
 * Real-time disaster monitoring and threat intelligence dashboard
 * Integrates with MITKAT (Multi-hazard Impact and Threat Knowledge Assessment Tool)
 * to provide global disaster awareness and business continuity insights
 */
export default function MITKATDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const [expandedThreat, setExpandedThreat] = useState<string | null>(null);
  const [visibleThreats, setVisibleThreats] = useState<string[]>([]);
  const [newThreatId, setNewThreatId] = useState<string | null>(null);
  const [flyingThreatId, setFlyingThreatId] = useState<string | null>(null);
  const [visiblePins, setVisiblePins] = useState<string[]>([]);
  const [droppingPins, setDroppingPins] = useState<string[]>([]);

  // Initialize client-side only date to prevent hydration errors
  useEffect(() => {
    setMounted(true);
    setLastUpdate(new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }));
  }, []);

  // Mock threat events for the activity feed - matches globe markers
  const recentThreats: ThreatEvent[] = [
    {
      id: '1',
      type: 'Earthquake',
      severity: 'high',
      location: 'Tokyo, Japan',
      region: 'Asia-Pacific',
      timestamp: '2 hours ago',
      impact: 'M6.8 - Major infrastructure disruption expected',
      source: 'verified',
      probability: 78,
      magnitude: 6.8,
      details: 'Seismic activity detected at depth of 35km. Multiple aftershocks expected. Emergency services on high alert. Transportation systems temporarily suspended.'
    },
    {
      id: '2',
      type: 'Hurricane',
      severity: 'critical',
      location: 'Miami, USA',
      region: 'North America',
      timestamp: '4 hours ago',
      impact: 'Category 4 - Winds 140mph - Evacuations ordered',
      source: 'satellite',
      probability: 92,
      windSpeed: 140,
      details: 'Hurricane tracking shows direct path toward Miami metropolitan area. Mandatory evacuations issued for coastal zones. Storm surge of 12-15 feet expected.'
    },
    {
      id: '3',
      type: 'Flood',
      severity: 'medium',
      location: 'London, UK',
      region: 'Europe',
      timestamp: '6 hours ago',
      impact: 'Heavy rainfall 85mm/24h - Flood barriers activated',
      source: 'news',
      probability: 65,
      details: 'Thames flood barriers activated as precautionary measure. Underground services experiencing delays. Residents advised to avoid low-lying areas.'
    },
    {
      id: '4',
      type: 'Wildfire',
      severity: 'high',
      location: 'Sydney, Australia',
      region: 'Australia',
      timestamp: '8 hours ago',
      impact: 'Extreme fire danger - Temperature 42°C',
      source: 'verified',
      probability: 85,
      temperature: 42,
      details: 'Multiple active fires burning across greater Sydney region. Total fire ban in effect. Air quality hazardous. Residents urged to stay indoors.'
    },
    {
      id: '5',
      type: 'Tornado',
      severity: 'medium',
      location: 'Oklahoma City, USA',
      region: 'North America',
      timestamp: '10 hours ago',
      impact: 'Severe thunderstorm warnings - Tornado watch in effect',
      source: 'twitter',
      probability: 70,
      details: 'Severe weather system moving through central Oklahoma. Multiple tornado warnings issued. Residents advised to seek shelter immediately.'
    },
    {
      id: '6',
      type: 'Tsunami',
      severity: 'low',
      location: 'Jakarta, Indonesia',
      region: 'Asia-Pacific',
      timestamp: '12 hours ago',
      impact: 'Coastal monitoring active - Wave height 1.2m expected',
      source: 'verified',
      probability: 45,
      details: 'Tsunami warning system activated following offshore seismic event. Coastal areas on alert. Wave arrival estimated in 2-3 hours.'
    },
    {
      id: '7',
      type: 'Volcano',
      severity: 'medium',
      location: 'Reykjavik, Iceland',
      region: 'Europe',
      timestamp: '14 hours ago',
      impact: 'Increased seismic activity - Volcanic alert level raised to Orange',
      source: 'verified',
      probability: 60,
      details: 'Volcanic monitoring shows increased magma movement. Aviation alert raised. Scientists monitoring situation closely for potential eruption.'
    },
    {
      id: '8',
      type: 'Storm',
      severity: 'high',
      location: 'New York, USA',
      region: 'North America',
      timestamp: '16 hours ago',
      impact: 'Winter storm warning - Heavy snow 18-24 inches expected',
      source: 'news',
      probability: 82,
      details: 'Major winter storm approaching northeastern United States. Blizzard conditions expected. Travel strongly discouraged. Power outages likely.'
    },
    {
      id: '9',
      type: 'Earthquake',
      severity: 'critical',
      location: 'San Francisco, USA',
      region: 'North America',
      timestamp: '18 hours ago',
      impact: 'M7.2 - Major structural damage - Aftershocks likely',
      source: 'verified',
      probability: 88,
      magnitude: 7.2,
      details: 'Major earthquake struck San Francisco Bay Area. Significant structural damage reported. Emergency response teams deployed. Multiple aftershocks detected.'
    },
    {
      id: '10',
      type: 'Flood',
      severity: 'high',
      location: 'Hong Kong, China',
      region: 'Asia-Pacific',
      timestamp: '20 hours ago',
      impact: 'Typhoon-related flooding - Storm surge 2.5m above normal',
      source: 'satellite',
      probability: 79,
      details: 'Typhoon bringing severe flooding to Hong Kong. Storm surge exceeding predictions. Low-lying areas evacuated. Transportation severely disrupted.'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Dramatic animation: paper plane flying → compress into feed → pin drops on Earth
  useEffect(() => {
    setVisibleThreats([]);
    setVisiblePins([]);
    setDroppingPins([]);
    setFlyingThreatId(null);

    recentThreats.forEach((threat, index) => {
      const baseDelay = index * 4500; // 4.5 seconds between each threat (slower)

      // Step 1: Paper plane flying animation (1.8 seconds)
      setTimeout(() => {
        setFlyingThreatId(threat.id);
      }, baseDelay);

      // Step 2: Compress into feed (after flying completes)
      setTimeout(() => {
        setFlyingThreatId(null);
        setVisibleThreats(prev => [...prev, threat.id]);
        setNewThreatId(threat.id);
      }, baseDelay + 1800);

      // Step 3: After threat settles in feed (1 second), pin starts dropping
      setTimeout(() => {
        setDroppingPins(prev => [...prev, threat.id]);
      }, baseDelay + 2800);

      // Step 4: Pin lands on Earth (after 1.2s drop animation)
      setTimeout(() => {
        setVisiblePins(prev => [...prev, threat.id]);
        setDroppingPins(prev => prev.filter(id => id !== threat.id));
      }, baseDelay + 4000);

      // Step 5: Remove "NEW" badge
      setTimeout(() => {
        setNewThreatId(prev => prev === threat.id ? null : prev);
      }, baseDelay + 6000);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // Simulate live updates - replay animation for random threat every 25 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * recentThreats.length);
      const threat = recentThreats[randomIndex];

      // Replay the full animation sequence
      setFlyingThreatId(threat.id);

      setTimeout(() => {
        setFlyingThreatId(null);
        setNewThreatId(threat.id);
      }, 1800);

      setTimeout(() => {
        setDroppingPins(prev => [...prev, threat.id]);
      }, 2800);

      setTimeout(() => {
        setDroppingPins(prev => prev.filter(id => id !== threat.id));
      }, 4000);

      setTimeout(() => {
        setNewThreatId(null);
      }, 6000);
    }, 25000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey(prev => prev + 1);
    setLastUpdate(new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }));
    setTimeout(() => setLoading(false), 1000);
  };

  const stats = [
    {
      name: 'Active Threats',
      value: '10',
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      change: '+2',
      changeLabel: 'in last hour',
      changeType: 'increase'
    },
    {
      name: 'Monitored Locations',
      value: '47',
      icon: MapPinIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      change: '100%',
      changeLabel: 'coverage',
      changeType: 'neutral'
    },
    {
      name: 'High Severity',
      value: '4',
      icon: ShieldExclamationIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      change: '2',
      changeLabel: 'critical',
      changeType: 'warning'
    },
    {
      name: 'Data Sources',
      value: '8',
      icon: SignalIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      change: 'All',
      changeLabel: 'operational',
      changeType: 'positive'
    }
  ];

  const getSeverityBadge = (severity: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      'low': { bg: 'bg-green-100', text: 'text-green-700', label: 'Low' },
      'medium': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium' },
      'high': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'High' },
      'critical': { bg: 'bg-red-100', text: 'text-red-700', label: 'Critical' }
    };
    const badge = badges[severity] || badges['low'];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getSourceBadge = (source: string) => {
    const sources: Record<string, { bg: string; text: string; label: string; icon: string }> = {
      'verified': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Verified', icon: '✓' },
      'satellite': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Satellite', icon: '🛰️' },
      'news': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'News', icon: '📰' },
      'twitter': { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Twitter', icon: '🐦' },
      'social-media': { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Social Media', icon: '📱' }
    };
    const sourceInfo = sources[source] || sources['news'];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${sourceInfo.bg} ${sourceInfo.text}`}>
        <span>{sourceInfo.icon}</span>
        {sourceInfo.label}
      </span>
    );
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <GlobeAltIcon className="h-6 w-6 text-blue-600" />
              MITKAT Integration Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time Global Disaster Monitoring & Threat Intelligence
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs border border-gray-300 rounded-sm px-3 py-2 bg-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="text-xs border border-gray-300 rounded-sm px-3 py-2 bg-white focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High & Above</option>
              <option value="medium">Medium & Above</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700">
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Last Update Info */}
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
          <CalendarIcon className="h-4 w-4" />
          Last updated: {mounted ? lastUpdate : 'Loading...'}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-5">
          {stats.map((stat) => (
            <div key={stat.name} className={`bg-white overflow-hidden rounded-sm border ${stat.borderColor}`}>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{stat.name}</p>
                    <p className={`mt-1.5 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <div className="mt-1.5 flex items-baseline gap-1">
                      <span className={`text-xs font-semibold ${
                        stat.changeType === 'increase' ? 'text-red-600' :
                        stat.changeType === 'positive' ? 'text-green-600' :
                        stat.changeType === 'warning' ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-[10px] text-gray-500">{stat.changeLabel}</span>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Globe Visualization - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">Global Threat Map</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Interactive 3D visualization of real-time disaster events
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                      <SignalIcon className="h-3 w-3 mr-1" />
                      Live
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-0">
                <MITKATWeatherWidget
                  key={refreshKey}
                  visiblePins={visiblePins}
                  droppingPins={droppingPins}
                />
              </div>
            </div>
          </div>

          {/* Activity Feed - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm border border-gray-200 overflow-hidden h-full">
              <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      Recent Threats
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 animate-pulse">
                        LIVE
                      </span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Real-time disaster bulletins</p>
                  </div>
                </div>
              </div>

              {/* Lottie Paper plane flying animation */}
              {flyingThreatId && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                  <div className="absolute top-1/2 -left-32 animate-fly-in">
                    <div className="w-32 h-32">
                      <Lottie
                        animationData={{
                          "v": "5.7.4",
                          "fr": 30,
                          "ip": 0,
                          "op": 60,
                          "w": 512,
                          "h": 512,
                          "nm": "Paper Plane",
                          "ddd": 0,
                          "assets": [],
                          "layers": [{
                            "ddd": 0,
                            "ind": 1,
                            "ty": 4,
                            "nm": "Plane",
                            "sr": 1,
                            "ks": {
                              "o": {"a": 0, "k": 100},
                              "r": {"a": 0, "k": -45},
                              "p": {"a": 0, "k": [256, 256, 0]},
                              "a": {"a": 0, "k": [0, 0, 0]},
                              "s": {"a": 0, "k": [100, 100, 100]}
                            },
                            "ao": 0,
                            "shapes": [{
                              "ty": "gr",
                              "it": [{
                                "ind": 0,
                                "ty": "sh",
                                "ks": {
                                  "a": 0,
                                  "k": {
                                    "i": [[0,0],[0,0],[0,0]],
                                    "o": [[0,0],[0,0],[0,0]],
                                    "v": [[0,-80],[60,40],[-60,40]],
                                    "c": true
                                  }
                                }
                              }, {
                                "ty": "fl",
                                "c": {"a": 0, "k": [0.3, 0.6, 1, 1]},
                                "o": {"a": 0, "k": 100}
                              }, {
                                "ty": "tr",
                                "p": {"a": 0, "k": [0, 0]},
                                "a": {"a": 0, "k": [0, 0]},
                                "s": {"a": 0, "k": [100, 100]},
                                "r": {"a": 0, "k": 0},
                                "o": {"a": 0, "k": 100}
                              }],
                              "nm": "Plane Shape"
                            }],
                            "ip": 0,
                            "op": 60,
                            "st": 0
                          }]
                        }}
                        loop={false}
                        autoplay={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="divide-y divide-gray-100 max-h-[486px] overflow-y-auto relative">
                {recentThreats.map((threat, index) => {
                  const isVisible = visibleThreats.includes(threat.id);
                  const isNew = newThreatId === threat.id;
                  const isFlying = flyingThreatId === threat.id;

                  return (
                    <div
                      key={threat.id}
                      className={`p-4 transition-all ${
                        isFlying ? 'duration-[1800ms] opacity-100 scale-100' :
                        isVisible ? 'duration-700 opacity-100 translate-x-0 scale-100' :
                        'duration-700 opacity-0 translate-x-full scale-50'
                      } ${isNew ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            threat.severity === 'critical' ? 'bg-red-500 animate-pulse' :
                            threat.severity === 'high' ? 'bg-orange-500' :
                            threat.severity === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                          <span className="text-sm font-semibold text-gray-900">{threat.type}</span>
                          {isNew && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-600 text-white animate-pulse">
                              NEW
                            </span>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          threat.severity === 'critical' ? 'bg-gray-100 text-red-700 border border-red-200' :
                          threat.severity === 'high' ? 'bg-gray-100 text-orange-700 border border-orange-200' :
                          threat.severity === 'medium' ? 'bg-gray-100 text-yellow-700 border border-yellow-200' :
                          'bg-gray-100 text-green-700 border border-green-200'
                        }`}>
                          {threat.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <MapPinIcon className="h-3 w-3" />
                          {threat.location}
                        </div>
                        <p className="text-xs text-gray-700 mb-2 font-medium">{threat.impact}</p>

                        {/* Source and Probability */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${
                            threat.source === 'verified' ? 'bg-white text-blue-700 border-blue-300' :
                            threat.source === 'satellite' ? 'bg-white text-purple-700 border-purple-300' :
                            threat.source === 'news' ? 'bg-white text-gray-700 border-gray-300' :
                            threat.source === 'twitter' ? 'bg-white text-sky-700 border-sky-300' :
                            'bg-white text-pink-700 border-pink-300'
                          }`}>
                            <span>{
                              threat.source === 'verified' ? '✓' :
                              threat.source === 'satellite' ? '🛰️' :
                              threat.source === 'news' ? '📰' :
                              threat.source === 'twitter' ? '🐦' : '📱'
                            }</span>
                            {threat.source.charAt(0).toUpperCase() + threat.source.slice(1).replace('-', ' ')}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                            {threat.probability}% probability
                          </span>
                        </div>

                        {/* Expandable Details */}
                        {expandedThreat === threat.id && threat.details && (
                          <div className="mt-3 p-3 bg-white rounded border border-gray-200 shadow-sm animate-in slide-in-from-top duration-300">
                            <p className="text-xs text-gray-700 leading-relaxed mb-2">{threat.details}</p>
                            {threat.magnitude && (
                              <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                <span className="font-semibold text-gray-800">Magnitude:</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded">{threat.magnitude}</span>
                              </div>
                            )}
                            {threat.windSpeed && (
                              <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                                <span className="font-semibold text-gray-800">Wind Speed:</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded">{threat.windSpeed} mph</span>
                              </div>
                            )}
                            {threat.temperature && (
                              <div className="text-xs text-gray-600 flex items-center gap-1">
                                <span className="font-semibold text-gray-800">Temperature:</span>
                                <span className="bg-gray-100 px-2 py-0.5 rounded">{threat.temperature}°C</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {threat.timestamp}
                          </span>
                          <button
                            onClick={() => setExpandedThreat(expandedThreat === threat.id ? null : threat.id)}
                            className="text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
                          >
                            {expandedThreat === threat.id ? 'Hide Details ↑' : 'View Details →'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <ChartBarIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Threat Trend</p>
                <p className="text-lg font-bold text-gray-900">+15%</p>
                <p className="text-xs text-gray-500">vs last week</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-lg">
                <MapPinIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Regions Monitored</p>
                <p className="text-lg font-bold text-gray-900">6</p>
                <p className="text-xs text-gray-500">continents</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-50 p-2 rounded-lg">
                <BoltIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Response Time</p>
                <p className="text-lg font-bold text-gray-900">2.3 min</p>
                <p className="text-xs text-gray-500">average</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

