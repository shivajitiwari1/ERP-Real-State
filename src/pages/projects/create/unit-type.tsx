import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { id?: number; projectId: number; name: string; area: number; areaTypeId?: number | null; };

export default function UnitTypePage() {
  const qc = useQueryClient();
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: areaTypes = [] } = useQuery({ queryKey: ['area-types'], queryFn: () => axios.get('/api/master/setup/area-type').then(r => r.data.data) });
  const { register, handleSubmit, reset, setValue, watch } = useForm<FD>({ defaultValues: { area: 0 } });
  const selectedProject = watch('projectId');
  const { data: unitTypes = [] } = useQuery({
    queryKey: ['unit-types', selectedProject],
    queryFn: () => axios.get(`/api/projects/unit-types?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });
  const save = useMutation({
    mutationFn: (d: FD) => d.id ? axios.put('/api/projects/unit-types', d) : axios.post('/api/projects/unit-types', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['unit-types'] }); reset({ area: 0 }); },
  });
  return (
    <div>
      <PageHeader title="Unit Type Creation" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm">
          <form onSubmit={handleSubmit(d => save.mutate({ ...d, projectId: Number(d.projectId), area: Number(d.area), areaTypeId: d.areaTypeId ? Number(d.areaTypeId) : null }))} className="space-y-3">
            <div><Label className="text-xs">Project *</Label>
              <select {...register('projectId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Project --</option>
                {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Unit Type Name *</Label><Input {...register('name')} placeholder="e.g. 2BHK, 3BHK" className="mt-1 h-9 text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Area (Carpet) *</Label><Input type="number" step="0.01" {...register('area')} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Area Type</Label>
                <select {...register('areaTypeId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                  <option value="">-- sq.ft --</option>
                  {(areaTypes as any[]).map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Save</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ area: 0 })}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Unit Types ({(unitTypes as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{['#','Type Name','Area','Area Type','Action'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(unitTypes as any[]).map((u: any, i) => (
              <tr key={u.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2 font-medium">{u.name}</td>
                <td className="px-2 py-2">{u.area}</td>
                <td className="px-2 py-2">{u.AreaType?.name || 'sq.ft'}</td>
                <td className="px-2 py-2"><Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={()=>{Object.keys(u).forEach(k=>setValue(k as any,u[k]));setValue('projectId',u.projectId);}}>Edit</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
