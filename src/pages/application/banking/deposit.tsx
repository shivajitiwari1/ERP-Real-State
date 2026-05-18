import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  deposited: 'bg-blue-100 text-blue-700',
  cleared: 'bg-green-100 text-green-700',
  bounced: 'bg-red-100 text-red-700',
  represented: 'bg-purple-100 text-purple-700',
};

export default function ChequePage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: cheques = [], isLoading } = useQuery({
    queryKey: ['cheques', selectedProject, statusFilter],
    queryFn: () => axios.get(`/api/application/banking/cheques?projectId=${selectedProject}&status=${statusFilter}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status, date }: { id: number; status: string; date: string }) => {
      const data: any = { id, status };
      if (status === 'deposited') data.depositDate = date;
      if (status === 'cleared') data.clearDate = date;
      if (status === 'bounced') data.bounceDate = date;
      return axios.put('/api/application/banking/cheques', data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cheques'] }),
  });

  return (
    <div>
      <PageHeader title="Cheque Deposit / Status Management" />
      <div className="bg-white p-4 rounded border shadow-sm">
        <div className="flex gap-3 mb-4 flex-wrap">
          <select className="border rounded px-3 py-2 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="border rounded px-3 py-2 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="deposited">Deposited</option>
            <option value="cleared">Cleared</option>
            <option value="bounced">Bounced</option>
            <option value="represented">Represented</option>
          </select>
          <span className="text-xs text-gray-500 self-center">{(cheques as any[]).length} cheques</span>
        </div>
        <table className="w-full text-xs border-collapse">
          <thead><tr className="bg-purple-700 text-white">{['#','Cheque No.','Date','Bank','Customer','Amount','Status','Actions'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
          <tbody>{isLoading ? <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td></tr> : (cheques as any[]).map((c: any, i) => (
            <tr key={c.id} className={i%2===0?'bg-white':'bg-gray-50'}>
              <td className="px-2 py-2 text-gray-400">{i+1}</td>
              <td className="px-2 py-2 font-medium">{c.chequeNo}</td>
              <td className="px-2 py-2">{c.chequeDate}</td>
              <td className="px-2 py-2">{c.bankName} {c.branch ? `/ ${c.branch}` : ''}</td>
              <td className="px-2 py-2">{c.Receipt?.Booking?.Applicants?.[0]?.firstName} {c.Receipt?.Booking?.Applicants?.[0]?.lastName}</td>
              <td className="px-2 py-2 text-right">₹{Number(c.amount).toLocaleString('en-IN')}</td>
              <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[c.status]||'bg-gray-100'}`}>{c.status}</span></td>
              <td className="px-2 py-2 flex gap-1 flex-wrap">
                {c.status === 'pending' && <Button size="sm" className="h-6 text-xs px-2 bg-blue-600 hover:bg-blue-700" onClick={() => updateStatus.mutate({ id: c.id, status: 'deposited', date: new Date().toISOString().split('T')[0] })}>Deposit</Button>}
                {c.status === 'deposited' && <Button size="sm" className="h-6 text-xs px-2 bg-green-600 hover:bg-green-700" onClick={() => updateStatus.mutate({ id: c.id, status: 'cleared', date: new Date().toISOString().split('T')[0] })}>Clear</Button>}
                {c.status === 'deposited' && <Button size="sm" className="h-6 text-xs px-2 bg-red-600 hover:bg-red-700" onClick={() => updateStatus.mutate({ id: c.id, status: 'bounced', date: new Date().toISOString().split('T')[0] })}>Bounce</Button>}
                {c.status === 'bounced' && <Button size="sm" className="h-6 text-xs px-2 bg-purple-600 hover:bg-purple-700" onClick={() => updateStatus.mutate({ id: c.id, status: 'represented', date: new Date().toISOString().split('T')[0] })}>Represent</Button>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
