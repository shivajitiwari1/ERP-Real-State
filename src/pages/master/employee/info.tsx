import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = {
  id?: number;
  code: string; salutation: string;
  firstName: string; middleName?: string; lastName: string;
  departmentId: number; designation?: string;
  mobile: string; email: string;
  isAdmin: boolean; isTransfer: boolean;
  roleType: 'employee' | 'call_center';
  managerId?: number | null; joiningDate?: string; isActive: boolean;
};

export default function EmployeeInfoPage() {
  const qc = useQueryClient();
  const { data: employees = [] } = useQuery({ queryKey: ['employees'], queryFn: () => axios.get('/api/master/employee/info').then(r => r.data.data) });
  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: () => axios.get('/api/master/employee/department').then(r => r.data.data) });
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FD>({
    defaultValues: { isAdmin: false, isTransfer: false, isActive: true, roleType: 'employee' },
  });
  const editingId = watch('id');
  const save = useMutation({
    mutationFn: (d: FD) => d.id ? axios.put('/api/master/employee/info', d) : axios.post('/api/master/employee/info', { ...d, departmentId: Number(d.departmentId), managerId: d.managerId ? Number(d.managerId) : null }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['employees'] }); reset(); },
  });
  const F = ({ label, name, type = 'text', cls = '' }: any) => (
    <div className={cls}><Label className="text-xs">{label}</Label>
      <Input type={type} {...register(name)} className="mt-1 h-9 text-sm" />
      {(errors as any)[name] && <p className="text-red-500 text-xs">{(errors as any)[name]?.message}</p>}
    </div>
  );
  return (
    <div><PageHeader title="Employee Information" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">{editingId ? 'Edit Employee' : 'Add Employee'}</h3>
          <form onSubmit={handleSubmit(d => save.mutate(d))} className="grid grid-cols-2 gap-3">
            <F label="Employee Code *" name="code" />
            <div><Label className="text-xs">Salutation *</Label>
              <select {...register('salutation')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">--Select--</option>
                {['Mr.','Mrs.','Ms.','Dr.','Prof.'].map(s => <option key={s}>{s}</option>)}
              </select>
              {errors.salutation && <p className="text-red-500 text-xs">{errors.salutation.message}</p>}
            </div>
            <F label="First Name *" name="firstName" />
            <F label="Middle Name" name="middleName" />
            <F label="Last Name *" name="lastName" />
            <div><Label className="text-xs">Department *</Label>
              <select {...register('departmentId', { valueAsNumber: true })} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">--Select--</option>
                {(departments as any[]).map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              {errors.departmentId && <p className="text-red-500 text-xs">{errors.departmentId.message}</p>}
            </div>
            <F label="Designation" name="designation" />
            <F label="Mobile *" name="mobile" />
            <F label="Email *" name="email" type="email" cls="col-span-2" />
            <F label="Joining Date" name="joiningDate" type="date" />
            <div><Label className="text-xs">Role Type</Label>
              <select {...register('roleType')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="employee">Employee</option>
                <option value="call_center">Call Center</option>
              </select>
            </div>
            <div className="col-span-2 flex gap-4 items-center text-sm">
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" {...register('isAdmin')} /> Admin
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" {...register('isActive')} defaultChecked /> Active
              </label>
            </div>
            <div className="col-span-2 flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>
                {save.isPending ? 'Saving...' : editingId ? 'Update' : 'Save'}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset()}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Employees ({(employees as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-700 text-white">
              {['#','Code','Name','Department','Mobile','Status','Action'].map(h => <th key={h} className="px-2 py-2 text-left">{h}</th>)}
            </tr></thead>
            <tbody>{(employees as any[]).map((e: any, i) => (
              <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2 font-medium">{e.code}</td>
                <td className="px-2 py-2">{e.firstName} {e.lastName}</td>
                <td className="px-2 py-2">{e.Department?.name || '-'}</td>
                <td className="px-2 py-2">{e.mobile}</td>
                <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded text-xs ${e.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{e.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-2 py-2"><Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => { Object.keys(e).forEach(k => setValue(k as any, e[k])); }}>Edit</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
