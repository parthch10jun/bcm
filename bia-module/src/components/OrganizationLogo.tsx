'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  PhotoIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useOrganization } from '@/contexts/OrganizationContext';

interface OrganizationLogoProps {
  currentLogo?: string | null;
  onLogoChange: (logoUrl: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
  showUpload?: boolean;
  className?: string;
}

export default function OrganizationLogo({ 
  currentLogo, 
  onLogoChange, 
  size = 'md', 
  showUpload = false,
  className = ''
}: OrganizationLogoProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-full h-full',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Upload to backend
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8080/api/system-config/organization/logo', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      const data = await response.json();
      // Convert relative URL to absolute URL for the backend
      const logoUrl = data.url.startsWith('http')
        ? data.url
        : `http://localhost:8080${data.url}`;
      onLogoChange(logoUrl);
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveLogo = () => {
    onLogoChange(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Default BSE logo path
  const defaultLogo = '/Bombay_Stock_Exchange__BSE__Logo_PNG_Vector_-_Logobase-removebg-preview.png';
  const logoToDisplay = currentLogo || defaultLogo;

  if (!showUpload && !currentLogo) {
    // Display default BSE logo when no custom logo is set
    return (
      <div className={`${sizeClasses[size]} relative ${className}`}>
        <Image
          src={defaultLogo}
          alt="BSE Logo"
          fill
          className="object-contain rounded-md"
          priority
        />
      </div>
    );
  }

  if (!showUpload && currentLogo) {
    // Display only mode with custom logo
    return (
      <div className={`${sizeClasses[size]} relative ${className}`}>
        <Image
          src={currentLogo}
          alt="Organization Logo"
          fill
          className="object-contain rounded-md"
          priority
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Logo Display */}
      {currentLogo && (
        <div className="flex items-center space-x-4">
          <div className={`${sizeClasses[size]} relative`}>
            <Image
              src={currentLogo}
              alt="Organization Logo"
              fill
              className="object-contain rounded-lg border border-gray-200"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Current Logo</p>
            <p className="text-xs text-gray-500">Click upload to replace</p>
          </div>
          <button
            onClick={handleRemoveLogo}
            className="p-2 text-red-400 hover:text-red-600 transition-colors"
            title="Remove logo"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-sm p-4 text-center transition-colors cursor-pointer
          ${dragOver
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onClick={handleUploadClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="space-y-2">
          {isUploading ? (
            <>
              <div className="mx-auto w-10 h-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              </div>
              <p className="text-xs text-gray-600">Uploading logo...</p>
            </>
          ) : (
            <>
              <ArrowUpTrayIcon className="mx-auto h-10 w-10 text-gray-400" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-gray-900">
                  {currentLogo ? 'Replace organization logo' : 'Upload organization logo'}
                </p>
                <p className="text-[10px] text-gray-500">
                  Drag and drop or click to select
                </p>
                <p className="text-[10px] text-gray-400">
                  PNG, JPG, SVG up to 5MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Guidelines */}
      <div className="bg-green-50 border border-green-200 rounded-sm p-3">
        <div className="flex">
          <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div className="ml-2">
            <h4 className="text-xs font-medium text-green-800">Logo Guidelines</h4>
            <div className="mt-1 text-[10px] text-green-700">
              <ul className="list-disc list-inside space-y-0.5">
                <li>Use high-resolution images for best quality</li>
                <li>Wide/horizontal logos work best (recommended: 180×56px)</li>
                <li>Transparent backgrounds (PNG) recommended</li>
                <li>Logo will be displayed in the navigation header</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Organization Settings Component
interface OrganizationSettingsProps {
  onSave: (settings: OrganizationSettings) => void;
}

export interface OrganizationSettings {
  name: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  website: string;
}

export function OrganizationSettings({ onSave }: OrganizationSettingsProps) {
  const { settings: orgSettings, updateSettings } = useOrganization();
  const [settings, setSettings] = useState<OrganizationSettings>(orgSettings);
  const [isSaving, setIsSaving] = useState(false);

  // Sync with context when it changes
  useEffect(() => {
    setSettings(orgSettings);
  }, [orgSettings]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateSettings(settings);
      onSave(settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-sm p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-6">Organization Settings</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Organization Name */}
            <div>
              <label htmlFor="orgName" className="block text-xs font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                id="orgName"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter organization name"
              />
            </div>

            {/* Brand Colors */}
            <div>
              <h4 className="text-xs font-medium text-gray-900 mb-3">Brand Colors</h4>
              <div className="space-y-3">
                <div>
                  <label htmlFor="primaryColor" className="block text-xs font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="primaryColor"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="h-8 w-12 border border-gray-300 rounded-sm cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="#1e3a1e"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="secondaryColor" className="block text-xs font-medium text-gray-700 mb-1">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      className="h-8 w-12 border border-gray-300 rounded-sm cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="#4a9d4a"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-xs font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-3">
                <div>
                  <label htmlFor="contactEmail" className="block text-xs font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="contact@organization.com"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-xs font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    value={settings.website}
                    onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://www.organization.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Logo Upload */}
          <div className="space-y-6">
            {/* Organization Logo */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Organization Logo
              </label>
              <p className="text-[10px] text-gray-500 mb-2">
                Logo displayed in the navigation header (wide/horizontal logos work best)
              </p>
              <OrganizationLogo
                currentLogo={settings.logo}
                onLogoChange={(logo) => setSettings({ ...settings, logo })}
                showUpload={true}
                size="lg"
              />
            </div>

            {/* Info about collapsed state */}
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <h4 className="text-xs font-medium text-blue-800">Collapsed Navigation</h4>
                  <p className="mt-1 text-[10px] text-blue-700">
                    When the navigation is collapsed, your organization's initials will be displayed instead of the logo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-medium rounded-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
