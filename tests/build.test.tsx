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
import { fireEvent, waitFor, renderHook, act } from "@testing-library/react";
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


import React from "react";
import { useCourseSearch } from "../src/app/dashboard/tab-1/hooks/useCourseSearch";
import { useCourses } from "../src/app/dashboard/tab-1/hooks/useCourses";

// Currently here because of issues with fetching actual data
const mockCoursesData = [
  {
    catalog_nbr: '101',
    class_nbr: '20001',
    class_section: '001',
    class_status: 'Open',
    component: 'LEC',
    end_time: '10:00',
    enrl_capacity: '25',
    enrl_status: 'Open',
    enrl_total: '18',
    instructors: [
      {
        cruzid: 'dsmith',
        name: 'Dr. Smith'
      }
    ],
    location: 'TECH 101',
    meeting_days: 'MWF',
    session_code: '01',
    start_time: '09:00',
    strm: '2248',
    subject: 'CS',
    title: 'Introduction to Computer Science',
    title_lon: 'Introduction to Computer Science',
    waitlist_total: '2',
    // Scraped fields
    credits: '4',
    description: 'An introduction to the intellectual enterprises of computer science and the art of programming.',
    prerequisites: 'None'
  },
  {
    catalog_nbr: '250',
    class_nbr: '20002',
    class_section: '001',
    class_status: 'Open',
    component: 'LEC',
    end_time: '15:30',
    enrl_capacity: '30',
    enrl_status: 'Open',
    enrl_total: '25',
    instructors: [
      {
        cruzid: 'djohnson',
        name: 'Dr. Johnson'
      }
    ],
    location: 'TECH 102',
    meeting_days: 'TTH',
    session_code: '01',
    start_time: '14:00',
    strm: '2248',
    subject: 'CS',
    title: 'Data Structures',
    title_lon: 'Data Structures and Algorithms',
    waitlist_total: '0',
    // Scraped fields
    credits: '4',
    description: 'Focuses on data structures and the algorithms that use them. Topics include stacks, queues, lists, trees, and graphs.',
    prerequisites: 'CS 101'
  },
  {
    catalog_nbr: '101',
    class_nbr: '30001',
    class_section: '001',
    class_status: 'Open',
    component: 'LEC',
    end_time: '11:00',
    enrl_capacity: '40',
    enrl_status: 'Open',
    enrl_total: '35',
    instructors: [
      {
        cruzid: 'dwilson',
        name: 'Dr. Wilson'
      }
    ],
    location: 'MATH 201',
    meeting_days: 'MWF',
    session_code: '01',
    start_time: '10:00',
    strm: '2248',
    subject: 'MATH',
    title: 'Calculus I',
    title_lon: 'Calculus I: Differential Calculus',
    waitlist_total: '1',
    // Scraped fields
    credits: '5',
    description: 'Limits, derivatives, applications of derivatives, and an introduction to integration.',
    prerequisites: 'MATH 19A or equivalent'
  }
];

test("Course search filtering functionality", () => {
  const { result: searchResult } = renderHook(() => useCourseSearch(mockCoursesData));
  expect(searchResult.current.filtered).toHaveLength(3);
  
  // By subject
  act(() => {
    searchResult.current.setQuery('CS');
  });
  
  expect(searchResult.current.filtered).toHaveLength(2);
  expect(searchResult.current.filtered.every(course => course.subject === 'CS')).toBe(true);
  
  // By catalog number
  act(() => {
    searchResult.current.setQuery('101');
  });
  
  expect(searchResult.current.filtered).toHaveLength(2);
  expect(searchResult.current.filtered.every(course => course.catalog_nbr === '101')).toBe(true);
  
  // By title
  act(() => {
    searchResult.current.setQuery('Data');
  });
  
  expect(searchResult.current.filtered).toHaveLength(1);
  expect(searchResult.current.filtered[0].title).toBe('Data Structures');
  
  // Test combined search
  act(() => {
    searchResult.current.setQuery('CS101');
  });
  
  expect(searchResult.current.filtered).toHaveLength(1);
  expect(searchResult.current.filtered[0].subject).toBe('CS');
  expect(searchResult.current.filtered[0].catalog_nbr).toBe('101');
  
  // Test clearing search
  act(() => {
    searchResult.current.setQuery('');
  });
  
  expect(searchResult.current.filtered).toHaveLength(3);
});

