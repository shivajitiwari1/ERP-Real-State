import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { id?: number; projectId: number; planId: number; amount: number; };

export default function SetBookingAmountPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: plans = [] } = useQuery({ queryKey: ['plans', selectedProject], queryFn: () => axios.get(`/api/projects/payment-plan?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset, setValue, watch } = useForm<FD>({ defaultValues: { amount: 0 } });
  const selectedPlan = watch('planId');
  const editingId = watch('id');
  const { data: bookingAmounts = [] } = useQuery({ queryKey: ['booking-amounts', selectedProject], queryFn: () => axios.get(`/api/projects/payment-plan/booking-amounts?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const save = useMutation({
    mutationFn: (d: FD) => d.id ? axios.put('/api/projects/payment-plan/booking-amounts', d) : axios.post('/api/projects/payment-plan/booking-amounts', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['booking-amounts'] }); reset({ amount: 0 }); },
  });
  const del = useMutation({ mutationFn: (id: number) => axios.delete('/api/projects/payment-plan/booking-amounts', { data: { id } }), onSuccess: () => qc.invalidateQueries({ queryKey: ['booking-amounts'] }) });
  return (
    <div>
      <PageHeader title="Set Booking Amount" subtitle="Configure booking token amount per payment plan" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <div><Label className="text-xs">Project *</Label>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full border rounded px-2 h-9 text-sm mt-1">
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <form onSubmit={handleSubmit(d => save.mutate({ ...d, projectId: Number(selectedProject), planId: Number(d.planId), amount: Number(d.amount) }))} className="space-y-3">
            <div><Label className="text-xs">Payment Plan *</Label>
              <select {...register('planId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Plan --</option>
                {(plans as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Booking Amount (Rs.) *</Label><Input type="number" step="100" {...register('amount')} className="mt-1 h-9 text-sm" /></div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>{editingId ? 'Update' : 'Set Amount'}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ amount: 0 })}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Booking Amounts ({(bookingAmounts as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{['#','Plan','Booking Amt','Action'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(bookingAmounts as any[]).map((ba: any, i) => (
              <tr key={ba.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2 font-medium">{ba.PaymentPlan?.name || ba.planId}</td>
                <td className="px-2 py-2 font-semibold text-orange-600">Rs.{Number(ba.amount).toLocaleString('en-IN')}</td>
                <td className="px-2 py-2 flex gap-1">
                  <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={()=>{Object.keys(ba).forEach(k=>setValue(k as any,ba[k]));setValue('planId',ba.planId);}}>Edit</Button>
                  <Button size="sm" variant="destructive" className="h-6 text-xs px-2" onClick={()=>del.mutate(ba.id)}>Del</Button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
