import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

const REVERSAL_TYPES = [
  { type: 'Booking Cancellation', trigger: 'Customer cancels booking', gstImpact: 'GST refundable if invoice reversed before filing', action: 'Credit Note issuance' },
  { type: 'Agreement Cancellation', trigger: 'Agreement of sale cancelled post-registration', gstImpact: 'GST reversal via credit note; stamp duty non-refundable', action: 'Credit Note + Amended Return' },
  { type: 'Unit Transfer', trigger: 'Unit transferred from one buyer to another', gstImpact: 'New invoice for transferee; original invoice reversed', action: 'Reversal + Fresh Invoice' },
  { type: 'Payment Reversal', trigger: 'Payment returned to customer', gstImpact: 'Proportionate GST reversal required', action: 'Partial Credit Note' },
  { type: 'Overcharge Correction', trigger: 'Error in invoice amount', gstImpact: 'Difference amount reversed via credit note', action: 'Credit Note issuance' },
];

export default function GstReversalPage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });

  const projName = (projects as any[]).find((p: any) => String(p.id) === projectId)?.name;

  return (
    <div>
      <PageHeader title="Invoice Reversal" />
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
          <div className="space-y-4">
            {/* Policy Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800">
              <strong>GST Reversal Policy — {projName}:</strong> Invoice reversals must be processed as Credit Notes under CGST Rule 53. Credit notes should be issued within the same financial year or by September of the following year to claim GST reversal in GSTR-3B.
            </div>

            {/* Reversal Types Table */}
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">
                GST Reversal Scenarios
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-3 py-2 text-center w-12">S.No.</th>
                    <th className="px-3 py-2 text-left">Reversal Type</th>
                    <th className="px-3 py-2 text-left">Trigger</th>
                    <th className="px-3 py-2 text-left">GST Impact</th>
                    <th className="px-3 py-2 text-left">Required Action</th>
                  </tr>
                </thead>
                <tbody>
                  {REVERSAL_TYPES.map((r, i) => (
                    <tr key={r.type} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                      <td className="px-3 py-2 font-semibold text-slate-700">{r.type}</td>
                      <td className="px-3 py-2 text-gray-600">{r.trigger}</td>
                      <td className="px-3 py-2 text-gray-600">{r.gstImpact}</td>
                      <td className="px-3 py-2">
                        <span className="bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5 rounded font-medium">
                          {r.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-400 italic">
                Consult your CA before processing reversals. Late reversals may attract interest and penalty under CGST Act.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
