import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

const HSN_DATA = [
  { hsn: '9954', description: 'Construction of a complex, building, civil structure or a part thereof', gstRate: '12% / 5% / 1%', category: 'Construction Services', remark: 'Rate depends on project type' },
  { hsn: '995411', description: 'Construction services of single dwelling or multi dwelling or multi-storied residential buildings', gstRate: '5% (No ITC) / 1% (AH)', category: 'Residential', remark: 'Most common for real estate' },
  { hsn: '995415', description: 'Construction services of other residential buildings', gstRate: '12% (with ITC)', category: 'Residential', remark: 'When opted for ITC scheme' },
  { hsn: '995421', description: 'General construction services of industrial buildings', gstRate: '12%', category: 'Industrial', remark: 'Warehouses, factories' },
  { hsn: '995431', description: 'General construction services of highways, streets, roads', gstRate: '12%', category: 'Infrastructure', remark: 'Road construction in township' },
  { hsn: '997211', description: 'Rental or leasing services involving own or leased non-residential property', gstRate: '18%', category: 'Commercial Leasing', remark: 'Shop / office rental' },
  { hsn: '997212', description: 'Rental or leasing services involving own or leased residential property', gstRate: 'Exempt', category: 'Residential Rental', remark: 'Residential rental exempt from GST' },
];

export default function GstHsnPage() {
  const [projectId, setProjectId] = useState('');
  const [search, setSearch] = useState('');
  const { data: projects = [] } = useQuery<any[]>({
    queryKey: ['projects'],
    queryFn: () => axios.get('/api/projects').then(r => r.data.data),
  });

  const projName = (projects as any[]).find((p: any) => String(p.id) === projectId)?.name;
  const filtered = HSN_DATA.filter(h =>
    !search || h.hsn.includes(search) || h.description.toLowerCase().includes(search.toLowerCase()) || h.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="HSN and Charge Wise Report" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex items-center gap-3">
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
          {projectId && (
            <input
              type="text"
              placeholder="Search HSN, description, category…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded px-3 h-9 text-sm w-72"
            />
          )}
        </div>

        {projectId && (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase flex items-center justify-between">
              <span>HSN / SAC Code Reference — {projName}</span>
              <span className="text-slate-300 font-normal normal-case">{filtered.length} codes</span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-3 py-2 text-left">HSN/SAC</th>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-center">GST Rate</th>
                  <th className="px-3 py-2 text-center">Category</th>
                  <th className="px-3 py-2 text-left">Remark</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-6 text-gray-400 italic">No matching HSN codes found.</td></tr>
                ) : filtered.map((h, i) => (
                  <tr key={h.hsn} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 font-mono font-semibold text-blue-700">{h.hsn}</td>
                    <td className="px-3 py-2 text-slate-600">{h.description}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${h.gstRate === 'Exempt' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {h.gstRate}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className="bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded">{h.category}</span>
                    </td>
                    <td className="px-3 py-2 text-gray-400 italic">{h.remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-400 italic">
              HSN codes as per GST Council classification. Verify applicable code with your CA before filing GSTR-1.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
