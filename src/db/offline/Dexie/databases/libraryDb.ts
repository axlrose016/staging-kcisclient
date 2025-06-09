import Dexie, { Table } from 'dexie';
import { ILibAllotmentClass, ILibAppropriationSource, ILibAppropriationType, ILibBudgetYear, ILibComponent, ILibDivision, ILibEmploymentStatus, ILibExpense, ILibHiringProcedure, ILibLevel, ILibOffice, ILibPAP, ILibPosition } from '@/components/interfaces/library-interface';
import { _registerAuditHooks } from '@/hooks/use-audit';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';

const commonFields = 'user_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks';
const _session = await getSession() as SessionPayload;

class LibDatabase extends Dexie {
    lib_level!: Table<ILibLevel, string>;
    lib_employment_status!: Table<ILibEmploymentStatus, string>;
    lib_position!: Table<ILibPosition, string>;
    lib_budget_year!: Table<ILibBudgetYear, string>;
    lib_pap!: Table<ILibPAP, string>;
    lib_appropriation_source!: Table<ILibAppropriationSource, string>;
    lib_appropriation_type!: Table<ILibAppropriationType, string>;
    lib_allotment_class!: Table<ILibAllotmentClass, string>;
    lib_expense!: Table<ILibExpense, string>;
    lib_component!: Table<ILibComponent, string>;
    lib_office!: Table<ILibOffice, string>;
    lib_division!: Table<ILibDivision, string>;
    lib_hiring_procedure!: Table<ILibHiringProcedure, string>; // Assuming this is a placeholder for hiring procedures

    constructor() {
        super('libdb');
        this.version(1).stores({
            lib_level: `++id, level_description, ${commonFields}`,
            lib_employment_status: `++id, employment_status_description, ${commonFields}`,
            lib_position: `++id, position_description, ${commonFields}`,
            lib_budget_year: `++id, budget_year_description, ${commonFields}`,
            lib_pap: `++id, pap_description, ${commonFields}`,
            lib_appropriation_source: `++id, appropriation_source_description, ${commonFields}`,
            lib_appropriation_type: `++id, appropriation_type_description, ${commonFields}`,
            lib_allotment_class: `++id, allotment_class_description, ${commonFields}`,
            lib_expense: `++id, expense_code, expense_description, ${commonFields}`,
            lib_component: `++id, component_description, ${commonFields}`,
            lib_office: `++id, office_description, ${commonFields}`,
            lib_division: `++id, division_description, ${commonFields}`,
            lib_hiring_procedure: `++id, hiring_procedure_description, ${commonFields}`,
        })
        _registerAuditHooks(this, "Library", _session?.userData.email || "unknown");
    }
}
export const libDb = new LibDatabase();
