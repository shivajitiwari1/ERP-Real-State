import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { id?: number; planId: number; stageId?: number | null; name: string; dueType: string; dueDate?: string; percentage: number; amount: number; };

export default function InstallmentPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: plans = [] } = useQuery({ queryKey: ['plans', selectedProject], queryFn: () => axios.get(`/api/projects/payment-plan?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset, setValue, watch } = useForm<FD>({ defaultValues: { dueType: 'date', percentage: 0, amount: 0 } });
  const selectedPlan = watch('planId');
  const editingId = watch('id');
  const { data: installments = [] } = useQuery({ queryKey: ['installments', selectedPlan], queryFn: () => axios.get(`/api/projects/payment-plan/installments?planId=${selectedPlan}`).then(r => r.data.data), enabled: !!selectedPlan });
  const { data: stages = [] } = useQuery({ queryKey: ['stages', selectedPlan], queryFn: () => axios.get(`/api/projects/payment-plan/stages?planId=${selectedPlan}`).then(r => r.data.data), enabled: !!selectedPlan });
  const save = useMutation({
    mutationFn: (d: FD) => d.id ? axios.put('/api/projects/payment-plan/installments', d) : axios.post('/api/projects/payment-plan/installments', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['installments'] }); reset({ dueType: 'date', percentage: 0, amount: 0 }); },
  });
  const del = useMutation({
    mutationFn: (id: number) => axios.delete('/api/projects/payment-plan/installments', { data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['installments'] }),
  });
  return (
    <div>
      <PageHeader title="Create Installment" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <div><Label className="text-xs">Project *</Label>
            <select className="w-full border rounded px-2 h-9 text-sm mt-1" value={selectedProject} onChange={e => { setSelectedProject(e.target.value); }}>
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <form onSubmit={handleSubmit(d => save.mutate({ ...d, planId: Number(d.planId), stageId: d.stageId ? Number(d.stageId) : null, percentage: Number(d.percentage), amount: Number(d.amount) }))} className="space-y-3">
            <div><Label className="text-xs">Payment Plan *</Label>
              <select {...register('planId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Plan --</option>
                {(plans as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Stage (optional)</Label>
              <select {...register('stageId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- No Stage --</option>
                {(stages as any[]).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Installment Name *</Label><Input {...register('name')} placeholder="e.g. On Booking, On Slab" className="mt-1 h-9 text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Due Type</Label>
                <select {...register('dueType')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                  <option value="date">Date</option>
                  <option value="milestone">Milestone</option>
                  <option value="on_booking">On Booking</option>
                </select>
              </div>
              <div><Label className="text-xs">Due Date</Label><Input type="date" {...register('dueDate')} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Percentage (%)</Label><Input type="number" step="0.01" {...register('percentage')} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Amount (₹)</Label><Input type="number" step="0.01" {...register('amount')} className="mt-1 h-9 text-sm" /></div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>{editingId ? 'Update' : 'Add'}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ dueType: 'date', percentage: 0, amount: 0 })}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Installments ({(installments as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{['#','Name','Stage','Type','Due Date','%','Amount','Action'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(installments as any[]).map((inst: any, i) => (
              <tr key={inst.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2 font-medium">{inst.name}</td>
                <td className="px-2 py-2">{inst.PaymentStage?.name || '-'}</td>
                <td className="px-2 py-2 capitalize">{inst.dueType}</td>
                <td className="px-2 py-2">{inst.dueDate || '-'}</td>
                <td className="px-2 py-2">{inst.percentage}%</td>
                <td className="px-2 py-2">₹{Number(inst.amount).toLocaleString('en-IN')}</td>
                <td className="px-2 py-2 flex gap-1">
                  <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={()=>{Object.keys(inst).forEach(k=>setValue(k as any,inst[k]));setValue('planId',inst.planId);}}>Edit</Button>
                  <Button size="sm" variant="destructive" className="h-6 text-xs px-2" onClick={()=>del.mutate(inst.id)}>Del</Button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
