import { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';

const STORAGE_KEY = 'sms_subject_master';
interface SMSTemplate { id: number; subject: string; body: string; }

export default function SMSSubjectMasterPage() {
  const [templates, setTemplates] = useState<SMSTemplate[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setTemplates(JSON.parse(stored));
    else setTemplates([
      { id: 1, subject: 'Booking Confirmation', body: 'Dear {name}, your booking {regNo} has been confirmed.' },
      { id: 2, subject: 'Payment Reminder', body: 'Dear {name}, payment of Rs. {amount} is due on {date}.' },
    ]);
  }, []);

  const save = (updated: SMSTemplate[]) => { setTemplates(updated); localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); };
  const add = () => {
    if (subject.trim() && body.trim()) {
      save([...templates, { id: Date.now(), subject: subject.trim(), body: body.trim() }]);
      setSubject(''); setBody('');
    }
  };
  const remove = (id: number) => save(templates.filter(t => t.id !== id));

  return (
    <div>
      <PageHeader title="SMS Subject Master" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-3 space-y-2">
          <div className="flex gap-2">
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Template subject..." className="border rounded px-2 h-9 text-sm flex-1" />
          </div>
          <div className="flex gap-2">
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="SMS body (use {name}, {amount}, {date}...)" className="border rounded px-2 py-1.5 text-sm flex-1 h-16 resize-none" />
            <button onClick={add} className="bg-purple-700 text-white px-4 rounded text-sm hover:bg-purple-800">Add</button>
          </div>
        </div>
        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase">SMS Templates ({templates.length})</div>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="bg-slate-800 text-white">
              <th className="px-3 py-2 text-left">S.No.</th>
              <th className="px-3 py-2 text-left">Subject</th>
              <th className="px-3 py-2 text-left">Template Body</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr></thead>
            <tbody>
              {templates.length === 0 ? <tr><td colSpan={4} className="text-center py-6 text-gray-400">No templates added</td></tr> :
              templates.map((t, i) => (
                <tr key={t.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                  <td className="px-3 py-1.5 font-medium text-blue-600">{t.subject}</td>
                  <td className="px-3 py-1.5 text-gray-600 max-w-sm">{t.body}</td>
                  <td className="px-3 py-1.5 text-center">
                    <button onClick={() => remove(t.id)} className="text-red-500 hover:text-red-700 text-xs px-2 py-0.5 rounded hover:bg-red-50">Delete</button>
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
