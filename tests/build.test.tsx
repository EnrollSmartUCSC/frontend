import {
  test,
  beforeEach,
  vi,
  // expect
} from "vitest";
import {
  render,
  cleanup,
  // screen,
  // getByText
} from "@testing-library/react";
// import { fireEvent } from "@testing-library/react";
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

// vi.mock('firebase/auth', () => ({
//   signInWithPopup: vi.fn().mockResolvedValue({ user: { email: 'test@example.com' } }),
// }));

// test('signs in with Google', async () => {
//   render(<Home />);
//   fireEvent.click(screen.getByText(/Sign in with Google/i));

//   expect(await screen.getByText(/Welcome, test@example.com/));
// });

