import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function GraceInstallmentWisePage() {
  const [projectId, setProjectId] = useState('');
  const [graceDays, setGraceDays] = useState(30);
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['demands', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });
  const interestRate = 0.18;
  const withGrace = (demands as any[]).filter((d: any) => d.dueDate).map((d: any) => {
    const days = Math.floor((Date.now() - new Date(d.dueDate).getTime()) / 86400000);
    const effectiveDays = Math.max(0, days - graceDays);
    const interest = effectiveDays > 0 ? (Number(d.totalAmount) * interestRate * effectiveDays) / 365 : 0;
    return { ...d, daysOverdue: days, effectiveDays, interest: Math.round(interest) };
  }).filter((d: any) => d.daysOverdue > 0 && d.status !== 'settled');

  return (
    <div>
      <PageHeader title="Installment Wise Grace Period" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center flex-wrap">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <label className="text-xs text-gray-600 flex items-center gap-1">
            Grace Days:
            <input type="number" value={graceDays} onChange={e => setGraceDays(Number(e.target.value))} className="border rounded px-2 h-9 text-sm w-20 ml-1" min="0" max="365" />
          </label>
          <div className="text-xs text-blue-600 font-medium">18% p.a. after grace period</div>
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Installment Wise Grace Period ({withGrace.length} overdue)</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-blue-900 text-white"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Installment</th><th className="px-3 py-2">Principal (₹)</th><th className="px-3 py-2">Due Date</th><th className="px-3 py-2">Days Overdue</th><th className="px-3 py-2">Grace Days</th><th className="px-3 py-2">Effective Days</th><th className="px-3 py-2">Interest (₹)</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={9} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                withGrace.length === 0 ? <tr><td colSpan={9} className="text-center py-6 text-gray-400 italic">No overdue demands found</td></tr> :
                withGrace.map((d: any, i: number) => (
                  <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{d.Booking?.registrationNo || '—'}</td>
                    <td className="px-3 py-2 text-gray-600">{d.installmentLabel || d.installmentNo || '—'}</td>
                    <td className="px-3 py-2">₹{Number(d.totalAmount).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2">{new Date(d.dueDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-3 py-2 text-red-600 font-semibold">{d.daysOverdue}</td>
                    <td className="px-3 py-2 text-blue-600">{graceDays}</td>
                    <td className="px-3 py-2 text-purple-600 font-semibold">{d.effectiveDays}</td>
                    <td className="px-3 py-2 text-orange-600 font-semibold">₹{d.interest.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              {withGrace.length > 0 && <tfoot><tr className="bg-slate-100 font-bold"><td colSpan={3} className="px-3 py-2">Total</td><td className="px-3 py-2">₹{withGrace.reduce((s: number, d: any) => s + Number(d.totalAmount), 0).toLocaleString('en-IN')}</td><td colSpan={4}></td><td className="px-3 py-2 text-orange-600">₹{withGrace.reduce((s: number, d: any) => s + d.interest, 0).toLocaleString('en-IN')}</td></tr></tfoot>}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
