import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TAX_HEADS = [
  { head: 'GST', description: 'Goods & Services Tax on construction services', defaultRate: 5 },
  { head: 'Stamp Duty', description: 'State stamp duty on property registration', defaultRate: 5 },
  { head: 'Registration Fee', description: 'Sub-registrar office registration fee', defaultRate: 1 },
  { head: 'TDS (194IA)', description: 'TDS on property purchase above 50L', defaultRate: 1 },
  { head: 'Legal Charges', description: 'Legal/documentation charges', defaultRate: 0 },
  { head: 'Service Tax (Legacy)', description: 'Pre-GST service tax reference', defaultRate: 0 },
];

export default function TaxMasterPage() {
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const [selectedProject, setSelectedProject] = useState('');
  return (
    <div>
      <PageHeader title="Tax Master" subtitle="Reference tax rates applicable to real estate transactions" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm">
          <div className="mb-4"><Label className="text-xs">Project</Label>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="w-full border rounded px-2 h-9 text-sm mt-1">
              <option value="">-- All Projects --</option>
              {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">Applicable Tax Heads</h3>
          <div className="space-y-2">
            {TAX_HEADS.map(t => (
              <div key={t.head} className="flex items-start justify-between p-3 bg-gray-50 rounded border">
                <div>
                  <div className="text-xs font-semibold text-slate-700">{t.head}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.description}</div>
                </div>
                <span className={`ml-3 shrink-0 font-bold text-xs px-2 py-0.5 rounded ${t.defaultRate === 0 ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-orange-700'}`}>{t.defaultRate}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm">
          <h3 className="text-xs font-bold text-slate-600 mb-3 pb-1 border-b uppercase">State-wise Stamp Duty</h3>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100"><th className="px-2 py-2 text-left">State</th><th className="px-2 py-2">Stamp Duty</th><th className="px-2 py-2">Reg. Fee</th></tr></thead>
            <tbody>{[['Uttar Pradesh','5%','1%'],['Maharashtra','5%','1%'],['Delhi','4-6%','1%'],['Haryana','5-7%','1%'],['Karnataka','5%','1%'],['Gujarat','4.9%','1%'],['Rajasthan','4-6%','1%'],].map(([s,d,r],i)=>(
              <tr key={s} className={i%2===0?'bg-white':'bg-gray-50'}>
                <td className="px-2 py-2">{s}</td>
                <td className="px-2 py-2 text-center font-medium">{d}</td>
                <td className="px-2 py-2 text-center">{r}</td>
              </tr>
            ))}</tbody>
          </table>
          <p className="text-xs text-gray-400 mt-3 italic">Rates are indicative. Verify current rates with your legal team.</p>
        </div>
      </div>
    </div>
  );
}
