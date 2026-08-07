import { Menu, LogOut } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useLocation } from 'react-router-dom';
import { SyncIndicator } from '@/components/ui/SyncIndicator';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useAuthModalStore } from '@/features/auth/store/authModalStore';

export function Header() {
  const toggleMobileSidebar = useUIStore((state) => state.toggleMobileSidebar);
  const { user, signOut } = useAuthStore();
  const openModal = useAuthModalStore((state) => state.openModal);
  const location = useLocation();

  const pathDisplay = location.pathname === '/' ? 'home' : location.pathname.slice(1);

  return (
    <header className="flex items-center justify-between border-b border-line bg-bg-raised px-6 py-3.5">
      <div className="flex items-center gap-4">
        <button onClick={toggleMobileSidebar} className="md:hidden text-text-faint hover:text-text-main transition-colors">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2 font-sans text-[17px] font-bold tracking-tight text-text-main">
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
          Odyssey
          <span className="font-mono text-[13px] font-normal text-text-faint ml-1">// {pathDisplay}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SyncIndicator />
        
        <div className="border-l border-line pl-4">
          {user ? (
            <div className="flex items-center gap-3">
              <img 
                src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=23272e&color=e6e8eb`} 
                alt="Profile" 
                className="h-6 w-6 rounded-full"
              />
              <button onClick={signOut} className="text-text-faint hover:text-hard transition-colors" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => openModal('general')}
              className="text-[12.5px] font-semibold text-text-dim hover:text-text-main transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}