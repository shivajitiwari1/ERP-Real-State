import { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';

const STORAGE_KEY = 'sms_head_master';

export default function SMSHeadMasterPage() {
  const [heads, setHeads] = useState<string[]>([]);
  const [newHead, setNewHead] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setHeads(JSON.parse(stored));
    else setHeads(['Booking', 'Payment', 'Possession', 'Reminder', 'General', 'Marketing']);
  }, []);

  const save = (updated: string[]) => { setHeads(updated); localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); };
  const add = () => { if (newHead.trim()) { save([...heads, newHead.trim()]); setNewHead(''); } };
  const remove = (i: number) => save(heads.filter((_, idx) => idx !== i));

  return (
    <div>
      <PageHeader title="SMS Head Master" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 flex gap-2">
          <input value={newHead} onChange={e => setNewHead(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} placeholder="New SMS head category..." className="border rounded px-2 h-9 text-sm flex-1" />
          <button onClick={add} className="bg-purple-700 text-white px-4 h-9 rounded text-sm hover:bg-purple-800">Add</button>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">SMS Head Categories ({heads.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-100">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Category Name</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr></thead>
            <tbody>
              {heads.length === 0 ? <tr><td colSpan={3} className="text-center py-6 text-gray-400">No categories added</td></tr> :
              heads.map((h, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{h}</td>
                  <td className="px-3 py-1.5 text-center">
                    <button onClick={() => remove(i)} className="text-red-500 hover:text-red-700 text-xs px-2 py-0.5 rounded hover:bg-red-50">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
