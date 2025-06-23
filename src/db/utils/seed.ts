import { lib_cfw_category, lib_cfw_type, lib_civil_status, lib_course, lib_cycle, lib_deployment_area, lib_deployment_area_categories, lib_educational_attainment, lib_extension_name, lib_files_to_upload, lib_fund_source, lib_id_card, lib_ip_group, lib_modality, lib_modality_sub_category, lib_mode, lib_province, lib_relationship_to_beneficiary, lib_sectors, lib_sex, lib_type_of_disability, lib_type_of_work, lib_volunteer_committee, lib_volunteer_committee_position, lib_year_level, modules, permissions, roles } from "../schema/libraries";
import { upsertData } from "./offline_crud";

export async function seed(db: any) {
    try {
        const _roles = [
            {
                "id": "d4003a01-36c6-47af-aae5-13d3f04e110f",
                "role_description": "Administrator",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": "cae2b943-9b80-45ea-af2a-823730f288ac",
                "role_description": "Guest",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": "17eb1f81-83d3-4642-843d-24ba3e40f45c",
                "role_description": "Finance",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": "1c99504f-ad53-4151-9a88-52e0cffdbb6d",
                "role_description": "Engineer",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": "37544f59-f3ba-45df-ae0b-c8fa4e4ce446",
                "role_description": "CFW Beneficiary",
                "created_by": "00000000-0000-0000-0000-000000000000"
            }
        ]
        const _permissions = [
            {
                "id": "f38252b5-cc46-4cc1-8353-a49a78708739",
                "permission_description": "Can Add",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": "98747f00-76e5-497d-beac-ba4255db066f",
                "permission_description": "Can Update",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": "5568ea7d-6f12-4ce9-b1e9-adb256e5b057",
                "permission_description": "Can Delete",
                "created_by": "00000000-0000-0000-0000-000000000000"
            }
        ]
        const _modules = [
            {
            "id": "9bb8ab82-1439-431d-b1c4-20630259157a",
            "module_description": "Sub-Project",
            "module_path": "subproject",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "4e658b02-705a-43eb-a051-681d54e22e2a",
            "module_description": "Person Profile",
            "module_path": "personprofile",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "19a18164-3a26-4ec3-ac6d-755df1d3b980",
            "module_description": "Finance",
            "module_path": "finance",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "78ac69e0-19b6-40d0-8b07-135df9152bd8",
            "module_description": "Procurement",
            "module_path": "procurement",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "ce67be45-b5aa-4272-bcf4-a32abc9d7068",
            "module_description": "Engineering",
            "module_path": "engineering",
            "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
            "id": "866e6bcb-041f-4d58-94bf-6c54e4855f85",
            "module_description": "Settings",
            "module_path": "settings",
            "created_by": "00000000-0000-0000-0000-000000000000"
            }
        ];

        const _modalities = [
            { "id": 1, "modality_name": "KC1", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 2, "modality_name": "PAMANA (2016 and earlier)", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 3, "modality_name": "MCC", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 4, "modality_name": "AF (Old)", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 5, "modality_name": "AUSAid", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 6, "modality_name": "PODER", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 7, "modality_name": "NCDDP", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 8, "modality_name": "BUB", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 9, "modality_name": "JFPR", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 10, "modality_name": "DFAT", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 11, "modality_name": "GIG", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 12, "modality_name": "CCL", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 13, "modality_name": "GOP", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 14, "modality_name": "L&E", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 15, "modality_name": "IP-CDD", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 16, "modality_name": "MAKILAHOK", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 17, "modality_name": "KKB", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 18, "modality_name": "KSB", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 19, "modality_name": "PAMANA (2020 onwards)", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 20, "modality_name": "KKB 2020", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 21, "modality_name": "NCDDP-AF", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 0 },
            { "id": 22, "modality_name": "PMNP", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 1 },
            { "id": 23, "modality_name": "KKB-CDD", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 1 },
            { "id": 24, "modality_name": "PAG-ABOT", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 1 },
            { "id": 25, "modality_name": "CFW", "created_by": "00000000-0000-0000-0000-000000000000", "is_active": 1 },
        ];

        const _sex = [
            { "id": 1, "sex_description": "Female", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "sex_description": "Male", "created_by": "00000000-0000-0000-0000-000000000000" },
        ];
        const _civil_status = [
            { "id": 1, "civil_status_description": "Annulled", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "civil_status_description": "Legally Separated", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "civil_status_description": "Married", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "civil_status_description": "Single", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 5, "civil_status_description": "Widowed", "created_by": "00000000-0000-0000-0000-000000000000" }
        ];
        const _extension_name = [
            { "id": 1, "extension_name": "Jr.", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "extension_name": "Sr.", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "extension_name": "II", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "extension_name": "III", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 5, "extension_name": "IV", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 6, "extension_name": "N/A", "created_by": "00000000-0000-0000-0000-000000000000" }

        ];
        // CFW FOR COLLEGE GRADUATES AND STUDENTS
        // CFW FOR ECONOMICALLY VULNERABLE COMMUNITIES AND SECTORS														
        const _cfw_cat = [
            { "id": 1, "category_name": "CFW FOR COLLEGE GRADUATES AND STUDENTS", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "category_name": "CFW FOR ECONOMICALLY VULNERABLE COMMUNITIES AND SECTORS", "created_by": "00000000-0000-0000-0000-000000000000" },
        ];

        const _id_card = [
            { "id": 1, "id_card_name": "National ID", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "id_card_name": "Passport", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "id_card_name": "Driver's License", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "id_card_name": "SSS ID", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 5, "id_card_name": "GSIS ID", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 6, "id_card_name": "PRC ID", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 7, "id_card_name": "PhilHealth ID", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 8, "id_card_name": "Voter’s ID", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 9, "id_card_name": "Senior Citizen ID", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 10, "id_card_name": "PWD ID", "created_by": "00000000-0000-0000-0000-000000000000" }
        ];



        const _educational_attainment = [
            { "id": 1, "educational_attainment_description": "College Graduate", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "educational_attainment_description": "College Level", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "educational_attainment_description": "Doctorate Level", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "educational_attainment_description": "Elementary Graduate", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 5, "educational_attainment_description": "Elementary Level", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 6, "educational_attainment_description": "Highschool Graduate", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 7, "educational_attainment_description": "Highschool Level", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 8, "educational_attainment_description": "Master Degree Graduate", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 9, "educational_attainment_description": "No Formal Education", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 10, "educational_attainment_description": "With Units in Masteral Degree", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 11, "educational_attainment_description": "Vocational", "created_by": "00000000-0000-0000-0000-000000000000" },
        ];

        const _relationship_to_beneficiary = [
            { "id": 1, "relationship_name": "Father", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "relationship_name": "Mother", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "relationship_name": "Son", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "relationship_name": "Daughter", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 5, "relationship_name": "Spouse", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 6, "relationship_name": "Sibling", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 7, "relationship_name": "Grandfather", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 8, "relationship_name": "Grandmother", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 9, "relationship_name": "Uncle", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 10, "relationship_name": "Aunt", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 11, "relationship_name": "Cousin", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 12, "relationship_name": "Nephew", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 13, "relationship_name": "Niece", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 14, "relationship_name": "Guardian", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 15, "relationship_name": "Friend", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 16, "relationship_name": "Others", "created_by": "00000000-0000-0000-0000-000000000000" }
        ];

        const _type_of_disability = [
            { "id": 1, "disability_name": "Visual Impairment", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "disability_name": "Hearing Impairment", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "disability_name": "Speech Impairment", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "disability_name": "Physical Disability", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 5, "disability_name": "Intellectual Disability", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 6, "disability_name": "Psychosocial Disability", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 7, "disability_name": "Autism Spectrum Disorder", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 8, "disability_name": "Multiple Disabilities", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 9, "disability_name": "Chronic Illness-related Disability", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 10, "disability_name": "Mental Disability", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 11, "disability_name": "Learning Disability", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 12, "disability_name": "Rare Disease", "created_by": "00000000-0000-0000-0000-000000000000" },

        ];

        const _fund_source = [
            { "id": 1, "fund_source_description": "KC1", "is_active": 0, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "fund_source_description": "PAMANA (2016 and earlier)", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "fund_source_description": "MCC", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "fund_source_description": "AF (Old)", "is_active": 0, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 5, "fund_source_description": "AUSAid", "is_active": 0, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 6, "fund_source_description": "PODER", "is_active": 0, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 7, "fund_source_description": "NCDDP", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 8, "fund_source_description": "BUB", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 9, "fund_source_description": "JFPR", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 10, "fund_source_description": "DFAT", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 11, "fund_source_description": "GIG", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 12, "fund_source_description": "CCL", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 13, "fund_source_description": "GOP", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 14, "fund_source_description": "L&E", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 15, "fund_source_description": "IP-CDD", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 16, "fund_source_description": "Makilahok", "is_active": 0, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 17, "fund_source_description": "KKB", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 18, "fund_source_description": "KSB", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 19, "fund_source_description": "PAMANA (2020 onwards)", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 20, "fund_source_description": "KKB 2020", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 21, "fund_source_description": "NCDDP-AF", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 22, "fund_source_description": "PMNP", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 23, "fund_source_description": "KKB-CDD", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 24, "fund_source_description": "PAG-ABOT", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" }
        ];

        const _cycle = [
            { "id": 1, "cycle_description": "M1", "fund_source_id": 4, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "cycle_description": "G1", "fund_source_id": 4, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "cycle_description": "H1", "fund_source_id": 4, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "cycle_description": "F2", "fund_source_id": 4, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 5, "cycle_description": "G2", "fund_source_id": 4, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 6, "cycle_description": "R1", "fund_source_id": 4, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 7, "cycle_description": "S1", "fund_source_id": 4, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 8, "cycle_description": "F3", "fund_source_id": 4, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 9, "cycle_description": "X1", "fund_source_id": 4, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 10, "cycle_description": "G3", "fund_source_id": 4, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 11, "cycle_description": "PMN2", "fund_source_id": 2, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 12, "cycle_description": "PMN3", "fund_source_id": 2, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 13, "cycle_description": "PMN2&3", "fund_source_id": 2, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 14, "cycle_description": "PMN4", "fund_source_id": 2, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 15, "cycle_description": "PMN3&4", "fund_source_id": 2, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 16, "cycle_description": "T2", "fund_source_id": 3, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 17, "cycle_description": "T1", "fund_source_id": 3, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 18, "cycle_description": "T3", "fund_source_id": 3, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 19, "cycle_description": "J1", "fund_source_id": 3, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 20, "cycle_description": "L1", "fund_source_id": 3, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 21, "cycle_description": "L2", "fund_source_id": 3, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 22, "cycle_description": "S2", "fund_source_id": 3, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 23, "cycle_description": "K1", "fund_source_id": 3, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 24, "cycle_description": "K2", "fund_source_id": 3, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 25, "cycle_description": "K3", "fund_source_id": 3, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 26, "cycle_description": "F1", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 27, "cycle_description": "F1MT", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 28, "cycle_description": "A1", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 29, "cycle_description": "A2", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 30, "cycle_description": "A3", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 31, "cycle_description": "B1", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 32, "cycle_description": "B2", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 33, "cycle_description": "B3", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 34, "cycle_description": "DA1", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 35, "cycle_description": "DA2", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 36, "cycle_description": "DA3", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 37, "cycle_description": "DB1", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 38, "cycle_description": "DB2", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 39, "cycle_description": "DB3", "fund_source_id": 1, "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" }
        ];

        const _mode = [
            { "id": 1, "mode_description": "CDD-LPP", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "mode_description": "DROM", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "mode_description": "Regular", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "mode_description": "DROM 2020", "created_by": "00000000-0000-0000-0000-000000000000" }
        ];

        const _volunteer_committee = [
            { "id": 1, "name": "AIT", "description": "Audit and Inventory Team", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "name": "BAC", "description": "Bids and Awards Committee", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "name": "BGD", "description": "Brgy. Gender and Development", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "name": "BRT", "description": "Barangay Representation Team", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 5, "name": "CMT", "description": "Community Monitoring Team", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 6, "name": "GRS", "description": "Grievance Redress System", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 7, "name": "MIT", "description": "Monitoring Inspection Team", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 8, "name": "O&M", "description": "Operation and Maintenance", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 9, "name": "PIT", "description": "Project Implementation Team", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 10, "name": "PPT", "description": "Project Preparation Team", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 11, "name": "PSA", "description": "Participatory Situational Analysis", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 12, "name": "PT", "description": "Procurement Team", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 13, "name": "SEC", "description": "BSPMC Secretary", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 14, "name": "BKR", "description": "Bookkeeper", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 15, "name": "TRE", "description": "Treasurer", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 16, "name": "STR", "description": "Storekeeper", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 17, "name": "BSPMCCH", "description": "BSPMC Chair", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 18, "name": "BSPMCACH", "description": "Assistant BSPMC Chair", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 19, "name": "ESST", "description": "Envi Social Safeguard Team", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 20, "name": "CSPMC", "description": "Community Sub-Project Mgnt Com", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 21, "name": "CRT", "description": "", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 22, "name": "BDC-TWG", "description": "Barangay Development Council - Technical Working Group", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 23, "name": "ASSTBKR", "description": "Assistant Bookkeeper", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 24, "name": "CNSPMC", "description": "Community Nutrition Sub-Project Management Committee", "created_by": "00000000-0000-0000-0000-000000000000" }
        ];

        const _volunteer_committee_position = [
            { "id": 1, "name": "Member", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "name": "Chair", "is_active": 1, "created_by": "00000000-0000-0000-0000-000000000000" }
        ];
        const _cfw_type = [
            { "id": 1, "cfw_type_name": "DRMB - FarmAralan", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "cfw_type_name": "DRMB - LAWA (Local Adaption to Water Access)", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "cfw_type_name": "DRMB - BINHI (Breaking Insufficiency through Nutritious Harvest for the Impoverished)", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "cfw_type_name": "STB - Tara Basa Tutoring Program", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 5, "cfw_type_name": "KC - Cash-for-Work Program for College Graduates and Students", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 6, "cfw_type_name": "KC - Cash-for-Work Program for Econolically Poor and Vulnerable Communities/ Sectors", "created_by": "00000000-0000-0000-0000-000000000000" },

        ];


        const _year_level = [
            { "id": 1, "year_level_name": "First Year", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "year_level_name": "Second Year", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "year_level_name": "Third Year", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "year_level_name": "Fourth Year", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 5, "year_level_name": "Fifth Year", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 6, "year_level_name": "More than Fifth Year", "created_by": "00000000-0000-0000-0000-000000000000" },
        ];

        const _courses = [
            {
                "id": 1,
                "course_code": "BSIT",
                "course_name": "Bachelor of Science in Information Technology",
                "course_description": "A program focused on the study of computer systems, software development, and network administration.",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": 2,
                "course_code": "BSTM",
                "course_name": "Bachelor of Science in Tourism Management",
                "course_description": "A program designed to prepare students for careers in the tourism industry, including hospitality, travel services, and event management.",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": 3,
                "course_code": "BSBA",
                "course_name": "Bachelor of Science in Business Administration",
                "course_description": "Focuses on business management, marketing, finance, and entrepreneurship.",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": 4,
                "course_code": "BSN",
                "course_name": "Bachelor of Science in Nursing",
                "course_description": "A program that trains students to become professional nurses with a focus on healthcare and patient care.",
                "created_by": "00000000-0000-0000-0000-000000000000"
            }
        ];
        const _deployment_area = [
            {
                "id": 1,
                "deployment_name": "Metro Manila",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": 2,
                "deployment_name": "Central Visayas",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": 3,
                "deployment_name": "Northern Mindanao",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": 4,
                "deployment_name": "CALABARZON",
                "created_by": "00000000-0000-0000-0000-000000000000"
            }
        ];
        const _deployment_area_categories = [
            {
                "id": 1,
                "category_name": "Company/ LGU",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
        ]
        const _type_of_work = [
            {
                "id": 1,
                "work_name": "Office Work",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": 2,
                "work_name": "Field Work",
                "created_by": "00000000-0000-0000-0000-000000000000"
            },
            {
                "id": 3,
                "work_name": "Clerical Work",
                "created_by": "00000000-0000-0000-0000-000000000000"
            }
        ];

        const _province = [
            { "province_code": "012800000", "province_name": "ILOCOS NORTE", "region_code": "010000000", "archive": 0, "latitude": 18.1997, "longitude": 120.7307, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "012900000", "province_name": "ILOCOS SUR", "region_code": "010000000", "archive": 0, "latitude": 17.2212, "longitude": 120.5516, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "013300000", "province_name": "LA UNION", "region_code": "010000000", "archive": 0, "latitude": 16.5810, "longitude": 120.4277, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "015500000", "province_name": "PANGASINAN", "region_code": "010000000", "archive": 0, "latitude": 16.0003, "longitude": 120.3116, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },

            { "province_code": "020900000", "province_name": "BATANES", "region_code": "020000000", "archive": 0, "latitude": 20.5498, "longitude": 121.8875, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "021500000", "province_name": "CAGAYAN", "region_code": "020000000", "archive": 0, "latitude": 18.0995, "longitude": 121.7630, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "023100000", "province_name": "ISABELA", "region_code": "020000000", "archive": 0, "latitude": 16.9842, "longitude": 121.9609, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "025000000", "province_name": "NUEVA VIZCAYA", "region_code": "020000000", "archive": 0, "latitude": 16.3117, "longitude": 121.1511, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "025700000", "province_name": "QUIRINO", "region_code": "020000000", "archive": 0, "latitude": 16.2921, "longitude": 121.5888, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },


            { "province_code": "030800000", "province_name": "BATAAN", "region_code": "030000000", "archive": 0, "latitude": 14.6760, "longitude": 120.5364, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "031400000", "province_name": "BULACAN", "region_code": "030000000", "archive": 0, "latitude": 14.7959, "longitude": 120.8789, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "034900000", "province_name": "NUEVA ECIJA", "region_code": "030000000", "archive": 0, "latitude": 15.6848, "longitude": 121.1027, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "035400000", "province_name": "PAMPANGA", "region_code": "030000000", "archive": 0, "latitude": 15.0794, "longitude": 120.6199, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "036900000", "province_name": "TARLAC", "region_code": "030000000", "archive": 0, "latitude": 15.4883, "longitude": 120.5887, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "037100000", "province_name": "ZAMBALES", "region_code": "030000000", "archive": 0, "latitude": 15.3334, "longitude": 120.2194, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "037700000", "province_name": "AURORA", "region_code": "030000000", "archive": 0, "latitude": 15.7572, "longitude": 121.5588, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },


            { "province_code": "041000000", "province_name": "BATANGAS", "region_code": "040000000", "archive": 0, "latitude": 13.7594, "longitude": 121.1193, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "042100000", "province_name": "CAVITE", "region_code": "040000000", "archive": 0, "latitude": 14.2710, "longitude": 120.8879, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "043400000", "province_name": "LAGUNA", "region_code": "040000000", "archive": 0, "latitude": 14.1750, "longitude": 121.3297, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "045600000", "province_name": "QUEZON", "region_code": "040000000", "archive": 0, "latitude": 13.9312, "longitude": 121.6176, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "045800000", "province_name": "RIZAL", "region_code": "040000000", "archive": 0, "latitude": 14.5994, "longitude": 121.2127, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },

            { "province_code": "175100000", "province_name": "MARINDUQUE", "region_code": "170000000", "archive": 0, "latitude": 13.3772, "longitude": 121.9797, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "175200000", "province_name": "OCCIDENTAL MINDORO", "region_code": "170000000", "archive": 0, "latitude": 12.9312, "longitude": 120.5930, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "175300000", "province_name": "ORIENTAL MINDORO", "region_code": "170000000", "archive": 0, "latitude": 13.2047, "longitude": 121.4368, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "175900000", "province_name": "PALAWAN", "region_code": "170000000", "archive": 0, "latitude": 9.8432, "longitude": 118.7384, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "175900000", "province_name": "ROMBLON", "region_code": "170000000", "archive": 0, "latitude": 12.5736, "longitude": 122.2877, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },

            { "province_code": "050500000", "province_name": "ALBAY", "region_code": "050000000", "archive": 0, "latitude": 13.1722, "longitude": 123.7557, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "051600000", "province_name": "CAMARINES NORTE", "region_code": "050000000", "archive": 0, "latitude": 14.0255, "longitude": 122.7931, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "051700000", "province_name": "CAMARINES SUR", "region_code": "050000000", "archive": 0, "latitude": 13.6218, "longitude": 123.3972, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "052000000", "province_name": "CATANDUANES", "region_code": "050000000", "archive": 0, "latitude": 13.6089, "longitude": 124.2384, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "054100000", "province_name": "MASBATE", "region_code": "050000000", "archive": 0, "latitude": 12.3712, "longitude": 123.5799, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "056200000", "province_name": "SORSOGON", "region_code": "050000000", "archive": 0, "latitude": 12.9731, "longitude": 124.0170, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },


            { "province_code": "060400000", "province_name": "AKLAN", "region_code": "060000000", "archive": 0, "latitude": 11.7167, "longitude": 122.3500, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "060600000", "province_name": "ANTIQUE", "region_code": "060000000", "archive": 0, "latitude": 11.0646, "longitude": 122.0942, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "061900000", "province_name": "CAPIZ", "region_code": "060000000", "archive": 0, "latitude": 11.5008, "longitude": 122.7503, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "063000000", "province_name": "ILOILO", "region_code": "060000000", "archive": 0, "latitude": 10.7202, "longitude": 122.5621, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "064500000", "province_name": "NEGROS OCCIDENTAL", "region_code": "060000000", "archive": 0, "latitude": 10.2667, "longitude": 123.0000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "067900000", "province_name": "GUIMARAS", "region_code": "060000000", "archive": 0, "latitude": 10.5993, "longitude": 122.5365, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },

            { "province_code": "071200000", "province_name": "BOHOL", "region_code": "070000000", "archive": 0, "latitude": 9.8333, "longitude": 124.1667, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "072200000", "province_name": "CEBU", "region_code": "070000000", "archive": 0, "latitude": 10.3167, "longitude": 123.9000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "074600000", "province_name": "NEGROS ORIENTAL", "region_code": "070000000", "archive": 0, "latitude": 9.4167, "longitude": 123.3000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "076100000", "province_name": "SIQUIJOR", "region_code": "070000000", "archive": 0, "latitude": 9.2167, "longitude": 123.5167, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },


            { "province_code": "082600000", "province_name": "EASTERN SAMAR", "region_code": "080000000", "archive": 0, "latitude": 11.5000, "longitude": 125.5000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "083700000", "province_name": "LEYTE", "region_code": "080000000", "archive": 0, "latitude": 11.1667, "longitude": 124.9667, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "084800000", "province_name": "NORTHERN SAMAR", "region_code": "080000000", "archive": 0, "latitude": 12.5000, "longitude": 124.5000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "086000000", "province_name": "SOUTHERN LEYTE", "region_code": "080000000", "archive": 0, "latitude": 10.3333, "longitude": 125.0000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "086400000", "province_name": "SAMAR (WESTERN SAMAR)", "region_code": "080000000", "archive": 0, "latitude": 12.0000, "longitude": 125.0000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "087800000", "province_name": "BILIRAN", "region_code": "080000000", "archive": 0, "latitude": 11.5167, "longitude": 124.5000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },


            { "province_code": "097200000", "province_name": "ZAMBOANGA DEL NORTE", "region_code": "090000000", "archive": 0, "latitude": 8.5000, "longitude": 123.5000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "097300000", "province_name": "ZAMBOANGA DEL SUR", "region_code": "090000000", "archive": 0, "latitude": 7.8333, "longitude": 123.2500, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "098300000", "province_name": "ZAMBOANGA SIBUGAY", "region_code": "090000000", "archive": 0, "latitude": 7.6667, "longitude": 122.5000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },

            { "province_code": "101300000", "province_name": "BUKIDNON", "region_code": "100000000", "archive": 0, "latitude": 8.0000, "longitude": 125.0000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "101800000", "province_name": "CAMIGUIN", "region_code": "100000000", "archive": 0, "latitude": 9.0000, "longitude": 124.7167, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "103500000", "province_name": "LANAO DEL NORTE", "region_code": "100000000", "archive": 0, "latitude": 8.1667, "longitude": 124.1667, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "104200000", "province_name": "MISAMIS OCCIDENTAL", "region_code": "100000000", "archive": 0, "latitude": 8.2500, "longitude": 123.8333, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "104300000", "province_name": "MISAMIS ORIENTAL", "region_code": "100000000", "archive": 0, "latitude": 8.5000, "longitude": 124.6500, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },

            { "province_code": "112300000", "province_name": "DAVAO DE ORO", "region_code": "110000000", "archive": 0, "latitude": 7.5833, "longitude": 126.0000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "112400000", "province_name": "DAVAO DEL NORTE", "region_code": "110000000", "archive": 0, "latitude": 7.5000, "longitude": 125.7000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "112500000", "province_name": "DAVAO DEL SUR", "region_code": "110000000", "archive": 0, "latitude": 6.7500, "longitude": 125.3500, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "118200000", "province_name": "DAVAO OCCIDENTAL", "region_code": "110000000", "archive": 0, "latitude": 6.4667, "longitude": 125.6000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "118600000", "province_name": "DAVAO ORIENTAL", "region_code": "110000000", "archive": 0, "latitude": 7.0000, "longitude": 126.5000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },


            { "province_code": "124700000", "province_name": "COTABATO", "region_code": "120000000", "archive": 0, "latitude": 7.1167, "longitude": 124.8333, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "126300000", "province_name": "SARANGANI", "region_code": "120000000", "archive": 0, "latitude": 6.1667, "longitude": 125.2833, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "126500000", "province_name": "SOUTH COTABATO", "region_code": "120000000", "archive": 0, "latitude": 6.2500, "longitude": 124.8833, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "128000000", "province_name": "SULTAN KUDARAT", "region_code": "120000000", "archive": 0, "latitude": 6.6167, "longitude": 124.2167, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },


            { "province_code": "133900000", "province_name": "AGUSAN DEL NORTE", "region_code": "130000000", "archive": 0, "latitude": 9.0000, "longitude": 125.5333, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "134000000", "province_name": "AGUSAN DEL SUR", "region_code": "130000000", "archive": 0, "latitude": 8.5000, "longitude": 125.7500, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "136800000", "province_name": "DINAGAT ISLANDS", "region_code": "130000000", "archive": 0, "latitude": 10.1500, "longitude": 125.6167, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "148100000", "province_name": "SURIGAO DEL NORTE", "region_code": "130000000", "archive": 0, "latitude": 9.5000, "longitude": 125.6000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "148200000", "province_name": "SURIGAO DEL SUR", "region_code": "130000000", "archive": 0, "latitude": 8.8333, "longitude": 126.1333, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },

            { "province_code": "150700000", "province_name": "BASILAN", "region_code": "150000000", "archive": 0, "latitude": 6.5500, "longitude": 122.0833, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "153600000", "province_name": "LANAO DEL SUR", "region_code": "150000000", "archive": 0, "latitude": 7.9167, "longitude": 124.2833, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "153800000", "province_name": "MAGUINDANAO", "region_code": "150000000", "archive": 0, "latitude": 7.2000, "longitude": 124.4167, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "156600000", "province_name": "SULU", "region_code": "150000000", "archive": 0, "latitude": 6.0500, "longitude": 121.0000, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "province_code": "157000000", "province_name": "TAWI-TAWI", "region_code": "150000000", "archive": 0, "latitude": 5.1333, "longitude": 120.0667, "psgc": "0", "created_by": "00000000-0000-0000-0000-000000000000" },


        ];

        // modalityid 25 is CFW, 22 is pmnp
        const _modality_sub_category = [
            { "id": 1, "modality_id": 25, "modality_sub_category_name": "CFW - HEI", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "modality_id": 25, "modality_sub_category_name": "CFW - PWD", "created_by": "00000000-0000-0000-0000-000000000000" },
        ];
        const _sectors = [
            { id: 1, sector_name: "Women", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 2, sector_name: "Out of School Youth (OSY)", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 3, sector_name: "Persons with Disabilities (PWD)", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 4, sector_name: "Indigenous People (IP)", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 5, sector_name: "Family Heads in Need of Assistance", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 6, sector_name: "Senior Citizen", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 7, sector_name: "Solo Parent", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 8, sector_name: "4Ps Beneficiary", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 9, sector_name: "Children and Youth in Need of Special Protection", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 10, sector_name: "Youth", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 11, sector_name: "Pregnant Women", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 12, sector_name: "Farmer", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 13, sector_name: "Fisherfolk", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 14, sector_name: "Urban Poor", created_by: "00000000-0000-0000-0000-000000000000" },
            { id: 15, sector_name: "Laborers", created_by: "00000000-0000-0000-0000-000000000000" },
        ];

        const _files_to_upload = [
            { "id": 1, "file_name": "Primary Valid ID", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "file_name": "Secondary ID", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "file_name": "PWD ID", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "file_name": "School ID", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 5, "file_name": "School ID", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 6, "file_name": "Valid ID of Representative", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 7, "file_name": "TOR/Diploma or any proof of graduation for graduates and Certificate of Enrolment for students", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 8, "file_name": "Certificate of Indigency", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 9, "file_name": "Certificate of Eligibility/ Certificate of Indigency", "created_by": "00000000-0000-0000-0000-000000000000" },          
            { "id": 10, "file_name": "Certificate of Eligibility/ Certificate of Indigency", "created_by": "00000000-0000-0000-0000-000000000000" },          
            { "id": 11, "file_name": "Display Picture", "created_by": "00000000-0000-0000-0000-000000000000" },          
            
        ];

        const _ip_groups = [
            { "id": 1, "ip_group_name": "Aeta", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 2, "ip_group_name": "Igorot", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 3, "ip_group_name": "Mangyan", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 4, "ip_group_name": "Lumad", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 5, "ip_group_name": "Badjao", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 6, "ip_group_name": "T'boli", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 7, "ip_group_name": "Maranao", "created_by": "00000000-0000-0000-0000-000000000000" },
            { "id": 8, "ip_group_name": "Ifugao", "created_by": "00000000-0000-0000-0000-000000000000" }
        ];
        

        const result = await db.transaction(async (trx: any) => {
            await upsertData(trx, roles, _roles);
            await upsertData(trx, permissions, _permissions);
            await upsertData(trx, modules, _modules);
            await upsertData(trx, lib_modality, _modalities);
            await upsertData(trx, lib_sex, _sex);
            await upsertData(trx, lib_civil_status, _civil_status);
            await upsertData(trx, lib_extension_name, _extension_name);
            await upsertData(trx, lib_cfw_category, _cfw_cat);
            await upsertData(trx, lib_educational_attainment, _educational_attainment);
            await upsertData(trx, lib_id_card, _id_card);
            await upsertData(trx, lib_relationship_to_beneficiary, _relationship_to_beneficiary);
            await upsertData(trx, lib_type_of_disability, _type_of_disability);
            await upsertData(trx, lib_fund_source, _fund_source);
            await upsertData(trx, lib_cycle, _cycle);
            await upsertData(trx, lib_mode, _mode);
            await upsertData(trx, lib_volunteer_committee, _volunteer_committee);
            await upsertData(trx, lib_volunteer_committee_position, _volunteer_committee_position);
            await upsertData(trx, lib_cfw_type, _cfw_type);
            await upsertData(trx, lib_year_level, _year_level);
            await upsertData(trx, lib_course, _courses);
            await upsertData(trx, lib_deployment_area, _deployment_area);
            await upsertData(trx, lib_type_of_work, _type_of_work);
            await upsertData(trx, lib_modality_sub_category, _modality_sub_category);
            await upsertData(trx, lib_sectors, _sectors);
            await upsertData(trx, lib_files_to_upload, _files_to_upload);
            await upsertData(trx, lib_ip_group, _ip_groups);
            await upsertData(trx, lib_deployment_area_categories, _deployment_area_categories);
            // await upsertData(trx, lib_province, _province);

        })
        return { success: true, message: "Library successfully updated!", result };
    }
    catch (error) {
        console.error("Failed to seed library:", error);
        return { success: false, message: "Failed to seed library.", error: error };
    }
}
