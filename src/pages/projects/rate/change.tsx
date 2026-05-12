import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { id?: number; projectId: number; unitTypeId?: number | null; ratePerSqft: number; effectiveDate?: string; };

export default function ChangeRatePage() {
  const qc = useQueryClient();
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { register, handleSubmit, reset, setValue, watch } = useForm<FD>({ defaultValues: { ratePerSqft: 0 } });
  const selectedProject = watch('projectId');
  const { data: unitTypes = [] } = useQuery({ queryKey: ['unit-types', selectedProject], queryFn: () => axios.get(`/api/projects/unit-types?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { data: rates = [] } = useQuery({ queryKey: ['rates', selectedProject], queryFn: () => axios.get(`/api/projects/rate?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const save = useMutation({
    mutationFn: (d: FD) => d.id ? axios.put('/api/projects/rate', d) : axios.post('/api/projects/rate', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['rates'] }); reset({ ratePerSqft: 0 }); },
  });
  return (
    <div>
      <PageHeader title="Change Rate" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <form onSubmit={handleSubmit(d => save.mutate({ ...d, projectId: Number(d.projectId), unitTypeId: d.unitTypeId ? Number(d.unitTypeId) : null, ratePerSqft: Number(d.ratePerSqft) }))} className="space-y-3">
            <div><Label className="text-xs">Project *</Label>
              <select {...register('projectId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Project --</option>
                {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Unit Type (leave blank for all types)</Label>
              <select {...register('unitTypeId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- All Unit Types --</option>
                {(unitTypes as any[]).map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Rate per Sq.ft (₹) *</Label><Input type="number" step="0.01" {...register('ratePerSqft')} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Effective Date</Label><Input type="date" {...register('effectiveDate')} className="mt-1 h-9 text-sm" /></div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Save Rate</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ ratePerSqft: 0 })}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Rate History</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{['#','Unit Type','Rate/Sq.ft','Effective Date','Action'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(rates as any[]).map((r: any, i) => (
              <tr key={r.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2">{r.UnitType?.name || 'All Types'}</td>
                <td className="px-2 py-2 font-medium">₹{Number(r.ratePerSqft).toLocaleString('en-IN')}</td>
                <td className="px-2 py-2">{r.effectiveDate || '-'}</td>
                <td className="px-2 py-2"><Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={()=>{Object.keys(r).forEach(k=>setValue(k as any,r[k]));setValue('projectId',r.projectId);}}>Edit</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
