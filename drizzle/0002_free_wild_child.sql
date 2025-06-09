PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_person_profile_family_composition` (
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
PRAGMA foreign_keys=ON;