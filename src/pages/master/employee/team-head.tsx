import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function TeamHeadPage() {
  const { data: employees = [] } = useQuery<any[]>({ queryKey: ['employees'], queryFn: () => axios.get('/api/master/employee/info').then(r => r.data.data) });
  const { data: departments = [] } = useQuery<any[]>({ queryKey: ['departments'], queryFn: () => axios.get('/api/master/employee/department').then(r => r.data.data) });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();
  const [saved, setSaved] = useState<any[]>([]);

  function onSubmit(data: any) {
    setSaved(prev => {
      const existing = prev.findIndex(s => s.departmentId === data.departmentId);
      if (existing >= 0) { const updated = [...prev]; updated[existing] = data; return updated; }
      return [...prev, data];
    });
    reset();
  }

  const deptMap: Record<string, string> = {};
  (departments as any[]).forEach((d: any) => { deptMap[d.id] = d.name; });
  const empMap: Record<string, string> = {};
  (employees as any[]).forEach((e: any) => { empMap[e.id] = `${e.firstName} ${e.lastName}`; });

  return (
    <div>
      <PageHeader title="Set Team Head" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg shadow-sm p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-600 uppercase border-b pb-2">Assign Team Head</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <Label className="text-xs">Department</Label>
              <select {...register('departmentId', { required: true })} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">Select Department</option>
                {(departments as any[]).map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              {errors.departmentId && <p className="text-red-500 text-xs mt-1">Department is required</p>}
            </div>
            <div>
              <Label className="text-xs">Team Head (Employee)</Label>
              <select {...register('employeeId', { required: true })} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">Select Employee</option>
                {(employees as any[]).filter((e: any) => e.isActive).map((e: any) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} — {e.designation || 'Staff'}</option>)}
              </select>
              {errors.employeeId && <p className="text-red-500 text-xs mt-1">Employee is required</p>}
            </div>
            <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600">Save</Button>
          </form>
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">Team Head Assignments</div>
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-100"><th className="px-3 py-2 text-left">Department</th><th className="px-3 py-2 text-left">Team Head</th></tr></thead>
            <tbody>{saved.length === 0 ? <tr><td colSpan={2} className="text-center py-6 text-gray-400 italic">No assignments yet</td></tr> : saved.map((s, i) => <tr key={i} className="border-t"><td className="px-3 py-2">{deptMap[s.departmentId] || s.departmentId}</td><td className="px-3 py-2">{empMap[s.employeeId] || s.employeeId}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
