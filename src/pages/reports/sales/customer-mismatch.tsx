import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function CustomerMismatchPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading: loadingB } = useQuery<any[]>({ queryKey: ['mismatch-bookings', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });
  const { data: receipts = [], isLoading: loadingR } = useQuery<any[]>({ queryKey: ['mismatch-receipts', projectId], queryFn: () => axios.get(`/api/application/receipts/index${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const receiptByBooking: Record<string, number> = {};
  (receipts as any[]).forEach((r: any) => {
    const bid = r.bookingId || r.Booking?.id;
    if (bid) receiptByBooking[bid] = (receiptByBooking[bid] || 0) + Number(r.totalAmount || r.amount || 0);
  });

  const mismatches = (bookings as any[]).filter((b: any) => {
    const agreed = Number(b.agreementValue || b.totalAmount || 0);
    const collected = receiptByBooking[b.id] || 0;
    return Math.abs(agreed - collected) > 1;
  }).map((b: any) => ({ ...b, collected: receiptByBooking[b.id] || 0, diff: Number(b.agreementValue || b.totalAmount || 0) - (receiptByBooking[b.id] || 0) }));

  const isLoading = loadingB || loadingR;

  return (
    <div>
      <PageHeader title="Customer Mismatch" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {mismatches.length > 0 && <span className="text-xs text-red-600 ml-auto">{mismatches.length} mismatch(es) found</span>}
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Customer Mismatch ({mismatches.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-800 text-white">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Reg. No.</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-right">Booking Amount (₹)</th>
              <th className="px-3 py-2 text-right">Total Receipts (₹)</th>
              <th className="px-3 py-2 text-right">Difference (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              mismatches.length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">No mismatches found</td></tr> :
              mismatches.map((b: any, i: number) => (
                <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 text-blue-600">{b.registrationNo || '-'}</td>
                  <td className="px-3 py-1.5">{`${b.Applicants?.[0]?.firstName || ''} ${b.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                  <td className="px-3 py-1.5">{b.Unit?.unitNumber || '-'}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{Number(b.agreementValue || b.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{b.collected.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right font-bold" style={{ color: b.diff > 0 ? '#dc2626' : '#16a34a' }}>{Math.abs(b.diff).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
