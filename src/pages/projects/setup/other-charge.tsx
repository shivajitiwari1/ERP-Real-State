import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { id?: number; projectId: number; name: string; rate: number; chargeType: string; isMandatory: boolean; };

export default function OtherChargePage() {
  const qc = useQueryClient();
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { register, handleSubmit, reset, setValue, watch } = useForm<FD>({ defaultValues: { chargeType: 'fixed', isMandatory: false, rate: 0 } });
  const selectedProject = watch('projectId');
  const editingId = watch('id');
  const { data: charges = [] } = useQuery({ queryKey: ['other-charges', selectedProject], queryFn: () => axios.get(`/api/projects/setup/other-charge?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const save = useMutation({
    mutationFn: (d: FD) => d.id ? axios.put('/api/projects/setup/other-charge', d) : axios.post('/api/projects/setup/other-charge', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['other-charges'] }); reset({ chargeType: 'fixed', isMandatory: false, rate: 0 }); },
  });
  return (
    <div>
      <PageHeader title="Other Charge Master" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <form onSubmit={handleSubmit(d => save.mutate({ ...d, projectId: Number(d.projectId), rate: Number(d.rate) }))} className="space-y-3">
            <div><Label className="text-xs">Project *</Label>
              <select {...register('projectId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Project --</option>
                {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Charge Name *</Label><Input {...register('name')} className="mt-1 h-9 text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Rate (₹)</Label><Input type="number" step="0.01" {...register('rate')} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Charge Type</Label>
                <select {...register('chargeType')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                  <option value="fixed">Fixed</option>
                  <option value="per_sqft">Per Sq.ft</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register('isMandatory')} id="mandatory" />
              <label htmlFor="mandatory" className="text-xs cursor-pointer">Mandatory Charge</label>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>{editingId ? 'Update' : 'Save'}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ chargeType: 'fixed', isMandatory: false, rate: 0 })}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Other Charges ({(charges as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{['#','Charge Name','Rate','Type','Mandatory','Action'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(charges as any[]).map((c: any, i) => (
              <tr key={c.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2 font-medium">{c.name}</td>
                <td className="px-2 py-2">₹{Number(c.rate).toLocaleString('en-IN')}</td>
                <td className="px-2 py-2 capitalize">{c.chargeType === 'per_sqft' ? 'Per Sq.ft' : 'Fixed'}</td>
                <td className="px-2 py-2">{c.isMandatory ? <span className="text-green-600">Yes</span> : <span className="text-gray-400">No</span>}</td>
                <td className="px-2 py-2"><Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={()=>{Object.keys(c).forEach(k=>setValue(k as any,c[k]));setValue('projectId',c.projectId);}}>Edit</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
