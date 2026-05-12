import { z } from 'zod';
import SimpleLookupPage from '@/components/shared/SimpleLookupPage';
export default function BankLoanPage() {
  return <SimpleLookupPage title="Loan Bank Creation" apiPath="/api/master/setup/bank/loan"
    fields={[
      { name: 'bankName', label: 'Bank Name' }, { name: 'branch', label: 'Branch' },
      { name: 'contactPerson', label: 'Contact Person' }, { name: 'contactNo', label: 'Contact No.' },
    ]}
    schema={z.object({ id: z.number().optional(), bankName: z.string().min(1, 'Required'), branch: z.string().min(1, 'Required'), contactPerson: z.string().optional(), contactNo: z.string().optional() })} />;
}
