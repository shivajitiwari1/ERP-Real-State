import { useEffect, useState } from 'react';

export default function MyIPPage() {
  const [ip, setIp] = useState('Detecting...');
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(d => setIp(d.ip))
      .catch(() => setIp('Could not detect IP'));
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-md text-center border-t-4 border-orange-500">
        <h2 className="text-lg font-bold text-slate-700 mb-6">Your IP Address</h2>
        <p className="text-3xl font-mono font-bold text-orange-600 bg-orange-50 px-8 py-4 rounded">{ip}</p>
        <p className="text-xs text-gray-400 mt-4">This is the IP address from which you are accessing this system.</p>
        <p className="text-center mt-6"><a href="/login" className="text-orange-500 hover:underline text-sm">← Back to Login</a></p>
      </div>
    </div>
  );
}
