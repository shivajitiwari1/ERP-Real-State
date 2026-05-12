import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/csv-export';

interface Column { header: string; accessor: string | ((row: any) => ReactNode); csvValue?: (row: any) => string; align?: 'left' | 'right' | 'center'; }

interface Props {
  title: string;
  columns: Column[];
  data: any[];
  filename?: string;
  totals?: Record<string, number>;
  isLoading?: boolean;
}

export default function ReportTable({ title, columns, data, filename, totals, isLoading }: Props) {
  function handleExport() {
    const headers = columns.map(c => c.header);
    const rows = data.map(row => columns.map(c => {
      if (c.csvValue) return c.csvValue(row);
      if (typeof c.accessor === 'string') return String(row[c.accessor] ?? '');
      return '';
    }));
    exportToCSV(filename || title.replace(/\s+/g, '_'), headers, rows);
  }

  const align = (a?: string) => a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left';

  return (
    <div className="bg-white rounded border shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-slate-50">
        <span className="text-xs font-bold text-slate-700 uppercase">{title} — {data.length} records</span>
        <Button size="sm" variant="outline" onClick={handleExport} className="h-7 text-xs" disabled={data.length === 0}>
          Export CSV
        </Button>
      </div>
      <div className="overflow-auto max-h-[60vh]">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0">
            <tr className="bg-slate-700 text-white">
              <th className="px-2 py-2 text-left w-8">S.No.</th>
              {columns.map(c => (
                <th key={c.header} className={`px-2 py-2 ${align(c.align)}`}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={columns.length + 1} className="text-center py-10 text-gray-400 italic">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="text-center py-10 text-gray-400 italic">No data found</td></tr>
            ) : data.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-2 py-1.5 text-gray-400">{i + 1}</td>
                {columns.map(c => (
                  <td key={c.header} className={`px-2 py-1.5 ${align(c.align)}`}>
                    {typeof c.accessor === 'function' ? c.accessor(row) : String(row[c.accessor] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {totals && (
            <tfoot>
              <tr className="bg-slate-100 font-semibold border-t-2 border-slate-400">
                <td className="px-2 py-2 text-xs text-slate-600" colSpan={2}>Total</td>
                {columns.slice(1).map(c => (
                  <td key={c.header} className={`px-2 py-2 text-xs ${align(c.align)}`}>
                    {totals[c.header] !== undefined ? totals[c.header].toLocaleString('en-IN') : ''}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
