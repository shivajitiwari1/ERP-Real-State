import { z } from 'zod';
import SimpleLookupPage from '@/components/shared/SimpleLookupPage';
export default function DepartmentPage() {
  return <SimpleLookupPage title="Department" apiPath="/api/master/employee/department"
    fields={[{ name: 'name', label: 'Department Name' }]}
    schema={z.object({ id: z.number().optional(), name: z.string().min(1, 'Department name required') })} />;
}
