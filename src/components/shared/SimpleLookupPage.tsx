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
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* Form card */}
        <div style={{ width: 340, flexShrink: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          {/* Purple header matching Company Master */}
          <div style={{ padding: '10px 16px', background: '#7C3AED', fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#fff' }}>
            {editingId ? '✏️  Edit Record' : '➕  Add New Record'}
          </div>
          <div style={{ padding: '18px 16px' }}>
            <form onSubmit={handleSubmit(d => save.mutate(d))}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {fields.map(f => (
                  <div key={f.name}>
                    <label style={{ display: 'block', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 5, fontFamily: "'Outfit', sans-serif" }}>
                      {f.label}
                    </label>
                    <input type={f.type || 'text'} {...register(f.name)}
                      style={{ width: '100%', height: 36, padding: '0 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'all 0.15s ease' }}
                      onFocus={e => { e.target.style.borderColor = '#7C3AED'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
                    {(errors as any)[f.name] && (
                      <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>
                        ⚠ {(errors as any)[f.name]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <button type="submit" disabled={save.isPending} style={{ padding: '0 18px', height: 34, background: '#F97316', border: 'none', borderRadius: 5, color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: "'Outfit', sans-serif", cursor: 'pointer', opacity: save.isPending ? 0.65 : 1, letterSpacing: '0.03em' }}>
                  {save.isPending ? 'Saving...' : editingId ? 'Update' : 'Save'}
                </button>
                <button type="button" onClick={() => reset()} style={{ padding: '0 16px', height: 34, background: 'transparent', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", cursor: 'pointer' }}>
                  Clear
                </button>
              </div>
              {save.isError && <p style={{ fontSize: 11.5, color: '#EF4444', marginTop: 10 }}>⚠ {String((save.error as any)?.response?.data?.message || 'Save failed')}</p>}
              {save.isSuccess && <p style={{ fontSize: 11.5, color: '#16A34A', marginTop: 10 }}>✓ Saved successfully</p>}
            </form>
          </div>
        </div>

        {/* Table */}
        <div style={{ flex: 1, minWidth: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#7C3AED' }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#fff' }}>
              {title} — Records
            </span>
            <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 10.5, fontWeight: 700, padding: '2px 10px', borderRadius: 99, fontFamily: "'Outfit', sans-serif" }}>
              {(data as any[]).length} total
            </span>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: 520, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              <thead>
                <tr style={{ background: '#F1F5F9' }}>
                  <th style={{ width: 44, textAlign: 'center', padding: '9px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569', borderBottom: '2px solid #CBD5E1', fontFamily: "'Outfit', sans-serif" }}>S.No.</th>
                  {cols.map(c => (
                    <th key={c.header} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569', borderBottom: '2px solid #CBD5E1', fontFamily: "'Outfit', sans-serif" }}>
                      {c.header}
                    </th>
                  ))}
                  <th style={{ textAlign: 'center', width: 80, padding: '9px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#475569', borderBottom: '2px solid #CBD5E1', fontFamily: "'Outfit', sans-serif" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {(data as any[]).length === 0 ? (
                  <tr>
                    <td colSpan={cols.length + 2} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 13 }}>
                      No records yet. Use the form to add one.
                    </td>
                  </tr>
                ) : (data as any[]).map((row: any, i) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? '#fff' : '#F8FAFC' }}>
                    <td style={{ textAlign: 'center', color: '#94A3B8', fontSize: 11, padding: '8px 12px' }}>{i + 1}</td>
                    {cols.map(c => (
                      <td key={c.header} style={{ padding: '8px 12px', color: 'var(--text-table)', verticalAlign: 'middle' }}>
                        {typeof c.accessor === 'function' ? c.accessor(row) : String(row[c.accessor as string] ?? '')}
                      </td>
                    ))}
                    <td style={{ textAlign: 'center', padding: '8px 12px' }}>
                      <button
                        onClick={() => { fields.forEach(f => setValue(f.name, row[f.name])); setValue('id', row.id); }}
                        style={{ padding: '3px 14px', height: 26, background: 'transparent', border: '1px solid #CBD5E1', borderRadius: 5, color: '#64748B', fontSize: 11, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontWeight: 600, transition: 'all 0.12s ease' }}
                        onMouseEnter={e => { (e.currentTarget.style.borderColor = '#7C3AED'); (e.currentTarget.style.color = '#7C3AED'); (e.currentTarget.style.background = 'rgba(124,58,237,0.06)'); }}
                        onMouseLeave={e => { (e.currentTarget.style.borderColor = '#CBD5E1'); (e.currentTarget.style.color = '#64748B'); (e.currentTarget.style.background = 'transparent'); }}>
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
