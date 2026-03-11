'use client';

import { useRouter } from 'next/navigation';
import { XMarkIcon, CheckCircleIcon, DocumentArrowDownIcon, ArrowPathIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function SummaryPage() {
  const router = useRouter();

  const summary = {
    planName: 'Customer Service Operations BCP',
    version: 'v1.0',
    status: 'Pending Approval',
    owner: 'John Smith',
    deputy: 'Sarah Johnson',
    createdDate: '2024-12-22',
    lastModified: '2024-12-22',
    sections: [
      { name: 'Plan Details', status: 'Complete', items: 4 },
      { name: 'Scope & Dependencies', status: 'Complete', items: 3 },
      { name: 'Activation & Escalation', status: 'Complete', items: 2 },
      { name: 'Scenarios', status: 'Complete', items: 4 },
      { name: 'Response Procedures', status: 'Complete', items: 10 },
      { name: 'Recovery Checklists', status: 'Complete', items: 3 },
      { name: 'Resources & Teams', status: 'Complete', items: 7 },
      { name: 'Alternate Workspaces', status: 'Complete', items: 3 },
      { name: 'Communications', status: 'Complete', items: 5 },
      { name: 'Testing Schedule', status: 'Complete', items: 4 }
    ]
  };

  const handleClose = () => router.push('/it-dr-plans');
  const handleBack = () => router.push('/it-dr-plans/create/review');
  const handlePublish = () => {
    alert('BCP Published Successfully!');
    router.push('/it-dr-plans');
  };
  const handleExportPDF = () => alert('Exporting BCP as PDF...');
  const handleExportWord = () => alert('Exporting BCP as Word document...');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-6">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-4">
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">BCP: Customer Service Operations</h1>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="px-6 py-3 bg-gray-50">
            <div className="flex items-center justify-center gap-1.5">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map((step) => (
                <div key={step} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${step === 12 ? 'bg-gray-900 text-white' : 'bg-green-600 text-white'}`}>
                  {step < 12 ? '✓' : step}
                </div>
              ))}
            </div>
            <div className="text-center mt-2"><span className="text-[10px] text-gray-600 uppercase tracking-wider">Step 12 of 12: Summary & Publish</span></div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Success Banner */}
          <div className="bg-green-50 border border-green-200 rounded-sm p-4 flex items-center gap-3">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-sm font-semibold text-green-800">BCP Ready for Publication</h3>
              <p className="text-xs text-green-700">All sections completed. Review the summary below and publish when ready.</p>
            </div>
          </div>

          {/* Plan Summary Card */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Plan Summary</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Plan Name</div>
                  <div className="text-sm font-medium text-gray-900">{summary.planName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Version</div>
                  <div className="text-sm font-medium text-gray-900">{summary.version}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Status</div>
                  <span className="px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-sm">{summary.status}</span>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Owner / Deputy</div>
                  <div className="text-sm text-gray-900">{summary.owner} / {summary.deputy}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Created</div>
                  <div className="text-sm text-gray-600">{summary.createdDate}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 uppercase">Last Modified</div>
                  <div className="text-sm text-gray-600">{summary.lastModified}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sections Summary */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Sections Completed</h2>
            </div>
            <div className="grid grid-cols-2 gap-px bg-gray-200">
              {summary.sections.map((section, idx) => (
                <div key={idx} className="bg-white p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-gray-900">{section.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{section.items} items</span>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Export Options</h2>
            </div>
            <div className="p-4 flex gap-3">
              <button onClick={handleExportPDF} className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm border border-gray-200">
                <DocumentArrowDownIcon className="h-4 w-4" /> Export as PDF
              </button>
              <button onClick={handleExportWord} className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm border border-gray-200">
                <DocumentArrowDownIcon className="h-4 w-4" /> Export as Word
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm border border-gray-200">
                <EyeIcon className="h-4 w-4" /> Preview
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button onClick={handleBack} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">← Back to Review</button>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 flex items-center gap-1">
                <ArrowPathIcon className="h-3.5 w-3.5" /> Save as Draft
              </button>
              <button onClick={handlePublish} className="px-4 py-1.5 text-xs font-medium text-white bg-green-600 rounded-sm hover:bg-green-700">
                Publish BCP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

