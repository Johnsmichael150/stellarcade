/**
 * @vitest-environment happy-dom
 */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { DetailFactsBlock } from "@/components/DetailFactsBlock";

describe("DetailFactsBlock", () => {
  it("renders each fact as a term/value pair", () => {
    render(
      <DetailFactsBlock
        facts={[
          { label: "Network", value: "Testnet" },
          { label: "Asset", value: "XLM" },
        ]}
      />,
    );

    expect(screen.getByText("Network")).toBeInTheDocument();
    expect(screen.getByText("Testnet")).toBeInTheDocument();
    expect(screen.getByText("Asset")).toBeInTheDocument();
    expect(screen.getByText("XLM")).toBeInTheDocument();
  });

  it("renders the empty state when there are no facts", () => {
    render(<DetailFactsBlock facts={[]} emptyLabel="Nothing to show" />);
    expect(screen.getByText("Nothing to show")).toBeInTheDocument();
    expect(screen.queryByRole("definition")).not.toBeInTheDocument();
  });
});
