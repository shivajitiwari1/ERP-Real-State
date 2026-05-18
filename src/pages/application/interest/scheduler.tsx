import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';

const INTEREST_SLABS = [
  { days: '0-30', rate: '0%', label: 'No Interest' },
  { days: '31-60', rate: '12% p.a.', label: 'Simple Interest' },
  { days: '61-90', rate: '15% p.a.', label: 'Simple Interest' },
  { days: '91-180', rate: '18% p.a.', label: 'Compound Quarterly' },
  { days: '181+', rate: '24% p.a.', label: 'Compound Monthly' },
];

export default function InterestSchedulerPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery({ queryKey: ['demands-sched', selectedProject], queryFn: () => axios.get(`/api/application/demand/list?projectId=${selectedProject}&status=pending`).then(r => r.data.data), enabled: !!selectedProject });
  const overdue = (demands as any[]).filter((d: any) => d.dueDate && new Date(d.dueDate) < new Date());
  function calcInterest(amount: number, due: string) {
    const days = Math.floor((Date.now() - new Date(due).getTime()) / 86400000);
    if (days <= 30) return 0;
    const rate = days <= 60 ? 0.12 : days <= 90 ? 0.15 : days <= 180 ? 0.18 : 0.24;
    return Math.round(amount * rate * (days / 365));
  }
  const totalInterest = overdue.reduce((sum, d: any) => sum + calcInterest(Number(d.totalAmount), d.dueDate), 0);
  return (
    <div>
      <PageHeader title="Interest Scheduler" subtitle="Auto-calculate interest liability on overdue demands" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded border shadow-sm flex gap-3 items-center flex-wrap">
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            {selectedProject && <span className="text-xs text-gray-500">{overdue.length} overdue · Total interest: <strong className="text-red-600">Rs.{totalInterest.toLocaleString('en-IN')}</strong></span>}
          </div>
          <div className="bg-white rounded border shadow-sm overflow-auto">
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-purple-700 text-white">{['#','Customer','Due Date','Days Overdue','Principal (Rs.)','Interest (Rs.)','Rate'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
              <tbody>{isLoading ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr> : overdue.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-400 italic">No overdue demands{selectedProject?'':' — select a project'}</td></tr> : overdue.map((d: any, i) => {
                const days = Math.floor((Date.now() - new Date(d.dueDate).getTime()) / 86400000);
                const interest = calcInterest(Number(d.totalAmount), d.dueDate);
                const rate = days <= 30 ? '0%' : days <= 60 ? '12% p.a.' : days <= 90 ? '15% p.a.' : days <= 180 ? '18% p.a.' : '24% p.a.';
                return (
                  <tr key={d.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                    <td className="px-2 py-2 text-gray-400">{i+1}</td>
                    <td className="px-2 py-2 font-medium">{d.Booking?.Applicants?.[0]?.firstName} {d.Booking?.Applicants?.[0]?.lastName}</td>
                    <td className="px-2 py-2 text-red-500">{d.dueDate}</td>
                    <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded font-bold ${days > 60 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{days}d</span></td>
                    <td className="px-2 py-2">Rs.{Number(d.totalAmount).toLocaleString('en-IN')}</td>
                    <td className="px-2 py-2 font-semibold text-red-600">Rs.{interest.toLocaleString('en-IN')}</td>
                    <td className="px-2 py-2 text-orange-600 font-medium">{rate}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Interest Slabs</h3>
          <div className="space-y-2">
            {INTEREST_SLABS.map(s => (
              <div key={s.days} className="flex justify-between items-center p-2 bg-slate-50 rounded border text-xs">
                <div><div className="font-medium text-slate-700">{s.days} days overdue</div><div className="text-gray-400">{s.label}</div></div>
                <span className="font-bold text-orange-600">{s.rate}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 italic">Slabs are indicative. Configure as per project agreement terms.</p>
        </div>
      </div>
    </div>
  );
}
