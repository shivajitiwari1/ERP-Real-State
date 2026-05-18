import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function UserDefineLettersPage() {
  const [search, setSearch] = useState('');
  const { data: letters = [], isLoading } = useQuery<any[]>({
    queryKey: ['letters'],
    queryFn: () => axios.get('/api/master/letters').then(r => r.data.data).catch(() => []),
    enabled: true
  });

  const filtered = (letters as any[]).filter((l: any) => {
    if (!search) return true;
    return (l.name || l.title || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <PageHeader title="User Define Letters" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search letter templates..." className="border rounded px-2 h-9 text-sm min-w-64 flex-1" />
        </div>
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-purple-700 px-3 py-2 text-white text-xs font-bold uppercase">User Define Letters ({filtered.length} templates)</div>
          <div className="overflow-auto">
            <table className="w-full text-xs">
              <thead><tr className="bg-slate-800 text-white"><th className="px-3 py-2">S.No.</th><th className="px-3 py-2">Letter Name</th><th className="px-3 py-2">Type</th><th className="px-3 py-2">Created Date</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Action</th></tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td></tr> :
                filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center">
                    <div className="text-gray-400 italic text-xs">No letter templates found</div>
                    <div className="text-gray-300 text-xs mt-1">Create templates in Master &rarr; Letters</div>
                  </td></tr>
                ) :
                filtered.map((l: any, i: number) => (
                  <tr key={l.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-2 text-center text-gray-400">{i + 1}</td>
                    <td className="px-3 py-2 font-medium">{l.name || l.title || '—'}</td>
                    <td className="px-3 py-2 text-gray-600">{l.type || l.category || 'General'}</td>
                    <td className="px-3 py-2">{l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-3 py-2"><span className={`px-1.5 py-0.5 rounded text-xs ${l.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{l.isActive !== false ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-3 py-2 flex gap-1"><button onClick={() => window.print()} className="px-2 py-1 bg-blue-700 text-white rounded text-xs hover:bg-blue-800">Preview</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
