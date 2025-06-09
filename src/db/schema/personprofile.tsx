import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { modules, permissions, roles } from "./libraries";

export const person_profile = sqliteTable("person_profile", {
    id: text("id").notNull().primaryKey(),
    // cwf_category_id: integer("cwf_category_id"),

    cfwp_id_no: text("cfwp_id_no"),

    first_name: text("first_name"), //✅
    middle_name: text("middle_name"), //✅
    last_name: text("last_name"), //✅
    extension_name: integer("extension_name"), //✅
    sex_id: integer("sex_id"),//✅
    civil_status_id: integer("civil_status_id"),//✅
    birthdate: text("birthdate"),//✅
    age: integer("age"),//✅
    birthplace: text("birthplace"),//✅

    philsys_id_no: text("philsys_id_no"), //✅

    no_of_children: integer("no_of_children"),
    is_pantawid: integer("is_pantawid", { mode: "boolean" }).default(false),
    is_pantawid_leader: integer("is_pantawid_leader", { mode: "boolean" }).default(false),
    is_slp: integer("is_slp", { mode: "boolean" }).default(false),

    sitio: text("sitio"), //permanent address ✅
    brgy_code: text("brgy_code"), //permanent address ✅

    is_permanent_same_as_current_address: integer("is_permanent_same_as_current_address", { mode: "boolean" }).default(false),
    sitio_current_address: text("sitio_current_address"),
    barangay_code_current: text("barangay_code_current"),

    cellphone_no: text("cellphone_no"), // ✅
    cellphone_no_secondary: text("cellphone_no_secondary"), //✅
    email: text("email"), //✅

    has_immediate_health_concern: integer("has_immediate_health_concern"), //✅
    immediate_health_concern: text("immediate_health_concern"), //✅


    is_lgu_official: integer("is_lgu_official", { mode: "boolean" }).default(false),
    is_mdc: integer("is_mdc"),
    is_bdc: integer("is_bdc"),
    is_bspmc: integer("is_bspmc"),
    is_bdrrmc_bdc_twg: integer("is_bdrrmc_bdc_twg"),
    is_bdrrmc_expanded_bdrrmc: integer("is_bdrrmc_expanded_bdrrmc"),
    is_mdrrmc: integer("is_mdrrmc"),
    is_hh_head: integer("is_hh_head"),
    academe: integer("academe"),
    business: integer("business"),
    differently_abled: integer("differently_abled"),
    farmer: integer("farmer"),
    fisherfolks: integer("fisherfolks"),
    government: integer("government"),
    ip_group_id: integer("ip_group_id"),
    // cfw make it junction table
    // women: integer("women"),
    // ip: integer("ip"),
    // ip_group_id: integer("ip_group_id"),
    // solo_parent: integer("solo_parent"),
    // children_and_youth_in_need_of_special_protection: integer("children_and_youth_in_need_of_special_protection"),
    // out_of_school_youth: integer("out_of_school_youth"),
    // family_heads_in_need_of_assistance: integer("family_heads_in_need_of_assistance"),
    // affected_by_disaster: integer("affected_by_disaster"),
    // persons_with_disability: integer("persons_with_disability"),
    // senior_citizen: integer("senior_citizen"),
    // is_family_beneficiary_of_cfw: integer("is_family_beneficiary_of_cfw", { mode: "boolean" }).default(false),
    school_name: text("school_name"), //✅
    campus: text("campus"), //✅
    school_address: text("school_address"),//✅
    course_id: integer("course_id"),//✅
    year_graduated: text("year_graduated"),//✅
    year_level_id: integer("year_level_id"),//✅

    skills: text("skills"), //✅

    deployment_area_id: integer("deployment_area_id"), //✅
    deployment_area_address: text("deployment_area_address"), //✅
    preffered_type_of_work_id: integer("preffered_type_of_work_id"), //✅

    is_pwd_representative: integer("is_pwd_representative"),
    representative_last_name: text("representative_last_name"), //✅
    representative_first_name: text("representative_first_name"), //✅
    representative_middle_name: text("representative_middle_name"), //✅
    representative_extension_name_id: integer("representative_extension_name_id"), //✅
    representative_sitio: text("representative_sitio"), //✅
    representative_brgy_code: text("representative_brgy_code"), //✅
    representative_relationship_to_beneficiary: integer("representative_relationship_to_beneficiary"), //✅
    representative_birthdate: text("representative_birthdate"), //✅
    representative_age: integer("representative_age"), //✅
    representative_occupation: text("representative_occupation"), //✅
    representative_monthly_salary: integer("representative_monthly_salary"), //✅
    representative_educational_attainment_id: integer("representative_educational_attainment_id"), //✅
    representative_sex_id: integer("representative_sex_id"), //✅
    representative_contact_number: text("representative_contact_number"), //✅
    representative_id_card_id: integer("representative_id_card_id"), //✅
    representative_id_card_number: text("representative_id_card_number"), //✅
    representative_civil_status_id: integer("representative_civil_status_id"), //✅
    representative_has_health_concern: integer("representative_has_health_concern"), //✅
    representative_health_concern_details: text("representative_health_concern_details"), //✅
    representative_skills: text("representative_skills"), //✅

    ngo: integer("ngo"),
    po: integer("po"),
    religious: integer("religious"),
    others: text("others"),

    date_of_first_appointment: text("date_of_first_appointment"),
    fund_source_id: integer("fund_source_id"),
    modality_id: integer("modality_id"),

    modality_sub_category_id: integer("modality_sub_category_id"),

    cycle_id: integer("cycle_id"),
    kc_mode_id: integer("kc_mode_id"),
    committee_id: integer("committee_id"),
    position_id: integer("position_id"),
    volunteer_date_start: text("volunteer_date_start"),
    volunteer_date_end: text("volunteer_date_end"),
    training_title: text("training_title"),
    training_start: text("training_start"),
    training_end: text("training_end"),
    seminar_title: text("seminar_title"),
    seminar_from: text("seminar_from"),
    seminar_to: text("seminar_to"),
    seminar_hours: integer("seminar_hours"),
    seminar_conducted_by: text("seminar_conducted_by"),
    date_reported: text("date_reported"),
    work_name: text("work_name"),
    work_start: text("work_start"),
    work_end: text("work_end"),
    actual_cash: text("actual_cash"),
    actual_lcc: text("actual_lcc"),
    is_eligible: text("is_eligible"),
    assessment: text("assessment"),

    current_occupation: text("current_occupation"),  //✅
    id_card: integer("id_card"), //✅
    occupation_id_card_number: text("occupation_id_card_number"), //✅

    family_member_name: text("family_member_name"),
    relationship_to_family_member: text("relationship_to_family_member"),
    family_member_birthday: text("family_member_birthday"),
    family_member_age: integer("family_member_age"),
    family_member_educational_level: text("family_member_educational_level"),
    family_member_occupation: text("family_member_occupation"),
    family_member_monthly_income: integer("family_member_monthly_income"),
    family_member_contact_number: text("family_member_contact_number"),
    type_of_cfw_id: integer("type_of_cfw_id"),
    year_served: integer("year_served"),
    created_date: text("created_date").default(sql`CURRENT_TIMESTAMP`).notNull(),
    created_by: text("created_by").notNull(),
    last_modified_date: text("last_modified_date").default(sql`CURRENT_TIMESTAMP`),
    last_modified_by: text("last_modified_by"),
    push_status_id: integer("push_status_id").default(0),
    push_date: text("push_date").default(sql`CURRENT_TIMESTAMP`),
    deleted_date: text("deleted_date").default(sql`CURRENT_TIMESTAMP`),
    deleted_by: text("deleted_by"),
    is_deleted: integer("is_deleted", { mode: "boolean" }).default(false),
    remarks: text("remarks"),

});



