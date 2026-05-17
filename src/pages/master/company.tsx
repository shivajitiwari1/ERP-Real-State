// src/pages/master/company.tsx
import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as Dialog from '@radix-ui/react-dialog';
import { Pencil, Trash2, ChevronDown, X } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ── Schema ──────────────────────────────────────────────────────────────────
const schema = z.object({
  id: z.number().optional(),
  code: z.string().min(1, 'Required'),
  groupName: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
  address1: z.string().min(1, 'Required'),
  address2: z.string().optional(),
  address3: z.string().optional(),
  city: z.string().min(1, 'Required'),
  stateText: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  pin: z.string().min(1, 'Required'),
  phone: z.string().optional(),
  fax: z.string().optional(),
  email: z.union([z.string().email('Invalid email'), z.literal('')]).optional(),
  website: z.string().optional(),
  cin: z.string().optional(),
  serviceTaxNo: z.string().optional(),
  panNo: z.string().optional(),
  vatRegNo: z.string().optional(),
  stateId: z.string().optional(),
  payableAt: z.string().optional(),
  logo: z.string().optional(),
});
type FD = z.infer<typeof schema>;

// ── Field helper ─────────────────────────────────────────────────────────────
function TF({ label, name, register, error, type = 'text', required = false }: any) {
  return (
    <div>
      <Label className="text-xs text-gray-600 block mb-0.5">
        {required && <span className="text-red-500 mr-0.5">*</span>}{label}
      </Label>
      <Input type={type} {...register(name)} className="h-7 text-xs rounded-none border-gray-300" />
      {error && <p className="text-red-500 text-[10px] mt-0.5">{error.message}</p>}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function CompanyPage() {
  const qc = useQueryClient();
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [logoPath, setLogoPath] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoName, setLogoName] = useState('');

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<FD | null>(null);

  const { data: companies = [] } = useQuery<any[]>({
    queryKey: ['company'],
    queryFn: () => axios.get('/api/master/company').then(r => r.data.data),
  });

  const { data: states = [] } = useQuery<any[]>({
    queryKey: ['states'],
    queryFn: () => axios.get('/api/master/states').then(r => r.data.data),
  });

  const { register, handleSubmit, reset, setValue, watch, getValues, control, formState: { errors } } = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: { stateId: '' },
  });

  const editingId = watch('id');
  const companyName = watch('name');

  function clearLogo() {
    setLogoPath('');
    setLogoName('');
    setLogoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const save = useMutation({
    mutationFn: (d: FD) => {
      const payload = { ...d, state: d.stateText, logo: logoPath || d.logo };
      return d.id
        ? axios.put('/api/master/company', payload)
        : axios.post('/api/master/company', payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company'] });
      reset();
      clearLogo();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => axios.delete('/api/master/company', { data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['company'] }),
    onError: (err: any) => alert(err?.response?.data?.message ?? 'Delete failed'),
  });

  function onEdit(c: any) {
    reset({
      id: c.id,
      code: c.code,
      groupName: c.groupName,
      name: c.name,
      address1: c.address1,
      address2: c.address2 ?? '',
      address3: c.address3 ?? '',
      city: c.city,
      stateText: c.state,
      country: c.country,
      pin: c.pin,
      phone: c.phone ?? '',
      fax: c.fax ?? '',
      email: c.email ?? '',
      website: c.website ?? '',
      cin: c.cin ?? '',
      serviceTaxNo: c.serviceTaxNo ?? '',
      panNo: c.panNo ?? '',
      vatRegNo: c.vatRegNo ?? '',
      payableAt: c.payableAt ?? '',
      stateId: (() => {
        const match = (states as any[]).find((s: any) => s.name === c.state);
        return match ? String(match.id) : '';
      })(),
      logo: c.logo ?? '',
    });
    setLogoPath(c.logo ?? '');
    setLogoName(c.logo ? c.logo.split('/').pop() ?? '' : '');
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function onDelete(id: number) {
    if (!window.confirm('Delete this company? This cannot be undone.')) return;
    deleteMutation.mutate(id);
  }

  async function handleAttach() {
    if (!logoFile) return;
    setLogoUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', logoFile);
      const res = await axios.post('/api/master/upload-logo', fd);
      setLogoPath(res.data.data.path);
      setLogoName(logoFile.name);
    } catch {
      alert('Logo upload failed. Check file type and size (max 2 MB).');
    } finally {
      setLogoUploading(false);
    }
  }

  function handleView() {
    const vals = getValues();
    setViewData({ ...vals, logo: logoPath || vals.logo });
    setViewOpen(true);
  }

  return (
    <div ref={formRef}>
      {/* Page header */}
      <div className="flex justify-between items-center mb-2">
        <PageHeader title="Company Master" />
        <span className="text-xs text-red-500 font-medium pr-4">* Denotes mandatory field</span>
      </div>

      {/* Form card */}
      <div className="bg-white border shadow-sm mb-4">
        <form onSubmit={handleSubmit(d => save.mutate(d))} className="p-3">

          {/* Row 1: Code + Group */}
          <div className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-2">
              <TF label="Code" name="code" register={register} error={errors.code} required />
            </div>
            <div className="col-span-10">
              <TF label="Group" name="groupName" register={register} error={errors.groupName} required />
            </div>
          </div>

          {/* Row 2: Company Name */}
          <div className="mb-2">
            <TF label="Company Name (200 Ch)" name="name" register={register} error={errors.name} required />
          </div>

          {/* Row 3: Address 1 */}
          <div className="mb-2">
            <TF label="Company Address1 (200 Ch)" name="address1" register={register} error={errors.address1} required />
          </div>

          {/* Row 4: Address 2 */}
          <div className="mb-2">
            <TF label="Company Address2 (200 Ch)" name="address2" register={register} error={errors.address2} />
          </div>

          {/* Row 5: Address 3 */}
          <div className="mb-2">
            <TF label="Company Address3 (200 Ch)" name="address3" register={register} error={errors.address3} />
          </div>

          {/* Row 6: City · State · Country · Pin · Phone · Fax */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <TF label="City" name="city" register={register} error={errors.city} required />
            <TF label="State" name="stateText" register={register} error={errors.stateText} required />
            <TF label="Country" name="country" register={register} error={errors.country} required />
            <TF label="Pin Code" name="pin" register={register} error={errors.pin} required />
            <TF label="Phone No." name="phone" register={register} error={errors.phone} />
            <TF label="Fax No." name="fax" register={register} error={errors.fax} />
          </div>

          {/* Row 7: Email · Website · CIN · ServiceTax · PAN · VAT */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <TF label="E-Mail" name="email" type="email" register={register} error={errors.email} />
            <TF label="Website" name="website" register={register} error={errors.website} />
            <TF label="C.I.No." name="cin" register={register} error={errors.cin} />
            <TF label="Service Tax No." name="serviceTaxNo" register={register} error={errors.serviceTaxNo} />
            <TF label="PAN No." name="panNo" register={register} error={errors.panNo} />
            <TF label="VAT No." name="vatRegNo" register={register} error={errors.vatRegNo} />
          </div>

          {/* Row 8: State dropdown + Payable At */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div className="col-span-2">
              <Label className="text-xs text-gray-600 block mb-0.5">State</Label>
              <Controller
                name="stateId"
                control={control}
                render={({ field }) => (
                  <SelectPrimitive.Root
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      const found = (states as any[]).find((s: any) => String(s.id) === val);
                      setValue('stateText', found ? found.name : '');
                    }}
                  >
                    <SelectPrimitive.Trigger className="flex h-7 w-full items-center justify-between border border-gray-300 bg-white px-2 text-xs rounded-none focus:outline-none">
                      <SelectPrimitive.Value placeholder="<-Select->" />
                      <SelectPrimitive.Icon><ChevronDown className="h-3 w-3 text-gray-500" /></SelectPrimitive.Icon>
                    </SelectPrimitive.Trigger>
                    <SelectPrimitive.Portal>
                      <SelectPrimitive.Content className="z-50 bg-white border border-gray-200 shadow-lg rounded max-h-48 overflow-auto">
                        <SelectPrimitive.Viewport>
                          {(states as any[]).map((s: any) => (
                            <SelectPrimitive.Item key={s.id} value={String(s.id)} className="px-3 py-1.5 text-xs cursor-pointer hover:bg-orange-50 outline-none">
                              <SelectPrimitive.ItemText>{s.name}</SelectPrimitive.ItemText>
                            </SelectPrimitive.Item>
                          ))}
                        </SelectPrimitive.Viewport>
                      </SelectPrimitive.Content>
                    </SelectPrimitive.Portal>
                  </SelectPrimitive.Root>
                )}
              />
            </div>
            <div className="col-span-4">
              <TF label="Payable At" name="payableAt" register={register} error={errors.payableAt} />
            </div>
          </div>

          {/* Row 9: Logo upload */}
          <div className="mb-3">
            <Label className="text-xs text-gray-600 block mb-0.5">
              Company Logo:(width=145px and height=72px)
            </Label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.gif,.svg,.webp"
                className="text-xs border border-gray-300 p-0.5"
                onChange={e => setLogoFile(e.target.files?.[0] ?? null)}
              />
              <Button
                type="button"
                size="sm"
                className="h-7 text-xs bg-blue-600 hover:bg-blue-700 rounded-none px-3"
                onClick={handleAttach}
                disabled={!logoFile || logoUploading}
              >
                {logoUploading ? 'Uploading...' : 'ATTACH'}
              </Button>
              {logoName && (
                <span className="text-xs text-green-600">{logoName}</span>
              )}
              {logoPath && (
                <img src={logoPath} alt="logo preview" width={72} height={36} className="object-contain border border-gray-200 ml-2" />
              )}
            </div>
          </div>

          {/* Row 10: Buttons */}
          <div className="flex items-center gap-2 border-t pt-2">
            <Button type="submit" size="sm" className="h-7 text-xs bg-orange-500 hover:bg-orange-600 rounded-none px-4" disabled={save.isPending}>
              {save.isPending ? 'Saving...' : 'SAVE'}
            </Button>
            <Button type="button" size="sm" variant="outline" className="h-7 text-xs rounded-none px-4 border-gray-400" onClick={handleView} disabled={!editingId && !companyName}>
              VIEW
            </Button>
            <Button type="button" size="sm" variant="outline" className="h-7 text-xs rounded-none px-4 border-gray-400" onClick={() => { reset(); clearLogo(); }}>
              CLOSE
            </Button>
          </div>
          {save.isError && (
            <p className="text-red-500 text-xs mt-1">{String((save.error as any)?.response?.data?.message ?? 'Save failed')}</p>
          )}
        </form>
      </div>

      {/* Company Details table */}
      <div className="bg-white border shadow-sm">
        <div className="bg-slate-700 px-3 py-1.5">
          <h3 className="text-white text-xs font-bold uppercase tracking-wide">Company Details</h3>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-3 py-2 text-center border border-blue-800">S. NO.</th>
                <th className="px-3 py-2 text-center border border-blue-800">CODE</th>
                <th className="px-3 py-2 text-center border border-blue-800">GROUP NAME</th>
                <th className="px-3 py-2 text-center border border-blue-800">COMPANY NAME</th>
                <th className="px-3 py-2 text-center border border-blue-800">EDIT</th>
                <th className="px-3 py-2 text-center border border-blue-800">DELETE</th>
              </tr>
            </thead>
            <tbody>
              {(companies as any[]).length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-400 py-8 italic">No companies added yet</td></tr>
              ) : (companies as any[]).map((c, i) => (
                <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-center border border-gray-100">{i + 1}</td>
                  <td className="px-3 py-1.5 text-center border border-gray-100">{c.code}</td>
                  <td className="px-3 py-1.5 text-center border border-gray-100">{c.groupName}</td>
                  <td className="px-3 py-1.5 text-center border border-gray-100">{c.name}</td>
                  <td className="px-3 py-1.5 text-center border border-gray-100">
                    <button onClick={() => onEdit(c)} className="text-blue-600 hover:text-blue-800">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </td>
                  <td className="px-3 py-1.5 text-center border border-gray-100">
                    <button onClick={() => onDelete(c.id)} className="text-red-500 hover:text-red-700" disabled={deleteMutation.isPending}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-2 border-t">
          <Button size="sm" variant="outline" className="h-7 text-xs rounded-none px-4" onClick={() => window.print()}>
            PRINT
          </Button>
        </div>
      </div>

      {/* VIEW modal */}
      <Dialog.Root open={viewOpen} onOpenChange={setViewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white border shadow-xl w-[640px] max-h-[80vh] overflow-auto p-0">
            <div className="bg-slate-700 px-4 py-2 flex justify-between items-center">
              <Dialog.Title className="text-white text-sm font-bold">Company Details</Dialog.Title>
              <Dialog.Close className="text-white hover:text-gray-300"><X className="h-4 w-4" /></Dialog.Close>
            </div>
            {viewData && (
              <div className="p-4 text-xs space-y-2">
                <ViewRow label="Code" value={viewData.code} />
                <ViewRow label="Group" value={viewData.groupName} />
                <ViewRow label="Company Name" value={viewData.name} />
                <ViewRow label="Address 1" value={viewData.address1} />
                {viewData.address2 && <ViewRow label="Address 2" value={viewData.address2} />}
                {viewData.address3 && <ViewRow label="Address 3" value={viewData.address3} />}
                <div className="grid grid-cols-3 gap-2">
                  <ViewRow label="City" value={viewData.city} />
                  <ViewRow label="State" value={viewData.stateText} />
                  <ViewRow label="Country" value={viewData.country} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <ViewRow label="PIN" value={viewData.pin} />
                  <ViewRow label="Phone" value={viewData.phone} />
                  <ViewRow label="Fax" value={viewData.fax} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ViewRow label="Email" value={viewData.email} />
                  <ViewRow label="Website" value={viewData.website} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <ViewRow label="CIN" value={viewData.cin} />
                  <ViewRow label="Service Tax No." value={viewData.serviceTaxNo} />
                  <ViewRow label="PAN No." value={viewData.panNo} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ViewRow label="VAT No." value={viewData.vatRegNo} />
                  <ViewRow label="Payable At" value={viewData.payableAt} />
                </div>
                {viewData.logo && (
                  <div>
                    <span className="text-gray-500 font-medium">Company Logo:</span>
                    <div className="mt-1">
                      <img src={viewData.logo} alt="Company logo" width={145} height={72} className="object-contain border border-gray-200" />
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t text-right">
                  <Dialog.Close asChild>
                    <Button size="sm" variant="outline" className="h-7 text-xs rounded-none px-4">CLOSE</Button>
                  </Dialog.Close>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function ViewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <span className="text-gray-500 font-medium">{label}: </span>
      <span className="text-gray-800">{value || '—'}</span>
    </div>
  );
}
