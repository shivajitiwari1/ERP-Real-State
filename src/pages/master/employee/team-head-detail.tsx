import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';

export default function TeamHeadDetailPage() {
  const { data: employees = [], isLoading } = useQuery<any[]>({ queryKey: ['employees'], queryFn: () => axios.get('/api/master/employee/info').then(r => r.data.data) });

  const grouped: Record<number, any[]> = {};
  (employees as any[]).forEach((e: any) => {
    if (e.managerId) {
      if (!grouped[e.managerId]) grouped[e.managerId] = [];
      grouped[e.managerId].push(e);
    }
  });
  const empMap: Record<string, any> = {};
  (employees as any[]).forEach((e: any) => { empMap[e.id] = e; });

  return (
    <div>
      <PageHeader title="Team Head Detail" />
      {isLoading ? <div className="text-center py-8 text-gray-400">Loading...</div> : (
        <div className="space-y-4">
          {Object.keys(grouped).length === 0 ? (
            <div className="bg-white border rounded-lg p-8 text-center text-gray-400 italic text-sm">No team assignments found. Set managers via Employee Information.</div>
          ) : Object.entries(grouped).map(([managerId, members]) => {
            const mgr = empMap[managerId];
            return (
              <div key={managerId} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="bg-slate-700 px-4 py-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">{mgr?.firstName?.[0]}{mgr?.lastName?.[0]}</div>
                  <div className="text-white text-sm font-semibold">{mgr ? `${mgr.firstName} ${mgr.lastName}` : `Manager #${managerId}`}</div>
                  <span className="text-orange-300 text-xs">{mgr?.designation || ''}</span>
                  <span className="ml-auto text-slate-300 text-xs">{members.length} member{members.length !== 1 ? 's' : ''}</span>
                </div>
                <table className="w-full text-xs">
                  <thead><tr className="bg-slate-50"><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-left">Designation</th><th className="px-3 py-2 text-left">Mobile</th></tr></thead>
                  <tbody>{members.map((m: any, i: number) => <tr key={m.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}><td className="px-3 py-2">{m.firstName} {m.lastName}</td><td className="px-3 py-2">{m.designation || '—'}</td><td className="px-3 py-2">{m.mobile || '—'}</td></tr>)}</tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
