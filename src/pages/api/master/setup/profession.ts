import { Profession } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(Profession, z.object({ name: z.string().min(1, 'Name required') }));
