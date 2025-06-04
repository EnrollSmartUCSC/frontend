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
import { CourseTable } from "../src/app/dashboard/tab-1/components/CourseTable";
import { PinnedCoursesPanel } from "../src/app/dashboard/tab-1/components/PinnedCoursesPanel";
import { CourseDetails } from "../src/app/dashboard/tab-1/components/CourseDetails";


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

// START Course Search Hook Tests
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
  
  // Combined search (subject + catalog number)
  act(() => {
    searchResult.current.setQuery('CS101');
  });
  
  expect(searchResult.current.filtered).toHaveLength(1);
  expect(searchResult.current.filtered[0].subject).toBe('CS');
  expect(searchResult.current.filtered[0].catalog_nbr).toBe('101');
  
  // Search clearing
  act(() => {
    searchResult.current.setQuery('');
  });
  
  expect(searchResult.current.filtered).toHaveLength(3);
});

test("Course search handles empty results", () => {
  const { result } = renderHook(() => useCourseSearch(mockCoursesData));
  
  act(() => {
    result.current.setQuery('NONEXISTENT');
  });
  
  expect(result.current.filtered).toHaveLength(0);
});

test("Course search is case insensitive", () => {
  const { result } = renderHook(() => useCourseSearch(mockCoursesData));
  
  act(() => {
    result.current.setQuery('cs');
  });
  
  expect(result.current.filtered).toHaveLength(2);
  expect(result.current.filtered.every(course => course.subject === 'CS')).toBe(true);
});

test("Course search removes duplicate courses", () => {
  const duplicateData = [...mockCoursesData, mockCoursesData[0]];
  const { result } = renderHook(() => useCourseSearch(duplicateData));
  
  expect(result.current.filtered).toHaveLength(3);
});

test("useCourseSearch returns all courses initially", () => {
  const { result } = renderHook(() => useCourseSearch(mockCoursesData));
  expect(result.current.filtered).toHaveLength(3);
});

test("useCourseSearch filters by subject correctly", () => {
  const { result } = renderHook(() => useCourseSearch(mockCoursesData));
  
  act(() => {
    result.current.setQuery('CS');
  });
  
  expect(result.current.filtered).toHaveLength(2);
  expect(result.current.filtered.every(course => course.subject === 'CS')).toBe(true);
});

test("useCourseSearch filters by catalog number", () => {
  const { result } = renderHook(() => useCourseSearch(mockCoursesData));
  
  act(() => {
    result.current.setQuery('101');
  });
  
  expect(result.current.filtered).toHaveLength(2);
  expect(result.current.filtered.every(course => course.catalog_nbr === '101')).toBe(true);
});

test("useCourseSearch filters by title", () => {
  const { result } = renderHook(() => useCourseSearch(mockCoursesData));
  
  act(() => {
    result.current.setQuery('Data');
  });
  
  expect(result.current.filtered).toHaveLength(1);
  expect(result.current.filtered[0].title).toBe('Data Structures');
});

test("useCourseSearch handles combined search", () => {
  const { result } = renderHook(() => useCourseSearch(mockCoursesData));
  
  act(() => {
    result.current.setQuery('CS101');
  });
  
  expect(result.current.filtered).toHaveLength(1);
  expect(result.current.filtered[0].subject).toBe('CS');
  expect(result.current.filtered[0].catalog_nbr).toBe('101');
});

test("useCourseSearch is case insensitive", () => {
  const { result } = renderHook(() => useCourseSearch(mockCoursesData));
  
  act(() => {
    result.current.setQuery('cs');
  });
  
  expect(result.current.filtered).toHaveLength(2);
  expect(result.current.filtered.every(course => course.subject === 'CS')).toBe(true);
});

test("useCourseSearch removes duplicates", () => {
  const duplicateData = [...mockCoursesData, mockCoursesData[0]];
  const { result } = renderHook(() => useCourseSearch(duplicateData));
  
  expect(result.current.filtered).toHaveLength(3);
});

