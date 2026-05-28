import { useEffect, useRef, type RefObject } from "react";

export interface UseFocusReturnOptions {
  /** Focused when the original trigger is no longer in the document on close. */
  fallbackRef?: RefObject<HTMLElement | null>;
}

/**
 * Deterministically returns focus when a transient surface (e.g. a warning
 * drawer) closes. On open it records the element that had focus; on close it
 * restores focus to that element, or to `fallbackRef` if the original trigger
 * has since been removed from the DOM. This keeps keyboard users anchored
 * instead of dropping focus back to <body>.
 */
export function useFocusReturn(
  isOpen: boolean,
  options: UseFocusReturnOptions = {},
): void {
  const { fallbackRef } = options;
  const triggerRef = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isOpen && !wasOpen.current) {
      // Rising edge: capture whatever had focus before the drawer opened.
      triggerRef.current = (document.activeElement as HTMLElement | null) ?? null;
    } else if (!isOpen && wasOpen.current) {
      // Falling edge: restore focus deterministically.
      const trigger = triggerRef.current;
      const target =
        trigger && document.contains(trigger)
          ? trigger
          : fallbackRef?.current ?? null;
      target?.focus();
      triggerRef.current = null;
    }

    wasOpen.current = isOpen;
  }, [isOpen, fallbackRef]);
}
