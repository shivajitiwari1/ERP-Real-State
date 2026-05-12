import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function RoleMenusPage() {
  const qc = useQueryClient();
  const [roleId, setRoleId] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const { data: roles = [] } = useQuery({ queryKey: ['roles'], queryFn: () => axios.get('/api/master/roles').then(r => r.data.data) });
  const { data: menuData, isLoading } = useQuery({
    queryKey: ['role-menus', roleId],
    queryFn: () => axios.get(`/api/master/role-menus?roleId=${roleId}`).then(r => r.data.data),
    enabled: !!roleId,
  });

  useEffect(() => {
    if (menuData?.assigned) setSelected(menuData.assigned.map((m: any) => m.pageUrl));
  }, [menuData]);

  const saveMutation = useMutation({
    mutationFn: () => axios.post('/api/master/role-menus', { roleId: Number(roleId), pageUrls: selected }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['role-menus', roleId] }),
  });

  const categories = [...new Set((menuData?.allPages ?? []).map((p: any) => p.category as string))];

  function toggleAll(cat: string, checked: boolean) {
    const urls = (menuData?.allPages ?? []).filter((p: any) => p.category === cat).map((p: any) => p.url as string);
    setSelected(prev => checked ? [...new Set([...prev, ...urls])] : prev.filter(u => !urls.includes(u)));
  }

  return (
    <div>
      <PageHeader title="Role Wise Menus" />
      <div className="bg-white p-4 rounded border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Label className="text-sm font-semibold">Select Role:</Label>
          <select className="border rounded px-3 py-2 text-sm" value={roleId} onChange={e => setRoleId(e.target.value)}>
            <option value="">-- Select Role --</option>
            {(roles as any[]).map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        {roleId && isLoading && <p className="text-sm text-gray-400">Loading...</p>}
        {roleId && menuData && (
          <>
            <div className="border rounded overflow-hidden mb-4">
              {categories.map(cat => {
                const pages = (menuData.allPages as any[]).filter(p => p.category === cat);
                const allChecked = pages.every(p => selected.includes(p.url));
                return (
                  <div key={cat} className="border-b last:border-b-0">
                    <div className="bg-slate-100 px-4 py-2 flex items-center gap-2">
                      <input type="checkbox" checked={allChecked} onChange={e => toggleAll(cat, e.target.checked)} className="cursor-pointer" />
                      <span className="font-semibold text-sm text-slate-700">{cat}</span>
                      <span className="text-xs text-gray-400">({pages.filter(p => selected.includes(p.url)).length}/{pages.length})</span>
                    </div>
                    <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {pages.map((p: any) => (
                        <label key={p.url} className="flex items-center gap-2 text-xs cursor-pointer hover:text-orange-600">
                          <input type="checkbox" checked={selected.includes(p.url)}
                            onChange={e => setSelected(prev => e.target.checked ? [...prev, p.url] : prev.filter(u => u !== p.url))} />
                          {p.name}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => saveMutation.mutate()} className="bg-orange-500 hover:bg-orange-600" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save Menu Access'}
              </Button>
              <span className="text-xs text-gray-500">{selected.length} pages selected</span>
              {saveMutation.isSuccess && <span className="text-green-600 text-xs">Saved!</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
