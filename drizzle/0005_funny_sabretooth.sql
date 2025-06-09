PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_person_profile_file_upload` (
	`id` integer PRIMARY KEY NOT NULL,
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
PRAGMA foreign_keys=ON;