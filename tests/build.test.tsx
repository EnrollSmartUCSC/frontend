import {
  test,
  beforeEach,
  vi,
  expect,
  beforeAll,
  afterEach,
  afterAll
} from "vitest";
import {
  render,
  cleanup,
  screen
} from "@testing-library/react";
import { 
  fireEvent,
  waitFor,
  // renderHook,
  act 
} from "@testing-library/react";
import { handlers } from "./mockApi";
import Home from "../src/app/page";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
// import userEvent from "@testing-library/user-event";
import Tab1 from "../src/app/dashboard/tab-1/page";
import Tab2 from "../src/app/dashboard/tab-2/page";
import Tab3 from "../src/app/dashboard/tab-3/page";
import Dashboard from "../src/app/dashboard/layout";

// Mock server setup for testing
const server = setupServer(...handlers);
// Start the server before all tests

beforeAll(() => {
  server.listen();
});

afterEach( async () => {
  // Reset any request handlers that are declared as a part of tests
  // so they don't affect other tests.
  await server.resetHandlers();
})

afterAll(() => {
  // Clean up after the tests are finished
  server.close();
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  })

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

test("render tab-1 component with initial state", async () => {
  await act(async () => {
    render(<Tab1 />);
  });
})

test("Tab1 component correctly fetches and displays courses", async () => {
  await act(async () => {
    render(<Tab1 />);
  });

  // Wait for courses to be fetched and displayed
  await waitFor(() => {
    screen.getByText(/Introduction to Computer Science/i)
    screen.getByText(/Data Structures/i)
    screen.getByText(/Calculus I/i)
  });
});

test("Tab1 component on selecting a course displays details", async () => {
  await act(async () => {
    render(<Tab1 />);
  });

  // Simulate selecting a course
  const courseItem = screen.getByText(/Introduction to Computer Science/i);
  fireEvent.click(courseItem);

  // Wait for course details to be displayed
  await waitFor(() => {
    expect(screen.queryByText(/Credits:/i)).not.toBeNull();
    expect(screen.queryByText("5")).not.toBeNull();
    expect(screen.queryByText(/None/)).not.toBeNull();
    expect(screen.queryByText(/Professor Smith/i)).not.toBeNull();
  });
})

test("Tab1 pinning a course updates pinned courses", async () => {
  await act(async () => {
    render(<Tab1 />);
  });

  // Simulate selecting a course
  const courseItem = screen.getByText(/Introduction to Computer Science/i);
  fireEvent.click(courseItem);

  // Simulate pinning the course
  const pinButton = screen.getByText(/Pin Course/i);
  fireEvent.click(pinButton);

  // Wait for pinned courses to be updated
  await waitFor(() => {
    expect(screen.queryAllByText(/Pinned Courses/i)).not.toBeNull();
    expect(screen.queryAllByText(/CS 101/i).length).toBe(3);
  });
})

test("Tab1 unpinning a course updates pinned courses", async () => {
  await act(async () => {
    render(<Tab1 />);
  });

  // Simulate selecting a course
  const courseItem = screen.getByText(/MATH 101/i);
  fireEvent.click(courseItem);

  // Simulate pinning the course
  const pinButton = screen.getByText(/Pin Course/i);
  fireEvent.click(pinButton);

  // Simulate unpinning the course
  await waitFor(() => {
  const unpinButton = screen.getByText(/Unpin Course/i);
  fireEvent.click(unpinButton);
  });

  // Wait for pinned courses to be updated
  await waitFor(() => {
    expect(screen.queryAllByText(/Pinned Courses/i)).not.toBeNull();
    expect(screen.queryAllByText(/MATH 101/i).length).toBe(2);
  });
});


test("Tab1 component handles empty course list", async () => {
  // Mock the fetchCourses API endpoint to return an empty array
  server.use(
    http.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/courses`, () => {
      return HttpResponse.json([], { status: 200 });
    })
  );

  await act(async () => {
    render(<Tab1 />);
  });

  // Wait for the component to update
  await waitFor(() => {
    expect(screen.queryByText(/No courses/i)).not.toBeNull();
  });
});

test("Tab1 add a course to watchlist", async () => {
  await act(async () => {
    render(<Tab1 />);
  });

  // Simulate selecting a course
  const courseItem = screen.getByText(/Introduction to Computer Science/i);
  fireEvent.click(courseItem);

  // Simulate adding the course to watchlist
  const addToWatchlistButton = screen.getByText(/Add to Watchlist/i);
  fireEvent.click(addToWatchlistButton);

  // Wait for watchlist to be updated
  await waitFor(() => {
    expect(screen.queryAllByText(/Remove from Watchlist/i)).not.toBeNull();
  });
})

test("Tab1 remove a course from watchlist", async () => {
  await act(async () => {
    render(<Tab1 />);
  });

  // Simulate selecting a course
  const courseItem = screen.getByText(/Introduction to Computer Science/i);
  fireEvent.click(courseItem);

  // Simulate adding the course to watchlist
  const addToWatchlistButton = screen.getByText(/Add to Watchlist/i);
  fireEvent.click(addToWatchlistButton);

  // Simulate removing the course from watchlist
  await waitFor(() => {
    const removeFromWatchlistButton = screen.getByText(/Remove from Watchlist/i);
    fireEvent.click(removeFromWatchlistButton);
  });

  // Wait for watchlist to be updated
  await waitFor(() => {
    expect(screen.queryAllByText(/Add to Watchlist/i)).not.toBeNull();
  });
});

test('Tab1 error handling for pinning a course', async () => {
  // Mock the pinCourse API endpoint to return an error
  server.use(
    http.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/pin`, () => {
      return HttpResponse.json({ error: 'Failed to pin course' }, { status: 500 });
    })
  );

  await act(async () => {
    render(<Tab1 />);
  });

  // Simulate selecting a course
  const courseItem = screen.getByText(/Introduction to Computer Science/i);
  fireEvent.click(courseItem);

  // Simulate pinning the course
  await waitFor(() => {
  const pinButton = screen.getByText(/Pin Course/i);
  fireEvent.click(pinButton);
  });

  // Wait for error message to be displayed
  await waitFor(() => {
    expect(screen.queryAllByText(/Introduction to Computer Science/i).length).toBe(2);
  });
});

test('Tab2 component renders correctly', async () => {
  await act(async () => {
    render(<Tab2 />);
  });
});

// test('Tab2 component has drag and drop', async () => {
//   await act(async () => {
//     render(<Tab2 />);
//   });
//   const dragElement = await screen.findByText(/CS 101/i);
//   const dropZone = screen.getByLabelText("Winter 2026");


//   const user = userEvent.setup();

//   // Simulate internal logic (or call the handler directly if exposed)
//   await user.pointer([
//   { keys: '[MouseLeft]', target: dragElement }, // press
//   { target: dropZone },                         // move
//   { keys: '[/MouseLeft]', target: dropZone },   // release
// ]);

//   await waitFor(() => {}, { timeout: 3000 });

//   await waitFor(() => {
//     expect(screen.queryAllByText(/CS 101/i).length).toBe(2);
//   });
// }, 10000);

test('Tab3 component renders correctly', async () => {
  await act(async () => {
    render(<Tab3 />);
  });
});


test('Rendering dashboard with all tabs', async () => {
  await act(async () => {
    render(
    <Dashboard>
      <Tab3 />
    </Dashboard>);
  });

  // Check if all tabs are rendered
  expect(screen.getAllByText(/Course Search/i).length).not.toBe(0);
  screen.getByText(/Planner/i);
  screen.getByText(/Watchlist and tracking/i);
});

