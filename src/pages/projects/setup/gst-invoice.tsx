import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function GstInvoicePage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });
  const { data: cfg } = useQuery<any>({
    queryKey: ['project-config', projectId],
    queryFn: () => axios.get(`/api/projects/setup/project-config?projectId=${projectId}`).then(r => r.data.data),
    enabled: !!projectId,
  });

  const proj = (projects as any[]).find((p: any) => String(p.id) === projectId);

  return (
    <div>
      <PageHeader title="Invoice Generation" />
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

        {proj && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Invoice Config Card */}
            <div className="bg-white border rounded-lg shadow-sm p-4">
              <div className="text-xs font-bold text-slate-700 uppercase border-b pb-2 mb-3">
                Invoice Configuration — {proj.name}
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-gray-500">Receipt No. Prefix</span>
                  <span className="font-mono font-semibold">{cfg?.receiptNoPrefix ?? 'REC'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-gray-500">Registration No. Prefix</span>
                  <span className="font-mono font-semibold">{cfg?.registrationNoPrefix ?? 'REG'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-gray-500">Booking Auth Type</span>
                  <span className="font-semibold capitalize">{cfg?.bookingAuthType ?? '—'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Transfer Auth Type</span>
                  <span className="font-semibold capitalize">{cfg?.transferAuthType ?? '—'}</span>
                </div>
              </div>
            </div>

            {/* GST Invoice Reference */}
            <div className="bg-white border rounded-lg shadow-sm p-4">
              <div className="text-xs font-bold text-slate-700 uppercase border-b pb-2 mb-3">
                GST Invoice Reference
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Invoice Type', value: 'Tax Invoice (GST)' },
                  { label: 'HSN / SAC Code', value: '9954' },
                  { label: 'GST Rate (Under Construction)', value: '5% (No ITC)' },
                  { label: 'GST Rate (Affordable Housing)', value: '1%' },
                  { label: 'CGST', value: '2.5%' },
                  { label: 'SGST', value: '2.5%' },
                  { label: 'IGST (Inter-state)', value: '5%' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-1 border-b border-dashed last:border-0">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-slate-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Format Preview */}
            <div className="bg-white border rounded-lg shadow-sm p-4 md:col-span-2">
              <div className="text-xs font-bold text-slate-700 uppercase border-b pb-2 mb-3">
                Invoice Number Format Preview
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                {[
                  { type: 'Receipt', prefix: cfg?.receiptNoPrefix ?? 'REC', example: `${cfg?.receiptNoPrefix ?? 'REC'}-2526-0001` },
                  { type: 'Registration', prefix: cfg?.registrationNoPrefix ?? 'REG', example: `${cfg?.registrationNoPrefix ?? 'REG'}-2526-0001` },
                  { type: 'GST Invoice', prefix: 'INV', example: `INV-${proj.code ?? 'PRJ'}-2526-0001` },
                ].map(({ type, prefix, example }) => (
                  <div key={type} className="bg-gray-50 rounded p-3 border">
                    <div className="text-gray-400 mb-1">{type}</div>
                    <div className="font-mono font-semibold text-slate-700">{example}</div>
                    <div className="text-gray-400 mt-1">Prefix: <span className="font-mono">{prefix}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
