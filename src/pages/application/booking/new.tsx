import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AddressForm = { addressType: string; address: string; pincode: string; stateText: string; cityText: string; mobile1: string; mobile2: string; phone: string; };
type ApplicantForm = {
  salutation: string; firstName: string; middleName: string; lastName: string;
  relationType: string; relationName: string; dob: string; gender: string;
  maritalStatus: string; nriStatus: string; panNo: string; aadhaarNo: string;
  email1: string; email2: string; designation: string; companyName: string;
  addresses: AddressForm[];
};
type BookingForm = {
  projectId: number; unitId: number; registrationNo: string; formNo: string;
  bookingDate: string; planId: number; basicPrice: number; perSqft: number;
  inauguralDiscount: number; companyDiscount: number; brokerDiscount: number;
  brokerId: number; employeeId: number; remarks: string;
  addCoApplicant: boolean;
  primaryApplicant: ApplicantForm;
  coApplicant: ApplicantForm;
};

const emptyApplicant: ApplicantForm = {
  salutation: 'Mr.', firstName: '', middleName: '', lastName: '',
  relationType: 's_o', relationName: '', dob: '', gender: 'male',
  maritalStatus: 'unmarried', nriStatus: 'resident', panNo: '', aadhaarNo: '',
  email1: '', email2: '', designation: '', companyName: '',
  addresses: [{ addressType: 'residential', address: '', pincode: '', stateText: '', cityText: '', mobile1: '', mobile2: '', phone: '' }],
};

const SField = ({ label, name, register, type = 'text', options }: any) => (
  <div>
    <Label className="text-xs">{label}</Label>
    {options ? (
      <select {...register(name)} className="w-full border rounded px-2 h-9 text-sm mt-1">
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    ) : (
      <Input type={type} {...register(name)} className="mt-1 h-9 text-sm" />
    )}
  </div>
);

function ApplicantSection({ prefix, register, control, title }: { prefix: string; register: any; control: any; title: string }) {
  return (
    <div className="border rounded p-3 bg-gray-50">
      <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase">{title}</h4>
      <div className="grid grid-cols-4 gap-2">
        <SField label="Salutation" name={`${prefix}.salutation`} register={register} options={[{value:'Mr.',label:'Mr.'},{value:'Mrs.',label:'Mrs.'},{value:'Ms.',label:'Ms.'},{value:'Dr.',label:'Dr.'}]} />
        <SField label="First Name *" name={`${prefix}.firstName`} register={register} />
        <SField label="Middle Name" name={`${prefix}.middleName`} register={register} />
        <SField label="Last Name *" name={`${prefix}.lastName`} register={register} />
        <SField label="Relation" name={`${prefix}.relationType`} register={register} options={[{value:'s_o',label:'S/o'},{value:'w_o',label:'W/o'},{value:'d_o',label:'D/o'}]} />
        <SField label="Relation Name" name={`${prefix}.relationName`} register={register} />
        <SField label="Date of Birth" name={`${prefix}.dob`} register={register} type="date" />
        <SField label="Gender" name={`${prefix}.gender`} register={register} options={[{value:'male',label:'Male'},{value:'female',label:'Female'},{value:'other',label:'Other'}]} />
        <SField label="Marital Status" name={`${prefix}.maritalStatus`} register={register} options={[{value:'unmarried',label:'Unmarried'},{value:'married',label:'Married'}]} />
        <SField label="NRI Status" name={`${prefix}.nriStatus`} register={register} options={[{value:'resident',label:'Resident'},{value:'nri',label:'NRI'},{value:'pio',label:'PIO'}]} />
        <SField label="PAN No." name={`${prefix}.panNo`} register={register} />
        <SField label="Aadhaar No." name={`${prefix}.aadhaarNo`} register={register} />
        <SField label="Email 1" name={`${prefix}.email1`} register={register} type="email" />
        <SField label="Email 2" name={`${prefix}.email2`} register={register} type="email" />
        <SField label="Designation" name={`${prefix}.designation`} register={register} />
        <SField label="Company Name" name={`${prefix}.companyName`} register={register} />
      </div>
      <div className="mt-3 border-t pt-3">
        <h5 className="text-xs font-semibold text-slate-600 mb-2">Residential Address</h5>
        <div className="grid grid-cols-3 gap-2">
          <SField label="Mobile 1" name={`${prefix}.addresses.0.mobile1`} register={register} />
          <SField label="Mobile 2" name={`${prefix}.addresses.0.mobile2`} register={register} />
          <SField label="Phone" name={`${prefix}.addresses.0.phone`} register={register} />
          <div className="col-span-3"><Label className="text-xs">Address</Label><textarea {...register(`${prefix}.addresses.0.address`)} className="w-full border rounded px-2 py-1 text-sm mt-1 h-16 resize-none" /></div>
          <SField label="City" name={`${prefix}.addresses.0.cityText`} register={register} />
          <SField label="State" name={`${prefix}.addresses.0.stateText`} register={register} />
          <SField label="Pincode" name={`${prefix}.addresses.0.pincode`} register={register} />
        </div>
      </div>
    </div>
  );
}

