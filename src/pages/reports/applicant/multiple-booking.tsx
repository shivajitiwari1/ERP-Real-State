import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function MultipleBookingPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['multiple-booking', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const byCustomer: Record<string, any[]> = {};
  (bookings as any[]).forEach((b: any) => {
    const key = b.Applicants?.[0]?.mobile || b.Applicants?.[0]?.email || 'unknown';
    if (!byCustomer[key]) byCustomer[key] = [];
    byCustomer[key].push(b);
  });
  const rows = Object.values(byCustomer).filter(arr => arr.length > 1).flatMap(arr =>
    arr.map((b: any) => ({ ...b, bookingCount: arr.length }))
  );

  return (
    <div>
      <PageHeader title="Multiple Booking" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {rows.length > 0 && <p className="mt-2 text-xs text-orange-600">{rows.length} booking(s) from customers with multiple units.</p>}
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Multiple Booking ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-800 text-white">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Mobile</th>
              <th className="px-3 py-2 text-left">Reg. No.</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-left">Tower</th>
              <th className="px-3 py-2 text-left">Booking Date</th>
              <th className="px-3 py-2 text-right">Agreement Value (₹)</th>
              <th className="px-3 py-2 text-center">Total Bookings</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={9} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={9} className="text-center py-6 text-gray-400">No customers with multiple bookings found</td></tr> :
              rows.map((b: any, i: number) => (
                <tr key={`${b.id}-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5">{`${b.Applicants?.[0]?.firstName || ''} ${b.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                  <td className="px-3 py-1.5">{b.Applicants?.[0]?.mobile || '-'}</td>
                  <td className="px-3 py-1.5 text-blue-600">{b.registrationNo || '-'}</td>
                  <td className="px-3 py-1.5">{b.Unit?.unitNumber || '-'}</td>
                  <td className="px-3 py-1.5">{b.Unit?.Tower?.name || '-'}</td>
                  <td className="px-3 py-1.5">{b.bookingDate?.split('T')[0] || '-'}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{Number(b.agreementValue || b.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-center"><span className="px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700 font-bold">{b.bookingCount}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
