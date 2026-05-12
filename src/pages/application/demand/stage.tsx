import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { projectId: number; stageId: number; demandDate: string; dueDate: string; taxPercent: number; };

export default function DemandRaiseStagePage() {
  const qc = useQueryClient();
  const [result, setResult] = useState<any>(null);
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { register, handleSubmit, watch, reset } = useForm<FD>({ defaultValues: { demandDate: new Date().toISOString().split('T')[0], taxPercent: 0 } });
  const selectedProject = watch('projectId');
  const { data: plans = [] } = useQuery({ queryKey: ['plans', selectedProject], queryFn: () => axios.get(`/api/projects/payment-plan?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const allStages = (plans as any[]).flatMap((p: any) => p.PaymentStages || []);
  const { data: recentDemands = [] } = useQuery({ queryKey: ['demands', selectedProject], queryFn: () => axios.get(`/api/application/demand/list?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });

  const raise = useMutation({
    mutationFn: (d: FD) => axios.post('/api/application/demand/raise', { ...d, projectId: Number(d.projectId), stageId: Number(d.stageId), taxPercent: Number(d.taxPercent), demandType: 'stage' }),
    onSuccess: (res) => { setResult(res.data); qc.invalidateQueries({ queryKey: ['demands'] }); },
    onError: (e: any) => alert(e.response?.data?.message || 'Error'),
  });

  return (
    <div>
      <PageHeader title="Stage Wise Demand Raise" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <form onSubmit={handleSubmit(d => raise.mutate(d))} className="space-y-3">
            <div><Label className="text-xs">Project *</Label>
              <select {...register('projectId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Project --</option>
                {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Payment Stage *</Label>
              <select {...register('stageId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Stage --</option>
                {allStages.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Demand Date *</Label><Input type="date" {...register('demandDate')} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Due Date</Label><Input type="date" {...register('dueDate')} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Tax % (GST)</Label><Input type="number" step="0.01" {...register('taxPercent')} className="mt-1 h-9 text-sm" /></div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={raise.isPending}>{raise.isPending ? 'Raising...' : 'Raise Demand'}</Button>
              <Button type="button" variant="outline" onClick={() => { reset({ demandDate: new Date().toISOString().split('T')[0], taxPercent: 0 }); setResult(null); }}>Clear</Button>
            </div>
            {result && (
              <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                <p className="text-green-700 font-semibold">Demand raised successfully!</p>
                <p className="text-green-600 text-xs">Raised for {result.data?.raised} bookings | Skipped: {result.data?.skipped}</p>
              </div>
            )}
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Recent Demands</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{['#','Reg. No.','Customer','Amount','Status','Date'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(recentDemands as any[]).slice(0, 20).map((d: any, i) => (
              <tr key={d.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2">{d.Booking?.registrationNo}</td>
                <td className="px-2 py-2">{d.Booking?.Applicants?.[0]?.firstName} {d.Booking?.Applicants?.[0]?.lastName}</td>
                <td className="px-2 py-2 text-right">₹{Number(d.totalAmount).toLocaleString('en-IN')}</td>
                <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded text-xs ${d.status==='settled'?'bg-green-100 text-green-700':d.status==='pending'?'bg-yellow-100 text-yellow-700':'bg-blue-100 text-blue-700'}`}>{d.status}</span></td>
                <td className="px-2 py-2">{d.demandDate}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
