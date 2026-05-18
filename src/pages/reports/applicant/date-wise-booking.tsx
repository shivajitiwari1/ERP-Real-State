import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function DateWiseBookingPage() {
  const [projectId, setProjectId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['date-wise-booking', projectId, fromDate, toDate], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const grouped: Record<string, { count: number; totalValue: number; units: string[] }> = {};
  (bookings as any[]).forEach((b: any) => {
    const date = b.bookingDate?.split('T')[0] || 'Unknown';
    if (!grouped[date]) grouped[date] = { count: 0, totalValue: 0, units: [] };
    grouped[date].count++;
    grouped[date].totalValue += Number(b.agreementValue || b.totalAmount || 0);
    grouped[date].units.push(b.Unit?.unitNumber || '-');
  });
  const rows = Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, d]) => ({ date, ...d }));

  return (
    <div>
      <PageHeader title="Date Wise Booking" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 flex-wrap items-end">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">From:</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="border rounded px-2 h-9 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">To:</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="border rounded px-2 h-9 text-sm" />
          </div>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Date Wise Booking ({rows.length} dates)</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Booking Date</th>
              <th className="px-3 py-2 text-right">No. of Bookings</th>
              <th className="px-3 py-2 text-right">Total Value (₹)</th>
              <th className="px-3 py-2 text-right">Avg. Value (₹)</th>
              <th className="px-3 py-2 text-left">Units</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.date} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.date}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600 font-bold">{r.count}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{r.totalValue.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{r.count > 0 ? Math.round(r.totalValue / r.count).toLocaleString('en-IN') : '-'}</td>
                  <td className="px-3 py-1.5 text-gray-600">{r.units.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
