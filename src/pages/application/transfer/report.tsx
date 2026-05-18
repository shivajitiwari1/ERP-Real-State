import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function TransferReportPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: transfers = [], isLoading } = useQuery<any[]>({
    queryKey: ['transfers', selectedProject, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedProject) params.set('projectId', selectedProject);
      if (statusFilter) params.set('status', statusFilter);
      return axios.get(`/api/application/transfer?${params}`).then(r => r.data.data);
    },
    enabled: !!selectedProject,
  });
  const totalFee = (transfers as any[]).reduce((s: number, t: any) => s + Number(t.transferFee || 0), 0);

  return (
    <div>
      <PageHeader title="Transfer Report" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex flex-wrap gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="border rounded px-3 h-9 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        {selectedProject && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-slate-700">{(transfers as any[]).length}</div>
                <div className="text-xs text-gray-500 mt-1">Total Transfers</div>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-xl font-bold text-blue-600">₹{totalFee.toLocaleString('en-IN')}</div>
                <div className="text-xs text-gray-500 mt-1">Total Transfer Fee</div>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{(transfers as any[]).filter((t: any) => t.status === 'completed').length}</div>
                <div className="text-xs text-gray-500 mt-1">Completed</div>
              </div>
            </div>
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
                Transfer Records ({(transfers as any[]).length})
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-3 py-2">S.No.</th>
                    <th className="px-3 py-2">From Reg. No.</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Transfer Date</th>
                    <th className="px-3 py-2 text-right">Transfer Fee</th>
                    <th className="px-3 py-2 text-right">Service Tax</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr>
                  ) : (transfers as any[]).length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">No transfer records found</td></tr>
                  ) : (transfers as any[]).map((t: any, i: number) => {
                    const a = t.fromBooking?.Applicants?.[0];
                    return (
                      <tr key={t.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2 font-medium">{t.fromBooking?.registrationNo || '—'}</td>
                        <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                        <td className="px-3 py-2">{t.transferDate ? new Date(t.transferDate).toLocaleDateString('en-IN') : '—'}</td>
                        <td className="px-3 py-2 text-right font-semibold">₹{Number(t.transferFee || 0).toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2 text-right">₹{Number(t.serviceTax || 0).toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {t.status}
                          </span>
                        </td>
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
