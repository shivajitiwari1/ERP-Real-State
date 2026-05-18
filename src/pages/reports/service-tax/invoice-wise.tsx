import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

const GST = 0.18;

export default function InvoiceWisePage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: receipts = [], isLoading } = useQuery<any[]>({ queryKey: ['stax-invoice-wise', projectId], queryFn: () => axios.get(`/api/application/receipts/index${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  return (
    <div>
      <PageHeader title="Invoice Wise Tax Detail" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase tracking-wide">Invoice Wise Tax Detail ({(receipts as any[]).length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Receipt No.</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-right">Base (₹)</th>
              <th className="px-3 py-2 text-right">GST 18% (₹)</th>
              <th className="px-3 py-2 text-right">Total (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              (receipts as any[]).length === 0 ? <tr><td colSpan={8} className="text-center py-6 text-gray-400">No data found</td></tr> :
              (receipts as any[]).map((r: any, i: number) => {
                const amt = Number(r.amount || 0); const gst = amt * GST;
                return (
                  <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-1.5 text-blue-600">{r.receiptNo || '-'}</td>
                    <td className="px-3 py-1.5">{r.receiptDate?.split('T')[0] || '-'}</td>
                    <td className="px-3 py-1.5">{`${r.Booking?.Applicants?.[0]?.firstName || ''} ${r.Booking?.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                    <td className="px-3 py-1.5">{r.Booking?.Unit?.unitNumber || '-'}</td>
                    <td className="px-3 py-1.5 text-right text-green-600">{amt.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-1.5 text-right text-orange-600">{gst.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-1.5 text-right text-purple-600 font-bold">{(amt + gst).toLocaleString('en-IN')}</td>
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
