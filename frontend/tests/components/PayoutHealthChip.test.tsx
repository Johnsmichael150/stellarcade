/**
 * @vitest-environment happy-dom
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { PayoutHealthChip } from "@/components/PayoutHealthChip";

describe("PayoutHealthChip", () => {
  it("renders the humanised label and exposes the status", () => {
    render(<PayoutHealthChip status="healthy" />);
    const chip = screen.getByRole("status");
    expect(chip).toHaveTextContent("Healthy");
    expect(chip).toHaveAttribute("data-status", "healthy");
    expect(chip).toHaveAttribute("aria-label", "Payout health: Healthy");
  });

  it("supports a label override and the md size", () => {
    render(<PayoutHealthChip status="delayed" label="Pending review" size="md" />);
    expect(screen.getByRole("status")).toHaveTextContent("Pending review");
  });

  it("falls back to Unknown for a missing or unrecognised status", () => {
    const { rerender } = render(<PayoutHealthChip status={null} />);
    expect(screen.getByRole("status")).toHaveAttribute("data-status", "unknown");

    // @ts-expect-error — exercising the runtime guard against bad input.
    rerender(<PayoutHealthChip status="not-a-real-status" />);
    expect(screen.getByRole("status")).toHaveTextContent("Unknown");
  });
});
