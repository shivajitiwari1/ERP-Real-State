import { ProjectType } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(ProjectType, z.object({ name: z.string().min(1, 'Name required') }));
