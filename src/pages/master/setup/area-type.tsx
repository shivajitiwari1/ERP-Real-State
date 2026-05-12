import { z } from 'zod';
import SimpleLookupPage from '@/components/shared/SimpleLookupPage';
export default function AreaTypePage() {
  return <SimpleLookupPage title="Area Type Creation" apiPath="/api/master/setup/area-type"
    fields={[{ name: 'name', label: 'Area Type Name' }]}
    schema={z.object({ id: z.number().optional(), name: z.string().min(1, 'Name required') })} />;
}
