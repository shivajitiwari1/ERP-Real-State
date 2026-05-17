import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function TransferAfterRegistryPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const queryClient = useQueryClient();
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: transfers = [], isLoading } = useQuery<any[]>({
    queryKey: ['transfers', selectedProject, 'pending'],
    queryFn: () => axios.get(`/api/application/transfer?projectId=${selectedProject}&status=pending`).then(r => r.data.data),
    enabled: !!selectedProject,
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) => axios.put('/api/application/transfer', { id, status: 'completed' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transfers'] }),
  });

  return (
    <div>
      <PageHeader title="Transfer After Registry" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {!selectedProject && <span className="text-xs text-gray-400">Select a project to view pending post-registry transfers</span>}
        </div>
        {selectedProject && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">
              Pending Post-Registry Transfers ({(transfers as any[]).length})
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">From Reg. No.</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Unit</th>
                  <th className="px-3 py-2">Transfer Date</th>
                  <th className="px-3 py-2 text-right">Transfer Fee</th>
                  <th className="px-3 py-2 text-right">Service Tax</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr>
                ) : (transfers as any[]).length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-6 text-gray-400 italic">No pending post-registry transfers</td></tr>
                ) : (transfers as any[]).map((t: any, i: number) => {
                  const a = t.fromBooking?.Applicants?.[0];
                  return (
                    <tr key={t.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{t.fromBooking?.registrationNo || '—'}</td>
                      <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                      <td className="px-3 py-2">{t.fromBooking?.Unit?.unitNumber || '—'}</td>
                      <td className="px-3 py-2">{t.transferDate ? new Date(t.transferDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2 text-right font-semibold">₹{Number(t.transferFee || 0).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2 text-right">₹{Number(t.serviceTax || 0).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => completeMutation.mutate(t.id)}
                          disabled={completeMutation.isPending}
                          className="px-2 py-0.5 bg-green-600 text-white rounded text-[10px] font-semibold hover:bg-green-700 disabled:opacity-40"
                        >
                          Mark Completed
                        </button>
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