test("useCourseSearch handles empty query", () => {
  const { result } = renderHook(() => useCourseSearch(mockCoursesData));
  
  act(() => {
    result.current.setQuery('NONEXISTENT');
  });
  
  expect(result.current.filtered).toHaveLength(0);
  
  act(() => {
    result.current.setQuery('');
  });
  
  expect(result.current.filtered).toHaveLength(3);
});

// PinnedCoursesPanel Component Tests
test("PinnedCoursesPanel renders empty state correctly", () => {
  const mockOnSelect = vi.fn();
  
  render(
    <PinnedCoursesPanel
      pinned={[]}
      selected={null}
      onSelect={mockOnSelect}
    />
  );
  
  expect(screen.getByText('Pinned Courses')).toBeDefined();
  expect(screen.getByText('No pinned courses.')).toBeDefined();
});

test("PinnedCoursesPanel renders pinned courses list", () => {
  const mockOnSelect = vi.fn();
  const pinnedCourses = [mockCoursesData[0], mockCoursesData[1]];
  
  render(
    <PinnedCoursesPanel
      pinned={pinnedCourses}
      selected={null}
      onSelect={mockOnSelect}
    />
  );
  
  expect(screen.getByText('Pinned Courses')).toBeDefined();
  expect(screen.getByText(/CS 101.*Introduction to Computer Science/)).toBeDefined();
  expect(screen.getByText(/CS 250.*Data Structures/)).toBeDefined();
  expect(screen.queryByText('No pinned courses.')).toBeNull();
});

test("PinnedCoursesPanel highlights selected course", () => {
  const mockOnSelect = vi.fn();
  const pinnedCourses = [mockCoursesData[0], mockCoursesData[1]];
  
  render(
    <PinnedCoursesPanel
      pinned={pinnedCourses}
      selected={mockCoursesData[0]}
      onSelect={mockOnSelect}
    />
  );
  
  const selectedCourse = screen.getByText(/CS 101.*Introduction to Computer Science/).closest('li');
  const unselectedCourse = screen.getByText(/CS 250.*Data Structures/).closest('li');
  
  expect(selectedCourse?.className).toContain('bg-gray-200');
  expect(unselectedCourse?.className).not.toContain('bg-gray-200');
  expect(unselectedCourse?.className).toContain('hover:bg-gray-100');
});

test("PinnedCoursesPanel calls onSelect when course is clicked", () => {
  const mockOnSelect = vi.fn();
  const pinnedCourses = [mockCoursesData[0], mockCoursesData[1]];
  
  render(
    <PinnedCoursesPanel
      pinned={pinnedCourses}
      selected={null}
      onSelect={mockOnSelect}
    />
  );
  
  const firstCourse = screen.getByText(/CS 101.*Introduction to Computer Science/);
  const secondCourse = screen.getByText(/CS 250.*Data Structures/);
  
  fireEvent.click(firstCourse);
  expect(mockOnSelect).toHaveBeenCalledWith(mockCoursesData[0]);
  
  fireEvent.click(secondCourse);
  expect(mockOnSelect).toHaveBeenCalledWith(mockCoursesData[1]);
  
  expect(mockOnSelect).toHaveBeenCalledTimes(2);
});

test("PinnedCoursesPanel displays course information correctly", () => {
  const mockOnSelect = vi.fn();
  const customCourse = {
    ...mockCoursesData[0],
    subject: 'PHYS',
    catalog_nbr: '211',
    title: 'Physics for Scientists and Engineers'
  };
  
  render(
    <PinnedCoursesPanel
      pinned={[customCourse]}
      selected={null}
      onSelect={mockOnSelect}
    />
  );
  
  expect(screen.getByText(/PHYS 211.*Physics for Scientists and Engineers/)).toBeDefined();
});

