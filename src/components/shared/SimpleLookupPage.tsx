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

  return (
    <div>
      <PageHeader title={title} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        {/* Form */}
        <div className="erp-card" style={{ padding: 20 }}>
          <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)', fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {editingId ? '✏️ Edit Record' : '➕ Add New'}
          </div>
          <form onSubmit={handleSubmit(d => save.mutate(d))}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {fields.map(f => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>{f.label}</label>
                  <input type={f.type || 'text'} {...register(f.name)}
                    style={{ width: '100%', height: 38, padding: '0 12px', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'all 0.15s ease' }}
                    onFocus={e => { e.target.style.borderColor = '#F97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
                  {(errors as any)[f.name] && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{(errors as any)[f.name]?.message}</p>}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <button type="submit" disabled={save.isPending}
                style={{ padding: '0 18px', height: 36, background: '#F97316', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", cursor: 'pointer', transition: 'all 0.15s ease', opacity: save.isPending ? 0.7 : 1 }}>
                {save.isPending ? '...' : editingId ? 'Update' : 'Save'}
              </button>
              <button type="button" onClick={() => reset()}
                style={{ padding: '0 14px', height: 36, background: 'transparent', border: '1.5px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, fontFamily: "'Outfit', sans-serif", cursor: 'pointer', transition: 'all 0.15s ease' }}>
                Clear
              </button>
            </div>
            {save.isError && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 8 }}>{String((save.error as any)?.response?.data?.message || 'Save failed')}</p>}
          </form>
        </div>

        {/* Table */}
        <div className="erp-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Records</span>
            <span style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, fontFamily: "'Outfit', sans-serif" }}>{(data as any[]).length}</span>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: 420, overflowY: 'auto' }}>
            <table className="erp-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>S.No.</th>
                  {cols.map(c => <th key={c.header}>{c.header}</th>)}
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {(data as any[]).length === 0 ? (
                  <tr><td colSpan={cols.length + 2} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>No records yet</td></tr>
                ) : (data as any[]).map((row: any, i) => (
                  <tr key={row.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{i + 1}</td>
                    {cols.map(c => (
                      <td key={c.header}>
                        {typeof c.accessor === 'function' ? c.accessor(row) : String(row[c.accessor as string] ?? '')}
                      </td>
                    ))}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => { fields.forEach(f => setValue(f.name, row[f.name])); setValue('id', row.id); }}
                        style={{ padding: '3px 10px', height: 26, background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'all 0.1s ease' }}
                        onMouseEnter={e => { (e.currentTarget.style.borderColor = '#F97316'); (e.currentTarget.style.color = '#F97316'); }}
                        onMouseLeave={e => { (e.currentTarget.style.borderColor = 'var(--border)'); (e.currentTarget.style.color = 'var(--text-muted)'); }}>
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
