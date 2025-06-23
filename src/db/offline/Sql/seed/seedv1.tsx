export const seedRoles = `
INSERT OR REPLACE INTO roles (id, role_description, created_by) VALUES
("d4003a01-36c6-47af-aae5-13d3f04e110f", "Administrator", "00000000-0000-0000-0000-000000000000"),
("cae2b943-9b80-45ea-af2a-823730f288ac", "Guest", "00000000-0000-0000-0000-000000000000"),
("17eb1f81-83d3-4642-843d-24ba3e40f45c", "Finance", "00000000-0000-0000-0000-000000000000"),
("1c99504f-ad53-4151-9a88-52e0cffdbb6d", "Engineer", "00000000-0000-0000-0000-000000000000"),
("37544f59-f3ba-45df-ae0b-c8fa4e4ce446", "CFW Beneficiary", "00000000-0000-0000-0000-000000000000");
("7e5d9d82-101a-4c5c-ab4e-86bd2169c348", "ODNPM", "00000000-0000-0000-0000-000000000000");
`

export const seedPermissions = `
INSERT OR REPLACE INTO permissions (id, permission_description, created_by) VALUES
("f38252b5-cc46-4cc1-8353-a49a78708739", "Can Add", "00000000-0000-0000-0000-000000000000"),
("98747f00-76e5-497d-beac-ba4255db066f", "Can Update", "00000000-0000-0000-0000-000000000000"),
("5568ea7d-6f12-4ce9-b1e9-adb256e5b057", "Can Delete", "00000000-0000-0000-0000-000000000000");
("5568ea7d-6f12-4ce9-b1e9-adb256e5b057", "Can Delete", "00000000-0000-0000-0000-000000000000");
("7e5d9d82-101a-4c5c-ab4e-86bd2169c348", "Can Delete", "00000000-0000-0000-0000-000000000000");
`

export const seedModules = `
INSERT OR REPLACE INTO modules (id, module_description, module_path, created_by) VALUES
("9bb8ab82-1439-431d-b1c4-20630259157a", "Sub-Project", "subproject", "00000000-0000-0000-0000-000000000000"),
("4e658b02-705a-43eb-a051-681d54e22e2a", "Person Profile", "personprofile", "00000000-0000-0000-0000-000000000000"),
("19a18164-3a26-4ec3-ac6d-755df1d3b980", "Finance", "finance", "00000000-0000-0000-0000-000000000000"),
("78ac69e0-19b6-40d0-8b07-135df9152bd8", "Procurement", "procurement", "00000000-0000-0000-0000-000000000000"),
("ce67be45-b5aa-4272-bcf4-a32abc9d7068", "Engineering", "engineering", "00000000-0000-0000-0000-000000000000");
`