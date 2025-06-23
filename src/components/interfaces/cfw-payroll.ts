export interface ICFWPayroll {
  id: string;
  period_cover_from: Date;
  period_cover_to: Date;
  status: string;
  status_date: string | null;
  mov_path: string;
  created_date: string;
  created_by: string;
  last_modified_date?: string | null;
  last_modified_by?: string | null;
  push_status_id?: number;
  push_date?: string;
  deleted_date?: string | null;
  deleted_by?: string | null;
  is_deleted?: boolean;
  remarks?: string | null;
}

export interface ICFWPayrollBene {
  id: string;
  bene_id: string;
  daily_time_record_id: string;
  daily_time_record_reviewed_date: string;
  accomplishment_report_id: string;
  accomplishment_report_reviewed_date: string;
  period_cover_from: Date;
  period_cover_to: Date;
  operation_status: string;
  operation_status_date: string | null;
  operation_reviewed_by: string | null; //new
  odnpm_status: string;
  odnpm_status_date: string | null;
  odnpm_reviewed_by: string | null; //new
  finance_status: string;
  finance_status_date: string | null;
  finance_reviewed_by: string | null; //new
  date_released: string | null;
  date_received: string | null;
  // created_date: string;
  // created_by: string;
  last_modified_date?: string | null;
  last_modified_by?: string | null;
  push_status_id?: number;
  push_date?: string;
  deleted_date?: string | null;
  deleted_by?: string | null;
  is_deleted?: boolean;
  remarks?: string | null;
}

export interface ISubmissionLog {
  id: string;
  record_id: string;//
  bene_id: string | undefined | null;//
  module: string;//
  comment: string;//
  status_id: number;//
  status_date: string | null;//
  created_date: string;//
  created_by: string;//
  last_modified_date?: string | null; //
  last_modified_by?: string | null;//
  push_status_id?: number;//
  push_date?: string;//
  deleted_date?: string | null;//
  deleted_by?: string | null;//
  is_deleted?: boolean;//
  remarks?: string | null;//
  user_id?: string | null
}
