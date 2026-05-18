import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function CustomerDuesDetailPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['customer-dues-detail', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  return (
    <div>
      <PageHeader title="Customer Dues Detail" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Customer Dues Detail ({(demands as any[]).length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Reg. No.</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-left">Tower</th>
              <th className="px-3 py-2 text-left">Stage</th>
              <th className="px-3 py-2 text-left">Due Date</th>
              <th className="px-3 py-2 text-right">Amount (₹)</th>
              <th className="px-3 py-2 text-right">Paid (₹)</th>
              <th className="px-3 py-2 text-right">Pending (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={10} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              (demands as any[]).length === 0 ? <tr><td colSpan={10} className="text-center py-6 text-gray-400">No data found</td></tr> :
              (demands as any[]).map((d: any, i: number) => {
                const amt = Number(d.totalAmount || d.amount || 0);
                const paid = Number(d.paidAmount || 0);
                const pending = Number(d.pendingAmount || amt - paid);
                return (
                  <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-1.5 text-blue-600">{d.Booking?.registrationNo || '-'}</td>
                    <td className="px-3 py-1.5">{`${d.Booking?.Applicants?.[0]?.firstName || ''} ${d.Booking?.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                    <td className="px-3 py-1.5">{d.Booking?.Unit?.unitNumber || '-'}</td>
                    <td className="px-3 py-1.5">{d.Booking?.Unit?.Tower?.name || '-'}</td>
                    <td className="px-3 py-1.5">{d.PaymentStage?.name || d.demandType || '-'}</td>
                    <td className="px-3 py-1.5">{d.dueDate?.split('T')[0] || '-'}</td>
                    <td className="px-3 py-1.5 text-right text-green-600">{amt.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-1.5 text-right text-purple-600">{paid.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-1.5 text-right text-red-600 font-semibold">{pending.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
