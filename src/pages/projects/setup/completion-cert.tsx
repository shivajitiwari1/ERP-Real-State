import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

export default function CompletionCertPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });

  const proj = (projects as any[]).find((p: any) => String(p.id) === projectId);

  return (
    <div>
      <PageHeader title="Completion Certificate Master" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 print:hidden">
          <select
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            className="border rounded px-2 h-9 text-sm min-w-64"
          >
            <option value="">Select Project</option>
            {(projects as any[]).map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {proj && (
          <div className="bg-white border rounded-lg shadow-sm p-5 max-w-2xl">
            {/* Certificate Header */}
            <div className="text-center border-b pb-4 mb-4">
              <div className="text-base font-bold text-slate-800 uppercase tracking-wide">
                Completion Certificate
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Issued under the Real Estate (Regulation and Development) Act, 2016
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-700 border-b pb-2 mb-4 uppercase">
              Project Details — {proj.name}
            </h3>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 uppercase text-xs tracking-wide">Project Name</span>
                <span className="font-semibold text-slate-700">{proj.name}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 uppercase text-xs tracking-wide">Project Code</span>
                <span className="font-semibold font-mono">{proj.code ?? '—'}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 uppercase text-xs tracking-wide">City</span>
                <span className="font-semibold">{proj.city ?? '—'}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 uppercase text-xs tracking-wide">Possession Date</span>
                <span className="font-semibold">
                  {proj.possessionDate ? new Date(proj.possessionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'}
                </span>
              </div>
              <div className="col-span-2 flex flex-col gap-0.5">
                <span className="text-gray-400 uppercase text-xs tracking-wide">Address</span>
                <span className="font-semibold">{proj.address ?? '—'}</span>
              </div>
              {proj.reraNo && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 uppercase text-xs tracking-wide">RERA No.</span>
                  <span className="font-semibold font-mono">{proj.reraNo}</span>
                </div>
              )}
              {proj.totalUnits != null && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-gray-400 uppercase text-xs tracking-wide">Total Units</span>
                  <span className="font-semibold">{proj.totalUnits}</span>
                </div>
              )}
            </div>

            {/* Completion Declaration */}
            <div className="mt-5 pt-4 border-t bg-green-50 rounded p-3 text-xs text-green-800">
              This certificate confirms that the above-mentioned project has been completed as per the approved building plan and all statutory requirements have been fulfilled.
            </div>

            <div className="mt-4 pt-3 border-t flex items-center gap-3 print:hidden">
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-600"
                onClick={() => window.print()}
              >
                Print Certificate
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
