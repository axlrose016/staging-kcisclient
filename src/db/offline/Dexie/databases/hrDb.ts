import Dexie, { Table } from 'dexie';
import { IApplicant, IHiringProcedure, IPositionItem, IPositionItemDistribution } from "../schema/hr-service";
import { _registerAuditHooks } from '@/hooks/use-audit';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';

const commonFields = 'user_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks';
const _session = await getSession() as SessionPayload;

class HRDatabase extends Dexie {
    position_item!: Table<IPositionItem, string>;
    position_item_distribution!: Table<IPositionItemDistribution, string>;
    hiring_procedure!: Table<IHiringProcedure, string>;
    applicant!: Table<IApplicant, string>;

    constructor() {
        super('hrdb');
        this.version(1).stores({
            position_item: `id, item_code, position_id, salary_grade_id, employment_status_id, modality_id, date_abolished, ${commonFields}`,
            position_item_distribution: `id, position_item_id, level_id, region_code, province_code, city_code, office_id, division_id, parenthetical_title, date_distributed, ${commonFields}`,
            hiring_procedure: `id, hiring_procedure_id, position_item_distribution_id, date_target_from, date_target_to, date_actual_from, date_actual_to, reason_for_variance, ${commonFields}`,
            applicant: `id,position_item_id, position_item_distribution_id, first_name, middle_name, last_name, extension_name_id, display_picture, sex_id, civil_status_id, birthdate, age, philsys_id_no, birthplace, status_id, overall_rating, ${commonFields}`
        })
        _registerAuditHooks(this, "HR", _session?.userData.email || "unknown");
    }
}
export const hrDb = new HRDatabase();