export default function BookingFormPage() {
  const qc = useQueryClient();
  const [step, setStep] = useState<'unit' | 'applicant' | 'done'>('unit');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors } } = useForm<BookingForm>({
    defaultValues: {
      bookingDate: new Date().toISOString().split('T')[0],
      basicPrice: 0, perSqft: 0, inauguralDiscount: 0, companyDiscount: 0, brokerDiscount: 0,
      addCoApplicant: false,
      primaryApplicant: emptyApplicant,
      coApplicant: emptyApplicant,
    },
  });

  const selectedProject = watch('projectId');
  const addCoApplicant = watch('addCoApplicant');

  const { data: towers = [] } = useQuery({ queryKey: ['towers', selectedProject], queryFn: () => axios.get(`/api/projects/towers?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { data: plans = [] } = useQuery({ queryKey: ['plans', selectedProject], queryFn: () => axios.get(`/api/projects/payment-plan?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const { data: employees = [] } = useQuery({ queryKey: ['employees'], queryFn: () => axios.get('/api/master/employee/info').then(r => r.data.data) });

  const [selectedTower, setSelectedTower] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const { data: floors = [] } = useQuery({ queryKey: ['floors', selectedTower], queryFn: () => axios.get(`/api/projects/floors?towerId=${selectedTower}`).then(r => r.data.data), enabled: !!selectedTower });
  const { data: units = [] } = useQuery({ queryKey: ['units', selectedFloor], queryFn: () => axios.get(`/api/projects/units?floorId=${selectedFloor}`).then(r => r.data.data), enabled: !!selectedFloor });

  const save = useMutation({
    mutationFn: (d: BookingForm) => axios.post('/api/application/bookings', {
      ...d,
      projectId: Number(d.projectId),
      unitId: Number(d.unitId),
      planId: d.planId ? Number(d.planId) : null,
      basicPrice: Number(d.basicPrice),
      perSqft: Number(d.perSqft),
      inauguralDiscount: Number(d.inauguralDiscount),
      companyDiscount: Number(d.companyDiscount),
      companyDiscountPerc: 0,
      brokerDiscount: Number(d.brokerDiscount),
      coApplicant: d.addCoApplicant ? d.coApplicant : undefined,
    }),
    onSuccess: () => { setStep('done'); qc.invalidateQueries({ queryKey: ['bookings'] }); },
  });

  if (step === 'done') return (
    <div>
      <PageHeader title="Booking Form" />
      <div className="bg-white p-8 rounded border shadow-sm text-center">
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">Booking Successful!</h3>
        <p className="text-gray-500 text-sm mb-6">The booking has been registered and the unit has been marked as booked.</p>
        <div className="flex gap-3 justify-center">
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => { reset(); setStep('unit'); }}>New Booking</Button>
          <Button variant="outline" onClick={() => window.location.href = '/application/booking/list'}>View All Bookings</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Booking Form (Application Form)" />
      <form onSubmit={handleSubmit(d => save.mutate(d))}>
        <div className="bg-white p-4 rounded border shadow-sm mb-4">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Unit Selection & Booking Details</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div><Label className="text-xs">Project *</Label>
              <select {...register('projectId')} onChange={e => { setValue('projectId', Number(e.target.value)); setSelectedTower(''); setSelectedFloor(''); }} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Project --</option>
                {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Tower *</Label>
              <select value={selectedTower} onChange={e => { setSelectedTower(e.target.value); setSelectedFloor(''); }} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Tower --</option>
                {(towers as any[]).map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Floor *</Label>
              <select value={selectedFloor} onChange={e => setSelectedFloor(e.target.value)} className="w-full border rounded px-2 h-9 text-sm mt-1" disabled={!selectedTower}>
                <option value="">-- Select Floor --</option>
                {(floors as any[]).map((f: any) => <option key={f.id} value={f.id}>{f.floorName}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Unit *</Label>
              <select {...register('unitId')} className="w-full border rounded px-2 h-9 text-sm mt-1" disabled={!selectedFloor}>
                <option value="">-- Select Unit --</option>
                {(units as any[]).filter((u: any) => u.status === 'available').map((u: any) => <option key={u.id} value={u.id}>{u.unitNumber} ({u.UnitType?.name || '-'})</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Registration No. *</Label><Input {...register('registrationNo')} className="mt-1 h-9 text-sm" placeholder="Auto or Manual" /></div>
            <div><Label className="text-xs">Form No.</Label><Input {...register('formNo')} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Booking Date *</Label><Input type="date" {...register('bookingDate')} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Payment Plan</Label>
              <select {...register('planId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select Plan --</option>
                {(plans as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><Label className="text-xs">Basic Price (₹)</Label><Input type="number" step="0.01" {...register('basicPrice')} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Rate/Sq.ft (₹)</Label><Input type="number" step="0.01" {...register('perSqft')} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Inaugural Discount (₹)</Label><Input type="number" step="0.01" {...register('inauguralDiscount')} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Company Discount (₹)</Label><Input type="number" step="0.01" {...register('companyDiscount')} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Broker Discount (₹)</Label><Input type="number" step="0.01" {...register('brokerDiscount')} className="mt-1 h-9 text-sm" /></div>
            <div><Label className="text-xs">Sales Employee</Label>
              <select {...register('employeeId')} className="w-full border rounded px-2 h-9 text-sm mt-1">
                <option value="">-- Select --</option>
                {(employees as any[]).map((e: any) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
              </select>
            </div>
            <div className="col-span-2"><Label className="text-xs">Remarks</Label><Input {...register('remarks')} className="mt-1 h-9 text-sm" /></div>
          </div>
        </div>

        <div className="space-y-4">
          <ApplicantSection prefix="primaryApplicant" register={register} control={control} title="Primary Applicant" />
          <div className="flex items-center gap-2 bg-white p-3 rounded border">
            <input type="checkbox" {...register('addCoApplicant')} id="addCo" />
            <label htmlFor="addCo" className="text-sm cursor-pointer font-medium">Add Co-Applicant / Joint Owner</label>
          </div>
          {addCoApplicant && (
            <ApplicantSection prefix="coApplicant" register={register} control={control} title="Co-Applicant" />
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>
            {save.isPending ? 'Saving Booking...' : 'Submit Booking'}
          </Button>
          <Button type="button" variant="outline" onClick={() => reset()}>Reset Form</Button>
        </div>
        {save.isError && <p className="mt-2 text-red-500 text-sm">{String((save.error as any)?.response?.data?.message)}</p>}
      </form>
    </div>
  );
}
