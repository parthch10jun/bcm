'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  TrashIcon,
  CalendarDaysIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  FolderIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';

// Backup schedule configuration
const backupSchedule = {
  enabled: true,
  frequency: 'Daily',
  time: '02:00 AM',
  timezone: 'Asia/Kolkata (IST)',
  retention: '30 days',
  destination: 'AWS S3 (ap-south-1)',
  encryption: 'AES-256',
  lastBackup: '02 Dec 2024, 02:00 AM',
  nextBackup: '03 Dec 2024, 02:00 AM',
  status: 'healthy'
};

// Backup history
const backupHistory = [
  { id: 'BKP-2024-1202-0200', date: '02 Dec 2024, 02:00 AM', type: 'Scheduled', size: '2.4 GB', duration: '12 min', status: 'completed', includes: ['Database', 'Configurations', 'Documents'] },
  { id: 'BKP-2024-1201-0200', date: '01 Dec 2024, 02:00 AM', type: 'Scheduled', size: '2.3 GB', duration: '11 min', status: 'completed', includes: ['Database', 'Configurations', 'Documents'] },
  { id: 'BKP-2024-1130-1430', date: '30 Nov 2024, 02:30 PM', type: 'Manual', size: '2.3 GB', duration: '10 min', status: 'completed', includes: ['Database', 'Configurations'] },
  { id: 'BKP-2024-1130-0200', date: '30 Nov 2024, 02:00 AM', type: 'Scheduled', size: '2.3 GB', duration: '11 min', status: 'completed', includes: ['Database', 'Configurations', 'Documents'] },
  { id: 'BKP-2024-1129-0200', date: '29 Nov 2024, 02:00 AM', type: 'Scheduled', size: '2.2 GB', duration: '10 min', status: 'completed', includes: ['Database', 'Configurations', 'Documents'] },
  { id: 'BKP-2024-1128-0200', date: '28 Nov 2024, 02:00 AM', type: 'Scheduled', size: '0 KB', duration: '2 min', status: 'failed', error: 'Storage quota exceeded', includes: [] },
  { id: 'BKP-2024-1127-0200', date: '27 Nov 2024, 02:00 AM', type: 'Scheduled', size: '2.2 GB', duration: '11 min', status: 'completed', includes: ['Database', 'Configurations', 'Documents'] },
];

// Restore points
const restorePoints = [
  { id: 'RP-2024-1202', date: '02 Dec 2024', time: '02:00 AM', size: '2.4 GB', verified: true },
  { id: 'RP-2024-1201', date: '01 Dec 2024', time: '02:00 AM', size: '2.3 GB', verified: true },
  { id: 'RP-2024-1130', date: '30 Nov 2024', time: '02:00 AM', size: '2.3 GB', verified: true },
  { id: 'RP-2024-1127', date: '27 Nov 2024', time: '02:00 AM', size: '2.2 GB', verified: true },
  { id: 'RP-2024-1120', date: '20 Nov 2024', time: '02:00 AM', size: '2.1 GB', verified: true },
];

const backupMetrics = {
  totalBackups: 28,
  successRate: '96.4%',
  totalStorage: '64.2 GB',
  avgDuration: '11 min'
};

