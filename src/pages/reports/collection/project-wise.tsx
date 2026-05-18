import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function ProjectWiseCollectionPage() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { data: receipts = [], isLoading } = useQuery<any[]>({ queryKey: ['proj-wise-collection', fromDate, toDate], queryFn: () => axios.get('/api/application/receipts/index').then(r => r.data.data) });

  const grouped: Record<string, { count: number; total: number; penalty: number }> = {};
  (receipts as any[]).forEach((r: any) => {
    const proj = r.Booking?.Project?.name || r.projectName || 'Unknown';
    if (!grouped[proj]) grouped[proj] = { count: 0, total: 0, penalty: 0 };
    grouped[proj].count++;
    grouped[proj].total += Number(r.totalAmount || r.amount || 0);
    grouped[proj].penalty += Number(r.penaltyAmount || 0);
  });
  const rows = Object.entries(grouped).map(([project, d]) => ({ project, ...d }));
  const grandTotal = rows.reduce((s, r) => s + r.total, 0);

  return (
    <div>
      <PageHeader title="Project Wise Collection" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 flex-wrap items-end">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">From:</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border rounded px-2 h-9 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">To:</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border rounded px-2 h-9 text-sm" />
          </div>
          {grandTotal > 0 && <span className="text-sm font-semibold text-green-700 ml-auto">Grand Total: ₹{grandTotal.toLocaleString('en-IN')}</span>}
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Project Wise Collection ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-800 text-white">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Project</th>
              <th className="px-3 py-2 text-right">Receipts</th>
              <th className="px-3 py-2 text-right">Penalty (₹)</th>
              <th className="px-3 py-2 text-right">Total Collection (₹)</th>
              <th className="px-3 py-2 text-right">% Share</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.project} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.project}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{r.count}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{r.penalty.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-green-600 font-semibold">{r.total.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right">{grandTotal > 0 ? `${((r.total / grandTotal) * 100).toFixed(1)}%` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
