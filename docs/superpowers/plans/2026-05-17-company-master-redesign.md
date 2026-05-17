# Company Master Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Company Master page to match the reference ERP screenshot — stacked layout, logo upload, State dropdown, VIEW modal, DELETE action, and updated table columns.

**Architecture:** Three new/modified API routes handle DELETE, logo upload, and states list. The frontend page is a full rewrite of `company.tsx` using the existing form/query stack (React Hook Form + Zod + React Query + Axios), Radix UI primitives for Select and Dialog, and Lucide icons for edit/delete buttons.

**Tech Stack:** Next.js 14 Pages Router · TypeScript · React Hook Form + Zod · TanStack React Query v5 · Axios · multer v2 (file upload) · Radix UI Select + Dialog · Lucide React · Tailwind CSS

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/pages/api/master/states.ts` | Create | GET list of all states for dropdown |
| `src/pages/api/master/company.ts` | Modify | Add DELETE handler |
| `src/pages/api/master/upload-logo.ts` | Create | POST multipart logo, save to disk, return path |
| `src/pages/master/company.tsx` | Full rewrite | Page UI — stacked layout, form, modal, table |
| `public/uploads/logos/.gitkeep` | Create | Ensure upload directory exists in git |

---

## Task 1: States API endpoint

**Files:**
- Create: `src/pages/api/master/states.ts`

- [ ] **Step 1: Create the states endpoint**

```typescript
// src/pages/api/master/states.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { State } from '@/models';
import { ok, unauthorized, serverError } from '@/lib/api-response';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const states = await State.findAll({ order: [['name', 'ASC']] });
    return ok(res, states);
  } catch (err) {
    return serverError(res, err);
  }
}
```

- [ ] **Step 2: Verify via curl / browser**

Open in browser (while `npm run dev` is running):
```
http://localhost:3000/api/master/states
```
Expected: JSON array of `{ id, countryId, name }` objects ordered by name.
If states table is empty, expected: `{ data: [] }`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/master/states.ts
git commit -m "feat: add GET /api/master/states endpoint"
```

---

## Task 2: Add DELETE to company API

**Files:**
- Modify: `src/pages/api/master/company.ts`

- [ ] **Step 1: Add DELETE handler after the PUT block**

Open `src/pages/api/master/company.ts`. After the `if (req.method === 'PUT')` block (line ~49), add:

```typescript
    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return badRequest(res, 'ID required');
      await Company.destroy({ where: { id } });
      return ok(res, null, 'Company deleted successfully');
    }
```

The final handler should end with `res.status(405).end();` as before.

- [ ] **Step 2: Verify the DELETE handler works**

