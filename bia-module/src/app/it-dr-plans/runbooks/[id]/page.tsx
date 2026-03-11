'use client';

export default function RunbookDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Runbook Detail - {params.id}</h1>
        <p className="text-sm text-gray-600 mt-2">This page is under construction.</p>
      </div>
    </div>
  );
}
