import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function AssignChallanPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const [challanInputs, setChallanInputs] = useState<Record<number, string>>({});
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: receipts = [], isLoading } = useQuery<any[]>({
    queryKey: ['receipts', selectedProject],
    queryFn: () => axios.get(`/api/application/receipts?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });
  // Show receipts without challan (no instrumentNo) — treat instrumentNo as challan field
  const withoutChallan = (receipts as any[]).filter((r: any) => !r.instrumentNo);

  return (
    <div>
      <PageHeader title="Assign Receipt Challan" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select className="border rounded px-3 h-9 text-sm" value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {!selectedProject && <span className="text-xs text-gray-400">Select a project to assign challans</span>}
        </div>
        {selectedProject && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
              Receipts Without Challan ({withoutChallan.length})
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Receipt No.</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Mode</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2">Challan No.</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr>
                ) : withoutChallan.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">All receipts have challan numbers assigned</td></tr>
                ) : withoutChallan.map((r: any, i: number) => {
                  const a = r.Booking?.Applicants?.[0];
                  return (
                    <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{r.receiptNo}</td>
                      <td className="px-3 py-2">{r.receiptDate ? new Date(r.receiptDate).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-3 py-2">{a ? `${a.firstName} ${a.lastName}` : '—'}</td>
                      <td className="px-3 py-2 uppercase">{r.paymentMode}</td>
                      <td className="px-3 py-2 text-right font-semibold">₹{Number(r.totalAmount).toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          <input
                            type="text"
                            placeholder="Enter challan no."
                            value={challanInputs[r.id] || ''}
                            onChange={e => setChallanInputs(prev => ({ ...prev, [r.id]: e.target.value }))}
                            className="border rounded px-2 h-7 text-xs w-28"
                          />
                          <button
                            onClick={() => axios.put('/api/application/receipts', { id: r.id, instrumentNo: challanInputs[r.id] })}
                            disabled={!challanInputs[r.id]}
                            className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-semibold hover:bg-blue-700 disabled:opacity-40"
                          >
                            Save
                          </button>
                        </div>
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
