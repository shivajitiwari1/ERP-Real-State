import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

const STATUS_OPTIONS = ['pending', 'deposited', 'cleared', 'bounced', 'represented'];

export default function ChangeChequeStatusPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const queryClient = useQueryClient();
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: cheques = [], isLoading } = useQuery<any[]>({
    queryKey: ['cheques', selectedProject, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedProject) params.set('projectId', selectedProject);
      if (statusFilter) params.set('status', statusFilter);
      return axios.get(`/api/application/banking/cheques?${params}`).then(r => r.data.data);
    },
    enabled: !!selectedProject,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; status: string }) => axios.put('/api/application/banking/cheques', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cheques'] });
      setEditId(null);
    },
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    deposited: 'bg-blue-100 text-blue-700',
    cleared: 'bg-green-100 text-green-700',
    bounced: 'bg-red-100 text-red-700',
    represented: 'bg-purple-100 text-purple-700',
  };

  return (
    <div>
      <PageHeader title="Change Cheque Status" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex flex-wrap gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="border rounded px-3 h-9 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>
        {selectedProject && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
              Cheques ({(cheques as any[]).length})
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Cheque No.</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Bank</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2">Current Status</th>
                  <th className="px-3 py-2">Change To</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr>
                ) : (cheques as any[]).length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-6 text-gray-400 italic">No cheques found</td></tr>
                ) : (cheques as any[]).map((c: any, i: number) => {
                  const a = c.Receipt?.Booking?.Applicants?.[0];
                  return (
                    <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{c.chequeNo}</td>
                      <td className="px-3 py-2">{c.chequeDate ? new Date(c.chequeDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2">{c.bankName}</td>
                      <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                      <td className="px-3 py-2 text-right font-semibold">₹{Number(c.Receipt?.totalAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${statusColors[c.status] || 'bg-gray-100 text-gray-700'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {editId === c.id ? (
                          <div className="flex gap-1">
                            <select className="border rounded px-1 h-9 text-sm" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                              <option value="">Select</option>
                              {STATUS_OPTIONS.filter(s => s !== c.status).map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                            </select>
                            <button onClick={() => updateMutation.mutate({ id: c.id, status: newStatus })} disabled={!newStatus || updateMutation.isPending} className="px-2 py-0.5 bg-green-600 text-white rounded text-[10px] font-semibold hover:bg-green-700 disabled:opacity-40">Save</button>
                            <button onClick={() => setEditId(null)} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-[10px] font-semibold">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditId(c.id); setNewStatus(''); }} className="px-2 py-0.5 bg-orange-500 text-white rounded text-[10px] font-semibold hover:bg-orange-600">Change</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
