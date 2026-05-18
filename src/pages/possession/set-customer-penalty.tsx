import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function SetCustomerPenaltyPage() {
  const [projectId, setProjectId] = useState('');
  const [penalties, setPenalties] = useState<Record<string, string>>({});
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['penalty-bookings', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  return (
    <div>
      <PageHeader title="Set Customer Wise Penalty" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Set Customer Wise Penalty ({(bookings as any[]).length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Reg. No.</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-right">Agreement Value (₹)</th>
              <th className="px-3 py-2 text-right">Penalty Amount (₹)</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              (bookings as any[]).length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">No data found</td></tr> :
              (bookings as any[]).map((b: any, i: number) => (
                <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 text-blue-600">{b.registrationNo || '-'}</td>
                  <td className="px-3 py-1.5">{`${b.Applicants?.[0]?.firstName || ''} ${b.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                  <td className="px-3 py-1.5">{b.Unit?.unitNumber || '-'}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{Number(b.agreementValue || b.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right">
                    <input type="number" value={penalties[b.id] || ''} onChange={e => setPenalties(p => ({...p, [b.id]: e.target.value}))} placeholder="0" className="border rounded px-1 h-7 text-xs w-24 text-right" />
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <button className="bg-purple-700 text-white px-2 py-0.5 rounded text-xs hover:bg-purple-800">Save</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
