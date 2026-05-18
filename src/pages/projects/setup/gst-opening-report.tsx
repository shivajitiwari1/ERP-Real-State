import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

export default function GstOpeningReportPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: cfg } = useQuery<any>({
    queryKey: ['project-config', projectId],
    queryFn: () => axios.get(`/api/projects/setup/project-config?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const proj = (projects as any[]).find((p: any) => String(p.id) === projectId);
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const openingCgst = parseFloat(cfg?.openingCgst ?? '0') || 0;
  const openingSgst = parseFloat(cfg?.openingSgst ?? '0') || 0;
  const openingIgst = parseFloat(cfg?.openingIgst ?? '0') || 0;
  const openingGstLiability = parseFloat(cfg?.openingGstLiability ?? '0') || 0;
  const openingItcBalance = parseFloat(cfg?.openingItcBalance ?? '0') || 0;
  const netLiability = openingGstLiability - openingItcBalance;

  return (
    <div>
      <PageHeader title="Opening Balance Report" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex items-center justify-between gap-3 print:hidden">
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
          {projectId && (
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => window.print()}>
              Print Report
            </Button>
          )}
        </div>

        {proj && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden max-w-2xl">
            {/* Report Header */}
            <div className="bg-slate-800 px-4 py-3 text-white">
              <div className="text-sm font-bold uppercase tracking-wide">GST Opening Balance Report</div>
              <div className="text-xs text-slate-300 mt-0.5">
                Project: {proj.name} &nbsp;|&nbsp; Generated: {today}
              </div>
              {cfg?.openingAsOn && (
                <div className="text-xs text-slate-300">
                  Opening as on: {new Date(cfg.openingAsOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 divide-x border-b text-xs">
              <div className="p-3">
                <div className="text-gray-400">Project Code</div>
                <div className="font-semibold mt-0.5">{proj.code ?? '—'}</div>
              </div>
              <div className="p-3">
                <div className="text-gray-400">City</div>
                <div className="font-semibold mt-0.5">{proj.city ?? '—'}</div>
              </div>
            </div>

            {/* Opening Balances Table */}
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-4 py-2 text-left">Particulars</th>
                  <th className="px-4 py-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <td className="px-4 py-2 font-semibold text-slate-700" colSpan={2}>GST Liability Break-up</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 pl-8 text-gray-600">Opening CGST Liability</td>
                  <td className="px-4 py-2 text-right font-mono">₹{openingCgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-2 pl-8 text-gray-600">Opening SGST Liability</td>
                  <td className="px-4 py-2 text-right font-mono">₹{openingSgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 pl-8 text-gray-600">Opening IGST Liability</td>
                  <td className="px-4 py-2 text-right font-mono">₹{openingIgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="bg-white font-semibold border-t-2">
                  <td className="px-4 py-2 text-slate-700">Total Opening GST Liability</td>
                  <td className="px-4 py-2 text-right font-mono text-orange-700">₹{openingGstLiability.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-4 py-2 text-slate-700">Opening ITC Balance</td>
                  <td className="px-4 py-2 text-right font-mono text-green-700">₹{openingItcBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className={`font-bold border-t-2 ${netLiability > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <td className="px-4 py-2 text-slate-800">Net Opening GST Payable</td>
                  <td className={`px-4 py-2 text-right font-mono ${netLiability > 0 ? 'text-red-700' : 'text-green-700'}`}>
                    ₹{Math.abs(netLiability).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    {netLiability < 0 && ' (Cr)'}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-400 italic">
              This report reflects the opening GST balances entered at the time of system setup. Verify with your GST portal (GSTIN) before filing.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
