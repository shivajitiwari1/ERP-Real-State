import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = {
  id?: number; companyId: number; projectTypeId?: number | null;
  name: string; code: string; address?: string; city?: string;
  state?: string; country?: string; pin?: string; email?: string;
  phone?: string; description?: string; startDate?: string;
  possessionDate?: string; isActive: boolean;
};

const F = ({ label, name, register, type = 'text', cls = '' }: any) => (
  <div className={cls}>
    <Label className="text-xs">{label}</Label>
    <Input type={type} {...register(name)} className="mt-1 h-9 text-sm" />
  </div>
);

export default function CreateProjectPage() {
  const qc = useQueryClient();
  const { data: companies = [] } = useQuery({ queryKey: ['companies'], queryFn: () => axios.get('/api/master/company').then(r => r.data.data) });
  const { data: projectTypes = [] } = useQuery({ queryKey: ['project-types'], queryFn: () => axios.get('/api/master/setup/project-type').then(r => r.data.data) });
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });

  const { register, handleSubmit, reset, setValue, watch } = useForm<FD>({
    defaultValues: { isActive: true },
  });
  const editingId = watch('id');

  const save = useMutation({
    mutationFn: (d: FD) => d.id ? axios.put('/api/projects', d) : axios.post('/api/projects', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); reset({ isActive: true }); },
  });

  return (
    <div>
      <PageHeader title="Create / Edit Project" />
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 bg-white p-4 rounded border shadow-sm">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">{editingId ? 'Edit Project' : 'Add Project'}</h3>
          <form onSubmit={handleSubmit(d => save.mutate({ ...d, companyId: Number(d.companyId), projectTypeId: d.projectTypeId ? Number(d.projectTypeId) : null }))}
            className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Company *</Label>
              <select {...register('companyId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Company --</option>
                {(companies as any[]).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs">Project Type</Label>
              <select {...register('projectTypeId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select --</option>
                {(projectTypes as any[]).map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <F label="Project Code *" name="code" register={register} />
            <F label="Project Name *" name="name" register={register} cls="col-span-2" />
            <F label="Address" name="address" register={register} cls="col-span-2" />
            <F label="City" name="city" register={register} />
            <F label="State" name="state" register={register} />
            <F label="Country" name="country" register={register} />
            <F label="PIN" name="pin" register={register} />
            <F label="Phone" name="phone" register={register} />
            <F label="Email" name="email" type="email" register={register} />
            <F label="Start Date" name="startDate" type="date" register={register} />
            <F label="Possession Date" name="possessionDate" type="date" register={register} />
            <div className="col-span-2">
              <Label className="text-xs">Description</Label>
              <textarea {...register('description')} className="w-full border rounded px-2 py-1.5 text-sm mt-1 h-16 resize-none" />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" {...register('isActive')} id="isActive" defaultChecked />
              <label htmlFor="isActive" className="text-xs cursor-pointer">Active</label>
            </div>
            <div className="col-span-2 flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>
                {save.isPending ? 'Saving...' : editingId ? 'Update' : 'Save'}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ isActive: true })}>Clear</Button>
            </div>
            {save.isError && <p className="col-span-2 text-red-500 text-xs">{String((save.error as any)?.response?.data?.message)}</p>}
          </form>
        </div>
        <div className="xl:col-span-3 bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Projects ({(projects as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">
              {['#', 'Code', 'Project Name', 'Company', 'City', 'Possession Date', 'Status', 'Action'].map(h => (
                <th key={h} className="px-2 py-2 text-left">{h}</th>
              ))}
            </tr></thead>
            <tbody>{(projects as any[]).map((p: any, i) => (
              <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                <td className="px-2 py-2 font-medium">{p.code}</td>
                <td className="px-2 py-2">{p.name}</td>
                <td className="px-2 py-2">{p.Company?.name || '-'}</td>
                <td className="px-2 py-2">{p.city || '-'}</td>
                <td className="px-2 py-2">{p.possessionDate || '-'}</td>
                <td className="px-2 py-2">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <Button size="sm" variant="outline" className="h-6 text-xs px-2"
                    onClick={() => { Object.keys(p).forEach(k => setValue(k as any, p[k])); }}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