export const review_approve = sqliteTable("review_approve", {
    id: text("id").notNull().primaryKey(),
    record_id: text("record_id").notNull(),
    user_id: text("user_id").notNull(),
    modality_id: integer("modality_id").notNull(),
    module_id: integer("module_id").notNull(),
    status: text("status").default("Pending"), // review, approve, decline, for compliance
    comments: text("comments"), // Optional comments    or assessment
    created_date: text("created_date").default(sql`CURRENT_TIMESTAMP`).notNull(),
    created_by: text("created_by").notNull(),
    last_modified_date: text("last_modified_date").default(sql`CURRENT_TIMESTAMP`),
    last_modified_by: text("last_modified_by"),
    push_status_id: integer("push_status_id").default(0),
    push_date: text("push_date").default(sql`CURRENT_TIMESTAMP`),
    deleted_date: text("deleted_date").default(sql`CURRENT_TIMESTAMP`),
    deleted_by: text("deleted_by"),
    is_deleted: integer("is_deleted", { mode: "boolean" }).default(false),
    remarks: text("remarks"),
});


export const person_profile_disability = sqliteTable('person_profile_disability', {
    id: text("id").notNull().primaryKey(),
    person_profile_id: text('person_profile_id'),
    type_of_disability_id: integer('type_of_disability_id'),
    created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    created_by: text('created_by').notNull(),
    last_modified_date: text('last_modified_date').default(sql`CURRENT_TIMESTAMP`),
    last_modified_by: text('last_modified_by'),
    push_status_id: integer('push_status_id').default(0),
    push_date: text('push_date').default(sql`CURRENT_TIMESTAMP`),
    deleted_date: text('deleted_date').default(sql`CURRENT_TIMESTAMP`),
    deleted_by: text('deleted_by'),
    is_deleted: integer('is_deleted', { mode: 'boolean' }).default(false),
    remarks: text('remarks'),
});


