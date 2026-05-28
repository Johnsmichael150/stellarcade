/**
 * @vitest-environment happy-dom
 */

import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRef, useState } from "react";
import { describe, expect, it } from "vitest";
import { useFocusReturn } from "@/hooks/useFocusReturn";

function Harness({ removeTriggerOnClose = false }: { removeTriggerOnClose?: boolean }) {
  const [open, setOpen] = useState(false);
  const [triggerGone, setTriggerGone] = useState(false);
  const fallbackRef = useRef<HTMLButtonElement>(null);
  useFocusReturn(open, { fallbackRef });

  return (
    <div>
      <button ref={fallbackRef} type="button" data-testid="fallback">
        Fallback
      </button>
      {!triggerGone && (
        <button type="button" data-testid="trigger" onClick={() => setOpen(true)}>
          Open drawer
        </button>
      )}
      {open && (
        <div role="dialog">
          <button
            type="button"
            data-testid="close"
            onClick={() => {
              if (removeTriggerOnClose) setTriggerGone(true);
              setOpen(false);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

describe("useFocusReturn", () => {
  it("returns focus to the trigger when the drawer closes", () => {
    render(<Harness />);
    const trigger = screen.getByTestId("trigger");
    act(() => trigger.focus());
    expect(trigger).toHaveFocus();

    fireEvent.click(trigger);
    fireEvent.click(screen.getByTestId("close"));

    expect(trigger).toHaveFocus();
  });

  it("falls back to fallbackRef when the trigger was removed", () => {
    render(<Harness removeTriggerOnClose />);
    const trigger = screen.getByTestId("trigger");
    act(() => trigger.focus());

    fireEvent.click(trigger);
    fireEvent.click(screen.getByTestId("close"));

    expect(screen.getByTestId("fallback")).toHaveFocus();
  });
});
