import { ReactNode } from 'react';
import TopBar from './TopBar';
import NavMenu from './NavMenu';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      <NavMenu />
      <main className="flex-1 p-4 max-w-screen-2xl mx-auto w-full">{children}</main>
      <footer className="bg-slate-800 text-white text-xs text-center py-2">
        <span className="text-orange-400">RealBoost ERP</span> · Copyright © 2026 · Powered by 4QT Technologies
      </footer>
    </div>
  );
}
