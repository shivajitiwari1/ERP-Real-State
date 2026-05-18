import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function ApplicantHistoryPage() {
  const [projectId, setProjectId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['appl-history', projectId, fromDate, toDate], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  return (
    <div>
      <PageHeader title="Applicant History" />
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
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Applicant History ({(bookings as any[]).length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Reg. No.</th>
              <th className="px-3 py-2 text-left">Booking Date</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Mobile</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-left">Tower</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-right">Agreement Value (₹)</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={10} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              (bookings as any[]).length === 0 ? <tr><td colSpan={10} className="text-center py-6 text-gray-400">No data found</td></tr> :
              (bookings as any[]).map((b: any, i: number) => (
                <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 text-blue-600">{b.registrationNo || '-'}</td>
                  <td className="px-3 py-1.5">{b.bookingDate?.split('T')[0] || '-'}</td>
                  <td className="px-3 py-1.5">{`${b.Applicants?.[0]?.firstName || ''} ${b.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                  <td className="px-3 py-1.5">{b.Applicants?.[0]?.mobile || '-'}</td>
                  <td className="px-3 py-1.5">{b.Unit?.unitNumber || '-'}</td>
                  <td className="px-3 py-1.5">{b.Unit?.Tower?.name || '-'}</td>
                  <td className="px-3 py-1.5">{b.Unit?.unitType || '-'}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{Number(b.agreementValue || b.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5"><span className={`px-1.5 py-0.5 rounded text-xs ${b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{b.status || 'active'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