export const person_profile_engagement_history = sqliteTable('person_profile_engagement_history', {
    id: text("id").notNull().primaryKey(),
    family_composition_id: text('family_composition_id'),
    person_profile_id: text("person_profile_id"),
    modality_id: integer('modality_id'),
    status_id: integer('status_id'),
    target_number_of_days: integer('target_number_of_days'),
    number_of_days_worked: integer('number_of_days_worked'),
    amount_received: text('amount_received'),
    date_ended: text('date_ended'),
    created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    created_by: text('created_by').notNull(),
    last_modified_date: text('last_modified_date').default(sql`CURRENT_TIMESTAMP`),
    last_modified_by: text('last_modified_by'),
    push_status_id: integer('push_status_id').default(0),
    push_date: text('push_date').default(sql`CURRENT_TIMESTAMP`),
    deleted_date: text('deleted_date').default(sql`CURRENT_TIMESTAMP`),
    deleted_by: text('deleted_by'),
    is_deleted: integer('is_deleted', { mode: 'boolean' }).default(false),
    remarks: text('remarks'),
});

export const person_profile_family_composition = sqliteTable('person_profile_family_composition', {
    id: text("id").notNull().primaryKey(),
    person_profile_id: text("person_profile_id"),
    name: text('name'),
    birthdate: text('birthdate'),
    age: integer('age'),
    contact_number: text('contact_number'),
    highest_educational_attainment_id: integer('highest_educational_attainment_id'),
    monthly_income: text('monthly_income'),
    relationship_to_the_beneficiary_id: integer('relationship_to_the_beneficiary_id'),
    work: text('work'),
    created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    created_by: text('created_by').notNull(),
    last_modified_date: text('last_modified_date').default(sql`CURRENT_TIMESTAMP`),
    last_modified_by: text('last_modified_by'),
    push_status_id: integer('push_status_id').default(0),
    push_date: text('push_date'),
    deleted_date: text('deleted_date'),
    deleted_by: text('deleted_by'),
    is_deleted: integer('is_deleted', { mode: 'boolean' }).default(false),
    remarks: text('remarks'),
});

export const person_profile_file_upload = sqliteTable('person_profile_file_upload', {
    id: text("id").notNull().primaryKey(),
    person_profile_id: text('person_profile_id'),
    file_id: integer('file_id'),
    file_name: text('file_name'), //this is the name of the file that has been uploaded
    created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    created_by: text('created_by').notNull(),
    last_modified_date: text('last_modified_date').default(sql`CURRENT_TIMESTAMP`),
    last_modified_by: text('last_modified_by'),
    push_status_id: integer('push_status_id').default(0),
    push_date: text('push_date').default(sql`CURRENT_TIMESTAMP`),
    deleted_date: text('deleted_date').default(sql`CURRENT_TIMESTAMP`),
    deleted_by: text('deleted_by'),
    is_deleted: integer('is_deleted', { mode: 'boolean' }).default(false),
    remarks: text('remarks'),
});

export const person_profile_cfw_fam_program_details = sqliteTable('person_profile_cfw_fam_program_details', {
    id: text("id").notNull().primaryKey(),
    person_profile_id: text("person_profile_id"),
    fam_member_first_name: text('fam_member_first_name'),
    fam_member_middle_name: text('fam_member_middle_name'),
    fam_member_last_name: text('fam_member_last_name'),
    fam_member_ext_name_id: text('fam_member_ext_name_id'),
    program_type_id: integer('program_type_id'),
    year_served_id: integer('year_served_id'),
    created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    created_by: text('created_by').notNull(),
    last_modified_date: text('last_modified_date').default(sql`CURRENT_TIMESTAMP`),
    last_modified_by: text('last_modified_by'),
    push_status_id: integer('push_status_id').default(0),
    push_date: text('push_date').default(sql`CURRENT_TIMESTAMP`),
    deleted_date: text('deleted_date').default(sql`CURRENT_TIMESTAMP`),
    deleted_by: text('deleted_by'),
    is_deleted: integer('is_deleted', { mode: 'boolean' }).default(false),
    remarks: text('remarks'),
});

export const person_profile_sector = sqliteTable('person_profile_sector', {
    id: text("id").notNull().primaryKey(),
    person_profile_id: text('person_profile_id'),
    sector_id: integer('sector_id'),
    created_date: text('created_date').default(sql`CURRENT_TIMESTAMP`).notNull(),
    created_by: text('created_by').notNull(),
    last_modified_date: text('last_modified_date').default(sql`CURRENT_TIMESTAMP`),
    last_modified_by: text('last_modified_by'),
    push_status_id: integer('push_status_id').default(0),
    push_date: text('push_date').default(sql`CURRENT_TIMESTAMP`),
    deleted_date: text('deleted_date').default(sql`CURRENT_TIMESTAMP`),
    deleted_by: text('deleted_by'),
    is_deleted: integer('is_deleted', { mode: 'boolean' }).default(false),
    remarks: text('remarks'),
});