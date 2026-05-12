import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const schema = z.object({
  username: z.string().min(1, 'Username required'),
  password: z.string().min(1, 'Password required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setError('');
    const result = await signIn('credentials', {
      username: data.username, password: data.password, redirect: false,
    });
    if (result?.error) { setError('Invalid username or password'); return; }
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm border-2 border-teal-600">
        <div className="text-center mb-6">
          <div className="bg-orange-400 text-white text-center py-2 px-4 rounded-t font-semibold text-base -mx-8 -mt-8 mb-4 rounded-t-lg">
            Sign In
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold"><span className="text-teal-600">Real</span><span className="text-blue-800 font-extrabold">Boost</span></span>
              <p className="text-xs text-gray-500 text-left">YOUR BUSINESS AT YOUR FINGER TIPS!</p>
            </div>
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-5 h-5 bg-red-600"></div>
              <div className="w-5 h-5 bg-red-600"></div>
              <div className="w-5 h-2 bg-red-600"></div>
              <div className="w-5 h-2 bg-red-600"></div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username">User Name:</Label>
            <Input id="username" {...register('username')} autoFocus className="mt-1" />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password:</Label>
            <Input id="password" type="password" {...register('password')} className="mt-1" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold tracking-wider" disabled={isSubmitting}>
            {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
          </Button>
        </form>
      </div>
      <div className="mt-4 bg-white border rounded px-6 py-3 text-xs text-gray-600 flex gap-4">
        <span className="font-semibold">Tools:</span>
        <Link href="/tools/area-conversion" className="text-blue-600 hover:underline">Area Conversion</Link>
        <span>|</span>
        <Link href="/tools/emi-calculator" className="text-blue-600 hover:underline">E.M.I Calculator</Link>
        <span>|</span>
        <Link href="/tools/my-ip" className="text-blue-600 hover:underline">Check your IP Address</Link>
      </div>
      <p className="mt-4 text-xs text-gray-400">Copyright 2026 RealBoost ERP. All rights reserved</p>
    </div>
  );
}
