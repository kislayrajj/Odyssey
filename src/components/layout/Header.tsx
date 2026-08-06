import { Menu } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useLocation } from 'react-router-dom';
import { SyncIndicator } from '@/components/ui/SyncIndicator';

export function Header() {
  const toggleMobileSidebar = useUIStore((state) => state.toggleMobileSidebar);
  const location = useLocation();

  const pathDisplay = location.pathname === '/' ? 'home' : location.pathname.slice(1);

  return (
    <header className="flex items-center justify-between border-b border-line bg-bg-raised px-6 py-3.5">
      
      {/* Left Side: Mobile Toggle & Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden text-text-faint hover:text-text-main transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 font-sans text-[17px] font-bold tracking-tight text-text-main">
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
          Odyssey
          <span className="font-mono text-[13px] font-normal text-text-faint ml-1">
            // {pathDisplay}
          </span>
        </div>
      </div>

      {/* Right Side: System Status & Future Profile */}
      <div className="flex items-center gap-3">
        <SyncIndicator />
      </div>

    </header>
  );
}