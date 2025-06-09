//IUserData and IUserrDataAccess is ginagamit para ifilter yung routes.
//ginagamit din ito para sa middleware para hindi maaccess yung mga protected routes.
export interface IUserData {
  token?: string,
  name?: string,
  email?: string,
  photo?: string,
  role?: string,
  level?: string,
  userAccess?: IUserDataAccess[]
}

export interface IUserDataAccess {
  role?: string,
  module?: string,
  module_path?: string,
  permission?: string
}

export interface IUserAccess {
  id: string,
  user_id: string,
  module_id: string,
  permission_id: string,
  created_date: string;
  created_by: string;
  last_modified_date: string | null;
  last_modified_by: string | null;
  push_status_id: number;
  push_date: string | null;
  deleted_date: string | null;
  deleted_by: string | null;
  is_deleted: boolean;
  remarks: string | null;
}


export interface IUser {
  id: string;
  username: string;
  email: string;
  password: any;
  salt: any;
  role_id: string;
  level_id: number | null;
  created_date: string;
  created_by: string;
  last_modified_date: string | null;
  last_modified_by: string | null;
  push_status_id: number;
  push_date: string | null;
  deleted_date: string | null;
  deleted_by: string | null;
  is_deleted: boolean;
  remarks: string | null;
}

export interface ICFWSchedules {
  id: string;                // Unique schedule ID
  record_id: string;         // Links to employee record
  cfw_type_id: string;      // "Student" or "Graduate"
  shift_type: string;        // "Fixed", "Flexi", "Rotational"
  date_start: Date;        // Schedule start date (YYYY-MM-DD)
  date_end: Date | null;   // Schedule end date (nullable for ongoing schedules)
  time_in_1: string;         // First morning IN time (HH:MM:SS)
  time_out_1: string;        // First morning OUT time (HH:MM:SS)
  time_in_2: string;         // Second morning IN time (HH:MM:SS)
  time_out_2: string;        // Second morning OUT time (HH:MM:SS)
  time_in_3: string;         // First afternoon IN time (HH:MM:SS)
  time_out_3: string;        // First afternoon OUT time (HH:MM:SS)
  time_in_4: string;         // Second afternoon IN time (HH:MM:SS)
  time_out_4: string;        // Second afternoon OUT time (HH:MM:SS)
  total_hours_required: number; // Required working hours per day or the max hours (4 hours in Flexi-students and 8 hours for Fixed-graduates)
  status_id: number; // "Active" | "Expired"; // Defines if schedule is in use                 
  created_date: string;
  created_by: string;
  last_modified_date: string | null;
  last_modified_by: string | null;
  push_status_id: number;
  push_date: string | null;
  deleted_date: string | null;
  deleted_by: string | null;
  is_deleted: boolean;
  remarks: string | null;
}

export interface ICFWTimeLogs {
  id: string;                // Unique log entry ID
  record_id: string;         // Employee ID (links to schedules)
  log_type: string; //"IN" | "OUT";    // Defines if it's a Time In or Time Out
  log_in: string;      // Timestamp of the log (YYYY-MM-DD HH:MM:SS)
  log_out: string;      // Timestamp of the log (YYYY-MM-DD HH:MM:SS)
  work_session: number;      // Identifies session (1st IN/OUT, 2nd IN/OUT, etc.)
  total_work_hours?: number; // Optional: Computed total hours (updated after OUT)
  status: string;// "Pending" | "Completed"; // Tracks if session is complete
  created_date: string;
  created_by: string;
  last_modified_date: string | null;
  last_modified_by: string | null;
  push_status_id: number;
  push_date: string | null;
  deleted_date: string | null;
  deleted_by: string | null;
  is_deleted: boolean;
  remarks: string | null; // if ever there is a reason for incomplete log entry
}

