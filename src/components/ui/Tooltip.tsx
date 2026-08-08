import { useState, useEffect, useLayoutEffect } from 'react';
import { useFloating, useHover, useFocus, useDismiss, useInteractions, FloatingPortal, offset, flip, shift } from '@floating-ui/react';
import { clsx } from 'clsx';

interface Props {
    children: React.ReactNode;
    content: React.ReactNode;
    forceOpen?: boolean;
}

export function Tooltip({ children, content, forceOpen = false }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isReadyToAnimate, setIsReadyToAnimate] = useState(false);

    useEffect(() => {
        if (forceOpen) setIsOpen(true);
    }, [forceOpen]);

    const { refs, floatingStyles, context, placement, isPositioned } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: 'bottom',
        middleware: [offset(8), flip(), shift({ padding: 8 })],
    });

    const hover = useHover(context, { move: false });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);

    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss]);

    // FIX: Two-Step Mount. Wait for Floating UI to calculate coordinates before allowing animation.
    useLayoutEffect(() => {
        if (isOpen && isPositioned) {
            // Use requestAnimationFrame to ensure the browser has painted the initial coordinates
            // before we apply the CSS animation classes.
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
            <div ref={refs.setReference} {...getReferenceProps()} className="flex items-center">
                {children}
            </div>

            <FloatingPortal>
                {isOpen && (
                    <div
                        ref={refs.setFloating}
                        style={{
                            ...floatingStyles,
                            // Keep it invisible until we are ready to animate from the correct origin
                            visibility: isReadyToAnimate ? 'visible' : 'hidden',
                        }}
                        {...getFloatingProps()}
                        className={clsx(
                            "z-[100] max-w-[280px] rounded-md border border-line bg-bg-raised p-3 shadow-xl outline-none",
                            originClass,
                            // Only apply animation classes AFTER the element is positioned and painted
                            isReadyToAnimate && "animate-in fade-in zoom-in-95 duration-150"
                        )}
                    >
                        <div className="text-[12px] leading-relaxed text-text-dim">
                            {content}
                        </div>
                    </div>
                )}
            </FloatingPortal>
        </>
    );
}