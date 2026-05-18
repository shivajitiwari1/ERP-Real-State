import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function InterestCustomerWaiverReportPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['demands', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });
  const overdue = (demands as any[]).filter((d: any) => d.dueDate && new Date(d.dueDate) < new Date() && d.status !== 'settled');
  const interestRate = 0.18;
  const withInterest = overdue.map((d: any) => {
    const days = Math.floor((Date.now() - new Date(d.dueDate).getTime()) / 86400000);
    const interest = (Number(d.totalAmount) * interestRate * days) / 365;
    const waiveOff = Math.round(interest * 0.5); // 50% waiver as example
    return { ...d, daysOverdue: days, interest: Math.round(interest), waiveOff, netInterest: Math.round(interest) - Math.round(interest * 0.5) };
  });

  return (
    <div>
      <PageHeader title="Customer Waiver Report" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="text-xs text-gray-500 self-center">Interest Rate: 18% p.a. | Sample 50% waiver applied</div>
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">Customer Waiver Report ({withInterest.length} overdue)</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-100"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Principal (₹)</th><th className="px-3 py-2">Due Date</th><th className="px-3 py-2">Days Overdue</th><th className="px-3 py-2">Gross Interest (₹)</th><th className="px-3 py-2">Waive Off (₹)</th><th className="px-3 py-2">Net Interest (₹)</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                withInterest.length === 0 ? <tr><td colSpan={8} className="text-center py-6 text-gray-400 italic">No overdue demands found</td></tr> :
                withInterest.map((d: any, i: number) => (
                  <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{d.Booking?.registrationNo || '—'}</td>
                    <td className="px-3 py-2">₹{Number(d.totalAmount).toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2">{new Date(d.dueDate).toLocaleDateString('en-IN')}</td>
                    <td className="px-3 py-2 text-red-600 font-semibold">{d.daysOverdue}</td>
                    <td className="px-3 py-2 text-orange-600">₹{d.interest.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 text-green-600">₹{d.waiveOff.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 text-blue-700 font-semibold">₹{d.netInterest.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              {withInterest.length > 0 && <tfoot><tr className="bg-slate-100 font-bold"><td colSpan={2} className="px-3 py-2">Total</td><td className="px-3 py-2">₹{withInterest.reduce((s: number, d: any) => s + Number(d.totalAmount), 0).toLocaleString('en-IN')}</td><td colSpan={2}></td><td className="px-3 py-2 text-orange-600">₹{withInterest.reduce((s: number, d: any) => s + d.interest, 0).toLocaleString('en-IN')}</td><td className="px-3 py-2 text-green-600">₹{withInterest.reduce((s: number, d: any) => s + d.waiveOff, 0).toLocaleString('en-IN')}</td><td className="px-3 py-2 text-blue-700">₹{withInterest.reduce((s: number, d: any) => s + d.netInterest, 0).toLocaleString('en-IN')}</td></tr></tfoot>}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
