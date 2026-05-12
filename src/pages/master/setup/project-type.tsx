import { z } from 'zod';
import SimpleLookupPage from '@/components/shared/SimpleLookupPage';
export default function ProjectTypePage() {
  return <SimpleLookupPage title="Project Type Creation" apiPath="/api/master/setup/project-type"
    fields={[{ name: 'name', label: 'Project Type Name' }]}
    schema={z.object({ id: z.number().optional(), name: z.string().min(1, 'Name required') })} />;
}
