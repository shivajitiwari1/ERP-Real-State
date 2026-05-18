import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function NOCPaymentDetailsPage() {
  const [payments, setPayments] = useState<Record<string, { amount: string; mode: string }>>({});
  const { data: nocs = [], isLoading } = useQuery<any[]>({ queryKey: ['noc-list'], queryFn: () => axios.get('/api/possession/noc').then(r => r.data.data) });

  return (
    <div>
      <PageHeader title="NOC Add Payment Details" />
      <div className="space-y-4">
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">NOC Payment Details ({(nocs as any[]).length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">NOC No.</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Unit</th>
              <th className="px-3 py-2 text-left">Requested</th>
              <th className="px-3 py-2 text-right">Payment Amount (₹)</th>
              <th className="px-3 py-2 text-left">Payment Mode</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              (nocs as any[]).length === 0 ? <tr><td colSpan={8} className="text-center py-6 text-gray-400">No NOC requests found</td></tr> :
              (nocs as any[]).map((n: any, i: number) => (
                <tr key={n.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 text-blue-600">{n.nocNo || n.id || '-'}</td>
                  <td className="px-3 py-1.5">{`${n.Booking?.Applicants?.[0]?.firstName || ''} ${n.Booking?.Applicants?.[0]?.lastName || ''}`.trim() || '-'}</td>
                  <td className="px-3 py-1.5">{n.Booking?.Unit?.unitNumber || '-'}</td>
                  <td className="px-3 py-1.5">{n.requestDate?.split('T')[0] || '-'}</td>
                  <td className="px-3 py-1.5 text-right">
                    <input type="number" value={payments[n.id]?.amount || ''} onChange={e => setPayments(p => ({...p, [n.id]: {...(p[n.id]||{}), amount: e.target.value}}))} placeholder="0" className="border rounded px-1 h-7 text-xs w-24 text-right" />
                  </td>
                  <td className="px-3 py-1.5">
                    <select value={payments[n.id]?.mode || ''} onChange={e => setPayments(p => ({...p, [n.id]: {...(p[n.id]||{}), mode: e.target.value}}))} className="border rounded px-1 h-7 text-xs">
                      <option value="">Select</option>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                      <option value="online">Online</option>
                    </select>
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
