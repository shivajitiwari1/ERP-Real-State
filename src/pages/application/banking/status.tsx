import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  deposited: 'bg-blue-100 text-blue-700',
  cleared: 'bg-green-100 text-green-700',
  bounced: 'bg-red-100 text-red-700',
  represented: 'bg-purple-100 text-purple-700',
};

export default function VerifyChequeStatusPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: cheques = [], isLoading } = useQuery({
    queryKey: ['cheques-status', selectedProject, statusFilter],
    queryFn: () => axios.get(`/api/application/banking/cheques?projectId=${selectedProject}&status=${statusFilter}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });
  const filtered = (cheques as any[]).filter((c: any) => !search || c.chequeNo?.toLowerCase().includes(search.toLowerCase()) || (c.Receipt?.Booking?.Applicants?.[0]?.firstName + ' ' + c.Receipt?.Booking?.Applicants?.[0]?.lastName).toLowerCase().includes(search.toLowerCase()));
  const stats = { total: (cheques as any[]).length, cleared: (cheques as any[]).filter((c: any) => c.status === 'cleared').length, pending: (cheques as any[]).filter((c: any) => c.status === 'pending').length, bounced: (cheques as any[]).filter((c: any) => c.status === 'bounced').length };
  return (
    <div>
      <PageHeader title="Verify Cheque Status" subtitle="View cheque status across all payment modes" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm flex gap-3 flex-wrap items-center">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-48">
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded px-2 h-9 text-sm">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="deposited">Deposited</option>
            <option value="cleared">Cleared</option>
            <option value="bounced">Bounced</option>
            <option value="represented">Represented</option>
          </select>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cheque no. or customer..." className="border rounded px-3 h-9 text-sm flex-1 min-w-48" />
        </div>
        {selectedProject && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[{l:'Total',v:stats.total,cls:'bg-slate-50'},{l:'Cleared',v:stats.cleared,cls:'bg-green-50'},{l:'Pending',v:stats.pending,cls:'bg-yellow-50'},{l:'Bounced',v:stats.bounced,cls:'bg-red-50'}].map(s=>(
              <div key={s.l} className={`${s.cls} rounded border p-3 text-center`}>
                <div className="text-lg font-bold text-slate-700">{s.v}</div>
                <div className="text-xs text-gray-400 uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        )}
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{['#','Cheque No.','Date','Bank/Branch','Customer','Amount','Status','Dates'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td></tr> : filtered.length === 0 ? <tr><td colSpan={8} className="text-center py-8 text-gray-400 italic">No cheques found</td></tr> : filtered.map((c: any, i) => (
              <tr key={c.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2 font-medium font-mono">{c.chequeNo}</td>
                <td className="px-2 py-2">{c.chequeDate}</td>
                <td className="px-2 py-2">{c.bankName}{c.branch ? ` / ${c.branch}` : ''}</td>
                <td className="px-2 py-2">{c.Receipt?.Booking?.Applicants?.[0]?.firstName} {c.Receipt?.Booking?.Applicants?.[0]?.lastName}</td>
                <td className="px-2 py-2 font-semibold text-right">Rs.{Number(c.amount).toLocaleString('en-IN')}</td>
                <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[c.status]||'bg-gray-100'}`}>{c.status}</span></td>
                <td className="px-2 py-2 text-gray-400">{c.depositDate||c.clearDate||c.bounceDate||'-'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
