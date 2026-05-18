import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

const TAX_HEADS = [
  { head: 'GST', description: 'Goods & Services Tax on construction services', rate: 5, category: 'Central' },
  { head: 'Stamp Duty', description: 'State stamp duty on property registration', rate: 5, category: 'State' },
  { head: 'Registration Fee', description: 'Sub-registrar office registration fee', rate: 1, category: 'State' },
  { head: 'TDS (194IA)', description: 'TDS on property purchase above ₹50L', rate: 1, category: 'Central' },
  { head: 'Legal Charges', description: 'Legal/documentation charges', rate: 0, category: 'Other' },
  { head: 'Service Tax (Legacy)', description: 'Pre-GST service tax reference', rate: 0, category: 'Legacy' },
];

export default function TaxInfoPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: config } = useQuery<any>({
    queryKey: ['project-config', projectId],
    queryFn: () => axios.get(`/api/projects/setup/project-config?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const projName = (projects as any[]).find((p: any) => String(p.id) === projectId)?.name;

  return (
    <div>
      <PageHeader title="Tax Information" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            className="border rounded px-2 h-9 text-sm min-w-64"
          >
            <option value="">Select Project</option>
            {(projects as any[]).map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        {projectId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Config Summary */}
            <div className="bg-white border rounded-lg shadow-sm p-4">
              <div className="text-xs font-bold text-slate-700 uppercase border-b pb-2 mb-3">
                Project Configuration — {projName}
              </div>
              {config ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-dashed">
                    <span className="text-gray-500">Booking Auth Type</span>
                    <span className="font-medium capitalize">{config.bookingAuthType ?? '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-dashed">
                    <span className="text-gray-500">Receipt No. Prefix</span>
                    <span className="font-medium font-mono">{config.receiptNoPrefix ?? '—'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-dashed">
                    <span className="text-gray-500">Registration No. Prefix</span>
                    <span className="font-medium font-mono">{config.registrationNoPrefix ?? '—'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Transfer Auth Type</span>
                    <span className="font-medium capitalize">{config.transferAuthType ?? '—'}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No project configuration found. Set up via Project Configuration.</p>
              )}
            </div>

            {/* Tax Heads Reference */}
            <div className="bg-white border rounded-lg shadow-sm p-4">
              <div className="text-xs font-bold text-slate-700 uppercase border-b pb-2 mb-3">
                Applicable Tax Heads
              </div>
              <div className="space-y-2">
                {TAX_HEADS.map(t => (
                  <div key={t.head} className="flex items-start justify-between p-2 bg-gray-50 rounded border text-xs">
                    <div>
                      <div className="font-semibold text-slate-700">{t.head}</div>
                      <div className="text-gray-400 mt-0.5">{t.description}</div>
                      <span className={`mt-1 inline-block text-xs px-1.5 py-0.5 rounded text-white ${
                        t.category === 'Central' ? 'bg-blue-600' :
                        t.category === 'State' ? 'bg-green-600' :
                        t.category === 'Legacy' ? 'bg-gray-500' : 'bg-slate-500'
                      }`}>{t.category}</span>
                    </div>
                    <span className={`ml-3 shrink-0 font-bold text-xs px-2 py-0.5 rounded ${
                      t.rate === 0 ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-orange-700'
                    }`}>{t.rate}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* State-wise Stamp Duty */}
            <div className="bg-white border rounded-lg shadow-sm p-4 md:col-span-2">
              <div className="text-xs font-bold text-slate-700 uppercase border-b pb-2 mb-3">
                State-wise Stamp Duty Reference
              </div>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-3 py-2 text-left">State</th>
                    <th className="px-3 py-2 text-center">Stamp Duty</th>
                    <th className="px-3 py-2 text-center">Reg. Fee</th>
                    <th className="px-3 py-2 text-center">GST Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Uttar Pradesh', '5%', '1%', '5%'],
                    ['Maharashtra', '5%', '1%', '5%'],
                    ['Delhi', '4–6%', '1%', '5%'],
                    ['Haryana', '5–7%', '1%', '5%'],
                    ['Karnataka', '5%', '1%', '5%'],
                    ['Gujarat', '4.9%', '1%', '5%'],
                    ['Rajasthan', '4–6%', '1%', '5%'],
                  ].map(([s, d, r, g], i) => (
                    <tr key={s} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 font-medium">{s}</td>
                      <td className="px-3 py-2 text-center">{d}</td>
                      <td className="px-3 py-2 text-center">{r}</td>
                      <td className="px-3 py-2 text-center text-orange-700 font-medium">{g}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-400 mt-2 italic">
                Rates are indicative. Verify current rates with your legal team before filing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
