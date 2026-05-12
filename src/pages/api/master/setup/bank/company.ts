import { BankCompany } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(BankCompany, z.object({
  bankName: z.string().min(1, 'Bank name required'),
  accountNo: z.string().min(1, 'Account number required'),
  ifsc: z.string().min(1, 'IFSC required'),
  branch: z.string().min(1, 'Branch required'),
  city: z.string().min(1, 'City required'),
}));