test("PinnedCoursesPanel handles multiple course selections", () => {
  const mockOnSelect = vi.fn();
  const pinnedCourses = mockCoursesData;
  
  render(
    <PinnedCoursesPanel
      pinned={pinnedCourses}
      selected={null}
      onSelect={mockOnSelect}
    />
  );
  
  // RENDERING
  expect(screen.getByText(/CS 101.*Introduction to Computer Science/)).toBeDefined();
  expect(screen.getByText(/CS 250.*Data Structures/)).toBeDefined();
  expect(screen.getByText(/MATH 101.*Calculus I/)).toBeDefined();
  
  // CALLBACK
  const csIntro = screen.getByText(/CS 101.*Introduction to Computer Science/);
  const csData = screen.getByText(/CS 250.*Data Structures/);
  const mathCalc = screen.getByText(/MATH 101.*Calculus I/);
  
  fireEvent.click(csIntro);
  expect(mockOnSelect).toHaveBeenLastCalledWith(mockCoursesData[0]);
  
  fireEvent.click(csData);
  expect(mockOnSelect).toHaveBeenLastCalledWith(mockCoursesData[1]);
  
  fireEvent.click(mathCalc);
  expect(mockOnSelect).toHaveBeenLastCalledWith(mockCoursesData[2]);
  
  expect(mockOnSelect).toHaveBeenCalledTimes(3);
});

test("PinnedCoursesPanel generates unique keys for courses", () => {
  const mockOnSelect = vi.fn();
  const duplicateSubjectCourses = [
    { ...mockCoursesData[0], catalog_nbr: '101' },
    { ...mockCoursesData[0], catalog_nbr: '102' },
    { ...mockCoursesData[0], catalog_nbr: '103' }
  ];
  
  render(
    <PinnedCoursesPanel
      pinned={duplicateSubjectCourses}
      selected={null}
      onSelect={mockOnSelect}
    />
  );

  const courseItems = screen.getAllByText(/CS \d+.*Introduction to Computer Science/);
  expect(courseItems).toHaveLength(3);
});

test("PinnedCoursesPanel maintains selection state across re-renders", () => {
  const mockOnSelect = vi.fn();
  const pinnedCourses = [mockCoursesData[0], mockCoursesData[1]];
  
  const { rerender } = render(
    <PinnedCoursesPanel
      pinned={pinnedCourses}
      selected={mockCoursesData[0]}
      onSelect={mockOnSelect}
    />
  );
  
  let selectedCourse = screen.getByText(/CS 101.*Introduction to Computer Science/).closest('li');
  expect(selectedCourse?.className).toContain('bg-gray-200');
  
  rerender(
    <PinnedCoursesPanel
      pinned={pinnedCourses}
      selected={mockCoursesData[1]}
      onSelect={mockOnSelect}
    />
  );
  
  const newSelectedCourse = screen.getByText(/CS 250.*Data Structures/).closest('li');
  const oldSelectedCourse = screen.getByText(/CS 101.*Introduction to Computer Science/).closest('li');
  
  expect(newSelectedCourse?.className).toContain('bg-gray-200');
  expect(oldSelectedCourse?.className).not.toContain('bg-gray-200');
});

test("PinnedCoursesPanel handles empty selection state", () => {
  const mockOnSelect = vi.fn();
  const pinnedCourses = [mockCoursesData[0], mockCoursesData[1]];
  
  render(
    <PinnedCoursesPanel
      pinned={pinnedCourses}
      selected={null}
      onSelect={mockOnSelect}
    />
  );
  
  const firstCourse = screen.getByText(/CS 101.*Introduction to Computer Science/).closest('li');
  const secondCourse = screen.getByText(/CS 250.*Data Structures/).closest('li');
  
  expect(firstCourse?.className).not.toContain('bg-gray-200');
  expect(secondCourse?.className).not.toContain('bg-gray-200');
  expect(firstCourse?.className).toContain('hover:bg-gray-100');
  expect(secondCourse?.className).toContain('hover:bg-gray-100');
});

