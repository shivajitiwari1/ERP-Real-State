import { z } from 'zod';
import SimpleLookupPage from '@/components/shared/SimpleLookupPage';
export default function CurrencyPage() {
  return <SimpleLookupPage title="Currency Configuration" apiPath="/api/master/setup/currency"
    fields={[
      { name: 'name', label: 'Currency Name' },
      { name: 'symbol', label: 'Symbol' },
      { name: 'exchangeRate', label: 'Exchange Rate', type: 'number' },
    ]}
    schema={z.object({
      id: z.number().optional(),
      name: z.string().min(1, 'Required'),
      symbol: z.string().min(1, 'Required'),
      exchangeRate: z.coerce.number().positive('Must be positive'),
    })} />;
}