Run `npm run dev`. Use the browser DevTools console or a REST client:
```javascript
fetch('/api/master/company', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: 999 }) // non-existent ID
}).then(r => r.json()).then(console.log)
```
Expected: `{ success: true, message: 'Company deleted successfully' }` (Sequelize `destroy` on missing row does not throw, returns 0 rows affected — that's fine).

- [ ] **Step 3: Commit**

```bash
git add src/pages/api/master/company.ts
git commit -m "feat: add DELETE /api/master/company endpoint"
```

---

## Task 3: Logo upload API + uploads directory

**Files:**
- Create: `src/pages/api/master/upload-logo.ts`
- Create: `public/uploads/logos/.gitkeep`

- [ ] **Step 1: Create the uploads directory**

```bash
mkdir -p public/uploads/logos
touch public/uploads/logos/.gitkeep
```

- [ ] **Step 2: Create the upload endpoint**

```typescript
// src/pages/api/master/upload-logo.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import multer from 'multer';
import path from 'path';
import { unauthorized, serverError } from '@/lib/api-response';

export const config = { api: { bodyParser: false } };

const storage = multer.diskStorage({
  destination: 'public/uploads/logos',
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  if (req.method !== 'POST') return res.status(405).end();
  try {
    await runMiddleware(req, res, upload.single('file'));
    const file = (req as any).file;
    if (!file) return res.status(400).json({ success: false, message: 'No file uploaded or invalid type' });
    const filePath = `/uploads/logos/${file.filename}`;
    return res.status(200).json({ success: true, data: { path: filePath } });
  } catch (err) {
    return serverError(res, err);
  }
}
```

- [ ] **Step 3: Test the upload endpoint**

Start `npm run dev`. In browser DevTools console:
```javascript
const fd = new FormData();
fd.append('file', new File(['test'], 'test.png', { type: 'image/png' }));
fetch('/api/master/upload-logo', { method: 'POST', body: fd })
  .then(r => r.json()).then(console.log);
```
Expected: `{ success: true, data: { path: '/uploads/logos/<timestamp>-test.png' } }`

Check that the file exists in `public/uploads/logos/`.

- [ ] **Step 4: Commit**

```bash
git add public/uploads/logos/.gitkeep src/pages/api/master/upload-logo.ts
git commit -m "feat: add POST /api/master/upload-logo endpoint with multer"
```

---

## Task 4: Rewrite company.tsx — skeleton, header, and form fields

**Files:**
- Modify: `src/pages/master/company.tsx` (full rewrite)

This task rewrites the entire file. Subsequent tasks (5, 6, 7, 8) modify specific parts of this file.

- [ ] **Step 1: Replace company.tsx with the new skeleton + complete form**

```tsx
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

  // logo upload state
  const [logoPath, setLogoPath] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoName, setLogoName] = useState('');

  // VIEW modal state
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

  const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: { stateId: '' },
  });

  const editingId = watch('id');

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
      setLogoPath('');
      setLogoName('');
      setLogoFile(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => axios.delete('/api/master/company', { data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['company'] }),
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
    const vals = watch();
    setViewData({ ...vals, logo: logoPath || vals.logo });
    setViewOpen(true);
  }

  // ── Render ──────────────────────────────────────────────────────────────────
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
                  <SelectPrimitive.Root value={field.value} onValueChange={field.onChange}>
                    <SelectPrimitive.Trigger className="flex h-7 w-full items-center justify-between border border-gray-300 bg-white px-2 text-xs rounded-none focus:outline-none">
                      <SelectPrimitive.Value placeholder="<-Select->" />
                      <SelectPrimitive.Icon><ChevronDown className="h-3 w-3 text-gray-500" /></SelectPrimitive.Icon>
                    </SelectPrimitive.Trigger>
                    <SelectPrimitive.Portal>
                      <SelectPrimitive.Content className="z-50 bg-white border border-gray-200 shadow-lg rounded max-h-48 overflow-auto">
                        <SelectPrimitive.Viewport>
                          <SelectPrimitive.Item value="" className="px-3 py-1.5 text-xs cursor-pointer hover:bg-orange-50 outline-none">
                            <SelectPrimitive.ItemText>&lt;-Select-&gt;</SelectPrimitive.ItemText>
                          </SelectPrimitive.Item>
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
                type="file"
                accept="image/*"
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
            <Button type="button" size="sm" variant="outline" className="h-7 text-xs rounded-none px-4 border-gray-400" onClick={handleView} disabled={!editingId && !watch('name')}>
              VIEW
            </Button>
            <Button type="button" size="sm" variant="outline" className="h-7 text-xs rounded-none px-4 border-gray-400" onClick={() => { reset(); setLogoPath(''); setLogoName(''); setLogoFile(null); }}>
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
                  <td className="px-3 py-1.5 border border-gray-100">{c.name}</td>
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: No errors. Fix any type errors before proceeding.

- [ ] **Step 3: Start dev server and open the page**

```bash
npm run dev
```
Open `http://localhost:3000/master/company`.

Verify:
- Page header shows "Company Master" with "* Denotes mandatory field" on the right
- Form has all 10 rows in correct order
- State dropdown (row 8) shows `<-Select->` and opens a list of states when clicked
- All required fields show red asterisk in label
- SAVE button is orange, VIEW and CLOSE are outlined grey
- Company Details table shows correct columns: S.NO. | CODE | GROUP NAME | COMPANY NAME | EDIT | DELETE

- [ ] **Step 4: Test SAVE**

Fill in all required fields (Code, Group, Company Name, Address1, City, State text, Country, Pin). Click SAVE.
Expected: Form resets, new row appears in the table below.

- [ ] **Step 5: Test CLOSE**

Fill some fields, click CLOSE. Expected: All form fields clear.

- [ ] **Step 6: Test EDIT**

Click the pencil icon on a table row. Expected: Form fills with that row's data and page scrolls up to the form.

- [ ] **Step 7: Test DELETE**

Click the trash icon on a table row. Expected: Browser confirm dialog appears. Click OK → row disappears from table.

- [ ] **Step 8: Test logo ATTACH**

Choose an image file, click ATTACH. Expected: "Uploading..." momentarily, then filename appears next to button and a small preview renders.

- [ ] **Step 9: Test VIEW modal**

After editing or filling in a company, click VIEW. Expected: Modal opens with all field values shown. Logo appears if one was attached. CLOSE button dismisses the modal.

- [ ] **Step 10: Commit**

```bash
git add src/pages/master/company.tsx
git commit -m "feat: rewrite Company Master page — stacked layout, logo upload, VIEW modal, DELETE, State dropdown"
```

---

## Self-Review Checklist

- [x] **States API** — Task 1 covers `GET /api/master/states`
- [x] **DELETE API** — Task 2 covers `DELETE /api/master/company`
- [x] **Logo upload API** — Task 3 covers `POST /api/master/upload-logo` with multer
- [x] **Stacked layout** — Task 4 rewrites page with stacked form → table structure
- [x] **All 10 form rows** — All rows present in Task 4 code
- [x] **State dropdown (row 8)** — Radix UI Select with states from DB, Controller-bound
- [x] **Logo ATTACH button** — separate upload on click, stores path in state
- [x] **SAVE** — submits with logoPath from state; invalidates query; resets form
- [x] **VIEW modal** — Dialog with all read-only fields + logo preview
- [x] **CLOSE** — resets form + logo state
- [x] **Table columns** — S.NO. | CODE | GROUP NAME | COMPANY NAME | EDIT | DELETE
- [x] **EDIT action** — `onEdit()` uses `reset()` to load all fields; scrolls to top
- [x] **DELETE action** — confirm dialog + `deleteMutation`
- [x] **PRINT button** — `window.print()` below table
- [x] **Type consistency** — `FD` type used consistently across `watch()`, `reset()`, `save.mutate()`
- [x] **`stateText` vs `state`** — form uses `stateText` internally, payload maps to `state` on submit (matching DB column in existing API)
