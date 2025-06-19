export interface Lesson {
  // Original API fields
  is_parent_scheduling_allowed: boolean;
  lesson_time: string; // Full ISO date string
  replaced_student_program_id: number | null;
  instructor_id: number;
  room_id: number;
  lesson_id: number;
  teacher_report_time: string | null;
  did_student_attend: boolean | null;
  is_payable_prep: boolean | null;
  student_program_id: number | null;
  studio_id: number;
  lesson_status: string | null;
  did_teacher_attend: boolean | null;

  // new api fields
  studentname: string;
  studentid: string;
  lesson_type: string | null;
  instructor_name: string | null;
  instrument: string | null;
  email: string | null;
  password: string | null;

}
