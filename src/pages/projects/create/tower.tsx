import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { id?: number; projectId: number; name: string; code: string; totalFloors: number; };

export default function CreateTowerPage() {
  const qc = useQueryClient();
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { register, handleSubmit, reset, setValue, watch } = useForm<FD>({ defaultValues: { totalFloors: 0 } });
  const selectedProject = watch('projectId');
  const { data: towers = [] } = useQuery({
    queryKey: ['towers', selectedProject],
    queryFn: () => axios.get(`/api/projects/towers?projectId=${selectedProject}`).then(r => r.data.data),
    enabled: !!selectedProject,
  });
  const save = useMutation({
    mutationFn: (d: FD) => d.id ? axios.put('/api/projects/towers', d) : axios.post('/api/projects/towers', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['towers'] }); reset({ totalFloors: 0 }); },
  });
  return (
    <div>
      <PageHeader title="Add Tower / Plot" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm">
          <form onSubmit={handleSubmit(d => save.mutate({ ...d, projectId: Number(d.projectId), totalFloors: Number(d.totalFloors) }))} className="space-y-3">
            <div><Label className="text-xs">Project *</Label>
              <select {...register('projectId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Project --</option>
                {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Tower Name *</Label><Input {...register('name')} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Tower Code *</Label><Input {...register('code')} className="mt-1 h-9 text-sm" /></div>
              <div><Label className="text-xs">Total Floors</Label><Input type="number" {...register('totalFloors')} className="mt-1 h-9 text-sm" /></div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Save</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ totalFloors: 0 })}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Towers ({(towers as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{['#','Code','Tower Name','Total Floors','Action'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(towers as any[]).map((t: any, i) => (
              <tr key={t.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2 font-medium">{t.code}</td>
                <td className="px-2 py-2">{t.name}</td>
                <td className="px-2 py-2">{t.totalFloors}</td>
                <td className="px-2 py-2"><Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={()=>{Object.keys(t).forEach(k=>setValue(k as any,t[k]));setValue('projectId',t.projectId);}}>Edit</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
