import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function CumulativeReceiptPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: receipts = [], isLoading } = useQuery<any[]>({
    queryKey: ['receipts', selectedProject],
    queryFn: () => axios.get(`/api/application/receipts?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });

  const filtered = (receipts as any[]).filter((r: any) => {
    if (!from && !to) return true;
    const d = new Date(r.receiptDate);
    if (from && d < new Date(from)) return false;
    if (to && d > new Date(to)) return false;
    return true;
  });

  // Cumulative by month
  const monthly: Record<string, { count: number; total: number }> = {};
  let runningTotal = 0;
  const sortedFiltered = [...filtered].sort((a, b) => new Date(a.receiptDate).getTime() - new Date(b.receiptDate).getTime());
  sortedFiltered.forEach((r: any) => {
    const d = new Date(r.receiptDate);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!monthly[key]) monthly[key] = { count: 0, total: 0 };
    monthly[key].count++;
    monthly[key].total += Number(r.totalAmount || 0);
  });

  const grandTotal = filtered.reduce((s: number, r: any) => s + Number(r.totalAmount || 0), 0);

  return (
    <div>
      <PageHeader title="Cumulative Receipt Book" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex flex-wrap gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <label className="text-xs text-gray-500">From:</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border rounded px-2 h-9 text-sm" />
          <label className="text-xs text-gray-500">To:</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border rounded px-2 h-9 text-sm" />
        </div>
        {selectedProject && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-slate-700">{filtered.length}</div>
                <div className="text-xs text-gray-500 mt-1">Total Receipts</div>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-xl font-bold text-green-600">₹{grandTotal.toLocaleString('en-IN')}</div>
                <div className="text-xs text-gray-500 mt-1">Total Amount</div>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{Object.keys(monthly).length}</div>
                <div className="text-xs text-gray-500 mt-1">Months</div>
              </div>
            </div>
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
                Cumulative Month-wise Summary
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-3 py-2">S.No.</th>
                    <th className="px-3 py-2">Month</th>
                    <th className="px-3 py-2 text-center">Receipts</th>
                    <th className="px-3 py-2 text-right">Month Total</th>
                    <th className="px-3 py-2 text-right">Cumulative Total</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={5} className="text-center py-6 text-gray-400">Loading...</td></tr>
                  ) : Object.keys(monthly).length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-6 text-gray-400 italic">No receipt data found</td></tr>
                  ) : (() => {
                    let cum = 0;
                    return Object.entries(monthly).map(([month, { count, total }], i) => {
                      cum += total;
                      const [year, mon] = month.split('-');
                      const label = new Date(Number(year), Number(mon) - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
                      return (
                        <tr key={month} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                          <td className="px-3 py-2 font-medium">{label}</td>
                          <td className="px-3 py-2 text-center">{count}</td>
                          <td className="px-3 py-2 text-right">₹{total.toLocaleString('en-IN')}</td>
                          <td className="px-3 py-2 text-right font-semibold text-blue-700">₹{cum.toLocaleString('en-IN')}</td>
                        </tr>
                      );
                    });
                  })()}
                  {Object.keys(monthly).length > 0 && (
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={2} className="px-3 py-2">Grand Total</td>
                      <td className="px-3 py-2 text-center">{filtered.length}</td>
                      <td className="px-3 py-2 text-right">₹{grandTotal.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2 text-right text-blue-700">₹{grandTotal.toLocaleString('en-IN')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
