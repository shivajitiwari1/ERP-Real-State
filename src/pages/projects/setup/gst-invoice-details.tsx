import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

const INVOICE_FIELDS = [
  { field: 'Invoice Number', description: 'Unique sequential invoice number with prefix', required: true, example: 'REC-2526-0001' },
  { field: 'Invoice Date', description: 'Date of invoice generation', required: true, example: '01/04/2025' },
  { field: 'GSTIN of Supplier', description: 'GST registration number of builder', required: true, example: '09AAAAA0000A1Z5' },
  { field: 'GSTIN of Recipient', description: "Customer's GST number (if registered)", required: false, example: '07BBBBB0000B1Z3' },
  { field: 'HSN / SAC Code', description: 'Service Accounting Code for construction', required: true, example: '9954' },
  { field: 'Taxable Value', description: 'Agreement value before GST', required: true, example: '₹50,00,000' },
  { field: 'CGST Amount', description: 'Central GST @ 2.5%', required: true, example: '₹1,25,000' },
  { field: 'SGST Amount', description: 'State GST @ 2.5%', required: true, example: '₹1,25,000' },
  { field: 'Total Invoice Value', description: 'Taxable value + CGST + SGST', required: true, example: '₹52,50,000' },
  { field: 'Place of Supply', description: 'State where property is located', required: true, example: 'Uttar Pradesh (09)' },
  { field: 'Description of Service', description: 'Nature of construction service', required: true, example: 'Construction of Residential Flat' },
  { field: 'Unit / Flat No.', description: 'Unit identifier for the property', required: false, example: 'A-101' },
];

export default function GstInvoiceDetailsPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });

  const projName = (projects as any[]).find((p: any) => String(p.id) === projectId)?.name;

  return (
    <div>
      <PageHeader title="Invoice Details" />
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
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">
              GST Invoice Field Details — {projName}
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="px-3 py-2 text-center w-12">S.No.</th>
                  <th className="px-3 py-2 text-left">Field Name</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-center">Required</th>
                  <th className="px-3 py-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                {INVOICE_FIELDS.map((f, i) => (
                  <tr key={f.field} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-semibold text-slate-700">{f.field}</td>
                    <td className="px-3 py-2 text-gray-500">{f.description}</td>
                    <td className="px-3 py-2 text-center">
                      {f.required ? (
                        <span className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded font-medium">Yes</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded">Optional</span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-600">{f.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
