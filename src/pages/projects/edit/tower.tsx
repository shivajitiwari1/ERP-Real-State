import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = { id?: number; projectId: number; name: string; code: string; totalFloors: number; };

export default function EditTowerPage() {
  const qc = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: towers = [] } = useQuery({ queryKey: ['towers', selectedProject], queryFn: () => axios.get(`/api/projects/towers?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { register, handleSubmit, reset, setValue, watch } = useForm<FD>({ defaultValues: { totalFloors: 0 } });
  const editingId = watch('id');
  const save = useMutation({
    mutationFn: (d: FD) => axios.put('/api/projects/towers', { ...d, projectId: Number(d.projectId), totalFloors: Number(d.totalFloors) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['towers'] }); reset({ totalFloors: 0 }); alert('Tower updated!'); },
    onError: (e: any) => alert(e.response?.data?.message || 'Error'),
  });
  function selectTower(t: any) { Object.keys(t).forEach(k => setValue(k as any, t[k])); setValue('projectId', t.projectId); }
  return (
    <div>
      <PageHeader title="Edit Tower" subtitle="Modify tower name, code, or floor count" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <div><Label className="text-xs">Project *</Label>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full border rounded px-2 h-9 text-sm mt-1">
              <option value="">-- Select Project --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          {editingId && (
            <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3 border-t pt-3">
              <p className="text-xs text-orange-600 font-medium">Editing Tower ID: {editingId}</p>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Tower Name *</Label><Input {...register('name')} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Tower Code *</Label><Input {...register('code')} className="mt-1 h-9 text-sm" /></div>
                <div><Label className="text-xs">Total Floors</Label><Input type="number" {...register('totalFloors')} className="mt-1 h-9 text-sm" /></div>
              </div>
              <div className="flex gap-2 pt-2 border-t">
                <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Update Tower</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => reset({ totalFloors: 0 })}>Cancel</Button>
              </div>
            </form>
          )}
          {!editingId && selectedProject && <p className="text-xs text-gray-400 italic">Select a tower from the list to edit.</p>}
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Towers ({(towers as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{['#','Code','Tower Name','Floors','Action'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(towers as any[]).map((t: any, i) => (
              <tr key={t.id} className={editingId===t.id?'bg-orange-50':(i%2===0?'bg-white':'bg-gray-50')}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2 font-medium">{t.code}</td>
                <td className="px-2 py-2">{t.name}</td>
                <td className="px-2 py-2">{t.totalFloors}</td>
                <td className="px-2 py-2"><Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={()=>selectTower(t)}>Edit</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
