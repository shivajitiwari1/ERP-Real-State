import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function AllotmentStatusPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: agreements = [], isLoading } = useQuery<any[]>({
    queryKey: ['agreements', selectedProject],
    queryFn: () => axios.get(`/api/application/agreements?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });
  const filtered = typeFilter ? (agreements as any[]).filter((a: any) => a.agreementType === typeFilter) : (agreements as any[]);

  const typeColors: Record<string, string> = {
    provisional: 'bg-yellow-100 text-yellow-700',
    allotment: 'bg-blue-100 text-blue-700',
    bba: 'bg-green-100 text-green-700',
    tpa: 'bg-purple-100 text-purple-700',
  };

  return (
    <div>
      <PageHeader title="Allotment &amp; Agreement Status" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex flex-wrap gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className="border rounded px-3 h-9 text-sm" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="">All Types</option>
            <option value="provisional">Provisional</option>
            <option value="allotment">Allotment</option>
            <option value="bba">BBA</option>
            <option value="tpa">TPA</option>
          </select>
        </div>
        {selectedProject && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
              Agreements / Allotments ({filtered.length})
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Reg. No.</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Unit</th>
                  <th className="px-3 py-2">Agreement Date</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">No agreements found</td></tr>
                ) : filtered.map((ag: any, i: number) => {
                  const a = ag.Booking?.Applicants?.[0];
                  return (
                    <tr key={ag.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{ag.Booking?.registrationNo || '—'}</td>
                      <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                      <td className="px-3 py-2">{ag.Booking?.Unit?.unitNumber || '—'}</td>
                      <td className="px-3 py-2">{ag.agreementDate ? new Date(ag.agreementDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${typeColors[ag.agreementType] || 'bg-gray-100 text-gray-700'}`}>
                          {ag.agreementType}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${ag.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {ag.status}
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
