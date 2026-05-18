import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function ResetReceiptPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: receipts = [], isLoading } = useQuery<any[]>({
    queryKey: ['receipts', selectedProject],
    queryFn: () => axios.get(`/api/application/receipts?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });

  const resetMutation = useMutation({
    mutationFn: (id: number) => axios.put('/api/application/receipts', { id, isCancelled: false, isDuplicate: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      setConfirmId(null);
      setSelectedId(null);
    },
  });

  return (
    <div>
      <PageHeader title="Reset Receipt" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {!selectedProject && <span className="text-xs text-gray-400">Select a project to manage receipts</span>}
        </div>
        {selectedProject && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
              Receipts — Reset ({(receipts as any[]).length})
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Receipt No.</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr>
                ) : (receipts as any[]).length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">No receipts found</td></tr>
                ) : (receipts as any[]).map((r: any, i: number) => {
                  const a = r.Booking?.Applicants?.[0];
                  const isCancelled = r.isCancelled;
                  return (
                    <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className={`px-3 py-2 font-medium ${isCancelled ? 'line-through text-gray-400' : ''}`}>{r.receiptNo}</td>
                      <td className="px-3 py-2">{r.receiptDate ? new Date(r.receiptDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                      <td className="px-3 py-2 text-right font-semibold">₹{Number(r.totalAmount).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isCancelled ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {isCancelled ? 'Cancelled' : 'Active'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {isCancelled && (
                          confirmId === r.id ? (
                            <div className="flex gap-1">
                              <button onClick={() => resetMutation.mutate(r.id)} disabled={resetMutation.isPending} className="px-2 py-0.5 bg-green-600 text-white rounded text-[10px] font-semibold hover:bg-green-700">Confirm</button>
                              <button onClick={() => setConfirmId(null)} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-[10px] font-semibold hover:bg-gray-300">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmId(r.id)} className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-semibold hover:bg-blue-700">Reset</button>
                          )
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
