import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

export function UnsavedChangesModal() {
  const { pendingAction, routerProceed, resolveSave, resolveDiscard, resolveCancel } = useEditorStore();
  const [isSaving, setIsSaving] = useState(false);

  // Modal is open if there is a pending state action OR a blocked route transition
  const isOpen = pendingAction !== null || routerProceed !== null;

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await resolveSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl border border-line bg-bg-raised p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hard-bg text-hard">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 className="font-sans text-lg font-bold text-text-main">Unsaved Changes</h2>
            <p className="mt-1 text-[13px] text-text-dim leading-relaxed">
              You have unsaved notes in your workspace. Do you want to save them before leaving?
            </p>
          </div>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
          <button
            onClick={resolveCancel}
            disabled={isSaving}
            className="rounded-md px-4 py-2 font-sans text-[13px] font-semibold text-text-dim hover:bg-bg-inset hover:text-text-main transition-colors disabled:opacity-50"
          >
            Continue Editing
          </button>
          <button
            onClick={resolveDiscard}
            disabled={isSaving}
            className="rounded-md bg-bg-inset border border-line px-4 py-2 font-sans text-[13px] font-semibold text-hard hover:bg-hard-bg transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 font-sans text-[13px] font-semibold text-[#04140a] hover:bg-accent-dim transition-colors disabled:opacity-70"
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            Save & Leave
          </button>
        </div>
      </div>
    </div>
  );
}