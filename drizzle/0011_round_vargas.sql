ALTER TABLE `cfw_family_program_details` RENAME TO `person_profile_cfw_fam_program_details`;--> statement-breakpoint
ALTER TABLE `person_profile_cfw_fam_program_details` RENAME COLUMN "cfw_type_id" TO "program_type_id";--> statement-breakpoint
ALTER TABLE `person_profile_cfw_fam_program_details` RENAME COLUMN "year_served" TO "year_served_id";--> statement-breakpoint
ALTER TABLE `person_profile_cfw_fam_program_details` ADD `fam_member_first_name` text;--> statement-breakpoint
ALTER TABLE `person_profile_cfw_fam_program_details` ADD `fam_member_middle_name` text;--> statement-breakpoint
ALTER TABLE `person_profile_cfw_fam_program_details` ADD `fam_member_last_name` text;--> statement-breakpoint
ALTER TABLE `person_profile_cfw_fam_program_details` ADD `fam_member_ext_name_id` text;