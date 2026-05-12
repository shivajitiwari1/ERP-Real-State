import { z } from 'zod';
import SimpleLookupPage from '@/components/shared/SimpleLookupPage';
export default function RoleCreatePage() {
  return <SimpleLookupPage title="Role Creation" apiPath="/api/master/roles"
    fields={[{ name: 'name', label: 'Role Name' }, { name: 'description', label: 'Description' }]}
    schema={z.object({ id: z.number().optional(), name: z.string().min(1, 'Required'), description: z.string().optional() })} />;
}