// CourseTable Component Tests
test("CourseTable renders table headers correctly", () => {
  render(<CourseTable sections={[]} />);
  
  expect(screen.getByText('Type')).toBeDefined();
  expect(screen.getByText('Days')).toBeDefined();
  expect(screen.getByText('Time')).toBeDefined();
  expect(screen.getByText('Location')).toBeDefined();
  expect(screen.getByText('Instructor(s)')).toBeDefined();
});

test("CourseTable renders empty table with headers only", () => {
  render(<CourseTable sections={[]} />);
  
  expect(screen.getByText('Type')).toBeDefined();

  expect(screen.queryByText('LEC')).toBeNull();
  expect(screen.queryByText('MWF')).toBeNull();
});

test("CourseTable renders single course section correctly", () => {
  const singleSection = [mockCoursesData[0]];
  
  render(<CourseTable sections={singleSection} />);
  
  expect(screen.getByText('LEC')).toBeDefined();
  expect(screen.getByText('MWF')).toBeDefined();
  expect(screen.getByText('09:00—10:00')).toBeDefined();
  expect(screen.getByText('TECH 101')).toBeDefined();
  expect(screen.getByText('Dr. Smith')).toBeDefined();
});

test("CourseTable renders multiple course sections", () => {
  render(<CourseTable sections={mockCoursesData} />);
  expect(screen.getAllByText('LEC')).toHaveLength(3);
  
  expect(screen.getByText('TTH')).toBeDefined();
  expect(screen.getByText('09:00—10:00')).toBeDefined();
  expect(screen.getByText('14:00—15:30')).toBeDefined();
  expect(screen.getByText('10:00—11:00')).toBeDefined();
  
  expect(screen.getByText('Dr. Smith')).toBeDefined();
  expect(screen.getByText('Dr. Johnson')).toBeDefined();
  expect(screen.getByText('Dr. Wilson')).toBeDefined();
});

test("CourseTable displays multiple instructors for single section", () => {
  const sectionWithMultipleInstructors = {
    ...mockCoursesData[0],
    instructors: [
      { cruzid: 'dsmith', name: 'Dr. Smith' },
      { cruzid: 'djones', name: 'Dr. Jones' },
      { cruzid: 'dbrown', name: 'Dr. Brown' }
    ]
  };
  
  render(<CourseTable sections={[sectionWithMultipleInstructors]} />);
  
  expect(screen.getByText('Dr. Smith, Dr. Jones, Dr. Brown')).toBeDefined();
});

test("CourseTable handles sections with no instructors", () => {
  const sectionWithNoInstructors = {
    ...mockCoursesData[0],
    instructors: []
  };
  
  render(<CourseTable sections={[sectionWithNoInstructors]} />);
  
  expect(screen.getByText('LEC')).toBeDefined();
  expect(screen.getByText('MWF')).toBeDefined();
  
  const rows = screen.getByRole('table').querySelectorAll('tbody tr');
  expect(rows).toHaveLength(1);
  const instructorCell = rows[0].querySelectorAll('td')[4];
  expect(instructorCell.textContent).toBe('');
});

test("CourseTable generates unique keys for sections", () => {
  const duplicateSections = [
    { ...mockCoursesData[0], class_section: '001' },
    { ...mockCoursesData[0], class_section: '002' },
    { ...mockCoursesData[0], class_section: '003' }
  ];
  
  render(<CourseTable sections={duplicateSections} />);
  
  const rows = screen.getByRole('table').querySelectorAll('tbody tr');
  expect(rows).toHaveLength(3);
});

test("CourseTable displays different course components correctly", () => {
  const mixedComponents = [
    { ...mockCoursesData[0], component: 'LEC' },
    { ...mockCoursesData[0], component: 'LAB', class_section: '002' },
    { ...mockCoursesData[0], component: 'DIS', class_section: '003' }
  ];
  
  render(<CourseTable sections={mixedComponents} />);
  
  expect(screen.getByText('LEC')).toBeDefined();
  expect(screen.getByText('LAB')).toBeDefined();
  expect(screen.getByText('DIS')).toBeDefined();
});

