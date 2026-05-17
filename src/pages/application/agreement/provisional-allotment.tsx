import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function ProvisionalAllotmentPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: bookings = [], isLoading } = useQuery<any[]>({
    queryKey: ['bookings', selectedProject],
    queryFn: () => axios.get(`/api/application/bookings?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });
  const { data: agreements = [] } = useQuery<any[]>({
    queryKey: ['agreements', selectedProject],
    queryFn: () => axios.get(`/api/application/agreements?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });

  // Active bookings without any agreement
  const agreedBookingIds = new Set((agreements as any[]).map((a: any) => a.bookingId));
  const withoutAgreement = (bookings as any[]).filter((b: any) => b.status === 'active' && !agreedBookingIds.has(b.id));

  return (
    <div>
      <PageHeader title="Provisional Allotment" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {!selectedProject && <span className="text-xs text-gray-400">Select a project to view bookings pending provisional allotment</span>}
        </div>
        {selectedProject && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-slate-700">{(bookings as any[]).filter((b: any) => b.status === 'active').length}</div>
                <div className="text-xs text-gray-500 mt-1">Active Bookings</div>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{(agreements as any[]).length}</div>
                <div className="text-xs text-gray-500 mt-1">Agreements Done</div>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{withoutAgreement.length}</div>
                <div className="text-xs text-gray-500 mt-1">Pending Allotment</div>
              </div>
            </div>
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">
                Pending Provisional Allotment ({withoutAgreement.length})
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="px-3 py-2">S.No.</th>
                    <th className="px-3 py-2">Reg. No.</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Unit</th>
                    <th className="px-3 py-2">Booking Date</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr>
                  ) : withoutAgreement.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-6 text-gray-400 italic">All active bookings have agreements</td></tr>
                  ) : withoutAgreement.map((b: any, i: number) => {
                    const a = b.Applicants?.[0];
                    return (
                      <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                        <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                        <td className="px-3 py-2">{b.Unit?.unitNumber || '—'}</td>
                        <td className="px-3 py-2">{b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('en-IN') : '—'}</td>
                        <td className="px-3 py-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-700">
                            Pending Allotment
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