// API Ping Tests for all endpoints
test("ping /hello endpoint", async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/hello`);
    console.log(`/hello - Status: ${response.status}, OK: ${response.ok}`);
    expect(response).toBeDefined();
    expect(typeof response.status).toBe('number');
  } catch (error) {
    console.error('/hello endpoint error:', error);
    throw error;
  }
});

test("ping /api/v1/courses endpoint", async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/courses`);
    console.log(`/api/v1/courses - Status: ${response.status}, OK: ${response.ok}`);
    expect(response).toBeDefined();
    expect(typeof response.status).toBe('number');
  } catch (error) {
    console.error('/api/v1/courses endpoint error:', error);
    throw error;
  }
});

test("ping /api/v1/classData endpoint", async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/classData`);
    console.log(`/api/v1/classData - Status: ${response.status}, OK: ${response.ok}`);
    expect(response).toBeDefined();
    expect(typeof response.status).toBe('number');
  } catch (error) {
    console.error('/api/v1/classData endpoint error:', error);
    throw error;
  }
});

test("ping /api/v1/quarterCode endpoint", async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/quarterCode`);
    console.log(`/api/v1/quarterCode - Status: ${response.status}, OK: ${response.ok}`);
    expect(response).toBeDefined();
    expect(typeof response.status).toBe('number');
  } catch (error) {
    console.error('/api/v1/quarterCode endpoint error:', error);
    throw error;
  }
});

test("ping /api/v1/courseInfo endpoint", async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/courseInfo`);
    console.log(`/api/v1/courseInfo - Status: ${response.status}, OK: ${response.ok}`);
    expect(response).toBeDefined();
    expect(typeof response.status).toBe('number');
  } catch (error) {
    console.error('/api/v1/courseInfo endpoint error:', error);
    throw error;
  }
});

test("ping /api/v1/professor-rating endpoint", async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/professor-rating`);
    console.log(`/api/v1/professor-rating - Status: ${response.status}, OK: ${response.ok}`);
    expect(response).toBeDefined();
    expect(typeof response.status).toBe('number');
  } catch (error) {
    console.error('/api/v1/professor-rating endpoint error:', error);
    throw error;
  }
});

test("ping /api/v1/pin endpoint", async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/pin`);
    console.log(`/api/v1/pin - Status: ${response.status}, OK: ${response.ok}`);
    expect(response).toBeDefined();
    expect(typeof response.status).toBe('number');
  } catch (error) {
    console.error('/api/v1/pin endpoint error:', error);
    throw error;
  }
});

test("ping /api/v1/planner endpoint", async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/planner`);
    console.log(`/api/v1/planner - Status: ${response.status}, OK: ${response.ok}`);
    expect(response).toBeDefined();
    expect(typeof response.status).toBe('number');
  } catch (error) {
    console.error('/api/v1/planner endpoint error:', error);
    throw error;
  }
});

test("ping /api/v1/watchlist endpoint", async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/watchlist`);
    console.log(`/api/v1/watchlist - Status: ${response.status}, OK: ${response.ok}`);
    expect(response).toBeDefined();
    expect(typeof response.status).toBe('number');
  } catch (error) {
    console.error('/api/v1/watchlist endpoint error:', error);
    throw error;
  }
});

test("ping /api/v1/track endpoint", async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/track`);
    console.log(`/api/v1/track - Status: ${response.status}, OK: ${response.ok}`);
    expect(response).toBeDefined();
    expect(typeof response.status).toBe('number');
  } catch (error) {
    console.error('/api/v1/track endpoint error:', error);
    throw error;
  }
});

test("ping /api/v1/tracking/quarter endpoint", async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/tracking/quarter`);
    console.log(`/api/v1/tracking/quarter - Status: ${response.status}, OK: ${response.ok}`);
    expect(response).toBeDefined();
    expect(typeof response.status).toBe('number');
  } catch (error) {
    console.error('/api/v1/tracking/quarter endpoint error:', error);
    throw error;
  }
});

test("ping /api/v1/get-carriers endpoint", async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/get-carriers`);
    console.log(`/api/v1/get-carriers - Status: ${response.status}, OK: ${response.ok}`);
    expect(response).toBeDefined();
    expect(typeof response.status).toBe('number');
  } catch (error) {
    console.error('/api/v1/get-carriers endpoint error:', error);
    throw error;
  }
});

test("ping /api/v1/trackingStatus endpoint", async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/trackingStatus`);
    console.log(`/api/v1/trackingStatus - Status: ${response.status}, OK: ${response.ok}`);
    expect(response).toBeDefined();
    expect(typeof response.status).toBe('number');
  } catch (error) {
    console.error('/api/v1/trackingStatus endpoint error:', error);
    throw error;
  }
});

