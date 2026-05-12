import { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  align?: 'left' | 'right' | 'center';
  width?: string;
}
interface Props<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  isLoading?: boolean;
}

export default function DataTable<T extends { id: number | string }>({
  columns, data, emptyMessage = 'No records found', isLoading,
}: Props<T>) {
  const ta = (a?: string) => a === 'right' ? 'right' as const : a === 'center' ? 'center' as const : 'left' as const;

  return (
    <div style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ overflowX: 'auto' }}>
        <table className="erp-table" style={{ width: '100%', minWidth: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: 44, textAlign: 'center' }}>No.</th>
              {columns.map(col => (
                <th key={String(col.header)} style={{ textAlign: ta(col.align), width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1}
                  style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <div style={{ width: 18, height: 18, border: '2px solid var(--border)', borderTopColor: '#F97316', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    <span style={{ fontSize: 13, fontStyle: 'italic' }}>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1}
                  style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : data.map((row, i) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}>{i + 1}</td>
                {columns.map(col => (
                  <td key={String(col.header)} style={{ textAlign: ta(col.align) }}>
                    {typeof col.accessor === 'function' ? col.accessor(row) : String(row[col.accessor] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
