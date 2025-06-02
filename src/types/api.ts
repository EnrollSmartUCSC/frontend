// ClassData schema returned by GET /classData

export interface className {
  subject: string;
  catalog_nbr: string;
  title: string;
}

export interface plan {
  [term: string]: className[];
}

export interface ClassData {
  catalog_nbr: string;
  class_nbr: string;
  class_section: string;
  class_status: string;
  component: string;
  end_time: string;
  enrl_capacity: string;
  enrl_status: string;
  enrl_total: string;
  instructors: Array<{
    cruzid: string;
    name: string;
  }>;
  location: string;
  meeting_days: string;
  session_code: string;
  start_time: string;
  strm: string;
  subject: string;
  title: string;
  title_lon: string;
  waitlist_total: string;

  /* SCRAPED */
  credits: string;
  description: string;
  prerequisites: string;
}

export interface ApiError {
  message: string;
}


export interface CourseDetailsProps {
  catalog_nbr: string;
  prerequisites: string;
  description: string;
  credits: string;
}

export interface watchlistClass {
  catalog_nbr: string;
  subject: string;
}

export interface WatchlistedClass {
  subject: string
  catalog_nbr: string
  title: string
  instructor: string
  enrolled: number[]
  capacity: number[]
  waitlist?: number[]
  credits: number
  status: 'Open' | 'Waitlist' | 'Closed' | 'Not offered'
  isTracking: boolean
}

