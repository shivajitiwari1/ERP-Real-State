import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function VerifyChequeStatusPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const queryClient = useQueryClient();
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: cheques = [], isLoading } = useQuery<any[]>({
    queryKey: ['cheques', selectedProject, 'pending'],
    queryFn: () => axios.get(`/api/application/banking/cheques?status=pending&projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; status: string; depositDate: string }) => axios.put('/api/application/banking/cheques', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cheques'] }),
  });

  return (
    <div>
      <PageHeader title="Verify Cheque Status" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {!selectedProject && <span className="text-xs text-gray-400">Select a project to verify pending cheques</span>}
        </div>
        {selectedProject && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
              Pending Cheques ({(cheques as any[]).length})
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Cheque No.</th>
                  <th className="px-3 py-2">Cheque Date</th>
                  <th className="px-3 py-2">Bank</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Reg. No.</th>
                  <th className="px-3 py-2 text-right">Receipt Amount</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr>
                ) : (cheques as any[]).length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-6 text-gray-400 italic">No pending cheques</td></tr>
                ) : (cheques as any[]).map((c: any, i: number) => {
                  const a = c.Receipt?.Booking?.Applicants?.[0];
                  return (
                    <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{c.chequeNo}</td>
                      <td className="px-3 py-2">{c.chequeDate ? new Date(c.chequeDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2">{c.bankName}</td>
                      <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                      <td className="px-3 py-2">{c.Receipt?.Booking?.registrationNo || '—'}</td>
                      <td className="px-3 py-2 text-right font-semibold">₹{Number(c.Receipt?.totalAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateMutation.mutate({ id: c.id, status: 'deposited', depositDate: new Date().toISOString().split('T')[0] })}
                            className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-semibold hover:bg-blue-700"
                          >
                            Deposit
                          </button>
                          <button
                            onClick={() => updateMutation.mutate({ id: c.id, status: 'cleared', depositDate: new Date().toISOString().split('T')[0] })}
                            className="px-2 py-0.5 bg-green-600 text-white rounded text-[10px] font-semibold hover:bg-green-700"
                          >
                            Clear
                          </button>
                        </div>
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
