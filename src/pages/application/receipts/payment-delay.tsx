import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function PaymentDelayPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: cheques = [], isLoading } = useQuery<any[]>({
    queryKey: ['cheques', selectedProject],
    queryFn: () => axios.get(`/api/application/banking/cheques?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });

  // Calculate delay days for deposited/cleared cheques
  const withDelay = (cheques as any[])
    .filter((c: any) => c.depositDate || c.clearDate)
    .map((c: any) => {
      const chequeDate = new Date(c.chequeDate);
      const actionDate = new Date(c.clearDate || c.depositDate);
      const delayDays = Math.floor((actionDate.getTime() - chequeDate.getTime()) / (1000 * 60 * 60 * 24));
      return { ...c, delayDays };
    })
    .filter((c: any) => c.delayDays > 0)
    .sort((a: any, b: any) => b.delayDays - a.delayDays);

  return (
    <div>
      <PageHeader title="Payment Clear Delay Report" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {!selectedProject && <span className="text-xs text-gray-400">Select a project to view payment delay report</span>}
        </div>
        {selectedProject && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
              Payment Clear Delay ({withDelay.length} cheques)
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Cheque No.</th>
                  <th className="px-3 py-2">Cheque Date</th>
                  <th className="px-3 py-2">Bank</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2">Clear Date</th>
                  <th className="px-3 py-2 text-center">Delay (Days)</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={9} className="text-center py-6 text-gray-400">Loading...</td></tr>
                ) : withDelay.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-6 text-gray-400 italic">No payment delay records found</td></tr>
                ) : withDelay.map((c: any, i: number) => {
                  const a = c.Receipt?.Booking?.Applicants?.[0];
                  const delayColor = c.delayDays > 30 ? 'text-red-600 font-bold' : c.delayDays > 15 ? 'text-orange-600 font-semibold' : 'text-yellow-600';
                  return (
                    <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{c.chequeNo}</td>
                      <td className="px-3 py-2">{c.chequeDate ? new Date(c.chequeDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2">{c.bankName}</td>
                      <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                      <td className="px-3 py-2 text-right font-semibold">₹{Number(c.Receipt?.totalAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2">{c.clearDate ? new Date(c.clearDate).toLocaleDateString('en-IN') : c.depositDate ? new Date(c.depositDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className={`px-3 py-2 text-center ${delayColor}`}>{c.delayDays} days</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.status === 'cleared' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {c.status}
                        </span>
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
