import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function ReceiptWiseCollectionPage() {
  const [projectId, setProjectId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: receipts = [], isLoading } = useQuery<any[]>({ queryKey: ['receipt-wise', projectId, fromDate, toDate], queryFn: () => axios.get(`/api/application/receipts/index${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  let running = 0;
  const rows = (receipts as any[]).map((r: any) => { running += Number(r.totalAmount || r.amount || 0); return { ...r, running }; });
  const grandTotal = rows.length > 0 ? rows[rows.length - 1]?.running || 0 : 0;

  return (
    <div>
      <PageHeader title="Receipt Wise Collection" />
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
          {grandTotal > 0 && <span className="text-sm font-semibold text-green-700 ml-auto">Grand Total: ₹{grandTotal.toLocaleString('en-IN')}</span>}
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Receipt Wise Collection ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-800 text-white">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Receipt No.</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-left">Mode</th>
              <th className="px-3 py-2 text-right">Amount (₹)</th>
              <th className="px-3 py-2 text-right">Penalty (₹)</th>
              <th className="px-3 py-2 text-right">Total (₹)</th>
              <th className="px-3 py-2 text-right">Running Total (₹)</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={10} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={10} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r: any, i: number) => (
                <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 text-blue-600">{r.receiptNo || '-'}</td>
                  <td className="px-3 py-1.5">{r.receiptDate?.split('T')[0] || '-'}</td>
                  <td className="px-3 py-1.5">{`${r.Booking?.Applicants?.[0]?.firstName || ''} ${r.Booking?.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                  <td className="px-3 py-1.5">{r.Booking?.Unit?.unitNumber || '-'}</td>
                  <td className="px-3 py-1.5">{r.paymentMode || '-'}</td>
                  <td className="px-3 py-1.5 text-right text-blue-600">{Number(r.amount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-purple-600">{Number(r.penaltyAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right text-green-600">{Number(r.totalAmount || r.amount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-1.5 text-right font-semibold text-green-700">{Number(r.running || 0).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
