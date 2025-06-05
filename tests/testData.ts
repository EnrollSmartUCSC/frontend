export const courses: {
  subject: string;
  catalog_nbr: string;
  title: string;}[] = [
  {subject: "CS", catalog_nbr: "101", title: "Introduction to Computer Science"},
  {subject: "CS", catalog_nbr: "102", title: "Data Structures"},
  {subject: "MATH", catalog_nbr: "101", title: "Calculus I"}
]

export const mockData = [
  { subject: "CS", catalog_nbr: "101", title: "Introduction to Computer Science", class_nbr: "12345", class_section: "01", class_status: "Open", component: "Lecture", end_time: "14:20", enrl_capacity: "200", enrl_status: "Open", enrl_total: "150", instructors: [{ cruzid: "prof1", name: "Professor Smith" }], location: "Baskin Engineering 152", meeting_days: "MWF", session_code: "1", start_time: "13:20", strm: "2242", title_lon: "Introduction to Computer Science", waitlist_total: "10", credits: "5", description: "Fundamentals of computer science", prerequisites: "None" },
  { subject: "CS", catalog_nbr: "102", title: "Data Structures", class_nbr: "12346", class_section: "01", class_status: "Open", component: "Lecture", end_time: "15:20", enrl_capacity: "200", enrl_status: "Open", enrl_total: "150", instructors: [{ cruzid: "prof2", name: "Professor Johnson" }], location: "Baskin Engineering 153", meeting_days: "TTH", session_code: "1", start_time: "14:20", strm: "2242", title_lon: "Data Structures and Algorithms", waitlist_total: "5", credits: "4", description: "Advanced data structures", prerequisites: "CS 101" },
  { subject: "MATH", catalog_nbr: "101", title: "Calculus I", class_nbr: "12347", class_section: "01", class_status: "Open", component: "Lecture", end_time: "16:20", enrl_capacity: "200", enrl_status: "Open", enrl_total: "150", instructors: [{ cruzid: "prof3", name: "Professor Brown" }], location: "Baskin Engineering 154", meeting_days: "MWF", session_code: "1", start_time: "15:20", strm: "2242", title_lon: "Calculus I for Engineers", waitlist_total: "0", credits: "5", description: "Introduction to calculus", prerequisites: "None" }
]

