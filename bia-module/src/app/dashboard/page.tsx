'use client';

import { useUserProfile } from '@/contexts/UserProfileContext';
import ChampionDashboard from './components/ChampionDashboard';
import SMEDashboard from './components/SMEDashboard';
import ReviewerDashboard from './components/ReviewerDashboard';
import VerifierDashboard from './components/VerifierDashboard';
import ApproverDashboard from './components/ApproverDashboard';

/**
 * Role-Based Dashboard Router
 * 
 * Routes users to their role-specific dashboard based on their current role.
 * Each role sees a completely different view with role-appropriate tasks and actions.
 */
export default function DashboardPage() {
  const { currentUser } = useUserProfile();

  if (!currentUser) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-sm text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  // Route to role-specific dashboard
  switch (currentUser.role) {
    case 'CHAMPION':
      return <ChampionDashboard />;
    
    case 'SME':
      return <SMEDashboard />;
    
    case 'DIVISION_HEAD':
      return <ReviewerDashboard />;
    
    case 'BCM_VERIFIER':
      return <VerifierDashboard />;
    
    case 'APPROVER':
      return <ApproverDashboard />;
    
    default:
      return (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-600">Unknown role: {currentUser.role}</p>
          </div>
        </div>
      );
  }
}

