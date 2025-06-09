CREATE TABLE `lib_ancestral_domain` (
	`id` integer PRIMARY KEY NOT NULL,
	`ancestral_domain_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_ancestral_domain_coverage` (
	`id` integer PRIMARY KEY NOT NULL,
	`ancestral_domain_coverage_description` text NOT NULL,
	`ancestral_domain_id` text NOT NULL,
	`region_code` text,
	`province_code` text,
	`city_code` text,
	`brgy_code` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	FOREIGN KEY (`ancestral_domain_id`) REFERENCES `lib_ancestral_domain`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`region_code`) REFERENCES `lib_region`(`region_code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`province_code`) REFERENCES `lib_province`(`province_code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`city_code`) REFERENCES `lib_city`(`city_code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`brgy_code`) REFERENCES `lib_brgy`(`brgy_code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lib_brgy` (
	`brgy_code` text PRIMARY KEY NOT NULL,
	`brgy_name` text NOT NULL,
	`brgy_nick` text,
	`city_code` text,
	`sort_order` integer,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	FOREIGN KEY (`city_code`) REFERENCES `lib_city`(`city_code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lib_cfw_category` (
	`id` integer PRIMARY KEY NOT NULL,
	`category_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_cfw_type` (
	`id` integer PRIMARY KEY NOT NULL,
	`cfw_type_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_city` (
	`city_code` text PRIMARY KEY NOT NULL,
	`city_name` text NOT NULL,
	`city_nick` text,
	`province_code` text,
	`sort_order` integer,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	FOREIGN KEY (`province_code`) REFERENCES `lib_province`(`province_code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lib_civil_status` (
	`id` integer PRIMARY KEY NOT NULL,
	`civil_status_description` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_course` (
	`id` integer PRIMARY KEY NOT NULL,
	`course_code` text,
	`course_name` text,
	`course_description` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_cycle` (
	`id` integer PRIMARY KEY NOT NULL,
	`cycle_description` integer NOT NULL,
	`fund_source_id` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	`is_active` integer DEFAULT false,
	FOREIGN KEY (`fund_source_id`) REFERENCES `lib_fund_source`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lib_deployment_area` (
	`id` integer PRIMARY KEY NOT NULL,
	`deployment_name` text,
	`sitio` text,
	`brgy_code` text,
	`contact_person` text,
	`contact_number` integer,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_educational_attainment` (
	`id` integer PRIMARY KEY NOT NULL,
	`educational_attainment_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_extension_name` (
	`id` integer PRIMARY KEY NOT NULL,
	`extension_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	`is_active` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `lib_files_to_upload` (
	`id` integer PRIMARY KEY NOT NULL,
	`file_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_fund_source` (
	`id` integer PRIMARY KEY NOT NULL,
	`fund_source_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	`is_active` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `lib_id_card` (
	`id` integer PRIMARY KEY NOT NULL,
	`id_card_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_ip_group` (
	`id` integer PRIMARY KEY NOT NULL,
	`ip_group_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_lgu_level` (
	`id` integer PRIMARY KEY NOT NULL,
	`lgu_level_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_lgu_position` (
	`id` integer PRIMARY KEY NOT NULL,
	`lgu_position_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_modality` (
	`id` integer PRIMARY KEY NOT NULL,
	`modality_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	`is_active` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `lib_modality_sub_category` (
	`id` integer PRIMARY KEY NOT NULL,
	`modality_id` integer,
	`modality_sub_category_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_mode` (
	`id` integer PRIMARY KEY NOT NULL,
	`mode_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_occupation` (
	`id` integer PRIMARY KEY NOT NULL,
	`occupation_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_position` (
	`id` integer PRIMARY KEY NOT NULL,
	`position_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_province` (
	`province_code` text PRIMARY KEY NOT NULL,
	`province_name` text NOT NULL,
	`region_code` text,
	`archive` integer DEFAULT false,
	`latitude` text,
	`longitude` text,
	`psgc` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	FOREIGN KEY (`region_code`) REFERENCES `lib_region`(`region_code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lib_region` (
	`region_code` text PRIMARY KEY NOT NULL,
	`region_name` text NOT NULL,
	`region_nick` text,
	`sort_order` integer,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_relationship_to_beneficiary` (
	`id` integer PRIMARY KEY NOT NULL,
	`relationship_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_sectors` (
	`id` integer PRIMARY KEY NOT NULL,
	`sector_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_sex` (
	`id` integer PRIMARY KEY NOT NULL,
	`sex_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_type_of_disability` (
	`id` integer PRIMARY KEY NOT NULL,
	`disability_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_type_of_work` (
	`id` integer PRIMARY KEY NOT NULL,
	`work_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_volunteer_committee` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `lib_volunteer_committee_position` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	`is_active` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `lib_year_level` (
	`id` integer PRIMARY KEY NOT NULL,
	`year_level_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` text PRIMARY KEY NOT NULL,
	`module_description` text NOT NULL,
	`module_path` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`permission_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`role_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `person_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`cwf_category_id` integer,
	`cfwp_id_no` text,
	`first_name` text,
	`middle_name` text,
	`last_name` text,
	`extension_name` integer,
	`sex_id` integer,
	`civil_status_id` integer,
	`birthdate` text,
	`age` integer,
	`birthplace` text,
	`philsys_id_no` text,
	`no_of_children` integer,
	`is_pantawid` integer DEFAULT false,
	`is_pantawid_leader` integer DEFAULT false,
	`is_slp` integer DEFAULT false,
	`sitio` text,
	`brgy_code` text,
	`is_permanent_same_as_current_address` integer DEFAULT false,
	`sitio_current_address` text,
	`barangay_code_current` text,
	`cellphone_no` text,
	`cellphone_no_secondary` text,
	`email` text,
	`has_immediate_health_concern` integer DEFAULT false,
	`immediate_health_concern` text,
	`is_lgu_official` integer DEFAULT false,
	`is_mdc` integer,
	`is_bdc` integer,
	`is_bspmc` integer,
	`is_bdrrmc_bdc_twg` integer,
	`is_bdrrmc_expanded_bdrrmc` integer,
	`is_mdrrmc` integer,
	`is_hh_head` integer,
	`academe` integer,
	`business` integer,
	`differently_abled` integer,
	`farmer` integer,
	`fisherfolks` integer,
	`government` integer,
	`school_name` text,
	`campus` text,
	`school_address` text,
	`course_id` integer,
	`year_graduated` text,
	`year_level_id` integer,
	`skills` text,
	`deployment_area_id` integer,
	`deployment_area_address` text,
	`preffered_type_of_work_id` integer,
	`representative_last_name` text,
	`representative_first_name` text,
	`representative_middle_name` text,
	`representative_extension_name_id` text,
	`representative_sitio` text,
	`representative_brgy_code` text,
	`representative_relationship_to_beneficiary` text,
	`representative_birthdate` text,
	`representative_age` text,
	`representative_occupation` text,
	`representative_monthly_salary` integer,
	`representative_educational_attainment_id` integer,
	`representative_sex_id` integer,
	`representative_contact_number` text,
	`representative_id_card_id` integer,
	`representative_id_card_number` text,
	`representative_civil_status_id` integer,
	`representative_has_health_concern` text,
	`representative_health_concern_details` text,
	`representative_skills` text,
	`ngo` integer,
	`po` integer,
	`religious` integer,
	`others` text,
	`date_of_first_appointment` text,
	`fund_source_id` integer,
	`modality_id` integer,
	`modality_sub_category_id` integer,
	`cycle_id` integer,
	`kc_mode_id` integer,
	`committee_id` integer,
	`position_id` integer,
	`volunteer_date_start` text,
	`volunteer_date_end` text,
	`training_title` text,
	`training_start` text,
	`training_end` text,
	`seminar_title` text,
	`seminar_from` text,
	`seminar_to` text,
	`seminar_hours` integer,
	`seminar_conducted_by` text,
	`date_reported` text,
	`work_name` text,
	`work_start` text,
	`work_end` text,
	`actual_cash` text,
	`actual_lcc` text,
	`is_eligible` text,
	`assessment` text,
	`current_occupation` text,
	`id_card` integer,
	`occupation_id_card_number` text,
	`family_member_name` text,
	`relationship_to_family_member` text,
	`family_member_birthday` text,
	`family_member_age` integer,
	`family_member_educational_level` text,
	`family_member_occupation` text,
	`family_member_monthly_income` integer,
	`family_member_contact_number` text,
	`type_of_cfw_id` integer,
	`year_served` integer,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `review_approve` (
	`id` text PRIMARY KEY NOT NULL,
	`record_id` text NOT NULL,
	`user_id` text NOT NULL,
	`modality_id` integer NOT NULL,
	`module_id` integer NOT NULL,
	`status` text DEFAULT 'Pending',
	`comments` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `person_profile_disability` (
	`id` integer PRIMARY KEY NOT NULL,
	`person_profile_id` text,
	`type_of_disability_id` integer,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `person_profile_engagement_history` (
	`id` integer PRIMARY KEY NOT NULL,
	`person_profile_id` text,
	`modality_id` integer,
	`status_id` integer,
	`target_number_of_days` integer,
	`number_of_days_worked` integer,
	`amount_received` text,
	`date_ended` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `person_profile_family_composition` (
	`id` integer PRIMARY KEY NOT NULL,
	`person_profile_id` text,
	`name` text,
	`birthdate` text,
	`age` integer,
	`contact_number` text,
	`highest_educational_attainment_id` integer,
	`monthly_income` text,
	`relationship_to_the_beneficiary_id` integer,
	`work` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `person_profile_file_upload` (
	`id` integer PRIMARY KEY NOT NULL,
	`person_profile_id` text,
	`file_id` text,
	`file_name` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `cfw_family_program_details` (
	`id` integer PRIMARY KEY NOT NULL,
	`person_profile_id` text,
	`cfw_type_id` integer,
	`year_served` integer,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `person_profile_sector` (
	`id` integer PRIMARY KEY NOT NULL,
	`person_profile_id` text,
	`sector_id` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `useraccess` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`module_id` text NOT NULL,
	`permission_id` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role_id` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`text` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);