export const createRolesTable = `
CREATE TABLE IF NOT EXISTS modules (
    id TEXT NOT NULL PRIMARY KEY,
    module_description TEXT NOT NULL,
    module_path TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createModulesTable = `
CREATE TABLE IF NOT EXISTS modules (
    id TEXT NOT NULL PRIMARY KEY,
    module_description TEXT NOT NULL,
    module_path TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createPermissionsTable = `
CREATE TABLE IF NOT EXISTS permissions (
    id TEXT NOT NULL PRIMARY KEY,
    permission_description TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibAncestralDomain = `
CREATE TABLE IF NOT EXISTS lib_ancestral_domain (
    id INTEGER NOT NULL PRIMARY KEY,
    ancestral_domain_description TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibRegion = `
CREATE TABLE IF NOT EXISTS lib_region (
    region_code TEXT NOT NULL PRIMARY KEY,
    region_name TEXT NOT NULL,
    region_nick TEXT,
    sort_order INTEGER,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibProvince = `
CREATE TABLE IF NOT EXISTS lib_province (
    province_code TEXT NOT NULL PRIMARY KEY,
    province_name TEXT NOT NULL,
    region_code TEXT,
    archive INTEGER DEFAULT 0,
    latitude TEXT,
    longitude TEXT,
    psgc TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT,
    FOREIGN KEY (region_code) REFERENCES lib_region(region_code)
);
`

export const createLibCity = `
CREATE TABLE IF NOT EXISTS lib_city (
    city_code TEXT NOT NULL PRIMARY KEY,
    city_name TEXT NOT NULL,
    city_nick TEXT,
    province_code TEXT,
    sort_order INTEGER,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT,
    FOREIGN KEY (province_code) REFERENCES lib_province(province_code)
);
`

export const createLibBrgy = `
CREATE TABLE IF NOT EXISTS lib_brgy (
    brgy_code TEXT NOT NULL PRIMARY KEY,
    brgy_name TEXT NOT NULL,
    brgy_nick TEXT,
    city_code TEXT,
    sort_order INTEGER,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT,
    FOREIGN KEY (city_code) REFERENCES lib_city(city_code)
);
`

export const createLibCivilStatus = `
CREATE TABLE IF NOT EXISTS lib_civil_status (
    id INTEGER NOT NULL PRIMARY KEY,
    civil_status_description TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibEducationalAttainment = `
CREATE TABLE IF NOT EXISTS lib_educational_attainment (
    id INTEGER NOT NULL PRIMARY KEY,
    educational_attainment_description TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibFundSource = `
CREATE TABLE IF NOT EXISTS lib_fund_source (
    id INTEGER NOT NULL PRIMARY KEY,
    fund_source_description TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT,
    is_active INTEGER DEFAULT 0
);
`

export const createLibCycle = `
CREATE TABLE IF NOT EXISTS lib_cycle (
    id INTEGER NOT NULL PRIMARY KEY,
    cycle_description INTEGER NOT NULL,
    fund_source_id INTEGER NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT,
    is_active INTEGER DEFAULT 0,
    FOREIGN KEY (fund_source_id) REFERENCES lib_fund_source(id)
);
`

export const createLibLguLevel = `
CREATE TABLE IF NOT EXISTS lib_lgu_level (
    id INTEGER NOT NULL PRIMARY KEY,
    lgu_level_description TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibLguPosition = `
CREATE TABLE IF NOT EXISTS lib_lgu_position (
    id INTEGER NOT NULL PRIMARY KEY,
    lgu_position_description TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibMode = `
CREATE TABLE IF NOT EXISTS lib_mode (
    id INTEGER NOT NULL PRIMARY KEY,
    mode_description TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibOccupation = `
CREATE TABLE IF NOT EXISTS lib_occupation (
    id INTEGER NOT NULL PRIMARY KEY,
    occupation_description TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibSex = `
CREATE TABLE IF NOT EXISTS lib_sex (
    id INTEGER NOT NULL PRIMARY KEY,
    sex_description TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibVolunteerCommittee = `
CREATE TABLE IF NOT EXISTS lib_volunteer_committee (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibVolunteerCommitteePosition = `
CREATE TABLE IF NOT EXISTS lib_volunteer_committee_position (
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT,
    is_active INTEGER DEFAULT 0
);
`

export const createLibAncestralDomainCoverage = `
CREATE TABLE IF NOT EXISTS lib_ancestral_domain_coverage (
    id INTEGER NOT NULL PRIMARY KEY,
    ancestral_domain_coverage_description TEXT NOT NULL,
    ancestral_domain_id TEXT NOT NULL,
    region_code TEXT,
    province_code TEXT,
    city_code TEXT,
    brgy_code TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT,
    FOREIGN KEY (ancestral_domain_id) REFERENCES lib_ancestral_domain(id),
    FOREIGN KEY (region_code) REFERENCES lib_region(region_code),
    FOREIGN KEY (province_code) REFERENCES lib_province(province_code),
    FOREIGN KEY (city_code) REFERENCES lib_city(city_code),
    FOREIGN KEY (brgy_code) REFERENCES lib_brgy(brgy_code)
);
`

export const createLibCfwCategory = `
CREATE TABLE IF NOT EXISTS lib_cfw_category (
    id INTEGER NOT NULL PRIMARY KEY,
    category_name TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibCfwType = `
CREATE TABLE IF NOT EXISTS lib_cfw_type (
    id INTEGER NOT NULL PRIMARY KEY,
    cfw_type_name TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibModalitySubCategory = `
CREATE TABLE IF NOT EXISTS lib_modality_sub_category (
    id INTEGER NOT NULL PRIMARY KEY,
    modality_id INTEGER,
    modality_sub_category_name TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibTypeOfWork = `
CREATE TABLE IF NOT EXISTS lib_type_of_work (
    id INTEGER NOT NULL PRIMARY KEY,
    work_name TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibIdCard = `
CREATE TABLE IF NOT EXISTS lib_id_card (
    id INTEGER NOT NULL PRIMARY KEY,
    id_card_name TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibRelationshipToBeneficiary = `
CREATE TABLE IF NOT EXISTS lib_relationship_to_beneficiary (
    id INTEGER NOT NULL PRIMARY KEY,
    relationship_name TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibIpGroup = `
CREATE TABLE IF NOT EXISTS lib_ip_group (
    id INTEGER NOT NULL PRIMARY KEY,
    ip_group_name TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibTypeOfDisability = `
CREATE TABLE IF NOT EXISTS lib_type_of_disability (
    id INTEGER NOT NULL PRIMARY KEY,
    disability_name TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibCourse = `
CREATE TABLE IF NOT EXISTS lib_course (
    id INTEGER NOT NULL PRIMARY KEY,
    course_code TEXT,
    course_name TEXT,
    course_description TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibYearLevel = `
CREATE TABLE IF NOT EXISTS lib_year_level (
    id INTEGER NOT NULL PRIMARY KEY,
    year_level_name TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibDeploymentArea = `
CREATE TABLE IF NOT EXISTS lib_deployment_area (
    id INTEGER NOT NULL PRIMARY KEY,
    deployment_name TEXT,
    sitio TEXT,
    brgy_code TEXT,
    contact_person TEXT,
    contact_number INTEGER,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`

export const createLibModality = `
CREATE TABLE IF NOT EXISTS lib_modality (
    id INTEGER NOT NULL PRIMARY KEY,
    modality_name TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT,
    is_active INTEGER DEFAULT 0
);
`

export const createLibExtensionName = `
CREATE TABLE IF NOT EXISTS lib_extension_name (
    id INTEGER NOT NULL PRIMARY KEY,
    extension_name TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT,
    is_active INTEGER DEFAULT 0
);
`

export const createLibPosition = `
CREATE TABLE IF NOT EXISTS lib_position (
    id INTEGER NOT NULL PRIMARY KEY,
    position_name TEXT,
    created_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT NOT NULL,
    last_modified_date TEXT DEFAULT CURRENT_TIMESTAMP,
    last_modified_by TEXT,
    push_status_id INTEGER DEFAULT 0,
    push_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_date TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted_by TEXT,
    is_deleted INTEGER DEFAULT 0,
    remarks TEXT
);
`
 