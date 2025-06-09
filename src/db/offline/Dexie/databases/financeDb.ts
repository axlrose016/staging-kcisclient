import Dexie, { Table } from "dexie";
import { IAllocation, IAllocationUacs, IMonthlyObligationPlan } from "../schema/finance-service";
import { _registerAuditHooks } from '@/hooks/use-audit';
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";

const commonFields = 'user_id, created_date, created_by, last_modified_date, last_modified_by, push_status_id, push_date, deleted_date, deleted_by, is_deleted, remarks';
const _session = await getSession() as SessionPayload;

class FinanceDatabase extends Dexie {
    allocation!: Table<IAllocation, string>;
    allocation_uacs!: Table<IAllocationUacs, string>;
    monthly_obligation_plan!: Table<IMonthlyObligationPlan, string>;

    constructor() {
        super('financeDb');
        this.version(1).stores({
            allocation: `id, date_allocation, region_code, pap_id, budget_year_id, appropriation_source_id, appropriation_type_id, record_status_id, allotment_manual_id, allotment_purpose,${commonFields}`,
            allocation_uacs: `id, allocation_id, allotment_class_id, component_id, expense_id, allocation_amount, allotment_amount, ${commonFields}`,
            monthly_obligation_plan: `id, allocation_uacs_id, amt_jan, amt_feb, amt_mar, amt_apr, amt_may, amt_jun, amt_jul, amt_aug, aug_sep, aug_oct, aug_nov, aug_dec, ${commonFields}`
        })
        _registerAuditHooks(this, "Finance", _session?.userData.email || "unknown");
    }
}

export const financeDb = new FinanceDatabase();
