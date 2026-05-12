import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string().min(1, 'Required'),
}).refine(d => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });
type FD = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const [msg, setMsg] = useState({ text: '', success: false });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FD>({ resolver: zodResolver(schema) });
  const mutation = useMutation({
    mutationFn: (d: FD) => axios.post('/api/master/security/change-password', { currentPassword: d.currentPassword, newPassword: d.newPassword }),
    onSuccess: () => { setMsg({ text: 'Password changed successfully!', success: true }); reset(); },
    onError: (e: any) => setMsg({ text: e.response?.data?.message || 'Error changing password', success: false }),
  });
  return (
    <div><PageHeader title="Change Password" />
      <div className="bg-white p-4 rounded border shadow-sm max-w-sm">
        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-3">
          <div><Label className="text-xs">Current Password</Label><Input type="password" {...register('currentPassword')} className="mt-1 h-9 text-sm" />{errors.currentPassword && <p className="text-red-500 text-xs">{errors.currentPassword.message}</p>}</div>
          <div><Label className="text-xs">New Password</Label><Input type="password" {...register('newPassword')} className="mt-1 h-9 text-sm" />{errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword.message}</p>}</div>
          <div><Label className="text-xs">Confirm New Password</Label><Input type="password" {...register('confirmPassword')} className="mt-1 h-9 text-sm" />{errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}</div>
          {msg.text && <p className={`text-xs p-2 rounded ${msg.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{msg.text}</p>}
          <Button type="submit" size="sm" className="bg-orange-500 hover:bg-orange-600" disabled={mutation.isPending}>
            {mutation.isPending ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
