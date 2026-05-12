import { Role } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(Role, z.object({
  name: z.string().min(1, 'Role name required'),
  description: z.string().optional(),
}));
