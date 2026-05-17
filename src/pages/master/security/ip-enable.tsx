import { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Shield, ShieldOff } from 'lucide-react';

export default function IpEnablePage() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(localStorage.getItem('ip_security_enabled') === 'true');
  }, []);
  function toggle() {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem('ip_security_enabled', String(next));
  }
  return (
    <div>
      <PageHeader title="IP Enable/Disable Security" />
      <div className="max-w-lg">
        <div className="bg-white border rounded-lg shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${enabled ? 'bg-green-100' : 'bg-red-100'}`}>
              {enabled ? <Shield className="h-7 w-7 text-green-600" /> : <ShieldOff className="h-7 w-7 text-red-500" />}
            </div>
            <div>
              <div className="font-semibold text-sm">{enabled ? 'IP Security is ENABLED' : 'IP Security is DISABLED'}</div>
              <div className="text-xs text-gray-500 mt-0.5">{enabled ? 'Only whitelisted IP addresses can access the system.' : 'All IP addresses are allowed to access the system.'}</div>
            </div>
          </div>
          <div className={`rounded-lg p-3 text-xs border ${enabled ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
            {enabled ? '✓ Security is active. Configure allowed IPs under Add IP Address.' : '⚠ Security is disabled. Enable to restrict access by IP address.'}
          </div>
          <Button onClick={toggle} className={enabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}>
            {enabled ? 'Disable IP Security' : 'Enable IP Security'}
          </Button>
        </div>
      </div>
    </div>
  );
}
