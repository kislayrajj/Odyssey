import { useState, useLayoutEffect } from 'react';
import { 
  useFloating, 
  useClick, 
  useDismiss, 
  useInteractions, 
  FloatingPortal, 
  FloatingFocusManager, 
  offset, 
  flip, 
  shift 
} from '@floating-ui/react';
import { clsx } from 'clsx';

interface Props {
  hiddenCount: number;
  companies: string[];
}

export function CompanyPopover({ hiddenCount, companies }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReadyToAnimate, setIsReadyToAnimate] = useState(false);

  const { refs, floatingStyles, context, isPositioned, placement } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [offset(6), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  // FIX: Two-Step Mount for the Company Popover
  useLayoutEffect(() => {
    if (isOpen && isPositioned) {
      requestAnimationFrame(() => {
        setIsReadyToAnimate(true);
      });
    } else if (!isOpen) {
      setIsReadyToAnimate(false);
    }
  }, [isOpen, isPositioned]);

  const originClass = placement.startsWith('top') ? 'origin-bottom' : 'origin-top';

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps({
          onClick: (e) => e.stopPropagation(),
        })}
        className="inline-flex items-center rounded-full border border-line bg-bg-inset px-1.5 py-0.5 text-[9px] font-semibold text-text-faint hover:text-text-main hover:bg-bg-raised transition-colors focus:outline-none"
      >
        +{hiddenCount}
      </button>

      <FloatingPortal>
        {isOpen && (
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={{
                ...floatingStyles,
                visibility: isReadyToAnimate ? 'visible' : 'hidden',
              }}
              {...getFloatingProps()}
              className={clsx(
                "z-[100] max-w-[250px] rounded-md border border-line bg-bg-raised p-2.5 shadow-xl outline-none",
                originClass,
                isReadyToAnimate && "animate-in fade-in zoom-in-95 duration-150"
              )}
            >
              <div className="flex flex-wrap gap-1.5">
                {companies.map((c) => (
                  <span key={c} className="rounded border border-line-soft bg-bg px-1.5 py-0.5 text-[10px] font-medium text-text-dim">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
}