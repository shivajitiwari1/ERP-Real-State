import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function TransferDetailPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTransfer, setSelectedTransfer] = useState<any | null>(null);
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: transfers = [], isLoading } = useQuery<any[]>({
    queryKey: ['transfers', selectedProject],
    queryFn: () => axios.get(`/api/application/transfer?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });

  return (
    <div>
      <PageHeader title="Transfer Detail" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => { setSelectedProject(e.target.value); setSelectedTransfer(null); }}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {!selectedProject && <span className="text-xs text-gray-400">Select a project to view transfer details</span>}
        </div>
        {selectedProject && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Transfer list */}
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
                Transfers ({(transfers as any[]).length})
              </div>
              {isLoading ? (
                <div className="p-4 text-center text-gray-400 text-xs">Loading...</div>
              ) : (transfers as any[]).length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-xs italic">No transfers found</div>
              ) : (
                <div className="divide-y">
                  {(transfers as any[]).map((t: any) => {
                    const a = t.fromBooking?.Applicants?.[0];
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTransfer(t)}
                        className={`w-full text-left px-3 py-2.5 hover:bg-blue-50 transition-colors ${selectedTransfer?.id === t.id ? 'bg-blue-50 border-l-2 border-blue-600' : ''}`}
                      >
                        <div className="text-xs font-semibold">{t.fromBooking?.registrationNo || `Transfer #${t.id}`}</div>
                        <div className="text-xs text-gray-500">{a ? `${a.firstName} ${a.lastName}` : '—'}</div>
                        <div className="text-xs text-gray-400">{t.transferDate ? new Date(t.transferDate).toLocaleDateString('en-IN') : '—'}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Transfer detail */}
            <div className="lg:col-span-2 bg-white border rounded-lg shadow-sm">
              {selectedTransfer ? (
                <>
                  <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">Transfer Detail</div>
                  <div className="p-4 grid grid-cols-2 gap-4 text-xs">
                    {[
                      { label: 'Transfer ID', value: `#${selectedTransfer.id}` },
                      { label: 'From Booking', value: selectedTransfer.fromBooking?.registrationNo || '—' },
                      { label: 'Customer', value: selectedTransfer.fromBooking?.Applicants?.[0] ? `${selectedTransfer.fromBooking.Applicants[0].firstName} ${selectedTransfer.fromBooking.Applicants[0].lastName}` : '—' },
                      { label: 'Unit', value: selectedTransfer.fromBooking?.Unit?.unitNumber || '—' },
                      { label: 'Transfer Date', value: selectedTransfer.transferDate ? new Date(selectedTransfer.transferDate).toLocaleDateString('en-IN') : '—' },
                      { label: 'Transfer Fee', value: `₹${Number(selectedTransfer.transferFee || 0).toLocaleString('en-IN')}` },
                      { label: 'Service Tax', value: `₹${Number(selectedTransfer.serviceTax || 0).toLocaleString('en-IN')}` },
                      { label: 'Total Payable', value: `₹${(Number(selectedTransfer.transferFee || 0) + Number(selectedTransfer.serviceTax || 0)).toLocaleString('en-IN')}` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="text-gray-500 text-[10px] uppercase font-semibold">{label}</div>
                        <div className="font-medium mt-0.5">{value}</div>
                      </div>
                    ))}
                    <div className="col-span-2">
                      <div className="text-gray-500 text-[10px] uppercase font-semibold">Status</div>
                      <span className={`mt-0.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${selectedTransfer.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {selectedTransfer.status}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-400 text-xs italic">Select a transfer from the list to view details</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
