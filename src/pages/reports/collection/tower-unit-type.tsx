import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function TowerVsUnitTypePage() {
  const [projectId, setProjectId] = useState('');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['tower-unit-type', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data) });

  const grouped: Record<string, Record<string, number>> = {};
  const unitTypes = new Set<string>();
  (bookings as any[]).forEach((b: any) => {
    const tower = b.Unit?.Tower?.name || 'Unknown';
    const type = b.Unit?.unitType || 'Unknown';
    unitTypes.add(type);
    if (!grouped[tower]) grouped[tower] = {};
    grouped[tower][type] = (grouped[tower][type] || 0) + 1;
  });
  const types = Array.from(unitTypes).sort();
  const rows = Object.entries(grouped).map(([tower, byType]) => ({ tower, byType, rowTotal: Object.values(byType).reduce((s, v) => s + v, 0) }));

  return (
    <div>
      <PageHeader title="Tower Vs Unit Type" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase tracking-wide">Tower Vs Unit Type ({rows.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Tower</th>
              {types.map(t => <th key={t} className="px-3 py-2 text-right">{t}</th>)}
              <th className="px-3 py-2 text-right">Row Total</th>
            </tr></thead>
            <tbody>
              {isLoading ? <tr><td colSpan={3 + types.length} className="text-center py-6 text-gray-400">Loading...</td></tr> :
              rows.length === 0 ? <tr><td colSpan={3 + types.length} className="text-center py-6 text-gray-400">No data found</td></tr> :
              rows.map((r, i) => (
                <tr key={r.tower} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{r.tower}</td>
                  {types.map(t => <td key={t} className="px-3 py-1.5 text-right text-blue-600">{r.byType[t] || 0}</td>)}
                  <td className="px-3 py-1.5 text-right text-green-600 font-bold">{r.rowTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
