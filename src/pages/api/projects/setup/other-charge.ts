import { OtherCharge } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(OtherCharge, z.object({
  projectId: z.number().int().positive('Select project'),
  name: z.string().min(1, 'Name required'),
  rate: z.number().min(0),
  chargeType: z.enum(['per_sqft', 'fixed']).default('fixed'),
  isMandatory: z.boolean().default(false),
}));
