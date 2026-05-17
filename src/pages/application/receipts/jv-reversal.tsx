import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function JVReversalPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: entries = [], isLoading } = useQuery<any[]>({
    queryKey: ['journal', selectedProject],
    queryFn: () => axios.get(`/api/application/journal?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });

  const reverseMutation = useMutation({
    mutationFn: (entry: any) => axios.post('/api/application/journal', {
      bookingId: entry.bookingId,
      projectId: entry.projectId,
      entryDate: new Date().toISOString().split('T')[0],
      amount: Number(entry.amount),
      entryType: entry.entryType === 'DR' ? 'CR' : entry.entryType === 'CR' ? 'DR' : entry.entryType,
      narration: `Reversal of Entry #${entry.id} — ${entry.narration || ''}`,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      setConfirmId(null);
    },
  });

  const typeColors: Record<string, string> = {
    JV: 'bg-blue-100 text-blue-700',
    DR: 'bg-red-100 text-red-700',
    CR: 'bg-green-100 text-green-700',
    Refund: 'bg-orange-100 text-orange-700',
  };

  return (
    <div>
      <PageHeader title="JV/Dr/Cr/Refund Reversal" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {!selectedProject && <span className="text-xs text-gray-400">Select a project to view journal entries for reversal</span>}
        </div>
        {selectedProject && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">
              Journal Entries — Reversal ({(entries as any[]).length})
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Reg. No.</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2">Narration</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr>
                ) : (entries as any[]).length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-6 text-gray-400 italic">No journal entries found</td></tr>
                ) : (entries as any[]).map((e: any, i: number) => {
                  const a = e.Booking?.Applicants?.[0];
                  return (
                    <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2">{e.entryDate ? new Date(e.entryDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2 font-medium">{e.Booking?.registrationNo || '—'}</td>
                      <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${typeColors[e.entryType] || 'bg-gray-100 text-gray-700'}`}>
                          {e.entryType}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right font-semibold">₹{Number(e.amount).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2 text-gray-500 max-w-[140px] truncate">{e.narration || '—'}</td>
                      <td className="px-3 py-2">
                        {confirmId === e.id ? (
                          <div className="flex gap-1">
                            <button onClick={() => reverseMutation.mutate(e)} className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-semibold hover:bg-red-700">Confirm</button>
                            <button onClick={() => setConfirmId(null)} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-[10px] font-semibold hover:bg-gray-300">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmId(e.id)} className="px-2 py-0.5 bg-orange-500 text-white rounded text-[10px] font-semibold hover:bg-orange-600">Reverse</button>
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
