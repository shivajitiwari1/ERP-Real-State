import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

export default function GracePeriodPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [search, setSearch] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery({ queryKey: ['demands-grace', selectedProject], queryFn: () => axios.get(`/api/application/demand/list?projectId=${selectedProject}&status=pending`).then(r => r.data.data), enabled: !!selectedProject });
  const overdue = (demands as any[]).filter((d: any) => d.dueDate && new Date(d.dueDate) < new Date());
  const filtered = overdue.filter((d: any) => !search || (d.Booking?.Applicants?.[0]?.firstName + ' ' + d.Booking?.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()));
  function getDaysOverdue(due: string) { return Math.max(0, Math.floor((Date.now() - new Date(due).getTime()) / 86400000)); }
  return (
    <div>
      <PageHeader title="Grace Period" subtitle="View overdue demands eligible for grace period extension" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer..." className="border rounded px-3 h-9 text-sm flex-1 min-w-48" />
          <span className="text-xs self-center text-red-500 font-medium">{filtered.length} overdue demands</span>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <div className="px-4 py-2.5 border-b bg-gradient-to-r from-slate-800 to-slate-700">
            <span className="text-xs font-bold uppercase text-slate-300">Overdue Demands</span>
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{['#','Customer','Reg. No.','Due Date','Days Overdue','Amount','Grace Action'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-400 italic">No overdue demands{selectedProject ? '' : ' — select a project first'}</td></tr> : filtered.map((d: any, i) => {
              const days = getDaysOverdue(d.dueDate);
              return (
                <tr key={d.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                  <td className="px-2 py-2 text-gray-400">{i+1}</td>
                  <td className="px-2 py-2 font-medium">{d.Booking?.Applicants?.[0]?.firstName} {d.Booking?.Applicants?.[0]?.lastName}</td>
                  <td className="px-2 py-2">{d.Booking?.registrationNo || d.bookingId}</td>
                  <td className="px-2 py-2 text-red-500">{d.dueDate}</td>
                  <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded font-bold ${days > 30 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{days}d</span></td>
                  <td className="px-2 py-2 font-semibold">Rs.{Number(d.totalAmount).toLocaleString('en-IN')}</td>
                  <td className="px-2 py-2"><Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => alert('Grace period extension: feature requires approval workflow configuration.')}>Extend Grace</Button></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
