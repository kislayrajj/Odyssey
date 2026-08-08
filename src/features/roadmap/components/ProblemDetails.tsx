import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useAuthModalStore } from '@/features/auth/store/authModalStore';
import { useEditorStore } from '../store/editorStore';
import { Lock, Lightbulb, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DEFAULT_NOTE_TEMPLATE } from '../constants';

interface Props {
  itemId: string;
  initialContent?: string;
  onSave: (content: string) => Promise<void>;
}

export function ProblemDetails({ itemId, initialContent, onSave }: Props) {
  const user = useAuthStore((state) => state.user);
  const openModal = useAuthModalStore((state) => state.openModal);
  const setDirty = useEditorStore((state) => state.setDirty);
  
  const baseContent = initialContent ?? DEFAULT_NOTE_TEMPLATE;
  
  const [content, setContent] = useState(baseContent);
  const [isEditing, setIsEditing] = useState(!initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDirty = content !== baseContent;

  // ---> INSTRUMENTATION LOGS <---
  useEffect(() => {
    console.log(`[Auth Trace] ${itemId} - isDirty evaluated to:`, isDirty);
    console.log(`[Auth Trace] ${itemId} - content:`, content === '' ? 'EMPTY_STRING' : 'HAS_CONTENT');
    console.log(`[Auth Trace] ${itemId} - baseContent:`, baseContent === '' ? 'EMPTY_STRING' : 'HAS_CONTENT');
  }, [isDirty, content, baseContent, itemId]);

  const handleSave = async () => {
    console.log(`[Auth Trace] ${itemId} - handleSave EXECUTED. User is:`, user ? 'LOGGED_IN' : 'LOGGED_OUT');
    
    // Defensive Guard (We add this now to prevent the actual crash during testing)
    if (!user) {
      console.warn(`[Auth Trace] ${itemId} - handleSave aborted: No user.`);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(content);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setContent(baseContent);
    setIsEditing(false);
  };

  useEffect(() => {
    console.log(`[Auth Trace] ${itemId} - Registering with global store. isDirty:`, isDirty);
    setDirty(isDirty, handleSave, handleDiscard);
    return () => {
      console.log(`[Auth Trace] ${itemId} - Unmounting. Clearing global store.`);
      setDirty(false);
    };
  }, [isDirty, content, setDirty]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-line bg-bg-inset p-8 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-line-soft text-text-dim"><Lock size={18} /></div>
        <h3 className="mb-1 font-sans text-[14px] font-semibold text-text-main">Unlock Personal Notes</h3>
        <p className="mb-4 text-[12.5px] text-text-faint">Sign in to write Markdown notes, track complexities, and save solution links.</p>
        <button onClick={() => openModal('notes')} className="rounded-md bg-text-main px-4 py-2 font-sans text-[12.5px] font-semibold text-bg transition-transform hover:scale-[1.02] active:scale-[0.98]">
          Sign In to Unlock
        </button>
      </div>
    );
  }

  const isDefaultTemplate = content.trim() === DEFAULT_NOTE_TEMPLATE.trim();
  const typographyClasses = "font-mono text-[13px] leading-snug text-text-main w-full min-h-[160px] p-4 bg-bg-inset rounded-md border border-line-soft";

  return (
    <div className="flex flex-col gap-3 p-4 bg-bg-raised border-b border-line-soft shadow-inner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-sans text-[12.5px] font-semibold text-text-dim uppercase tracking-wider">Workspace</span>
          {isDefaultTemplate && isEditing && (
            <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-theory-bg px-2.5 py-0.5 text-[11px] font-medium text-theory animate-in fade-in">
              <Lightbulb size={12} /> Use this template as a guide.
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {isEditing && isDirty && (
            <button onClick={handleDiscard} className="text-[12px] font-medium text-text-faint hover:text-text-main transition-colors">
              Cancel
            </button>
          )}
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={isSaving || (isEditing && !isDirty)}
            className="flex items-center gap-1.5 text-[12px] font-medium text-accent hover:text-accent-dim disabled:opacity-50 transition-colors"
          >
            {isSaving && <Loader2 size={12} className="animate-spin" />}
            {isEditing ? 'Save Notes' : 'Edit Notes'}
          </button>
        </div>
      </div>
      
      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`${typographyClasses} resize-y focus:border-accent-dim focus:outline-none`}
          spellCheck={false}
        />
      ) : (
        <div 
          className={`${typographyClasses} prose prose-invert prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0 prose-headings:mb-2 prose-headings:mt-4 prose-headings:font-sans prose-headings:text-text-main prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-pre:bg-bg prose-pre:border prose-pre:border-line prose-pre:p-3 cursor-text`}
          onDoubleClick={() => setIsEditing(true)}
        >
          {content ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown> : <span className="italic text-text-faint">No notes added yet. Double-click to edit.</span>}
        </div>
      )}
    </div>
  );
}