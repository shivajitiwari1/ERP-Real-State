import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function CustomerAlterationReportPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['alteration', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const altered = (bookings as any[]).filter((b: any) => b.hasAlteration || b.alterationDate || b.alterationAmount);

  return (
    <div>
      <PageHeader title="Customer Alteration Report" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Customer Alteration Report ({altered.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Reg. No.</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-left">Alteration Date</th>
              <th className="px-3 py-2 text-right">Alteration Amount (₹)</th>
              <th className="px-3 py-2 text-left">Remarks</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              altered.length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">No alteration records found</td></tr> :
              altered.map((b: any, i: number) => (
                <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 text-blue-600">{b.registrationNo || '-'}</td>
                  <td className="px-3 py-1.5">{`${b.Applicants?.[0]?.firstName || ''} ${b.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                  <td className="px-3 py-1.5">{b.Unit?.unitNumber || '-'}</td>
                  <td className="px-3 py-1.5">{b.alterationDate?.split('T')[0] || '-'}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{Number(b.alterationAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-gray-500">{b.alterationRemarks || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
