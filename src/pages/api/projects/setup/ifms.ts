import { IfmsCharge } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(IfmsCharge, z.object({
  projectId: z.number().int().positive('Select project'),
  name: z.string().min(1, 'Name required'),
  rate: z.number().min(0),
}));