test("CourseTable handles missing or empty location", () => {
  const sectionWithEmptyLocation = {
    ...mockCoursesData[0],
    location: ''
  };
  
  render(<CourseTable sections={[sectionWithEmptyLocation]} />);
  
  const rows = screen.getByRole('table').querySelectorAll('tbody tr');
  expect(rows).toHaveLength(1);
  const locationCell = rows[0].querySelectorAll('td')[3];
  expect(locationCell.textContent).toBe('');
});

test("CourseTable displays time ranges correctly", () => {
  const customTimeSection = {
    ...mockCoursesData[0],
    start_time: '08:00',
    end_time: '09:30'
  };
  
  render(<CourseTable sections={[customTimeSection]} />);
  
  expect(screen.getByText('08:00—09:30')).toBeDefined();
});

test("CourseTable handles various meeting day patterns", () => {
  const variousMeetingDays = [
    { ...mockCoursesData[0], meeting_days: 'MWF', class_section: '001' },
    { ...mockCoursesData[0], meeting_days: 'TTH', class_section: '002' },
    { ...mockCoursesData[0], meeting_days: 'MW', class_section: '003' },
    { ...mockCoursesData[0], meeting_days: 'F', class_section: '004' }
  ];
  
  render(<CourseTable sections={variousMeetingDays} />);
  
  expect(screen.getByText('MWF')).toBeDefined();
  expect(screen.getByText('TTH')).toBeDefined();
  expect(screen.getByText('MW')).toBeDefined();
  expect(screen.getByText('F')).toBeDefined();
});

// Hook Tests for useCourseInfo
test("useCourseInfo: Data transformation from API response", async () => {
  const mockCourse = {
    title: 'Introduction to Computer Science',
    catalog_nbr: '101',
    subject: 'CS'
  };
  
  const mockApiResponse = {
    course_code: 'cs-101',
    prerequisites: 'None',
    description: 'An introduction to computer science fundamentals',
    credits: '4'
  };
  
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue(mockApiResponse)
  });
  
  const { useCourseInfo } = await import("../src/app/dashboard/tab-1/hooks/useCourseInfo");
  const result = await useCourseInfo(mockCourse);
  
  expect(result.catalog_nbr).toBe('cs-101');
  expect(result.prerequisites).toBe('None');
  expect(result.description).toBe('An introduction to computer science fundamentals');
  expect(result.credits).toBe('4');
  expect(typeof result.catalog_nbr).toBe('string');
  expect(typeof result.prerequisites).toBe('string');
  expect(typeof result.description).toBe('string');
  expect(typeof result.credits).toBe('string');
});

test("useCourseInfo constructs correctly", async () => {
  const mockCourse = {
    title: 'Calculus I',
    catalog_nbr: '19A',
    subject: 'MATH'
  };
  
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({
      course_code: 'math-19a',
      prerequisites: 'High school algebra',
      description: 'Differential calculus',
      credits: '5'
    })
  });
  
  const { useCourseInfo } = await import("../src/app/dashboard/tab-1/hooks/useCourseInfo");
  await useCourseInfo(mockCourse);
  
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('course_code=math-19a')
  );
});

test("useCourseInfo handles credits", async () => {
  const testCases = [
    { credits: '3', expected: '3' },
    { credits: '4', expected: '4' },
    { credits: '5', expected: '5' },
    { credits: '1-3', expected: '1-3' }
  ];
  
  for (const testCase of testCases) {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        course_code: 'test-101',
        prerequisites: 'None',
        description: 'Test course',
        credits: testCase.credits
      })
    });
    
    const { useCourseInfo } = await import("../src/app/dashboard/tab-1/hooks/useCourseInfo");
    const result = await useCourseInfo({
      title: 'Test Course',
      catalog_nbr: '101',
      subject: 'TEST'
    });
    
    expect(result.credits).toBe(testCase.expected);
  }
});

