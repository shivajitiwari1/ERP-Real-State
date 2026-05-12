import { BankCustomer } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(BankCustomer, z.object({
  bankName: z.string().min(1, 'Bank name required'),
  branch: z.string().min(1, 'Branch required'),
  city: z.string().min(1, 'City required'),
}));
