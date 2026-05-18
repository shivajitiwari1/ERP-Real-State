import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FD = {
  id?: number; code: string; companyName: string; firstName: string; middleName: string; lastName: string;
  designation: string; dob: string; panNo: string; tanNo: string; serviceTaxNo: string;
  isGstRegistered: boolean; isTdsApplicable: boolean; depositMoney: number; mobile: string;
  email: string; address: string; city: string; state: string; pincode: string;
  bankName: string; bankBranch: string; accountNo: string; ifsc: string; remark: string; isActive: boolean;
};

const F = ({ label, name, register, type = 'text', cls = '' }: any) => (
  <div className={cls}>
    <Label className="text-xs">{label}</Label>
    <Input type={type} {...register(name)} className="mt-1 h-9 text-sm" />
  </div>
);

export default function BrokerApplicationPage() {
  const qc = useQueryClient();
  const { data: brokers = [] } = useQuery({ queryKey: ['brokers'], queryFn: () => axios.get('/api/broker').then(r => r.data.data) });
  const { register, handleSubmit, reset, setValue, watch } = useForm<FD>({ defaultValues: { isGstRegistered: false, isTdsApplicable: false, isActive: true, depositMoney: 0 } });
  const editingId = watch('id');
  const save = useMutation({
    mutationFn: (d: FD) => d.id ? axios.put('/api/broker', d) : axios.post('/api/broker', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['brokers'] }); reset({ isGstRegistered: false, isTdsApplicable: false, isActive: true, depositMoney: 0 }); },
  });
  return (
    <div>
      <PageHeader title="Broker Application" />
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 bg-white p-4 rounded border shadow-sm">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">{editingId ? 'Edit Broker' : 'Add Broker'}</h3>
          <form onSubmit={handleSubmit(d => save.mutate({ ...d, depositMoney: Number(d.depositMoney) }))} className="grid grid-cols-2 gap-3">
            <F label="Broker Code *" name="code" register={register} />
            <F label="Company Name" name="companyName" register={register} />
            <F label="First Name *" name="firstName" register={register} />
            <F label="Middle Name" name="middleName" register={register} />
            <F label="Last Name *" name="lastName" register={register} />
            <F label="Designation" name="designation" register={register} />
            <F label="Date of Birth" name="dob" register={register} type="date" />
            <F label="PAN No." name="panNo" register={register} />
            <F label="TAN No." name="tanNo" register={register} />
            <F label="Service Tax No." name="serviceTaxNo" register={register} />
            <F label="Mobile" name="mobile" register={register} />
            <F label="Email" name="email" register={register} type="email" />
            <F label="City" name="city" register={register} />
            <F label="State" name="state" register={register} />
            <F label="Pincode" name="pincode" register={register} />
            <F label="Deposit Money" name="depositMoney" register={register} type="number" />
            <F label="Bank Name" name="bankName" register={register} />
            <F label="Branch" name="bankBranch" register={register} />
            <F label="Account No." name="accountNo" register={register} />
            <F label="IFSC" name="ifsc" register={register} />
            <div className="col-span-2"><Label className="text-xs">Address</Label><textarea {...register('address')} className="w-full border rounded px-2 py-1 text-sm mt-1 h-16 resize-none" /></div>
            <div className="col-span-2"><Label className="text-xs">Remark</Label><textarea {...register('remark')} className="w-full border rounded px-2 py-1 text-sm mt-1 h-12 resize-none" /></div>
            <div className="col-span-2 flex gap-4 text-xs">
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" {...register('isGstRegistered')} /> GST Registered</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" {...register('isTdsApplicable')} /> TDS Applicable</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" {...register('isActive')} defaultChecked /> Active</label>
            </div>
            <div className="col-span-2 flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>{editingId ? 'Update' : 'Save'}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset({ isGstRegistered: false, isTdsApplicable: false, isActive: true, depositMoney: 0 })}>Clear</Button>
            </div>
            {save.isError && <p className="col-span-2 text-red-500 text-xs">{String((save.error as any)?.response?.data?.message)}</p>}
          </form>
        </div>
        <div className="xl:col-span-3 bg-white p-4 rounded border shadow-sm overflow-auto">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Brokers ({(brokers as any[]).length})</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{['#','Code','Name','Company','Mobile','PAN','Status','Action'].map(h=><th key={h} className="px-2 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{(brokers as any[]).map((b: any, i) => (
              <tr key={b.id} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2 text-gray-400">{i+1}</td>
                <td className="px-2 py-2 font-medium">{b.code}</td>
                <td className="px-2 py-2">{b.firstName} {b.lastName}</td>
                <td className="px-2 py-2">{b.companyName || '-'}</td>
                <td className="px-2 py-2">{b.mobile || '-'}</td>
                <td className="px-2 py-2">{b.panNo || '-'}</td>
                <td className="px-2 py-2"><span className={`px-1.5 py-0.5 rounded text-xs ${b.isActive?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{b.isActive?'Active':'Inactive'}</span></td>
                <td className="px-2 py-2"><Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={()=>{Object.keys(b).forEach(k=>setValue(k as any,b[k]));setValue('id',b.id);}}>Edit</Button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
