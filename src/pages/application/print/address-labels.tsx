import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function AddressLabelsPage() {
  const [projectId, setProjectId] = useState('');
  const [view, setView] = useState<'table' | 'labels'>('table');
  const { data: projects = [] } = useQuery<any[]>({ queryKey: ['projects'], queryFn: () => axios.get('/api/projects').then(r => r.data.data) });
  const { data: bookings = [], isLoading } = useQuery<any[]>({ queryKey: ['bookings', projectId], queryFn: () => axios.get(`/api/application/bookings${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.data.data), enabled: true });

  return (
    <div>
      <PageHeader title="Address Labels" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3 items-center">
          <select value={projectId} onChange={e => setProjectId(e.target.value)} className="border rounded px-2 h-9 text-sm min-w-64">
            <option value="">All Projects</option>
            {(projects as any[]).map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="flex border rounded overflow-hidden text-xs">
            <button onClick={() => setView('table')} className={`px-3 py-1.5 ${view === 'table' ? 'bg-blue-700 text-white' : 'bg-white text-gray-600'}`}>Table</button>
            <button onClick={() => setView('labels')} className={`px-3 py-1.5 ${view === 'labels' ? 'bg-blue-700 text-white' : 'bg-white text-gray-600'}`}>Labels</button>
          </div>
          <button onClick={() => window.print()} className="px-3 py-1.5 bg-slate-700 text-white rounded text-xs hover:bg-slate-800">Print All Labels</button>
        </div>

        {view === 'table' ? (
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-slate-700 px-3 py-2 text-white text-xs font-bold uppercase">Address Labels ({(bookings as any[]).length} customers)</div>
            <div className="overflow-auto">
              <table className="w-full text-xs">
                <thead><tr className="bg-blue-900 text-white"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Reg. No.</th><th className="px-3 py-2">Customer Name</th><th className="px-3 py-2">Address</th><th className="px-3 py-2">City</th><th className="px-3 py-2">Pin</th><th className="px-3 py-2">Action</th></tr></thead>
                <tbody>
                  {isLoading ? <tr><td colSpan={7} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                  (bookings as any[]).length === 0 ? <tr><td colSpan={7} className="text-center py-6 text-gray-400 italic">No bookings found</td></tr> :
                  (bookings as any[]).map((b: any, i: number) => {
                    const app = b.Applicants?.[0];
                    return (
                      <tr key={b.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2 font-medium">{b.registrationNo || '—'}</td>
                        <td className="px-3 py-2">{`${app?.firstName || ''} ${app?.lastName || ''}`.trim() || '—'}</td>
                        <td className="px-3 py-2 text-gray-600">{app?.address || '—'}</td>
                        <td className="px-3 py-2">{app?.city || '—'}</td>
                        <td className="px-3 py-2">{app?.pinCode || app?.pin || '—'}</td>
                        <td className="px-3 py-2"><button onClick={() => window.print()} className="px-2 py-1 bg-blue-700 text-white rounded text-xs hover:bg-blue-800">Print</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {isLoading ? <div className="col-span-4 text-center py-8 text-gray-400">Loading...</div> :
            (bookings as any[]).map((b: any) => {
              const app = b.Applicants?.[0];
              return (
                <div key={b.id} className="bg-white border-2 border-dashed border-gray-300 rounded p-3 text-xs">
                  <div className="font-bold text-gray-800 mb-1">{`${app?.firstName || ''} ${app?.lastName || ''}`.trim() || '—'}</div>
                  <div className="text-gray-600">{app?.address || 'Address not available'}</div>
                  {app?.city && <div className="text-gray-600">{app.city}{app?.state ? `, ${app.state}` : ''}</div>}
                  {(app?.pinCode || app?.pin) && <div className="font-medium text-gray-700">PIN: {app?.pinCode || app?.pin}</div>}
                  <div className="text-gray-400 mt-1 text-xs border-t pt-1">Reg: {b.registrationNo || '—'}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
