import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AgreementCancellationPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const [search, setSearch] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: agreements = [], isLoading } = useQuery({ queryKey: ['agreements-cancel', selectedProject], queryFn: () => axios.get(`/api/application/agreements?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const cancel = useMutation({
    mutationFn: (id: number) => axios.put('/api/application/agreements', { id, status: 'cancelled' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['agreements-cancel'] }); alert('Agreement cancelled.'); },
    onError: (e: any) => alert(e.response?.data?.message || 'Error'),
  });
  const filtered = (agreements as any[]).filter((a: any) => a.status !== 'cancelled' && (!search || (a.Booking?.Applicants?.[0]?.firstName + ' ' + a.Booking?.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase())));
  const STATUS_BADGE: Record<string,string> = { active: 'bg-green-100 text-green-700', registered: 'bg-blue-100 text-blue-700', cancelled: 'bg-red-100 text-red-700' };
  return (
    <div>
      <PageHeader title="Agreement Cancellation" subtitle="Cancel an executed agreement for a booking" />
      <div className="bg-white rounded border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex gap-3 flex-wrap">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer name..." className="border rounded px-3 h-9 text-sm flex-1 min-w-48" />
          <span className="text-xs text-gray-400 self-center">{filtered.length} active agreements</span>
        </div>
        <table className="w-full text-xs border-collapse">
          <thead><tr className="bg-slate-700 text-white">{['#','Customer','Booking','Agreement Type','Date','Status','Action'].map(h=><th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>{isLoading ? <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-gray-400 italic">No active agreements found</td></tr> : filtered.map((a: any, i) => (
            <tr key={a.id} className={i%2===0?'bg-white':'bg-gray-50'}>
              <td className="px-3 py-2 text-gray-400">{i+1}</td>
              <td className="px-3 py-2 font-medium">{a.Booking?.Applicants?.[0]?.firstName} {a.Booking?.Applicants?.[0]?.lastName}</td>
              <td className="px-3 py-2">{a.Booking?.registrationNo || a.bookingId}</td>
              <td className="px-3 py-2 capitalize">{a.agreementType}</td>
              <td className="px-3 py-2">{a.agreementDate}</td>
              <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-xs font-medium ${STATUS_BADGE[a.status]||'bg-gray-100'}`}>{a.status}</span></td>
              <td className="px-3 py-2">
                <Button size="sm" variant="destructive" className="h-6 text-xs px-2" onClick={() => { if (window.confirm('Cancel agreement for this customer?')) cancel.mutate(a.id); }} disabled={cancel.isPending}>Cancel</Button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
