/**
 * @vitest-environment happy-dom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it, vi } from "vitest";
import { AbandonedFlowRecoveryBanner } from "@/components/AbandonedFlowRecoveryBanner";

describe("AbandonedFlowRecoveryBanner", () => {
  it("renders nothing when there is no staged submission", () => {
    const { container } = render(
      <AbandonedFlowRecoveryBanner staged={null} onResume={vi.fn()} onDismiss={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the staged flow and wires up resume/dismiss", () => {
    const onResume = vi.fn();
    const onDismiss = vi.fn();
    render(
      <AbandonedFlowRecoveryBanner
        staged={{ label: "deposit", savedAt: Date.now() }}
        onResume={onResume}
        onDismiss={onDismiss}
      />,
    );

    expect(screen.getByRole("region", { name: /recover unfinished submission/i })).toBeInTheDocument();
    expect(screen.getByText(/unfinished deposit/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Resume" }));
    expect(onResume).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
