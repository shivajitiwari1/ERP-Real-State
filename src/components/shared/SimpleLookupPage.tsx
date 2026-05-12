import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { z } from 'zod';
import PageHeader from './PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DataTable from './DataTable';
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm">
          <h3 className="text-sm font-semibold text-slate-600 mb-3 pb-1 border-b">
            {editingId ? 'Edit Record' : 'Add New'}
          </h3>
          <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3">
            {fields.map(f => (
              <div key={f.name}>
                <Label className="text-xs text-gray-600">{f.label}</Label>
                <Input type={f.type || 'text'} {...register(f.name)} className="mt-1 h-9 text-sm" />
                {(errors as any)[f.name] && (
                  <p className="text-red-500 text-xs mt-1">{(errors as any)[f.name]?.message}</p>
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>
                {save.isPending ? 'Saving...' : editingId ? 'Update' : 'Save'}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => reset()}>Clear</Button>
            </div>
            {save.isError && <p className="text-red-500 text-xs">{String((save.error as any)?.response?.data?.message || 'Save failed')}</p>}
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm">
          <h3 className="text-sm font-semibold text-slate-600 mb-3 pb-1 border-b">Records ({(data as any[]).length})</h3>
          <DataTable
            columns={[
              ...cols.map(c => ({
                header: c.header,
                accessor: typeof c.accessor === 'function' ? c.accessor : (row: any) => String(row[c.accessor as string] ?? ''),
              })),
              {
                header: 'Action',
                accessor: (row: any) => (
                  <Button size="sm" variant="outline" className="h-7 text-xs"
                    onClick={() => { fields.forEach(f => setValue(f.name, row[f.name])); setValue('id', row.id); }}>
                    Edit
                  </Button>
                ),
              },
            ]}
            data={data as any[]}
          />
        </div>
      </div>
    </div>
  );
}
