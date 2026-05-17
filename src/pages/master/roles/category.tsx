import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function RoleCategoryPage() {
  const { data: menus = [], isLoading } = useQuery<any[]>({ queryKey: ['role-menus-all'], queryFn: () => axios.get('/api/master/role-menus').then(r => r.data.data) });
  const { data: roles = [] } = useQuery<any[]>({ queryKey: ['roles'], queryFn: () => axios.get('/api/master/roles').then(r => r.data.data) });

  const byCategory: Record<string, any[]> = {};
  (menus as any[]).forEach((m: any) => {
    const cat = m.category || 'General';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(m);
  });

  const roleMap: Record<string, string> = {};
  (roles as any[]).forEach((r: any) => { roleMap[r.id] = r.name; });

  return (
    <div>
      <PageHeader title="Role Category Wise Page Hierarchy" />
      {isLoading ? <div className="text-center py-8 text-gray-400">Loading...</div> : (
        Object.keys(byCategory).length === 0 ? (
          <div className="bg-white border rounded-lg p-8 text-center text-gray-400 italic text-sm">No role menu assignments found. Configure via Role Wise Menus.</div>
        ) : (
          <div className="space-y-4">
            {Object.entries(byCategory).map(([category, pages]) => (
              <div key={category} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="bg-slate-700 px-4 py-2 flex items-center justify-between">
                  <span className="text-white text-xs font-bold uppercase tracking-wide">{category}</span>
                  <span className="text-slate-300 text-xs">{pages.length} page{pages.length !== 1 ? 's' : ''}</span>
                </div>
                <table className="w-full text-xs">
                  <thead><tr className="bg-slate-100"><th className="px-3 py-2 text-left">Page Name</th><th className="px-3 py-2 text-left">URL</th><th className="px-3 py-2 text-left">Role</th><th className="px-3 py-2 text-center">Can View</th></tr></thead>
                  <tbody>{pages.map((p: any, i: number) => (
                    <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 font-medium">{p.pageName}</td>
                      <td className="px-3 py-2 text-gray-500 font-mono text-[10px]">{p.pageUrl}</td>
                      <td className="px-3 py-2">{roleMap[p.roleId] || `Role #${p.roleId}`}</td>
                      <td className="px-3 py-2 text-center">{p.canView ? <span className="text-green-600 font-bold">✓</span> : <span className="text-red-400">✗</span>}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
