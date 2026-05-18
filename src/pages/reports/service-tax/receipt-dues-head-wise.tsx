import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

const GST = 0.18;

export default function ReceiptDuesHeadWisePage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: receipts = [], isLoading: lr } = useQuery<any[]>({ queryKey: ['stax-rdh-receipts', projectId], queryFn: () => axios.get(`/api/application/receipts/index${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });
  const { data: demands = [], isLoading: ld } = useQuery<any[]>({ queryKey: ['stax-rdh-demands', projectId], queryFn: () => axios.get(`/api/application/demand/list${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });
  const isLoading = lr || ld;

  const totalReceipts = (receipts as any[]).reduce((s, r: any) => s + Number(r.amount || 0), 0);
  const totalDues = (demands as any[]).reduce((s, d: any) => s + Number(d.pendingAmount || (d.totalAmount || d.amount || 0) - (d.paidAmount || 0)), 0);

  return (
    <div>
      <PageHeader title="Head Wise Receipt & Dues" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded border shadow-sm overflow-hidden">
            <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase tracking-wide">Receipts — GST Summary</div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Total Receipts</span><span className="font-bold text-green-600">₹{totalReceipts.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">GST 18%</span><span className="font-bold text-orange-600">₹{(totalReceipts * GST).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between border-t pt-2"><span className="font-semibold">Total with GST</span><span className="font-bold text-purple-700">₹{(totalReceipts * (1 + GST)).toLocaleString('en-IN')}</span></div>
            </div>
          </div>
          <div className="bg-white rounded border shadow-sm overflow-hidden">
            <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase tracking-wide">Dues — GST Summary</div>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Total Dues Pending</span><span className="font-bold text-red-600">₹{totalDues.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">GST 18%</span><span className="font-bold text-orange-600">₹{(totalDues * GST).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between border-t pt-2"><span className="font-semibold">Total with GST</span><span className="font-bold text-purple-700">₹{(totalDues * (1 + GST)).toLocaleString('en-IN')}</span></div>
            </div>
          </div>
        </div>
        {isLoading && <div className="bg-white rounded border shadow-sm p-8 text-center text-gray-400 text-sm">Loading...</div>}
      </div>
    </div>
  );
}
