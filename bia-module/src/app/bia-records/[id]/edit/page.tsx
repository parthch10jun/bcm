'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function EditBIARecord() {
  const params = useParams();
  const router = useRouter();
  const recordId = params.id as string;

  useEffect(() => {
    // Redirect to BIA wizard with edit mode and record ID
    router.push(`/bia-records/new?edit=${recordId}`);
  }, [recordId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting to BIA wizard...</p>
      </div>
    </div>
  );
}
