'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * This page redirects to the centralized Control Library in /libraries/controls
 * All control management is now handled from a single location.
 */
export default function ControlsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the centralized Control Library
    router.replace('/libraries/controls');
  }, [router]);

  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-sm text-gray-600">Redirecting to Control Library...</p>
      </div>
    </div>
  );
}