import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function BounceReportPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: cheques = [], isLoading } = useQuery<any[]>({
    queryKey: ['cheques', selectedProject, 'bounced'],
    queryFn: () => axios.get(`/api/application/banking/cheques?status=bounced&projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });
  const total = (cheques as any[]).reduce((s: number, c: any) => s + Number(c.Receipt?.totalAmount || 0), 0);

  return (
    <div>
      <PageHeader title="Clear/Bounce Cheque Report" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {!selectedProject && <span className="text-xs text-gray-400">Select a project to view bounced cheques</span>}
        </div>
        {selectedProject && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{(cheques as any[]).length}</div>
                <div className="text-xs text-gray-500 mt-1">Bounced Cheques</div>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-xl font-bold text-red-600">₹{total.toLocaleString('en-IN')}</div>
                <div className="text-xs text-gray-500 mt-1">Total Bounced Amount</div>
              </div>
            </div>
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
                Bounced Cheques ({(cheques as any[]).length})
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
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr>
                  ) : (cheques as any[]).length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-6 text-gray-400 italic">No bounced cheques found</td></tr>
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
                        <td className="px-3 py-2 text-right font-semibold text-red-600">₹{Number(c.Receipt?.totalAmount || 0).toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2 text-gray-500">{c.remarks || '—'}</td>
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
