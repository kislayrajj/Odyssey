import { CloudOff, RefreshCw, CheckCircle2, AlertCircle, type LucideIcon } from 'lucide-react';
import { useSyncStore } from '@/store/syncStore';
import { clsx } from 'clsx';

// 1. Explicitly define the shape of our configuration
interface IndicatorConfig {
  icon: LucideIcon;
  text: string;
  color: string;
  tooltip: string;
  spin?: boolean; // Optional property
}

export function SyncIndicator() {
  const status = useSyncStore((state) => state.status);

  if (status === 'online') return null;

  // 2. Apply the type to our config map
  const config: Record<string, IndicatorConfig> = {
    offline: {
      icon: CloudOff,
      text: 'Offline',
      color: 'text-text-faint',
      tooltip: 'Viewing cached data. Changes will sync when online.',
    },
    syncing: {
      icon: RefreshCw,
      text: 'Syncing...',
      color: 'text-theory',
      tooltip: 'Saving changes to cloud...',
      spin: true,
    },
    synced: {
      icon: CheckCircle2,
      text: 'Synced',
      color: 'text-easy',
      tooltip: 'All changes saved to cloud.',
    },
    error: {
      icon: AlertCircle,
      text: 'Sync Error',
      color: 'text-hard',
      tooltip: 'Failed to save changes. Will retry automatically.',
    },
  };

  const current = config[status];
  if (!current) return null;

  const Icon = current.icon;

  return (
    <div 
      className={clsx(
        'flex items-center gap-1.5 rounded-full border border-line bg-bg-inset px-2.5 py-1 text-[11px] font-medium transition-all',
        current.color
      )}
      title={current.tooltip}
    >
      <Icon size={12} className={clsx({ 'animate-spin': current.spin })} />
      <span className="hidden sm:inline-block">{current.text}</span>
    </div>
  );
}