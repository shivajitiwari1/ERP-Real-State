import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function InterestCustomerWisePage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['demands', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });
  const overdue = (demands as any[]).filter((d: any) => d.dueDate && new Date(d.dueDate) < new Date() && d.status !== 'settled');
  const interestRate = 0.18;
  const withInterest = overdue.map((d: any) => {
    const days = Math.floor((Date.now() - new Date(d.dueDate).getTime()) / 86400000);
    const interest = (Number(d.totalAmount) * interestRate * days) / 365;
    return { ...d, daysOverdue: days, interest: Math.round(interest) };
  });
  const byCustomer: Record<string, any> = {};
  withInterest.forEach((d: any) => {
    const key = String(d.bookingId || 'unknown');
    if (!byCustomer[key]) byCustomer[key] = { regNo: d.Booking?.registrationNo || '—', customer: `${d.Booking?.Applicants?.[0]?.firstName || ''} ${d.Booking?.Applicants?.[0]?.lastName || ''}`.trim() || '—', count: 0, totalPrincipal: 0, totalInterest: 0 };
    byCustomer[key].count++;
    byCustomer[key].totalPrincipal += Number(d.totalAmount);
    byCustomer[key].totalInterest += d.interest;
  });
  const rows = Object.values(byCustomer);

  return (
    <div>
      <PageHeader title="Customer Interest Master" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="text-xs text-gray-500 self-center">Interest Rate: 18% p.a.</div>
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">Customer Interest Master ({rows.length} customers)</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-100"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Customer Name</th><th className="px-3 py-2">Overdue Demands</th><th className="px-3 py-2">Total Principal (₹)</th><th className="px-3 py-2">Total Interest (₹)</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                rows.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400 italic">No overdue demands found</td></tr> :
                rows.map((r: any, i: number) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{r.regNo}</td>
                    <td className="px-3 py-2">{r.customer}</td>
                    <td className="px-3 py-2 text-center">{r.count}</td>
                    <td className="px-3 py-2">₹{r.totalPrincipal.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-2 text-orange-600 font-semibold">₹{r.totalInterest.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              {rows.length > 0 && <tfoot><tr className="bg-slate-100 font-bold"><td colSpan={4} className="px-3 py-2">Total</td><td className="px-3 py-2">₹{rows.reduce((s: number, r: any) => s + r.totalPrincipal, 0).toLocaleString('en-IN')}</td><td className="px-3 py-2 text-orange-600">₹{rows.reduce((s: number, r: any) => s + r.totalInterest, 0).toLocaleString('en-IN')}</td></tr></tfoot>}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
