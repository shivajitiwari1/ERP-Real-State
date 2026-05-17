import { z } from 'zod';
import SimpleLookupPage from '@/components/shared/SimpleLookupPage';
export default function BankCustomerPage() {
  return <SimpleLookupPage title="Customer Bank Creation" apiPath="/api/master/setup/bank/customer"
    fields={[{ name: 'bankName', label: 'Bank Name' }]}
    schema={z.object({ id: z.number().optional(), bankName: z.string().min(1, 'Required') })} />;
}
