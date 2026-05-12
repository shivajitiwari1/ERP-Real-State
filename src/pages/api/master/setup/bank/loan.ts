import { BankLoan } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(BankLoan, z.object({
  bankName: z.string().min(1, 'Bank name required'),
  branch: z.string().min(1, 'Branch required'),
  contactPerson: z.string().optional(),
  contactNo: z.string().optional(),
}));
