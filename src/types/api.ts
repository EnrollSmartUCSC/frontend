// ClassData schema returned by GET /classData
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

// export interface TrackClassItem {
//   subject: string;
//   class_nbr: string;
// }

// export interface UserSignup {
//   email: string;
//   password: string;
//   phoneNo: string;
//   pingMedium: string;
// }

// export interface UserSignin {
//   email: string;
//   password: string;
// }
