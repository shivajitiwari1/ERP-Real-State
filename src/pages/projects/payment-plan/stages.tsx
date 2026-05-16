import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { id?: number; projectId: number; planId: number; name: string; stageOrder: number; };

export default function StageMasterPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: plans = [] } = useQuery({ queryKey: ['plans', selectedProject], queryFn: () => axios.get(`/api/projects/payment-plan?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset, setValue, watch } = useForm<FD>({ defaultValues: { stageOrder: 0 } });
  const selectedPlan = watch('planId');
  const editingId = watch('id');
  const { data: stages = [] } = useQuery({ queryKey: ['stages', selectedPlan], queryFn: () => axios.get(`/api/projects/payment-plan/stages?planId=${selectedPlan}`).then(r => r.data.data), enabled: !!selectedPlan });
  const save = useMutation({
    mutationFn: (d: FD) => d.id ? axios.put('/api/projects/payment-plan/stages', d) : axios.post('/api/projects/payment-plan/stages', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stages'] }); reset({ stageOrder: 0 }); },
  });
  const del = useMutation({ mutationFn: (id: number) => axios.delete('/api/projects/payment-plan/stages', { data: { id } }), onSuccess: () => qc.invalidateQueries({ queryKey: ['stages'] }) });
  return (
    <div>
      <PageHeader title="Stage Master" subtitle="Define construction/payment stages for payment plans" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <div><Label className="text-xs">Project *</Label>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full border rounded px-2 h-9 text-sm mt-1">
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <form onSubmit={handleSubmit(d => save.mutate({ ...d, projectId: Number(selectedProject), planId: Number(d.planId), stageOrder: Number(d.stageOrder) }))} className="space-y-3">
            <div><Label className="text-xs">Payment Plan *</Label>
              <select {...register('planId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Plan --</option>
                {(plans as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Stage Name *</Label><Input {...register('name')} placeholder="e.g. Foundation, Slab, Handover" className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Stage Order</Label><Input type="number" {...register('stageOrder')} className="mt-1 h-9 text-sm" /></div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>{editingId ? 'Update' : 'Add Stage'}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ stageOrder: 0 })}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Stages ({(stages as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{['Order','Stage Name','Action'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(stages as any[]).map((s: any, i) => (
              <tr key={s.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{s.stageOrder}</td>
                <td className="px-2 py-2 font-medium">{s.name}</td>
                <td className="px-2 py-2 flex gap-1">
                  <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={()=>{Object.keys(s).forEach(k=>setValue(k as any,s[k]));setValue('planId',s.planId);}}>Edit</Button>
                  <Button size="sm" variant="destructive" className="h-6 text-xs px-2" onClick={()=>del.mutate(s.id)}>Del</Button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
