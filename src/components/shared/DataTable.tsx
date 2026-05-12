import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export default function DataTable<T extends { id: number | string }>({
  columns, data, emptyMessage = 'No records found',
}: Props<T>) {
  return (
    <div className="border rounded overflow-hidden">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-700 text-white">
            <th className="px-3 py-2 text-left text-xs font-medium w-10">S.No.</th>
            {columns.map(col => (
              <th key={String(col.header)} className={`px-3 py-2 text-left text-xs font-medium ${col.className ?? ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center text-gray-400 py-8 italic">
                {emptyMessage}
              </td>
            </tr>
          ) : data.map((row, i) => (
            <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-3 py-2 text-gray-400">{i + 1}</td>
              {columns.map(col => (
                <td key={String(col.header)} className={`px-3 py-2 ${col.className ?? ''}`}>
                  {typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : String(row[col.accessor] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
