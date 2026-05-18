import { ReactNode } from 'react';
import { exportToCSV } from '@/lib/csv-export';

interface Column { header: string; accessor: string | ((row: any) => ReactNode); csvValue?: (row: any) => string; align?: 'left' | 'right' | 'center'; width?: string; }
interface Props { title: string; columns: Column[]; data: any[]; filename?: string; isLoading?: boolean; }

export default function ReportTable({ title, columns, data, filename, isLoading }: Props) {
  function handleExport() {
    const headers = columns.map(c => c.header);
    const rows = data.map(row => columns.map(c => {
      if (c.csvValue) return c.csvValue(row);
      if (typeof c.accessor === 'string') return String(row[c.accessor] ?? '');
      return '';
    }));
    exportToCSV(filename || title.replace(/\s+/g, '_'), headers, rows);
  }

  const ta = (a?: string) => a === 'right' ? 'right' as const : a === 'center' ? 'center' as const : 'left' as const;

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 14px', background: 'transparent',
    border: '1.5px solid var(--border)', borderRadius: 7,
    fontSize: 12, color: 'var(--text-muted)', cursor: data.length === 0 ? 'not-allowed' : 'pointer',
    fontFamily: "'Outfit', sans-serif", fontWeight: 600,
    transition: 'all 0.15s ease', opacity: data.length === 0 ? 0.4 : 1,
  };

  return (
    <div style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#7C3AED' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#fff' }}>
            {title}
          </span>
          {data.length > 0 && (
            <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 10.5, fontWeight: 700, padding: '2px 10px', borderRadius: 99, fontFamily: "'Outfit', sans-serif" }}>
              {data.length.toLocaleString()} records
            </span>
          )}
        </div>
        <button onClick={handleExport} disabled={data.length === 0} style={{ ...btnStyle, borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}
          onMouseEnter={e => { if (data.length > 0) { (e.currentTarget.style.background = 'rgba(255,255,255,0.15)'); } }}
          onMouseLeave={e => { (e.currentTarget.style.background = 'transparent'); }}>
          📥 Export CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', maxHeight: '65vh', overflowY: 'auto' }}>
        <table className="erp-table" style={{ width: '100%', minWidth: '100%' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
            <tr>
              <th style={{ width: 44, textAlign: 'center' }}>S.No.</th>
              {columns.map(c => <th key={c.header} style={{ textAlign: ta(c.align), width: c.width }}>{c.header}</th>)}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, border: '2.5px solid var(--border)', borderTopColor: '#F97316', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  <span style={{ fontSize: 13, fontStyle: 'italic' }}>Fetching data...</span>
                </div>
              </td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length + 1}
                style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13.5 }}>
                No data found. Select a project and adjust filters, then try again.
              </td></tr>
            ) : data.map((row, i) => (
              <tr key={i}>
                <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}>{i + 1}</td>
                {columns.map(c => (
                  <td key={c.header} style={{ textAlign: ta(c.align) }}>
                    {typeof c.accessor === 'function' ? c.accessor(row) : String(row[c.accessor as string] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      {data.length > 0 && (
        <div style={{ padding: '8px 18px', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontFamily: "'Outfit', sans-serif" }}>
            Showing <strong style={{ color: 'var(--text)' }}>{data.length.toLocaleString()}</strong> records
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Use Export CSV to download</span>
        </div>
      )}
    </div>
  );
}
