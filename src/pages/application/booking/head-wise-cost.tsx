import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function HeadWiseCostPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: receipts = [], isLoading } = useQuery<any[]>({
    queryKey: ['receipts', selectedProject],
    queryFn: () => axios.get(`/api/application/receipts?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });

  // Group receipts by receiptType
  const grouped: Record<string, { count: number; total: number }> = {};
  (receipts as any[]).forEach((r: any) => {
    const type = r.receiptType || 'other';
    if (!grouped[type]) grouped[type] = { count: 0, total: 0 };
    grouped[type].count++;
    grouped[type].total += Number(r.totalAmount || 0);
  });
  const grandTotal = Object.values(grouped).reduce((s, g) => s + g.total, 0);

  return (
    <div>
      <PageHeader title="Head Wise Cost" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex flex-wrap gap-3 items-center">
          <select
            className="border rounded px-3 h-9 text-sm"
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
          >
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {!selectedProject && <span className="text-xs text-gray-400">Select a project to view head-wise cost breakdown</span>}
        </div>

        {selectedProject && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(grouped).map(([type, { count, total }]) => (
                <div key={type} className="bg-white border rounded-lg shadow-sm p-4">
                  <div className="text-lg font-bold text-slate-700">₹{total.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-500 mt-1 capitalize">{type}</div>
                  <div className="text-xs text-gray-400">{count} receipt{count !== 1 ? 's' : ''}</div>
                </div>
              ))}
            </div>
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase flex justify-between">
                <span>Head Wise Cost Summary</span>
                <span>Total: ₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-3 py-2">S.No.</th>
                    <th className="px-3 py-2">Receipt Head</th>
                    <th className="px-3 py-2 text-center">Count</th>
                    <th className="px-3 py-2 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={4} className="text-center py-6 text-gray-400">Loading...</td></tr>
                  ) : Object.keys(grouped).length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-6 text-gray-400 italic">No receipt data found</td></tr>
                  ) : Object.entries(grouped).map(([type, { count, total }], i) => (
                    <tr key={type} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium capitalize">{type}</td>
                      <td className="px-3 py-2 text-center">{count}</td>
                      <td className="px-3 py-2 text-right font-semibold">₹{total.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  {Object.keys(grouped).length > 0 && (
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={2} className="px-3 py-2">Grand Total</td>
                      <td className="px-3 py-2 text-center">{(receipts as any[]).length}</td>
                      <td className="px-3 py-2 text-right">₹{grandTotal.toLocaleString('en-IN')}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
