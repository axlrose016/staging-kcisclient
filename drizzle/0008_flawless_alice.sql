PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_cfw_family_program_details` (
	`id` text PRIMARY KEY NOT NULL,
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
INSERT INTO `__new_cfw_family_program_details`("id", "person_profile_id", "cfw_type_id", "year_served", "created_date", "created_by", "last_modified_date", "last_modified_by", "push_status_id", "push_date", "deleted_date", "deleted_by", "is_deleted", "remarks") SELECT "id", "person_profile_id", "cfw_type_id", "year_served", "created_date", "created_by", "last_modified_date", "last_modified_by", "push_status_id", "push_date", "deleted_date", "deleted_by", "is_deleted", "remarks" FROM `cfw_family_program_details`;--> statement-breakpoint
DROP TABLE `cfw_family_program_details`;--> statement-breakpoint
ALTER TABLE `__new_cfw_family_program_details` RENAME TO `cfw_family_program_details`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_person_profile_disability` (
	`id` text PRIMARY KEY NOT NULL,
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
INSERT INTO `__new_person_profile_disability`("id", "person_profile_id", "type_of_disability_id", "created_date", "created_by", "last_modified_date", "last_modified_by", "push_status_id", "push_date", "deleted_date", "deleted_by", "is_deleted", "remarks") SELECT "id", "person_profile_id", "type_of_disability_id", "created_date", "created_by", "last_modified_date", "last_modified_by", "push_status_id", "push_date", "deleted_date", "deleted_by", "is_deleted", "remarks" FROM `person_profile_disability`;--> statement-breakpoint
DROP TABLE `person_profile_disability`;--> statement-breakpoint
ALTER TABLE `__new_person_profile_disability` RENAME TO `person_profile_disability`;--> statement-breakpoint
CREATE TABLE `__new_person_profile_engagement_history` (
	`id` text PRIMARY KEY NOT NULL,
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
INSERT INTO `__new_person_profile_engagement_history`("id", "person_profile_id", "modality_id", "status_id", "target_number_of_days", "number_of_days_worked", "amount_received", "date_ended", "created_date", "created_by", "last_modified_date", "last_modified_by", "push_status_id", "push_date", "deleted_date", "deleted_by", "is_deleted", "remarks") SELECT "id", "person_profile_id", "modality_id", "status_id", "target_number_of_days", "number_of_days_worked", "amount_received", "date_ended", "created_date", "created_by", "last_modified_date", "last_modified_by", "push_status_id", "push_date", "deleted_date", "deleted_by", "is_deleted", "remarks" FROM `person_profile_engagement_history`;--> statement-breakpoint
DROP TABLE `person_profile_engagement_history`;--> statement-breakpoint
ALTER TABLE `__new_person_profile_engagement_history` RENAME TO `person_profile_engagement_history`;--> statement-breakpoint
CREATE TABLE `__new_person_profile_family_composition` (
	`id` text PRIMARY KEY NOT NULL,
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
	`push_date` text,
	`deleted_date` text,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
INSERT INTO `__new_person_profile_family_composition`("id", "person_profile_id", "name", "birthdate", "age", "contact_number", "highest_educational_attainment_id", "monthly_income", "relationship_to_the_beneficiary_id", "work", "created_date", "created_by", "last_modified_date", "last_modified_by", "push_status_id", "push_date", "deleted_date", "deleted_by", "is_deleted", "remarks") SELECT "id", "person_profile_id", "name", "birthdate", "age", "contact_number", "highest_educational_attainment_id", "monthly_income", "relationship_to_the_beneficiary_id", "work", "created_date", "created_by", "last_modified_date", "last_modified_by", "push_status_id", "push_date", "deleted_date", "deleted_by", "is_deleted", "remarks" FROM `person_profile_family_composition`;--> statement-breakpoint
DROP TABLE `person_profile_family_composition`;--> statement-breakpoint
ALTER TABLE `__new_person_profile_family_composition` RENAME TO `person_profile_family_composition`;--> statement-breakpoint
CREATE TABLE `__new_person_profile_file_upload` (
	`id` text PRIMARY KEY NOT NULL,
	`person_profile_id` text,
	`file_id` integer,
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
INSERT INTO `__new_person_profile_file_upload`("id", "person_profile_id", "file_id", "file_name", "created_date", "created_by", "last_modified_date", "last_modified_by", "push_status_id", "push_date", "deleted_date", "deleted_by", "is_deleted", "remarks") SELECT "id", "person_profile_id", "file_id", "file_name", "created_date", "created_by", "last_modified_date", "last_modified_by", "push_status_id", "push_date", "deleted_date", "deleted_by", "is_deleted", "remarks" FROM `person_profile_file_upload`;--> statement-breakpoint
DROP TABLE `person_profile_file_upload`;--> statement-breakpoint
ALTER TABLE `__new_person_profile_file_upload` RENAME TO `person_profile_file_upload`;--> statement-breakpoint
CREATE TABLE `__new_person_profile_sector` (
	`id` text PRIMARY KEY NOT NULL,
	`person_profile_id` text,
	`sector_id` integer,
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
INSERT INTO `__new_person_profile_sector`("id", "person_profile_id", "sector_id", "created_date", "created_by", "last_modified_date", "last_modified_by", "push_status_id", "push_date", "deleted_date", "deleted_by", "is_deleted", "remarks") SELECT "id", "person_profile_id", "sector_id", "created_date", "created_by", "last_modified_date", "last_modified_by", "push_status_id", "push_date", "deleted_date", "deleted_by", "is_deleted", "remarks" FROM `person_profile_sector`;--> statement-breakpoint
DROP TABLE `person_profile_sector`;--> statement-breakpoint
ALTER TABLE `__new_person_profile_sector` RENAME TO `person_profile_sector`;