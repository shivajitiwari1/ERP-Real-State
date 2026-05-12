import { Country } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(Country, z.object({
  name: z.string().min(1, 'Name required'),
  phoneCode: z.string().optional(),
}));
