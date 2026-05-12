import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { id?: number; projectId: number; name: string; planType: string; discountType: string; discountValue: number; is100Percent: boolean; description?: string; };

export default function PaymentPlanCreatePage() {
  const qc = useQueryClient();
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { register, handleSubmit, reset, setValue, watch } = useForm<FD>({ defaultValues: { planType: 'regular', discountType: 'percent', discountValue: 0, is100Percent: false } });
  const selectedProject = watch('projectId');
  const { data: plans = [] } = useQuery({ queryKey: ['plans', selectedProject], queryFn: () => axios.get(`/api/projects/payment-plan?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const editingId = watch('id');
  const save = useMutation({
    mutationFn: (d: FD) => d.id ? axios.put('/api/projects/payment-plan', d) : axios.post('/api/projects/payment-plan', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['plans'] }); reset({ planType: 'regular', discountType: 'percent', discountValue: 0, is100Percent: false }); },
  });
  return (
    <div>
      <PageHeader title="Payment Plan Creation" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <form onSubmit={handleSubmit(d => save.mutate({ ...d, projectId: Number(d.projectId), discountValue: Number(d.discountValue) }))} className="space-y-3">
            <div><Label className="text-xs">Project *</Label>
              <select {...register('projectId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Project --</option>
                {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Plan Name *</Label><Input {...register('name')} className="mt-1 h-9 text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Plan Type</Label>
                <select {...register('planType')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                  <option value="regular">Regular</option>
                  <option value="flexi">Flexi</option>
                  <option value="construction">Construction Linked</option>
                </select>
              </div>
              <div><Label className="text-xs">Discount Type</Label>
                <select {...register('discountType')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                  <option value="percent">Percentage (%)</option>
                  <option value="per_area">Per Sq.ft</option>
                </select>
              </div>
              <div><Label className="text-xs">Discount Value</Label><Input type="number" step="0.01" {...register('discountValue')} className="mt-1 h-9 text-sm" /></div>
              <div className="flex items-end gap-2 pb-1">
                <input type="checkbox" {...register('is100Percent')} id="is100" />
                <label htmlFor="is100" className="text-xs cursor-pointer">100% Payment Plan</label>
              </div>
            </div>
            <div><Label className="text-xs">Description (max 500 chars)</Label>
              <textarea {...register('description')} maxLength={500} className="w-full border rounded px-2 py-1.5 text-sm mt-1 h-20 resize-none" />
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>{save.isPending ? 'Saving...' : editingId ? 'Update' : 'Save'}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ planType: 'regular', discountType: 'percent', discountValue: 0, is100Percent: false })}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Payment Plans ({(plans as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{['#','Plan Name','Type','Discount','Action'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(plans as any[]).map((p: any, i) => (
              <tr key={p.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2 font-medium">{p.name}</td>
                <td className="px-2 py-2 capitalize">{p.planType}</td>
                <td className="px-2 py-2">{p.discountValue} {p.discountType === 'percent' ? '%' : '/sqft'}</td>
                <td className="px-2 py-2"><Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={()=>{Object.keys(p).forEach(k=>setValue(k as any,p[k]));setValue('projectId',p.projectId);}}>Edit</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
