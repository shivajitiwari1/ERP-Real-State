import { Currency } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(Currency, z.object({
  name: z.string().min(1, 'Name required'),
  symbol: z.string().min(1, 'Symbol required'),
  exchangeRate: z.number().positive().default(1),
}));
