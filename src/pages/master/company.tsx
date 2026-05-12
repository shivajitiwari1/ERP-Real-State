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
  id: z.number().optional(),
  code: z.string().min(1, 'Required'),
  groupName: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
  address1: z.string().min(1, 'Required'),
  address2: z.string().optional(),
  address3: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  pin: z.string().min(1, 'Required'),
  phone: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  cin: z.string().optional(),
  serviceTaxNo: z.string().optional(),
  panNo: z.string().optional(),
  vatRegNo: z.string().optional(),
  payableAt: z.string().optional(),
});
type FD = z.infer<typeof schema>;

function Field({ label, name, register, error, type = 'text', className = '' }: any) {
  return (
    <div className={className}>
      <Label className="text-xs text-gray-600">{label}</Label>
      <Input type={type} {...register(name)} className="mt-1 h-9 text-sm" />
      {error && <p className="text-red-500 text-xs mt-0.5">{error.message}</p>}
    </div>
  );
}

export default function CompanyPage() {
  const qc = useQueryClient();
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['company'],
    queryFn: () => axios.get('/api/master/company').then(r => r.data.data),
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FD>({
    resolver: zodResolver(schema),
  });
  const editingId = watch('id');

  const save = useMutation({
    mutationFn: (d: FD) => d.id ? axios.put('/api/master/company', d) : axios.post('/api/master/company', d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['company'] }); reset(); },
  });

  function onEdit(c: any) {
    Object.keys(c).forEach(k => setValue(k as any, c[k]));
  }

  return (
    <div>
      <PageHeader title="Company Creation" />
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 bg-white p-4 rounded border shadow-sm">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">
            {editingId ? 'Edit Company' : 'Add Company'}
          </h3>
          <form onSubmit={handleSubmit(d => save.mutate(d))} className="grid grid-cols-2 gap-3">
            <Field label="Code *" name="code" register={register} error={errors.code} />
            <Field label="Group Name *" name="groupName" register={register} error={errors.groupName} />
            <Field label="Company Name *" name="name" register={register} error={errors.name} className="col-span-2" />
            <Field label="Address Line 1 *" name="address1" register={register} error={errors.address1} className="col-span-2" />
            <Field label="Address Line 2" name="address2" register={register} error={errors.address2} className="col-span-2" />
            <Field label="Address Line 3" name="address3" register={register} error={errors.address3} className="col-span-2" />
            <Field label="City *" name="city" register={register} error={errors.city} />
            <Field label="State *" name="state" register={register} error={errors.state} />
            <Field label="Country *" name="country" register={register} error={errors.country} />
            <Field label="PIN Code *" name="pin" register={register} error={errors.pin} />
            <Field label="Phone" name="phone" register={register} error={errors.phone} />
            <Field label="Fax" name="fax" register={register} error={errors.fax} />
            <Field label="Email" name="email" type="email" register={register} error={errors.email} />
            <Field label="Website" name="website" register={register} error={errors.website} />
            <Field label="CIN" name="cin" register={register} error={errors.cin} />
            <Field label="Service Tax No." name="serviceTaxNo" register={register} error={errors.serviceTaxNo} />
            <Field label="PAN No." name="panNo" register={register} error={errors.panNo} />
            <Field label="VAT Reg. No." name="vatRegNo" register={register} error={errors.vatRegNo} />
            <Field label="Payable At" name="payableAt" register={register} error={errors.payableAt} className="col-span-2" />
            <div className="col-span-2 flex gap-2 pt-2 border-t">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>
                {save.isPending ? 'Saving...' : editingId ? 'Update' : 'Save'}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset()}>Clear</Button>
            </div>
            {save.isError && (
              <p className="col-span-2 text-red-500 text-xs">{String((save.error as any)?.response?.data?.message || 'Save failed')}</p>
            )}
          </form>
        </div>
        <div className="xl:col-span-3 bg-white p-4 rounded border shadow-sm">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">
            Companies ({(companies as any[]).length})
          </h3>
          {isLoading ? <p className="text-sm text-gray-400">Loading...</p> : (
            <div className="overflow-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-700 text-white text-xs">
                    <th className="px-2 py-2 text-left">S.No.</th>
                    <th className="px-2 py-2 text-left">Code</th>
                    <th className="px-2 py-2 text-left">Company Name</th>
                    <th className="px-2 py-2 text-left">City</th>
                    <th className="px-2 py-2 text-left">Phone</th>
                    <th className="px-2 py-2 text-left">PAN</th>
                    <th className="px-2 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(companies as any[]).length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-gray-400 py-8 italic text-xs">No companies added yet</td></tr>
                  ) : (companies as any[]).map((c, i) => (
                    <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-2 py-2 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-2 py-2 font-medium">{c.code}</td>
                      <td className="px-2 py-2">{c.name}</td>
                      <td className="px-2 py-2">{c.city}</td>
                      <td className="px-2 py-2">{c.phone || '-'}</td>
                      <td className="px-2 py-2">{c.panNo || '-'}</td>
                      <td className="px-2 py-2 text-center">
                        <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => onEdit(c)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
