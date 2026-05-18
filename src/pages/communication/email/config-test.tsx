import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function EmailConfigTestPage() {
  const { data: config, isLoading, error } = useQuery<any>({ queryKey: ['email-config'], queryFn: () => axios.get('/api/communication/email-config').then(r => r.data.data || r.data) });

  const fields = config ? [
    { label: 'SMTP Host', value: config.smtpHost || config.host },
    { label: 'SMTP Port', value: config.smtpPort || config.port },
    { label: 'Encryption', value: config.encryption || config.secure ? 'SSL/TLS' : 'None' },
    { label: 'Username / Email', value: config.username || config.email || config.fromEmail },
    { label: 'From Name', value: config.fromName || config.senderName },
    { label: 'Auth Required', value: config.auth !== false ? 'Yes' : 'No' },
    { label: 'Status', value: config.status || 'active' },
  ] : [];

  return (
    <div>
      <PageHeader title="Email Configuration Test" />
      <div className="space-y-4">
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Email Configuration Diagnostics</div>
          {isLoading ? <div className="p-8 text-center text-gray-400 text-sm">Loading configuration...</div> :
          error ? <div className="p-8 text-center text-red-500 text-sm">Could not load email config. API may not be configured.</div> :
          !config ? <div className="p-8 text-center text-gray-400 text-sm">No configuration found</div> :
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">Parameter</th>
              <th className="px-3 py-2 text-left">Value</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr></thead>
            <tbody>
              {fields.map((f, i) => (
                <tr key={f.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 font-medium">{f.label}</td>
                  <td className="px-3 py-1.5 text-blue-600">{f.value || '-'}</td>
                  <td className="px-3 py-1.5"><span className={`px-1.5 py-0.5 rounded text-xs ${f.value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{f.value ? 'OK' : 'Missing'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>}
        </div>
      </div>
    </div>
  );
}
