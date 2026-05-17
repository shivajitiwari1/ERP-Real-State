import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function LoanDispersalReportPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [search, setSearch] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: loans = [], isLoading } = useQuery<any[]>({
    queryKey: ['loans', selectedProject],
    queryFn: () => axios.get(`/api/application/loan?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });

  const filtered = (loans as any[]).filter((l: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const a = l.Booking?.Applicants?.[0];
    return (
      (l.Booking?.registrationNo || '').toLowerCase().includes(q) ||
      (l.fileNo || '').toLowerCase().includes(q) ||
      (l.BankLoan?.bankName || '').toLowerCase().includes(q) ||
      (a ? `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) : false)
    );
  });

  const totalSanctioned = filtered.reduce((s: number, l: any) => s + Number(l.sanctionedAmount || 0), 0);

  return (
    <div>
      <PageHeader title="Loan Dispersal Report" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex flex-wrap gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {selectedProject && (
            <input
              type="text"
              placeholder="Search by name, file no., bank..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded px-3 h-9 text-sm w-56"
            />
          )}
          {!selectedProject && <span className="text-xs text-gray-400">Select a project to view loan dispersal report</span>}
        </div>
        {selectedProject && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-slate-700">{filtered.length}</div>
                <div className="text-xs text-gray-500 mt-1">Total Loans</div>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-xl font-bold text-blue-600">₹{totalSanctioned.toLocaleString('en-IN')}</div>
                <div className="text-xs text-gray-500 mt-1">Total Sanctioned</div>
              </div>
              <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{filtered.filter((l: any) => l.sanctionedAmount > 0).length}</div>
                <div className="text-xs text-gray-500 mt-1">Sanctioned</div>
              </div>
            </div>
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase flex justify-between">
                <span>Loan Records ({filtered.length})</span>
                {filtered.length > 0 && <span>Total Sanctioned: ₹{totalSanctioned.toLocaleString('en-IN')}</span>}
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-blue-900 text-white">
                    <th className="px-3 py-2">S.No.</th>
                    <th className="px-3 py-2">Reg. No.</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Bank</th>
                    <th className="px-3 py-2">Branch</th>
                    <th className="px-3 py-2">File No.</th>
                    <th className="px-3 py-2">File Date</th>
                    <th className="px-3 py-2 text-right">Sanctioned Amount</th>
                    <th className="px-3 py-2">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={9} className="text-center py-6 text-gray-400">Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={9} className="text-center py-6 text-gray-400 italic">No loan records found</td></tr>
                  ) : filtered.map((l: any, i: number) => {
                    const a = l.Booking?.Applicants?.[0];
                    return (
                      <tr key={l.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2 font-medium">{l.Booking?.registrationNo || '—'}</td>
                        <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                        <td className="px-3 py-2">{l.BankLoan?.bankName || '—'}</td>
                        <td className="px-3 py-2">{l.branch || '—'}</td>
                        <td className="px-3 py-2">{l.fileNo || '—'}</td>
                        <td className="px-3 py-2">{l.fileDate ? new Date(l.fileDate).toLocaleDateString('en-IN') : '—'}</td>
                        <td className="px-3 py-2 text-right font-semibold">
                          {l.sanctionedAmount ? `₹${Number(l.sanctionedAmount).toLocaleString('en-IN')}` : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-3 py-2">{l.contactPerson ? `${l.contactPerson}${l.contactNo ? ` (${l.contactNo})` : ''}` : '—'}</td>
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
