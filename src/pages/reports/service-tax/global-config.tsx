import PageHeader from '@/components/shared/PageHeader';

const GST_CONFIG = [
  { label: 'GST Rate (Standard)', value: '18%', description: 'Applicable on all real estate transactions' },
  { label: 'TDS Rate', value: '1%', description: 'Tax Deducted at Source on property purchase' },
  { label: 'SGST', value: '9%', description: 'State GST component' },
  { label: 'CGST', value: '9%', description: 'Central GST component' },
  { label: 'Threshold for TDS', value: '₹50,00,000', description: 'TDS applicable on transactions above this value' },
  { label: 'GST on Advance', value: '18%', description: 'GST on advance payment received' },
  { label: 'Effective Date', value: '01-Jul-2017', description: 'GST implementation date' },
];

export default function GlobalConfigPage() {
  return (
    <div>
      <PageHeader title="Global Service Tax Configuration" />
      <div className="space-y-4">
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">GST Configuration (Static Reference)</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Parameter</th>
              <th className="px-3 py-2 text-left">Value</th>
              <th className="px-3 py-2 text-left">Description</th>
            </tr></thead>
            <tbody>
              {GST_CONFIG.map((c, i) => (
                <tr key={c.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{c.label}</td>
                  <td className="px-3 py-1.5 text-purple-700 font-bold">{c.value}</td>
                  <td className="px-3 py-1.5 text-gray-500">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-yellow-800">
          These are system-wide GST configuration values. Contact your tax consultant before modifying tax rates.
        </div>
      </div>
    </div>
  );
}
