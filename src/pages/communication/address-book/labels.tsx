import { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';

const STORAGE_KEY = 'address_book_labels';
interface AddressEntry { id: number; name: string; address: string; tag: string; phone: string; }

export default function AddressLabelsPage() {
  const [entries, setEntries] = useState<AddressEntry[]>([]);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ name: '', address: '', tag: '', phone: '' });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  const save = (updated: AddressEntry[]) => { setEntries(updated); localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); };
  const add = () => {
    if (form.name.trim()) {
      save([...entries, { id: Date.now(), ...form }]);
      setForm({ name: '', address: '', tag: '', phone: '' });
    }
  };
  const remove = (id: number) => save(entries.filter(e => e.id !== id));
  const filtered = entries.filter(e => !filter || e.name.toLowerCase().includes(filter.toLowerCase()) || e.tag.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <PageHeader title="Address Label" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 space-y-2">
          <div className="grid grid-cols-4 gap-2">
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Name *" className="border rounded px-2 h-9 text-sm" />
            <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="Phone" className="border rounded px-2 h-9 text-sm" />
            <input value={form.tag} onChange={e => setForm(f => ({...f, tag: e.target.value}))} placeholder="Tag / Label" className="border rounded px-2 h-9 text-sm" />
            <input value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} placeholder="Address" className="border rounded px-2 h-9 text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={add} className="bg-purple-700 text-white px-4 h-8 rounded text-sm hover:bg-purple-800">Add Entry</button>
            <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter by name or tag..." className="border rounded px-2 h-8 text-sm ml-auto min-w-48" />
          </div>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">Address Labels ({filtered.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-800 text-white">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Phone</th>
              <th className="px-3 py-2 text-left">Tag</th>
              <th className="px-3 py-2 text-left">Address</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-6 text-gray-400">No entries found</td></tr> :
              filtered.map((e, i) => (
                <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium">{e.name}</td>
                  <td className="px-3 py-1.5">{e.phone || '-'}</td>
                  <td className="px-3 py-1.5"><span className="px-1.5 py-0.5 rounded text-xs bg-purple-100 text-purple-700">{e.tag || '-'}</span></td>
                  <td className="px-3 py-1.5 text-gray-600">{e.address || '-'}</td>
                  <td className="px-3 py-1.5 text-center">
                    <button onClick={() => remove(e.id)} className="text-red-500 hover:text-red-700 text-xs px-2 py-0.5 rounded hover:bg-red-50">Delete</button>
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