export default function BackupRestorePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'restore' | 'settings'>('overview');
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedRestore, setSelectedRestore] = useState<any>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleManualBackup = async () => {
    setIsBackingUp(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsBackingUp(false);
    setShowBackupModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      case 'running': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'failed': return <XCircleIcon className="h-4 w-4 text-red-600" />;
      case 'running': return <ArrowPathIcon className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings" className="mr-4 p-1 hover:bg-gray-100 rounded-sm">
              <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Backup & Restore</h1>
              <p className="mt-0.5 text-xs text-gray-500">Manage scheduled backups, restore points, and recovery options</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowBackupModal(true)}
              className="inline-flex items-center h-[32px] px-3 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800"
            >
              <CloudArrowUpIcon className="h-4 w-4 mr-2" />
              Backup Now
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-1">
            {[
              { id: 'overview', name: 'Overview', icon: CircleStackIcon },
              { id: 'history', name: 'Backup History', icon: ClockIcon },
              { id: 'restore', name: 'Restore Points', icon: CloudArrowDownIcon },
              { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Backup Status Card */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-green-100 rounded-sm flex items-center justify-center mr-4">
                      <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">Automated Backup</h2>
                      <p className="text-xs text-gray-500">Status: {backupSchedule.status === 'healthy' ? 'Healthy - All systems operational' : 'Issue detected'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-sm border bg-green-50 text-green-700 border-green-200">
                      <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                      {backupSchedule.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 divide-x divide-gray-200">
                <div className="p-4">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Last Backup</p>
                  <p className="mt-1 text-xs font-medium text-gray-900">{backupSchedule.lastBackup}</p>
                  <p className="text-[10px] text-green-600 flex items-center mt-1">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />Completed successfully
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Next Backup</p>
                  <p className="mt-1 text-xs font-medium text-gray-900">{backupSchedule.nextBackup}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{backupSchedule.frequency} at {backupSchedule.time}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Destination</p>
                  <p className="mt-1 text-xs font-medium text-gray-900">{backupSchedule.destination}</p>
                  <p className="text-[10px] text-gray-500 mt-1">Encrypted: {backupSchedule.encryption}</p>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Retention</p>
                  <p className="mt-1 text-xs font-medium text-gray-900">{backupSchedule.retention}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{restorePoints.length} restore points available</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Backups</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{backupMetrics.totalBackups}</p>
                  </div>
                  <CloudArrowUpIcon className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-[10px] text-gray-500 mt-2">Last 30 days</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Success Rate</p>
                    <p className="mt-1 text-2xl font-semibold text-green-600">{backupMetrics.successRate}</p>
                  </div>
                  <CheckCircleIcon className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-[10px] text-gray-500 mt-2">27 of 28 successful</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Total Storage</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{backupMetrics.totalStorage}</p>
                  </div>
                  <FolderIcon className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-[10px] text-gray-500 mt-2">Across all restore points</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Avg Duration</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{backupMetrics.avgDuration}</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-[10px] text-gray-500 mt-2">Per backup operation</p>
              </div>
            </div>

            {/* Recent Backups */}
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Recent Backups</h3>
                <button onClick={() => setActiveTab('history')} className="text-xs text-blue-600 hover:underline">View All</button>
              </div>
              <div className="divide-y divide-gray-200">
                {backupHistory.slice(0, 4).map(backup => (
                  <div key={backup.id} className="px-4 py-3 flex items-center">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: backup.status === 'completed' ? '#ECFDF5' : '#FEF2F2' }}>
                      {getStatusIcon(backup.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900">{backup.id}</p>
                      <p className="text-[10px] text-gray-500">{backup.date} • {backup.type}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-xs text-gray-900">{backup.size}</p>
                      <p className="text-[10px] text-gray-500">{backup.duration}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-sm border capitalize ${getStatusColor(backup.status)}`}>
                      {backup.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Backup History</h3>
              <span className="text-[10px] text-gray-500">{backupHistory.length} backups in last 30 days</span>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Backup ID</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-right text-[10px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {backupHistory.map(backup => (
                  <tr key={backup.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-gray-900">{backup.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-900">{backup.date}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-sm border ${backup.type === 'Manual' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {backup.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-900">{backup.size}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">{backup.duration}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-sm border capitalize ${getStatusColor(backup.status)}`}>
                        {getStatusIcon(backup.status)}
                        <span className="ml-1">{backup.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {backup.status === 'completed' && (
                        <button className="text-xs text-blue-600 hover:underline">Restore</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'restore' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Restore Operations</p>
                  <p className="text-xs text-amber-700 mt-1">Restoring from a backup will replace all current data with the backup data. This action cannot be undone. Ensure you have a current backup before proceeding.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Available Restore Points</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {restorePoints.map(point => (
                  <div key={point.id} className="px-4 py-4 flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded-sm flex items-center justify-center mr-4 flex-shrink-0">
                      <DocumentDuplicateIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900">{point.date}</p>
                      <p className="text-[10px] text-gray-500">Created at {point.time} • {point.size}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {point.verified && (
                        <span className="inline-flex items-center text-[10px] text-green-600">
                          <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />Verified
                        </span>
                      )}
                      <button
                        onClick={() => { setSelectedRestore(point); setShowRestoreModal(true); }}
                        className="h-[28px] px-3 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Backup Schedule</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-xs font-medium text-gray-900">Automated Backups</p>
                    <p className="text-[10px] text-gray-500">Enable or disable scheduled backups</p>
                  </div>
                  <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${backupSchedule.enabled ? 'bg-green-600' : 'bg-gray-200'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${backupSchedule.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Frequency</label>
                    <select defaultValue={backupSchedule.frequency} className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                      <option>Hourly</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Time</label>
                    <input type="time" defaultValue="02:00" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Timezone</label>
                    <select defaultValue="IST" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                      <option value="IST">Asia/Kolkata (IST)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Storage & Retention</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Storage Destination</label>
                    <select defaultValue="s3" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                      <option value="s3">AWS S3 (ap-south-1)</option>
                      <option value="azure">Azure Blob Storage</option>
                      <option value="gcp">Google Cloud Storage</option>
                      <option value="local">Local Storage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Retention Period</label>
                    <select defaultValue="30" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Encryption</label>
                    <select defaultValue="aes256" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                      <option value="aes256">AES-256</option>
                      <option value="aes128">AES-128</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Compression</label>
                    <select defaultValue="gzip" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                      <option value="gzip">GZIP</option>
                      <option value="lz4">LZ4 (Fast)</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="h-[32px] px-4 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Backup Now Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => !isBackingUp && setShowBackupModal(false)} />

            <div className="relative bg-white rounded-sm shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Create Manual Backup</h3>
                <p className="text-xs text-gray-500 mt-0.5">Start an immediate backup of all platform data</p>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-2">Include in Backup</label>
                  <div className="space-y-2">
                    {['Database', 'Configurations', 'Documents & Attachments', 'Audit Logs'].map(item => (
                      <label key={item} className="flex items-center">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-gray-900 border-gray-300 rounded" />
                        <span className="ml-2 text-xs text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Backup Note (Optional)</label>
                  <input type="text" placeholder="e.g., Pre-upgrade backup" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button onClick={() => setShowBackupModal(false)} disabled={isBackingUp} className="h-[32px] px-4 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={handleManualBackup} disabled={isBackingUp} className="inline-flex items-center h-[32px] px-4 text-xs font-medium rounded-sm bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50">
                  {isBackingUp ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      Backing Up...
                    </>
                  ) : (
                    <>
                      <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                      Start Backup
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && selectedRestore && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowRestoreModal(false)} />

            <div className="relative bg-white rounded-sm shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Confirm Restore</h3>
                <p className="text-xs text-gray-500 mt-0.5">Restore from {selectedRestore.date}</p>
              </div>

              <div className="px-6 py-4">
                <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-4">
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Warning: This will replace all current data</p>
                      <p className="text-xs text-red-700 mt-1">All data created after {selectedRestore.date} will be permanently lost. A backup of current data will be created automatically before restore.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Type "RESTORE" to confirm</label>
                  <input type="text" placeholder="RESTORE" className="w-full h-[32px] px-3 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
                <button onClick={() => setShowRestoreModal(false)} className="h-[32px] px-4 text-xs font-medium rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button className="h-[32px] px-4 text-xs font-medium rounded-sm bg-red-600 text-white hover:bg-red-700">
                  Restore Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

