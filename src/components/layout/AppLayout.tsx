import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useNetworkMonitor } from '@/hooks/useNetworkMonitor';

export function AppLayout() {
  // Mount global network listener
  useNetworkMonitor();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg text-text-main">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}