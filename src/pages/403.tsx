import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-10 rounded border shadow">
        <h1 className="text-5xl font-bold text-gray-300 mb-2">403</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-6">You do not have permission to access this page.</p>
        <Button onClick={() => router.push('/')} className="bg-orange-500 hover:bg-orange-600">Go to Dashboard</Button>
      </div>
    </div>
  );
}
