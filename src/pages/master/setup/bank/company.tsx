import { z } from 'zod';
import SimpleLookupPage from '@/components/shared/SimpleLookupPage';
export default function BankCompanyPage() {
  return <SimpleLookupPage title="Company Bank Creation" apiPath="/api/master/setup/bank/company"
    fields={[
      { name: 'bankName', label: 'Bank Name' }, { name: 'accountNo', label: 'Account No.' },
      { name: 'ifsc', label: 'IFSC Code' }, { name: 'branch', label: 'Branch' }, { name: 'city', label: 'City' },
    ]}
    schema={z.object({
      id: z.number().optional(),
      bankName: z.string().min(1, 'Required'), accountNo: z.string().min(1, 'Required'),
      ifsc: z.string().min(1, 'Required'), branch: z.string().min(1, 'Required'), city: z.string().min(1, 'Required'),
    })} />;
}
