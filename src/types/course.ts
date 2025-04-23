// Lab sections: attached to a lecture timeslot
// Alternatively, may not exist at all
export interface LabInfo {
  meeting_days: string;
  start_time: string;
  end_time: string;
  location: string;
  instructor: string;
}

export interface LectureInfo {
  meeting_days: string;
  start_time: string;
  end_time: string;
  location: string;
  instructor: string;
  lab_sections: LabInfo[];
}

// Course summary:
//  ~ What is prefetched and displayed in the search results component
//  ~ Every field that's NOT included here will be fetched on demand
export interface CourseSummary {
  code: string;
  name: string;
  quarter: string;
}

// Full course details:
//  ~ What is displayed in the course details component
//  ~ Displayed after clicking on an individual course in search results
//  ~ These fields are what will be fetched on demand
export interface CourseInfo extends CourseSummary {
  description: string;
  prerequisites: string;
  credits: number;
  lectures: LectureInfo[];
}
