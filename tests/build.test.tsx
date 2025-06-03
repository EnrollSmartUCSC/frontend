import {
  test,
  beforeEach,
  vi,
  expect
} from "vitest";
import {
  render,
  cleanup,
  screen
} from "@testing-library/react";
import { fireEvent, waitFor } from "@testing-library/react";
import Home from "../src/app/page";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

// Mock server setup for testing
const server = setupServer(
  http.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/signup`,
    () => {
      // const { email, password } = req.body;
      return HttpResponse.json({
        success: true,
        message: "Successfully signed up"
      });
    }
  )
);
// Start the server before all tests
server.listen()

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

const mockRouter = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouter,
  }),
}));

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn().mockResolvedValue({ user: { email: 'test@example.com' } }),
  getAuth: () => ({
    currentUser: { getIdToken: vi.fn().mockResolvedValue('mock-token') },
    onAuthStateChanged: vi.fn(),
    useDeviceLanguage: vi.fn(),
  }),
  GoogleAuthProvider: vi.fn().mockImplementation(() => ({
    addScope: vi.fn(),
  })),
  signInWithEmailAndPassword: vi.fn().mockResolvedValue,
  onAuthStateChanged: vi.fn().mockImplementation((authOrCallback, maybeCallback) => {
  // Check which arg is the callback:
  const callback = typeof authOrCallback === 'function' ? authOrCallback : maybeCallback;

  if (typeof callback === 'function') {
    callback({ email: 'test@example.com' });
  }

  // Return a dummy unsubscribe function:
  return () => {};
  }),
}));

test('sign up with Google', async () => {
  render(<Home />);
  await fireEvent.click(screen.getByText('Continue with Google'));

  expect(mockRouter).toHaveBeenCalledWith('/dashboard');
});

test('signin with google', async () => {
  render(<Home />);
  await fireEvent.click(screen.getByText('Log In Here'));
  await fireEvent.click(screen.getByText('Continue with Google'));

  expect(mockRouter).toHaveBeenCalledWith('/dashboard');
});

test('sign up with email and password', async () => {
  const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
  render(<Home />);
  await fireEvent.change(screen.getByPlaceholderText('Email'), 'helloswayamshah@gmail.com');
  await fireEvent.change(screen.getByPlaceholderText('Password'), 'password123');
  await fireEvent.click(screen.getByText('Continue'));

  await waitFor(() => {
    expect(alertMock).toHaveBeenCalledWith('Successfully signed up! Please log in.');
  });

  alertMock.mockRestore();
});
