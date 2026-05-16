import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';

export default function InterestWaiverPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [search, setSearch] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery({ queryKey: ['demands-waiver', selectedProject], queryFn: () => axios.get(`/api/application/demand/list?projectId=${selectedProject}&status=pending`).then(r => r.data.data), enabled: !!selectedProject });
  const overdue = (demands as any[]).filter((d: any) => d.dueDate && new Date(d.dueDate) < new Date() && Math.floor((Date.now() - new Date(d.dueDate).getTime()) / 86400000) > 30);
  const filtered = overdue.filter((d: any) => !search || (d.Booking?.Applicants?.[0]?.firstName + ' ' + d.Booking?.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()));
  function calcInterest(amount: number, due: string) {
    const days = Math.floor((Date.now() - new Date(due).getTime()) / 86400000);
    const rate = days <= 60 ? 0.12 : days <= 90 ? 0.15 : days <= 180 ? 0.18 : 0.24;
    return Math.round(amount * rate * (days / 365));
  }
  return (
    <div>
      <PageHeader title="Interest Waiver" subtitle="Apply interest waiver to eligible overdue accounts" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap items-center">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer..." className="border rounded px-3 h-9 text-sm flex-1 min-w-48" />
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-700">
          <strong>Note:</strong> Interest waiver requires management approval. Waivers will be logged against the account. Only accounts with 31+ days overdue are shown.
        </div>
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{['#','Customer','Reg. No.','Due Date','Days Overdue','Principal','Interest','Waiver'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={8} className="text-center py-8 text-gray-400 italic">No eligible accounts{selectedProject?'':' — select a project'}</td></tr> : filtered.map((d: any, i) => {
              const days = Math.floor((Date.now() - new Date(d.dueDate).getTime()) / 86400000);
              const interest = calcInterest(Number(d.totalAmount), d.dueDate);
              return (
                <tr key={d.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                  <td className="px-2 py-2 text-gray-400">{i+1}</td>
                  <td className="px-2 py-2 font-medium">{d.Booking?.Applicants?.[0]?.firstName} {d.Booking?.Applicants?.[0]?.lastName}</td>
                  <td className="px-2 py-2">{d.Booking?.registrationNo || d.bookingId}</td>
                  <td className="px-2 py-2 text-red-500">{d.dueDate}</td>
                  <td className="px-2 py-2"><span className="px-1.5 py-0.5 rounded font-bold bg-red-100 text-red-700">{days}d</span></td>
                  <td className="px-2 py-2">Rs.{Number(d.totalAmount).toLocaleString('en-IN')}</td>
                  <td className="px-2 py-2 font-semibold text-red-600">Rs.{interest.toLocaleString('en-IN')}</td>
                  <td className="px-2 py-2"><Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => alert('Interest waiver submitted for approval. Management will review the request.')}>Request Waiver</Button></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
