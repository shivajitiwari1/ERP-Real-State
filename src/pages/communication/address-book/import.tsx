import { useState, useRef } from 'react';
import PageHeader from '@/components/shared/PageHeader';

export default function ImportExcelPage() {
  const [rows, setRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length === 0) { setError('File is empty'); return; }
      const parseCSV = (line: string) => line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      setHeaders(parseCSV(lines[0]));
      setRows(lines.slice(1).map(parseCSV));
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <PageHeader title="Import Excel Sheet" />
      <div className="space-y-4">
        <div className="bg-white border rounded-lg shadow-sm p-4">
          <div className="flex gap-3 items-center">
            <input ref={inputRef} type="file" accept=".csv,.txt" onChange={handleFile} className="hidden" />
            <button onClick={() => inputRef.current?.click()} className="bg-purple-700 text-white px-4 h-9 rounded text-sm hover:bg-purple-800">Choose CSV File</button>
            <span className="text-xs text-gray-500">Supports CSV format. First row should be headers.</span>
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
        {rows.length > 0 && (
          <div className="bg-white rounded border shadow-sm overflow-hidden">
            <div className="bg-purple-700 text-white text-xs font-bold px-3 py-2 uppercase tracking-wide">Preview — {rows.length} records imported</div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-slate-100">
                  <th className="px-3 py-2 text-left">S.No.</th>
                  {headers.map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}
                </tr></thead>
                <tbody>
                  {rows.slice(0, 50).map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-1.5 text-gray-500">{i + 1}</td>
                      {headers.map((_, ci) => <td key={ci} className="px-3 py-1.5">{row[ci] || '-'}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 50 && <p className="text-xs text-gray-400 px-3 py-2">Showing first 50 of {rows.length} records</p>}
          </div>
        )}
      </div>
    </div>
  );
}
