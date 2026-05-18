import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function PenaltyReportPage() {
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

  const penalties = (receipts as any[]).filter((r: any) => {
    if (r.receiptType !== 'penalty') return false;
    if (!from && !to) return true;
    const d = new Date(r.receiptDate);
    if (from && d < new Date(from)) return false;
    if (to && d > new Date(to)) return false;
    return true;
  });
  const total = penalties.reduce((s: number, r: any) => s + Number(r.totalAmount || 0), 0);

  return (
    <div>
      <PageHeader title="Penalty Payment Report" />
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
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{penalties.length}</div>
                <div className="text-xs text-gray-500 mt-1">Penalty Receipts</div>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-xl font-bold text-orange-600">₹{total.toLocaleString('en-IN')}</div>
                <div className="text-xs text-gray-500 mt-1">Total Penalty Collected</div>
              </div>
            </div>
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase flex justify-between">
                <span>Penalty Receipts ({penalties.length})</span>
                {penalties.length > 0 && <span>Total: ₹{total.toLocaleString('en-IN')}</span>}
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-3 py-2">S.No.</th>
                    <th className="px-3 py-2">Receipt No.</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Reg. No.</th>
                    <th className="px-3 py-2">Payment Mode</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr>
                  ) : penalties.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">No penalty receipts found</td></tr>
                  ) : penalties.map((r: any, i: number) => {
                    const a = r.Booking?.Applicants?.[0];
                    return (
                      <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2 font-medium">{r.receiptNo}</td>
                        <td className="px-3 py-2">{r.receiptDate ? new Date(r.receiptDate).toLocaleDateString('en-IN') : '—'}</td>
                        <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                        <td className="px-3 py-2">{r.Booking?.registrationNo || '—'}</td>
                        <td className="px-3 py-2 uppercase">{r.paymentMode}</td>
                        <td className="px-3 py-2 text-right font-semibold text-orange-600">₹{Number(r.totalAmount).toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
