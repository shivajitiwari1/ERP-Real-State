import PageHeader from '@/components/shared/PageHeader';

const SHORT_CODES = [
  { code: '{name}', description: 'Customer Full Name', example: 'Ramesh Kumar' },
  { code: '{firstName}', description: 'Customer First Name', example: 'Ramesh' },
  { code: '{regNo}', description: 'Registration Number', example: 'REG-2024-001' },
  { code: '{unitNo}', description: 'Unit Number', example: 'A-101' },
  { code: '{tower}', description: 'Tower Name', example: 'Tower A' },
  { code: '{projectName}', description: 'Project Name', example: 'Green Valley' },
  { code: '{amount}', description: 'Payment Amount', example: '₹5,00,000' },
  { code: '{dueDate}', description: 'Due Date', example: '30-Jun-2025' },
  { code: '{date}', description: 'Current Date', example: '18-May-2026' },
  { code: '{mobile}', description: 'Customer Mobile', example: '9876543210' },
  { code: '{email}', description: 'Customer Email', example: 'customer@example.com' },
  { code: '{balance}', description: 'Outstanding Balance', example: '₹10,00,000' },
  { code: '{receiptNo}', description: 'Receipt Number', example: 'RCP-2024-0123' },
  { code: '{brokerName}', description: 'Broker Name', example: 'Suresh Properties' },
  { code: '{companyName}', description: 'Company Name', example: 'RealBoost Builders' },
];

export default function ShortCodeDetailsPage() {
  return (
    <div>
      <PageHeader title="Short Code Details" />
      <div className="space-y-4">
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">SMS Short Code Reference ({SHORT_CODES.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-800 text-white">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Short Code</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-left">Example Output</th>
            </tr></thead>
            <tbody>
              {SHORT_CODES.map((s, i) => (
                <tr key={s.code} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-mono text-purple-700 font-bold">{s.code}</td>
                  <td className="px-3 py-1.5">{s.description}</td>
                  <td className="px-3 py-1.5 text-green-600">{s.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-700">
          Use these short codes in your SMS templates. They will be replaced with actual data when the SMS is sent.
        </div>
      </div>
    </div>
  );
}
