import { test, beforeEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import Home from "../src/app/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

beforeEach(() => {
  cleanup();
});

test("Renders", async () => {
  render(<Home />);
});
