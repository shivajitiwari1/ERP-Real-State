import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function ApplicantAdditionPage() {
  const [search, setSearch] = useState('');
  const { data: bookings = [], isLoading } = useQuery<any[]>({
    queryKey: ['bookings'],
    queryFn: () => axios.get('/api/application/bookings').then(r => r.data.data),
  });
  const filtered = (bookings as any[]).filter((b: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const a = b.Applicants?.[0];
    return (
      (b.registrationNo || '').toLowerCase().includes(q) ||
      (a ? `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) : false)
    );
  });

  return (
    <div>
      <PageHeader title="Applicant Addition/Deletion Process" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <input
            type="text"
            placeholder="Search by registration no. or customer name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-3 h-9 text-sm w-full max-w-sm"
          />
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">
            Applicant Addition/Deletion ({filtered.length} bookings)
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-3 py-2">S.No.</th>
                <th className="px-3 py-2">Reg. No.</th>
                <th className="px-3 py-2">Primary Applicant</th>
                <th className="px-3 py-2">Project</th>
                <th className="px-3 py-2">Unit</th>
                <th className="px-3 py-2">Total Applicants</th>
                <th className="px-3 py-2">Co-Applicants</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="text-center py-6 text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-6 text-gray-400 italic">No records found</td></tr>
              ) : filtered.map((b: any, i: number) => {
                const primary = b.Applicants?.find((a: any) => a.applicantType === 'primary') || b.Applicants?.[0];
                const coApplicants = (b.Applicants || []).filter((a: any) => a.applicantType !== 'primary');
                return (
                  <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                    <td className="px-3 py-2">{primary ? `${primary.firstName} ${primary.lastName}` : '—'}</td>
                    <td className="px-3 py-2">{b.Project?.name || '—'}</td>
                    <td className="px-3 py-2">{b.Unit?.unitNumber || '—'}</td>
                    <td className="px-3 py-2 text-center font-semibold">{(b.Applicants || []).length}</td>
                    <td className="px-3 py-2 text-center text-gray-500">{coApplicants.length}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${b.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
