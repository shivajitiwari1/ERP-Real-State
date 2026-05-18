import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function EmailNotificationPage() {
  const [projectId, setProjectId] = useState('');
  const [sent, setSent] = useState<Set<string>>(new Set());
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: demands = [], isLoading } = useQuery<any[]>({ queryKey: ['demands', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });

  const pending = (demands as any[]).filter((d: any) => d.status !== 'settled');

  const handleSend = (id: string) => setSent(prev => new Set(Array.from(prev).concat(id)));

  return (
    <div>
      <PageHeader title="Email Notification" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <span className="text-xs text-gray-500">{sent.size} email(s) sent this session</span>
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Email Notification ({pending.length} pending demands)</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-blue-900 text-white"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Customer</th><th className="px-3 py-2">Amount (₹)</th><th className="px-3 py-2">Due Date</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Action</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                pending.length === 0 ? <tr><td colSpan={8} className="text-center py-6 text-gray-400 italic">No pending demands</td></tr> :
                pending.map((d: any, i: number) => {
                  const email = d.Booking?.Applicants?.[0]?.email || '';
                  const isSent = sent.has(String(d.id));
                  return (
                    <tr key={d.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{d.Booking?.registrationNo || '—'}</td>
                      <td className="px-3 py-2">{`${d.Booking?.Applicants?.[0]?.firstName || ''} ${d.Booking?.Applicants?.[0]?.lastName || ''}`.trim() || '—'}</td>
                      <td className="px-3 py-2">₹{Number(d.totalAmount).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2">{d.dueDate ? new Date(d.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-xs ${d.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{d.status}</span></td>
                      <td className="px-3 py-2 text-gray-500">{email || <span className="text-red-400">No email</span>}</td>
                      <td className="px-3 py-2">{isSent ? <span className="text-green-600 text-xs font-medium">Sent</span> : <button disabled={!email} onClick={() => handleSend(String(d.id))} className="px-2 py-1 bg-indigo-700 text-white rounded text-xs hover:bg-indigo-800 disabled:opacity-40">Send Email</button>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
