import { z } from 'zod';
import SimpleLookupPage from '@/components/shared/SimpleLookupPage';
export default function CountryPage() {
  return <SimpleLookupPage title="Country Master" apiPath="/api/master/setup/country"
    fields={[{ name: 'name', label: 'Country Name' }, { name: 'phoneCode', label: 'Phone Code' }]}
    schema={z.object({ id: z.number().optional(), name: z.string().min(1, 'Required'), phoneCode: z.string().optional() })} />;
}
