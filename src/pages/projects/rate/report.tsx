import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';

export default function RateReportPage() {
  const [selectedProject, setSelectedProject] = useState('');
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: rates = [], isLoading } = useQuery({ queryKey: ['rates', selectedProject], queryFn: () => axios.get(`/api/projects/rate?projectId=${selectedProject}`).then(r => r.data.data), enabled: !!selectedProject });
  const current = (rates as any[]).length > 0 ? (rates as any[])[0] : null;
  return (
    <div>
      <PageHeader title="Rate Report" subtitle="View current and historical rates per project" />
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border shadow-sm">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="border rounded px-3 h-9 text-sm min-w-64">
            <option value="">-- Select Project --</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        {current && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded p-4">
              <div className="text-xs text-orange-600 font-bold uppercase mb-1">Current Rate</div>
              <div className="text-2xl font-bold text-orange-700">Rs.{Number(current.ratePerSqft).toLocaleString('en-IN')}</div>
              <div className="text-xs text-orange-500 mt-1">per sq.ft</div>
            </div>
            <div className="bg-slate-50 border rounded p-4">
              <div className="text-xs text-slate-500 font-bold uppercase mb-1">Unit Type</div>
              <div className="text-lg font-semibold text-slate-700">{current.UnitType?.name || 'All Units'}</div>
            </div>
            <div className="bg-slate-50 border rounded p-4">
              <div className="text-xs text-slate-500 font-bold uppercase mb-1">Effective From</div>
              <div className="text-lg font-semibold text-slate-700">{current.effectiveDate || 'N/A'}</div>
            </div>
          </div>
        )}
        <div className="bg-white rounded border shadow-sm overflow-auto">
          <div className="px-4 py-2.5 border-b bg-gradient-to-r from-slate-800 to-slate-700">
            <span className="text-xs font-bold uppercase text-slate-300">Rate History ({(rates as any[]).length})</span>
          </div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-purple-700 text-white">{['#','Rate/Sq.ft','Unit Type','Effective Date','Added On'].map(h=><th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr></thead>
            <tbody>{isLoading ? <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr> : (rates as any[]).map((r: any, i) => (
              <tr key={r.id} className={i===0?'bg-orange-50 font-semibold':(i%2===0?'bg-white':'bg-gray-50')}>
                <td className="px-3 py-2 text-gray-400">{i+1}</td>
                <td className="px-3 py-2 text-orange-600 font-bold">Rs.{Number(r.ratePerSqft).toLocaleString('en-IN')}</td>
                <td className="px-3 py-2">{r.UnitType?.name || 'All'}</td>
                <td className="px-3 py-2">{r.effectiveDate || '-'}</td>
                <td className="px-3 py-2 text-gray-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '-'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
