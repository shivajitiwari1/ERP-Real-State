import { z } from 'zod';
import SimpleLookupPage from '@/components/shared/SimpleLookupPage';
export default function ProfessionPage() {
  return <SimpleLookupPage title="Customer Profession Configuration" apiPath="/api/master/setup/profession"
    fields={[{ name: 'name', label: 'Profession Name' }]}
    schema={z.object({ id: z.number().optional(), name: z.string().min(1, 'Name required') })} />;
}
