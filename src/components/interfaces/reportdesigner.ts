 
export interface IReportDesigner{
  id: string;  
  name: string;
  columns: string; 
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date?: string | null,
  deleted_by?: string | null,
  is_deleted?: boolean,
  remarks?: string | null,
}
export interface IReportColumn{
  id: string;  
  report_designer_id: string;  
  label: string;  
	value: string;
	type: string;
	description?: string;
	visible?: boolean,
	options?: string,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date?: string | null,
  deleted_by?: string | null,
  is_deleted?: boolean,
  remarks?: string | null,
}