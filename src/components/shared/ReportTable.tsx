import { ReactNode } from 'react';
import { exportToCSV } from '@/lib/csv-export';

interface Column { header: string; accessor: string | ((row: any) => ReactNode); csvValue?: (row: any) => string; align?: 'left' | 'right' | 'center'; }
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

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-card)' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</span>
          <span style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, fontFamily: "'Outfit', sans-serif" }}>
            {data.length} records
          </span>
        </div>
        <button onClick={handleExport} disabled={data.length === 0}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, fontSize: 11, color: 'var(--text-muted)', cursor: data.length === 0 ? 'not-allowed' : 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 500, transition: 'all 0.15s ease', opacity: data.length === 0 ? 0.4 : 1 }}
          onMouseEnter={e => { if (data.length > 0) { (e.currentTarget.style.borderColor = '#F97316'); (e.currentTarget.style.color = '#F97316'); } }}
          onMouseLeave={e => { (e.currentTarget.style.borderColor = 'var(--border)'); (e.currentTarget.style.color = 'var(--text-muted)'); }}>
          📥 Export CSV
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', maxHeight: '62vh', overflowY: 'auto' }}>
        <table className="erp-table">
          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              <th style={{ width: 36 }}>S.No.</th>
              {columns.map(c => <th key={c.header} style={{ textAlign: ta(c.align) }}>{c.header}</th>)}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div style={{ width: 18, height: 18, border: '2px solid var(--border)', borderTopColor: '#F97316', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  <span style={{ fontSize: 13, fontStyle: 'italic' }}>Loading data...</span>
                </div>
              </td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>
                No data found. Adjust filters and try again.
              </td></tr>
            ) : data.map((row, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{i + 1}</td>
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
    </div>
  );
}
