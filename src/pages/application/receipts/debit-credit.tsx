import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function DebitCreditPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: entries = [], isLoading } = useQuery<any[]>({
    queryKey: ['journal', selectedProject],
    queryFn: () => axios.get(`/api/application/journal?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });
  const filtered = (entries as any[]).filter((e: any) => {
    if (!typeFilter) return e.entryType === 'DR' || e.entryType === 'CR';
    return e.entryType === typeFilter;
  });
  const totalDR = (entries as any[]).filter((e: any) => e.entryType === 'DR').reduce((s, e) => s + Number(e.amount), 0);
  const totalCR = (entries as any[]).filter((e: any) => e.entryType === 'CR').reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div>
      <PageHeader title="Debit/Credit" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex flex-wrap gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="border rounded px-3 h-9 text-sm" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All (DR + CR)</option>
            <option value="DR">Debit (DR)</option>
            <option value="CR">Credit (CR)</option>
          </select>
        </div>
        {selectedProject && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-xl font-bold text-red-600">₹{totalDR.toLocaleString('en-IN')}</div>
                <div className="text-xs text-gray-500 mt-1">Total Debit (DR)</div>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-xl font-bold text-green-600">₹{totalCR.toLocaleString('en-IN')}</div>
                <div className="text-xs text-gray-500 mt-1">Total Credit (CR)</div>
              </div>
            </div>
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">
                Debit/Credit Entries ({filtered.length})
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="px-3 py-2">S.No.</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Reg. No.</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2">Narration</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">No debit/credit entries found</td></tr>
                  ) : filtered.map((e: any, i: number) => {
                    const a = e.Booking?.Applicants?.[0];
                    return (
                      <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2">{e.entryDate ? new Date(e.entryDate).toLocaleDateString('en-IN') : '—'}</td>
                        <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                        <td className="px-3 py-2 font-medium">{e.Booking?.registrationNo || '—'}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${e.entryType === 'DR' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {e.entryType}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right font-semibold">₹{Number(e.amount).toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2 text-gray-500 max-w-[160px] truncate">{e.narration || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
