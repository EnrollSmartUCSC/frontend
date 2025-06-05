import { HttpResponse, http } from 'msw';
import { mockData, courses } from './testData';
import { beforeEach } from 'vitest';
let trackingStatus = false;

let pinnedCourses: {
  subject: string;
  catalog_nbr: string;
  title: string;}[] = [];

let mockWatchlist: {
  subject: string;
  catalog_nbr: string;
  title: string;}[] = [];

let planner: {
  [key: string]: {
    subject: string;
    catalog_nbr: string;
    title: string;
  }[]} = {}

beforeEach(() => {
  // Reset the pinned courses and watchlist before each test
  pinnedCourses = [];
  mockWatchlist = [];
  planner = {}
});

export const handlers = [
  http.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/signup`,
    () => {
      // const { email, password } = req.body;
      return HttpResponse.json({
        success: true,
        message: "Successfully signed up"
      });
    }
  ),
  http.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/google-signin`,
    () => {
      // const { email, password } = req.body;
      return HttpResponse.json({
        success: true,
        message: "Successfully logged in"
      });
    }
  ),
  http.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/classData`, (req) => {
    const url = new URL(req.request.url);
    const catalog_nbr = url.searchParams.get('class');
    const subject = url.searchParams.get('subject');
    const res = mockData.filter(course => course.catalog_nbr === catalog_nbr && course.subject === subject);
    return HttpResponse.json(res, {
      status: 200
    });
  }),
  http.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/courseInfo`, (req) => {
    const url = new URL(req.request.url);
    const catalog_nbr = url.searchParams.get('course_code');
    const subject = catalog_nbr?.split('-')[0].toUpperCase();
    const code = catalog_nbr?.split('-')[1];
    const course = mockData.find(course => course.catalog_nbr === code && course.subject === subject);
    if (!course) {
      return HttpResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    return HttpResponse.json({
      course_code: `${course?.subject.toLowerCase()}-${course?.catalog_nbr}`,
      prerequisites: course?.prerequisites,
      description: course?.description,
      credits: course?.credits
    }, {
      status: 200
    });
  }),
  http.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/pin`, () => {
    return HttpResponse.json(pinnedCourses, {
      status: 200
    });
  }),
  http.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/pin`, async ({ request }) => {
    const body = await request.json();
    // Ensure body is an object before accessing properties
    const { subject, catalog_nbr, title } = typeof body === 'object' && body !== null
      ? body as { subject?: string; catalog_nbr?: string; title?: string }
      : {};
    const courseTitle = title || `${subject} ${catalog_nbr}`;
    console.log('Pinning course:', subject, catalog_nbr, courseTitle);
    if (!subject || !catalog_nbr) {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    pinnedCourses.push({ subject, catalog_nbr, title: title ?? `${subject} ${catalog_nbr}` });
    return HttpResponse.json({"message": "Course pinned successfully"}, { status: 200 });
  }),
  http.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/unpin`, async ({request}) => {
    const body = await request.json();
    const subject = typeof body === 'object' && body !== null ? body.subject : null;
    const catalog_nbr = typeof body === 'object' && body !== null ? body.catalog_nbr : null;
    if (!subject || !catalog_nbr) {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    
    const newList = pinnedCourses.filter(course => course.subject !== subject || course.catalog_nbr !== catalog_nbr);
    
    pinnedCourses = newList;
    
    return HttpResponse.json(pinnedCourses, { status: 200 });
  }),
  http.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/professor-rating`, () => {
    return HttpResponse.json({
      message: '4.3'
    });
  }),
  http.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/courses`, () => {
    return HttpResponse.json(courses, {
      status: 200
    });
  }),
  http.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/watchlist`, () => {
    return HttpResponse.json(mockWatchlist, {
      status: 200
    });
  }),
  http.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/watchlist`, async ({request}) => {
    const body = await request.json();
    const subject = typeof body === 'object' && body !== null ? body.subject : null;
    const catalog_nbr = typeof body === 'object' && body !== null ? body.catalog_nbr : null;

    if (!subject || !catalog_nbr) {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    mockWatchlist.push({ subject, catalog_nbr, title: `${subject} ${catalog_nbr}` });
    return HttpResponse.json(mockWatchlist, { status: 200  });
  }),
  http.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/watchlist`, async ({request}) => {
    const body = await request.json();
    const subject = typeof body === 'object' && body !== null ? body.subject : null;
    const catalog_nbr = typeof body === 'object' && body !== null ? body.catalog_nbr : null;
    if (!subject || !catalog_nbr) {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    mockWatchlist = mockWatchlist.filter(course => course.subject !== subject || course.catalog_nbr !== catalog_nbr);
    return HttpResponse.json(mockWatchlist, { status: 200  });
  }),
  http.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/trackingStatus`, () => {
    return HttpResponse.json({
      trackingEnabled: trackingStatus
    }, {
      status: 200
    });
  }),
  http.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/track`, () => {
    trackingStatus = true;
    return HttpResponse.json({ message: 'Tracking enabled' }, { status: 200 });
  }),
  http.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/track`, () => {
    trackingStatus = false;
    return HttpResponse.json({ message: 'Tracking disabled' }, { status: 200  });
  }),
  http.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/planner`, () => {
    return HttpResponse.json({
      "Fall 2023": [
        {
          "subject": "CS",
          "catalog_nbr": "101",
          "title": "Introduction to Computer Science"
        }
      ],
      "Spring 2024": []
    }, { status: 200 });
  }),
  http.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/planner`, async ({request}) => {
    console.log('Adding course to planner');
    const body = await request.json();
    const { quarter, subject, catalog_nbr, title } = typeof body === 'object' && body !== null
      ? body as { quarter?: string; subject?: string; catalog_nbr?: string; title?: string }
      : {};
    if (!quarter || !subject || !catalog_nbr || !title) {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    if (!planner[quarter]) {
      planner[quarter] = [];
    }
    planner[quarter].push({ subject, catalog_nbr, title });
    return HttpResponse.json({"message": "Course added to planner successfully"}, { status: 200  });
  }),
  http.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/planner`, async ({request}) => {
    const body = await request.json();
    const { quarter, subject, catalog_nbr } = typeof body === 'object' && body !== null
      ? body as { quarter?: string; subject?: string; catalog_nbr?: string }
      : {};
    if (!quarter || !subject || !catalog_nbr) {
      return HttpResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    if (planner[quarter]) {
      planner[quarter] = planner[quarter].filter(course => course.subject !== subject || course.catalog_nbr !== catalog_nbr);
    }
    return HttpResponse.json({"message": "Course removed from planner successfully"}, { status: 200  });
  }),
  http.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/v1/planner`, () => {
    console.log('Returning planner:', planner);
    return HttpResponse.json(planner, { status: 200 });
  })
];