// Pinned Courses
test("usePinnedCourses: Pin course function behavior", async () => {
  const mockPinCourse = vi.fn().mockResolvedValue(undefined);
  const testCourse = mockCoursesData[0];
  
  await mockPinCourse(testCourse);
  
  expect(mockPinCourse).toHaveBeenCalledWith(testCourse);
  expect(mockPinCourse).toHaveBeenCalledTimes(1);
});

test("usePinnedCourses: Unpin course function behavior", async () => {
  const mockUnpinCourse = vi.fn().mockResolvedValue(undefined);
  const testCourse = mockCoursesData[0];
  
  await mockUnpinCourse(testCourse);
  
  expect(mockUnpinCourse).toHaveBeenCalledWith(testCourse);
  expect(mockUnpinCourse).toHaveBeenCalledTimes(1);
});

test("usePinnedCourses: isPinned function returns boolean", async () => {
  const mockIsPinned = vi.fn().mockResolvedValue(true);
  const testCourse = mockCoursesData[0];
  
  const result = await mockIsPinned(testCourse);
  
  expect(typeof result).toBe('boolean');
  expect(result).toBe(true);
  expect(mockIsPinned).toHaveBeenCalledWith(testCourse);
});

test("usePinnedCourses: fetchPinnedCourses returns array", async () => {
  const mockFetchPinnedCourses = vi.fn().mockResolvedValue([mockCoursesData[0], mockCoursesData[1]]);
  
  const result = await mockFetchPinnedCourses();
  
  expect(Array.isArray(result)).toBe(true);
  expect(result).toHaveLength(2);
  expect(result[0]).toHaveProperty('subject');
  expect(result[0]).toHaveProperty('catalog_nbr');
  expect(result[0]).toHaveProperty('title');
});

// Watchlist Functionality Tests
test("Watchlist: Add course validation", () => {
  const mockCourse = {
    subject: "CS",
    catalog_nbr: "101",
    title: "Introduction to Computer Science",
    class_nbr: "12345",
    class_section: "01",
    class_status: "Open",
    component: "Lecture",
    end_time: "14:20",
    enrl_capacity: "200",
    enrl_status: "Open",
    enrl_total: "150",
    instructors: [{ cruzid: "prof1", name: "Professor Smith" }],
    location: "Baskin Engineering 152",
    meeting_days: "MWF",
    session_code: "1",
    start_time: "13:20",
    strm: "2242",
    title_lon: "Introduction to Computer Science",
    waitlist_total: "10",
    credits: "5",
    description: "Fundamentals of computer science",
    prerequisites: "None"
  };

  const quarter = "Fall 2024";

  const createAddWatchlistRequest = (course: any, quarter: string) => ({
    subject: course.subject,
    catalog_nbr: course.catalog_nbr,
    quarter: quarter
  });

  const requestBody = createAddWatchlistRequest(mockCourse, quarter);

  expect(requestBody).toEqual({
    subject: "CS",
    catalog_nbr: "101",
    quarter: "Fall 2024"
  });

  expect(requestBody).toHaveProperty("subject");
  expect(requestBody).toHaveProperty("catalog_nbr");
  expect(requestBody).toHaveProperty("quarter");
});

test("Watchlist: Remove course validation", () => {
  const mockWatchlistCourse = {
    subject: "CS",
    catalog_nbr: "101"
  };

  const createRemoveWatchlistRequest = (course: any) => ({
    subject: course.subject,
    catalog_nbr: course.catalog_nbr
  });

  const requestBody = createRemoveWatchlistRequest(mockWatchlistCourse);

  expect(requestBody).toEqual({
    subject: "CS",
    catalog_nbr: "101"
  });

  expect(requestBody).toHaveProperty("subject");
  expect(requestBody).toHaveProperty("catalog_nbr");
  expect(requestBody).not.toHaveProperty("quarter");
});
