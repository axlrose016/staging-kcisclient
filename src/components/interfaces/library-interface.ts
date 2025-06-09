export interface LibraryOption {
  label: any;
  id: any,
  name: string,
  short_name?: string,
}

export interface LibraryOptions {
  options: LibraryOption[],
  selectedOption: string,
  label?: string,
  onChange?: (selectedValue: string) => void;
}

export interface IRoles {
  id: string,
  role_description: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface IModules {
  id: string,
  module_description: string,
  module_path: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface IPermissions {
  id: string,
  permission_description: string;
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibModality {
  id: number,
  modality_name: string,
  is_active: boolean,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibModalitySubCategory {
  id: number,
  modality_id: number,
  modality_sub_category_name: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibSex {
  id: number,
  sex_description: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibCivilStatus {
  id: number,
  civil_status_description: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibExtensionName {
  id: number,
  extension_name: string,
  is_active: boolean,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibSectors {
  id: number,
  sector_name: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibIdCard {
  id: number,
  id_card_name: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibEducationalAttainment {
  id: number,
  educational_attainment_description: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibRelationshipToBeneficiary {
  id: number,
  relationship_name: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibTypeOfDisability {
  id: number,
  disability_name: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibCFWType {
  id: number,
  cfw_type_name: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibYearLevel {
  id: number,
  year_level_name: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibCourses {
  id: number,
  course_code: string,
  course_name: string,
  course_description: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibDeploymentArea {
  id: number,
  deployment_name: string,
  deployment_area_short_name: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}
export interface ILibTypeOfWork {
  id: number,
  work_name: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}
export interface ILibFilesToUpload {
  id: number,
  file_name: string,
  module_path: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}

export interface ILibIPGroup {
  id: number,
  name: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}
export interface ILibYearServed {
  id: number,
  year_served: number,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}
export interface ILibProgramTypes {
  id: number,
  program_type_name: string,
  created_date: string,
  created_by: string,
  last_modified_date: string | null,
  last_modified_by: string | null,
  push_status_id: number,
  push_date: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks: string | null,
}


export interface ILibSchoolProfiles {
  id: number;                          // Unique ID (UUID)
  school_name: string;                // Full name of the school
  short_name?: string;                // Abbreviated name (e.g., "MIT", optional)
  school_code: string;                // Government-issued school ID/code
  address: string;                    // Full address of the school
  city_code: string;                       // City or municipality
  province_code: string;                   // Province or state
  region_code: string;                     // Region (e.g., Region IV-A)
  barangay_code?: string;               // ZIP or postal code
  email: string;                      // Official contact email
  contact_number: string;             // Phone or landline
  school_head: string;                // Principal / Head of the school
  school_head_position: string;       // Position (e.g., Principal, Director)
  website_url?: string;               // Official school website (optional)
  established_year?: number;          // Year the school was established (optional)
  logo_url?: string;                  // URL or path to school logo (optional)
  type: string;                       // "Public" | "Private"
  level: string;                      // "Elementary", "Junior High", "Senior High", "College", etc.
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibSchoolPrograms {
  id: number;                       // Unique ID for the program (UUID)
  program_name: string;            // Full name of the program (e.g., "Bachelor of Science in Information Technology")
  program_code: string;            // Program code (e.g., "BSIT")
  description?: string;            // Description or notes
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}
export interface ILibStatuses {
  id: number;
  status_name: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibDeploymentAreaCategories {
  id: number;
  category_name: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibWorkPlanTaskCategory {
  id: number;  
  work_plan_category_name: string;
  status_id: number;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibLevel {
  id: number;
  level_description: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibEmploymentStatus{
  id: number;
  employment_status_description: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibPosition{
  id: number;
  position_description: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibHiringProcedure{
  id: number;
  hiring_procedure_description: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibOffice{
  id: number;
  office_description: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibDivision{
  id: number;
  division_description: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibBudgetYear{
  id: number;
  budget_year_description: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibPAP{
  id: number;
  pap_description: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibAppropriationSource{
  id: number;
  appropriation_source_description: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibAppropriationType{
  id: number;
  appropriation_type_description: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibComponent{
  id: number;
  component_description: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibExpense{
  id: number;
  expense_code: string;
  expense_description: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}

export interface ILibAllotmentClass{
  id: number;
  allotment_class_description: string;
  created_date: string,
  created_by: string,
  last_modified_date?: string | null,
  last_modified_by?: string | null,
  push_status_id?: number,
  push_date?: string,
  deleted_date: string | null,
  deleted_by: string | null,
  is_deleted: boolean,
  remarks?: string | null,
}
