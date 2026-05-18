import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function InterestCustomerManualPage() {
  const [projectId, setProjectId] = useState('');
  const [manualRate, setManualRate] = useState('18');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['demands', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });
  const overdue = (demands as any[]).filter((d: any) => d.dueDate && new Date(d.dueDate) < new Date() && d.status !== 'settled');
  const rate = (parseFloat(manualRate) || 18) / 100;
  const withInterest = overdue.map((d: any) => {
    const days = Math.floor((Date.now() - new Date(d.dueDate).getTime()) / 86400000);
    const interest = (Number(d.totalAmount) * rate * days) / 365;
    return { ...d, daysOverdue: days, interest: Math.round(interest) };
  });

  return (
    <div>
      <PageHeader title="Manual Interest" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center flex-wrap">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <label className="text-xs text-gray-600 flex items-center gap-1">
            Manual Rate (%):
            <input type="number" value={manualRate} onChange={e => setManualRate(e.target.value)} className="border rounded px-2 h-9 text-sm w-20 ml-1" min="0" max="100" step="0.5" />
          </label>
          <span className="text-xs text-blue-600 font-medium">Applying {manualRate}% p.a.</span>
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Manual Interest ({withInterest.length} overdue)</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-blue-900 text-white"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Principal (₹)</th><th className="px-3 py-2">Due Date</th><th className="px-3 py-2">Days Overdue</th><th className="px-3 py-2">Interest (₹)</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                withInterest.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400 italic">No overdue demands found</td></tr> :
                withInterest.map((d: any, i: number) => (
                  <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{d.Booking?.registrationNo || '—'}</td>
                    <td className="px-3 py-2">₹{Number(d.totalAmount).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2">{new Date(d.dueDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-3 py-2 text-red-600 font-semibold">{d.daysOverdue}</td>
                    <td className="px-3 py-2 text-orange-600 font-semibold">₹{d.interest.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              {withInterest.length > 0 && <tfoot><tr className="bg-slate-100 font-bold"><td colSpan={2} className="px-3 py-2">Total</td><td className="px-3 py-2">₹{withInterest.reduce((s: number, d: any) => s + Number(d.totalAmount), 0).toLocaleString('en-IN')}</td><td colSpan={2}></td><td className="px-3 py-2 text-orange-600">₹{withInterest.reduce((s: number, d: any) => s + d.interest, 0).toLocaleString('en-IN')}</td></tr></tfoot>}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
