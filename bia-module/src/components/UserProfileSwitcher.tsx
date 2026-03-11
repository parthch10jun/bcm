'use client';

import React, { useState } from 'react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import {
  UserCircleIcon,
  ChevronDownIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export const UserProfileSwitcher: React.FC = () => {
  const { currentUser, switchProfile } = useUserProfile();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="flex items-center gap-3">
      {/* User Profile Menu */}
      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-sm transition-colors"
        >
          <UserCircleIcon className="h-5 w-5" />
          <div className="text-left">
            <p className="text-xs font-medium text-gray-900">{currentUser.fullName}</p>
            <p className="text-[10px] text-gray-500">
              {currentUser.role === 'CHAMPION' && 'Champion'}
              {currentUser.role === 'SME' && 'SME'}
              {currentUser.role === 'DIVISION_HEAD' && 'Division Head'}
              {currentUser.role === 'BCM_VERIFIER' && 'BCM Verifier'}
              {currentUser.role === 'APPROVER' && 'Chief Approver'}
            </p>
          </div>
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        </button>

        {/* Profile Dropdown */}
        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-sm shadow-lg z-50">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-900">{currentUser.fullName}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{currentUser.email}</p>
              <p className="text-[10px] text-gray-500">{currentUser.department} • {currentUser.title}</p>
            </div>

            <div className="p-2">
              <div className="mb-2">
                <p className="px-2 py-1 text-[10px] font-semibold text-gray-500 uppercase">Switch Role (Testing)</p>
              </div>

              {/* Champion Role */}
              <button
                onClick={() => {
                  switchProfile('MAKER', 'CHAMPION');
                  setShowProfileMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-sm transition-colors mb-1 ${
                  currentUser.role === 'CHAMPION'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserCircleIcon className="h-4 w-4" />
                  <div className="text-left">
                    <p className="font-medium">Champion</p>
                    <p className={`text-[10px] ${currentUser.role === 'CHAMPION' ? 'text-blue-100' : 'text-gray-500'}`}>
                      Initiate & assign BIAs
                    </p>
                  </div>
                </div>
                {currentUser.role === 'CHAMPION' && <CheckCircleIcon className="h-4 w-4" />}
              </button>

              {/* SME Role */}
              <button
                onClick={() => {
                  switchProfile('MAKER', 'SME');
                  setShowProfileMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-sm transition-colors mb-1 ${
                  currentUser.role === 'SME'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserCircleIcon className="h-4 w-4" />
                  <div className="text-left">
                    <p className="font-medium">SME</p>
                    <p className={`text-[10px] ${currentUser.role === 'SME' ? 'text-purple-100' : 'text-gray-500'}`}>
                      Complete assigned BIAs
                    </p>
                  </div>
                </div>
                {currentUser.role === 'SME' && <CheckCircleIcon className="h-4 w-4" />}
              </button>

              {/* Division Head Role */}
              <button
                onClick={() => {
                  switchProfile('CHECKER', 'DIVISION_HEAD');
                  setShowProfileMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-sm transition-colors mb-1 ${
                  currentUser.role === 'DIVISION_HEAD'
                    ? 'bg-yellow-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4" />
                  <div className="text-left">
                    <p className="font-medium">Division Head</p>
                    <p className={`text-[10px] ${currentUser.role === 'DIVISION_HEAD' ? 'text-yellow-100' : 'text-gray-500'}`}>
                      Review & comment
                    </p>
                  </div>
                </div>
                {currentUser.role === 'DIVISION_HEAD' && <CheckCircleIcon className="h-4 w-4" />}
              </button>

              {/* BCM Verifier Role */}
              <button
                onClick={() => {
                  switchProfile('CHECKER', 'BCM_VERIFIER');
                  setShowProfileMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-sm transition-colors mb-1 ${
                  currentUser.role === 'BCM_VERIFIER'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4" />
                  <div className="text-left">
                    <p className="font-medium">BCM Verifier</p>
                    <p className={`text-[10px] ${currentUser.role === 'BCM_VERIFIER' ? 'text-indigo-100' : 'text-gray-500'}`}>
                      Verify compliance
                    </p>
                  </div>
                </div>
                {currentUser.role === 'BCM_VERIFIER' && <CheckCircleIcon className="h-4 w-4" />}
              </button>

              {/* Approver Role */}
              <button
                onClick={() => {
                  switchProfile('CHECKER', 'APPROVER');
                  setShowProfileMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-sm transition-colors ${
                  currentUser.role === 'APPROVER'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4" />
                  <div className="text-left">
                    <p className="font-medium">Chief Approver</p>
                    <p className={`text-[10px] ${currentUser.role === 'APPROVER' ? 'text-green-100' : 'text-gray-500'}`}>
                      Final approval
                    </p>
                  </div>
                </div>
                {currentUser.role === 'APPROVER' && <CheckCircleIcon className="h-4 w-4" />}
              </button>
            </div>

            <div className="border-t border-gray-200 p-2">
              <button className="w-full px-3 py-2 text-xs text-left text-gray-700 hover:bg-gray-100 rounded-sm">
                Profile Settings
              </button>
              <button className="w-full px-3 py-2 text-xs text-left text-gray-700 hover:bg-gray-100 rounded-sm">
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

