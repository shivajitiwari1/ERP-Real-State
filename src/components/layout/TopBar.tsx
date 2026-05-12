import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import dayjs from 'dayjs';

export default function TopBar() {
  const { data: session } = useSession();
  return (
    <div className="bg-white border-b flex items-center justify-between px-4 py-2 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-800 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs">RE</span>
        </div>
        <div>
          <div className="font-bold text-teal-700 text-sm leading-tight">Real Estate Manager</div>
          <div className="text-xs text-red-500">You are logged in as <strong>{session?.user?.name}</strong></div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="grid grid-cols-2 gap-0.5 opacity-70">
          <div className="w-4 h-4 bg-red-600"></div>
          <div className="w-4 h-4 bg-red-600"></div>
          <div className="w-4 h-2 bg-red-600"></div>
          <div className="w-4 h-2 bg-red-600"></div>
        </div>
        <span className="text-gray-400">|</span>
        <Link href="/" className="hover:text-teal-700 font-medium">Home</Link>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="hover:text-red-600 font-medium">
          Logout
        </button>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
          {dayjs().format('DD MMM YYYY')}
        </span>
      </div>
    </div>
  );
}
