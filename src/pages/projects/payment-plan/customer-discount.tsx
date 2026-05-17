import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function CustomerDiscountPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: plans = [] } = useQuery<any[]>({ queryKey: ['plans', projectId], queryFn: () => axios.get(`/api/projects/payment-plan/index?projectId=${projectId}`).then(r => r.data.data), enabled: !!projectId });

  return (
    <div>
      <PageHeader title="Customer Wise Timely Discount" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">Select Project</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        {projectId && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Payment Plans &amp; Discounts</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2">S.No.</th>
                  <th className="px-3 py-2">Plan Name</th>
                  <th className="px-3 py-2">Plan Type</th>
                  <th className="px-3 py-2">Discount Value</th>
                  <th className="px-3 py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {(plans as any[]).length === 0
                  ? <tr><td colSpan={5} className="text-center py-6 text-gray-400 italic">No payment plans found</td></tr>
                  : (plans as any[]).map((p: any, i: number) => (
                    <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-medium">{p.name}</td>
                      <td className="px-3 py-2 capitalize">{p.planType}</td>
                      <td className="px-3 py-2">{p.discountValue ? `${p.discountValue}%` : '—'}</td>
                      <td className="px-3 py-2 text-gray-500">{p.description || '—'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
