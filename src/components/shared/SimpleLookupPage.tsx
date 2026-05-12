import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { z } from 'zod';
import PageHeader from './PageHeader';
import { ReactNode } from 'react';

interface Field { name: string; label: string; type?: string; }
interface Props {
  title: string;
  apiPath: string;
  fields: Field[];
  schema: z.ZodObject<any>;
  tableColumns?: { header: string; accessor: string | ((row: any) => ReactNode); }[];
}

export default function SimpleLookupPage({ title, apiPath, fields, schema, tableColumns }: Props) {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: [apiPath],
    queryFn: () => axios.get(apiPath).then(r => r.data.data),
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const editingId = watch('id');

  const save = useMutation({
    mutationFn: (d: any) => d.id ? axios.put(apiPath, d) : axios.post(apiPath, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [apiPath] }); reset(); },
  });

  const cols = tableColumns ?? fields.map(f => ({ header: f.label, accessor: f.name }));

  const btnStyle = (primary: boolean): React.CSSProperties => ({
    padding: '0 18px', height: 36,
    background: primary ? '#F97316' : 'transparent',
    border: primary ? 'none' : '1.5px solid var(--border)',
    borderRadius: 8, color: primary ? '#fff' : 'var(--text-muted)',
    fontSize: 12.5, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
    cursor: 'pointer', transition: 'all 0.15s ease',
    opacity: (primary && save.isPending) ? 0.65 : 1,
  });

  return (
    <div>
      <PageHeader title={title} />
      {/* Layout: left form 340px fixed + right table takes remaining */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* Form card */}
        <div style={{ width: 340, flexShrink: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ padding: '11px 18px', background: 'linear-gradient(135deg, #1E293B, #0F172A)', borderBottom: '1px solid var(--border)', fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94A3B8' }}>
            {editingId ? '✏️  Edit Record' : '➕  Add New Record'}
          </div>
          <div style={{ padding: '20px 18px' }}>
            <form onSubmit={handleSubmit(d => save.mutate(d))}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {fields.map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>
                      {f.label}
                    </label>
                    <input type={f.type || 'text'} {...register(f.name)}
                      style={{ width: '100%', height: 38, padding: '0 12px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'all 0.15s ease' }}
                      onFocus={e => { e.target.style.borderColor = '#F97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
                    {(errors as any)[f.name] && (
                      <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                        ⚠ {(errors as any)[f.name]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <button type="submit" disabled={save.isPending} style={btnStyle(true)}>
                  {save.isPending ? '...' : editingId ? 'Update' : 'Save'}
                </button>
                <button type="button" onClick={() => reset()} style={btnStyle(false)}>
                  Clear
                </button>
              </div>
              {save.isError && (
                <p style={{ fontSize: 11.5, color: '#EF4444', marginTop: 10 }}>
                  ⚠ {String((save.error as any)?.response?.data?.message || 'Save failed')}
                </p>
              )}
              {save.isSuccess && (
                <p style={{ fontSize: 11.5, color: '#16A34A', marginTop: 10 }}>✓ Saved successfully</p>
              )}
            </form>
          </div>
        </div>

        {/* Table — takes full remaining width */}
        <div style={{ flex: 1, minWidth: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 18px', background: 'linear-gradient(135deg, #1E293B, #0F172A)', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#94A3B8' }}>
              {title} — Records
            </span>
            <span style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316', fontSize: 10.5, fontWeight: 700, padding: '2px 9px', borderRadius: 99, fontFamily: "'Outfit', sans-serif", border: '1px solid rgba(249,115,22,0.25)' }}>
              {(data as any[]).length} total
            </span>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: 500, overflowY: 'auto' }}>
            <table className="erp-table" style={{ width: '100%' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                <tr>
                  <th style={{ width: 44, textAlign: 'center' }}>S.No.</th>
                  {cols.map(c => <th key={c.header}>{c.header}</th>)}
                  <th style={{ textAlign: 'center', width: 80 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {(data as any[]).length === 0 ? (
                  <tr>
                    <td colSpan={cols.length + 2}
                      style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>
                      No records yet. Use the form to add one.
                    </td>
                  </tr>
                ) : (data as any[]).map((row: any, i) => (
                  <tr key={row.id}>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>{i + 1}</td>
                    {cols.map(c => (
                      <td key={c.header}>
                        {typeof c.accessor === 'function' ? c.accessor(row) : String(row[c.accessor as string] ?? '')}
                      </td>
                    ))}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => { fields.forEach(f => setValue(f.name, row[f.name])); setValue('id', row.id); }}
                        style={{ padding: '3px 12px', height: 26, background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 500, transition: 'all 0.12s ease' }}
                        onMouseEnter={e => { (e.currentTarget.style.borderColor = '#F97316'); (e.currentTarget.style.color = '#F97316'); (e.currentTarget.style.background = 'rgba(249,115,22,0.06)'); }}
                        onMouseLeave={e => { (e.currentTarget.style.borderColor = 'var(--border)'); (e.currentTarget.style.color = 'var(--text-muted)'); (e.currentTarget.style.background = 'transparent'); }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
