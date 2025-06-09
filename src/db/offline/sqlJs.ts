import initSqlJs from 'sql.js/dist/sql-wasm';
import { createUserAccessTable, createUsersTable } from './Sql/sqlSchema/users';
import { 
  createLibAncestralDomain, createLibAncestralDomainCoverage, createLibBrgy, createLibCfwCategory, 
  createLibCfwType, createLibCity, createLibCivilStatus, createLibCourse, createLibCycle, 
  createLibDeploymentArea, createLibEducationalAttainment, createLibExtensionName, createLibFundSource, 
  createLibIdCard, createLibIpGroup, createLibLguLevel, createLibLguPosition, createLibModality, 
  createLibModalitySubCategory, createLibMode, createLibOccupation, createLibPosition, createLibProvince, 
  createLibRegion, createLibRelationshipToBeneficiary, createLibSex, createLibTypeOfDisability, 
  createLibTypeOfWork, createLibVolunteerCommittee, createLibVolunteerCommitteePosition, createLibYearLevel, 
  createModulesTable, createPermissionsTable, createRolesTable 
} from './Sql/sqlSchema/libraries';

export const createDatabase = async () => {
    const SQL = await initSqlJs();
    const db = new SQL.Database();
    try {
    // Initialize SQL.js
   

    // Start a transaction to create all tables at once for better performance and atomicity
    db.run("BEGIN TRANSACTION;");

    // Run all the table creation queries in one go
    db.run(createUsersTable);
    db.run(createUserAccessTable);
    db.run(createRolesTable);
    db.run(createModulesTable);
    db.run(createPermissionsTable);
    db.run(createLibAncestralDomain);
    db.run(createLibRegion);
    db.run(createLibProvince);
    db.run(createLibCity);
    db.run(createLibBrgy);
    db.run(createLibCivilStatus);
    db.run(createLibEducationalAttainment);
    db.run(createLibFundSource);
    db.run(createLibCycle);
    db.run(createLibLguLevel);
    db.run(createLibLguPosition);
    db.run(createLibMode);
    db.run(createLibOccupation);
    db.run(createLibSex);
    db.run(createLibVolunteerCommittee);
    db.run(createLibVolunteerCommitteePosition);
    db.run(createLibAncestralDomainCoverage);
    db.run(createLibCfwCategory);
    db.run(createLibCfwType);
    db.run(createLibModality);
    db.run(createLibModalitySubCategory);
    db.run(createLibTypeOfWork);
    db.run(createLibIdCard);
    db.run(createLibRelationshipToBeneficiary);
    db.run(createLibIpGroup);
    db.run(createLibTypeOfDisability);
    db.run(createLibCourse);
    db.run(createLibYearLevel);
    db.run(createLibDeploymentArea);
    db.run(createLibExtensionName);
    db.run(createLibPosition);

    // Commit the transaction
    db.run("COMMIT;");

    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
    // Rollback in case of error
    db.run("ROLLBACK;");
  }
}

// Call the function
createDatabase().catch(console.error);
