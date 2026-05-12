import { Department } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(Department, z.object({ name: z.string().min(1, 'Department name required') }));
