import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

const GST_RATE = 0.18;

export default function CustomerAgeingStaxPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['customer-ageing-stax', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const today = new Date();
  const grouped: Record<string, { name: string; unit: string; b0_30: number; b31_60: number; b61_90: number; b90p: number; total: number }> = {};
  (demands as any[]).forEach((d: any) => {
    const key = d.Booking?.registrationNo || d.bookingId || 'unknown';
    const name = `${d.Booking?.Applicants?.[0]?.firstName || ''} ${d.Booking?.Applicants?.[0]?.lastName || ''}`.trim() || 'Unknown';
    const unit = d.Booking?.Unit?.unitNumber || '-';
    if (!grouped[key]) grouped[key] = { name, unit, b0_30: 0, b31_60: 0, b61_90: 0, b90p: 0, total: 0 };
    const due = d.dueDate ? new Date(d.dueDate) : null;
    const pending = Number(d.pendingAmount || (d.totalAmount || d.amount || 0) - (d.paidAmount || 0));
    if (pending <= 0) return;
    grouped[key].total += pending;
    if (!due) { grouped[key].b0_30 += pending; return; }
    const days = Math.floor((today.getTime() - due.getTime()) / 86400000);
    if (days <= 30) grouped[key].b0_30 += pending;
    else if (days <= 60) grouped[key].b31_60 += pending;
    else if (days <= 90) grouped[key].b61_90 += pending;
    else grouped[key].b90p += pending;
  });
  const rows = Object.entries(grouped).map(([key, d]) => ({ key, ...d, gst: d.total * GST_RATE, grandTotal: d.total * (1 + GST_RATE) }));

  return (
    <div>
      <PageHeader title="Customer Wise Ageing With STax" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-3 py-1.5">GST Rate: 18%</span>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase tracking-wide">Customer Wise Ageing With STax ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-right">0-30 (₹)</th>
              <th className="px-3 py-2 text-right">31-60 (₹)</th>
              <th className="px-3 py-2 text-right">61-90 (₹)</th>
              <th className="px-3 py-2 text-right">90+ (₹)</th>
              <th className="px-3 py-2 text-right">Total (₹)</th>
              <th className="px-3 py-2 text-right">GST 18% (₹)</th>
              <th className="px-3 py-2 text-right">Grand Total (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={10} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={10} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.name}</td>
                  <td className="px-3 py-1.5">{r.unit}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{r.b0_30.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{r.b31_60.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{r.b61_90.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-red-600">{r.b90p.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-red-700 font-bold">{r.total.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-orange-600">{r.gst.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right font-bold text-purple-700">{r.grandTotal.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
