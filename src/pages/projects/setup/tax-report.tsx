import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

const TAX_HEADS = [
  { head: 'GST', hsn: '9954', category: 'Central', rate: 5, applicableOn: 'Construction Value', remarks: 'As per CBIC notification' },
  { head: 'Stamp Duty', hsn: '—', category: 'State', rate: 5, applicableOn: 'Circle Rate / Agreement Value', remarks: 'Varies by state' },
  { head: 'Registration Fee', hsn: '—', category: 'State', rate: 1, applicableOn: 'Agreement Value', remarks: 'Max cap applies in some states' },
  { head: 'TDS (194IA)', hsn: '—', category: 'Central', rate: 1, applicableOn: 'Agreement Value > ₹50L', remarks: 'Buyer deducts at source' },
  { head: 'Legal Charges', hsn: '—', category: 'Other', rate: 0, applicableOn: 'Fixed / Negotiated', remarks: 'Not statutory' },
  { head: 'Service Tax (Legacy)', hsn: '—', category: 'Legacy', rate: 0, applicableOn: 'Pre-GST bookings only', remarks: 'Reference only' },
];

export default function TaxReportPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });

  const proj = (projects as any[]).find((p: any) => String(p.id) === projectId);
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div>
      <PageHeader title="Tax Configuration Report" />
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

        {projectId && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            {/* Report Header */}
            <div className="bg-slate-800 px-4 py-3 text-white">
              <div className="text-sm font-bold uppercase tracking-wide">Tax Configuration Report</div>
              <div className="text-xs text-slate-300 mt-0.5">
                Project: {proj?.name} &nbsp;|&nbsp; Generated: {today}
              </div>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-3 divide-x border-b text-xs">
              <div className="p-3">
                <div className="text-gray-400">Project Code</div>
                <div className="font-semibold mt-0.5">{proj?.code ?? '—'}</div>
              </div>
              <div className="p-3">
                <div className="text-gray-400">City</div>
                <div className="font-semibold mt-0.5">{proj?.city ?? '—'}</div>
              </div>
              <div className="p-3">
                <div className="text-gray-400">Total Tax Heads</div>
                <div className="font-semibold mt-0.5">{TAX_HEADS.length}</div>
              </div>
            </div>

            {/* Tax Table */}
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2 text-center w-12">S.No.</th>
                  <th className="px-3 py-2 text-left">Tax Head</th>
                  <th className="px-3 py-2 text-center">HSN/SAC</th>
                  <th className="px-3 py-2 text-center">Category</th>
                  <th className="px-3 py-2 text-right">Rate (%)</th>
                  <th className="px-3 py-2 text-left">Applicable On</th>
                  <th className="px-3 py-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {TAX_HEADS.map((t, i) => (
                  <tr key={t.head} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-semibold text-slate-700">{t.head}</td>
                    <td className="px-3 py-2 text-center font-mono">{t.hsn}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-xs px-1.5 py-0.5 rounded text-white ${
                        t.category === 'Central' ? 'bg-blue-600' :
                        t.category === 'State' ? 'bg-green-600' :
                        t.category === 'Legacy' ? 'bg-gray-500' : 'bg-slate-500'
                      }`}>{t.category}</span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <span className={`font-bold ${t.rate === 0 ? 'text-gray-400' : 'text-orange-700'}`}>{t.rate}%</span>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{t.applicableOn}</td>
                    <td className="px-3 py-2 text-gray-400 italic">{t.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-400 italic">
              Disclaimer: Rates are indicative. Verify current statutory rates with your Chartered Accountant before filing.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
