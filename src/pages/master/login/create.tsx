import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  employeeId: z.coerce.number().int().positive('Select employee'),
  username: z.string().min(3, 'Min 3 characters'),
  password: z.string().min(6, 'Min 6 characters'),
  roleId: z.coerce.number().int().positive('Select role'),
});
type FD = z.infer<typeof schema>;

export default function CreateLoginPage() {
  const qc = useQueryClient();
  const { data: employees = [] } = useQuery({ queryKey: ['employees'], queryFn: () => axios.get('/api/master/employee/info').then(r => r.data.data) });
  const { data: roles = [] } = useQuery({ queryKey: ['roles'], queryFn: () => axios.get('/api/master/roles').then(r => r.data.data) });
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: () => axios.get('/api/master/users').then(r => r.data.data) });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FD>({ resolver: zodResolver(schema) });
  const save = useMutation({
    mutationFn: (d: FD) => axios.post('/api/master/users', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); reset(); },
  });
  return (
    <div><PageHeader title="Create Employee Login" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Create Login</h3>
          <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3">
            <div><Label className="text-xs">Employee *</Label>
              <select {...register('employeeId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Employee --</option>
                {(employees as any[]).map((e: any) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.code})</option>)}
              </select>
              {errors.employeeId && <p className="text-red-500 text-xs">{errors.employeeId.message}</p>}
            </div>
            <div><Label className="text-xs">Username *</Label><Input {...register('username')} className="mt-1 h-9 text-sm" />{errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}</div>
            <div><Label className="text-xs">Password *</Label><Input type="password" {...register('password')} className="mt-1 h-9 text-sm" />{errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}</div>
            <div><Label className="text-xs">Role *</Label>
              <select {...register('roleId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Role --</option>
                {(roles as any[]).map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              {errors.roleId && <p className="text-red-500 text-xs">{errors.roleId.message}</p>}
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>
                {save.isPending ? 'Creating...' : 'Create Login'}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset()}>Clear</Button>
            </div>
            {save.isError && <p className="text-red-500 text-xs">{String((save.error as any)?.response?.data?.message)}</p>}
            {save.isSuccess && <p className="text-green-600 text-xs">Login created successfully!</p>}
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">User Logins ({(users as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">{['#','Employee','Username','Role','Status'].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(users as any[]).map((u: any, i) => (
              <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2">{u.Employee?.firstName} {u.Employee?.lastName}</td>
                <td className="px-2 py-2 font-medium">{u.username}</td>
                <td className="px-2 py-2">{u.Role?.name}</td>
                <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
