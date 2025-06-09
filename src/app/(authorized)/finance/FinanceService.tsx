import { useAlert } from "@/components/general/use-alert";
import { financeDb } from "@/db/offline/Dexie/databases/financeDb";
import { libDb } from "@/db/offline/Dexie/databases/libraryDb";
import { IAllocation, IAllocationUacs, IMonthlyObligationPlan } from "@/db/offline/Dexie/schema/finance-service";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import { v4 as uuidv4 } from 'uuid';

const _session = await getSession() as SessionPayload;

export class FinanceService {
    
    async getOfflineAllocationById(id: any): Promise<IAllocation | undefined> {
      try {
        const result = await financeDb.transaction('r', [financeDb.allocation], async () => {
          const allocation = await financeDb.allocation.where('id').equals(id).first();
          if (allocation) {
            return allocation;
          } else {
            console.log('No record found with the given ID.');
            return undefined;
          }
        });
        return result;
      } catch (error) {
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async getOfflineAllocationUacsById(id: any): Promise<IAllocationUacs | undefined>{
        try{
            const result = await financeDb.transaction('r', [financeDb.allocation_uacs], async () => {
                const uacs = await financeDb.allocation_uacs.where('id').equals(id).first();
                if(uacs){
                    return uacs;
                }else {
                    console.log('No record found with the given ID.');
                    return undefined;
                }
            });
            return result;
        }catch(error) {
            console.error('Fetch Record Failed: ', error)
            return undefined;
        }
    }
    async getOfflineAllocationUacsByAllotmentId(id: any): Promise<IAllocationUacs[]>{
       try {
            const allotmentList = await libDb.lib_allotment_class.toArray();
            const allotmentMap = new Map(allotmentList.map(a => [a.id, a.allotment_class_description || ""]));
            
            const expenseList = await libDb.lib_expense.toArray();
            const expenseMap = new Map(expenseList.map(e => [e.id, e.expense_description + " - " + e.expense_code || ""]));

            const uacs = await financeDb.transaction('r', financeDb.allocation_uacs, async () => {
                return await financeDb.allocation_uacs.where('allocation_id').equals(id).toArray();
            });

            const result = uacs.map(ua => ({
                ...ua,
                component: ua.component_id,
                allotment_description: allotmentMap.get(ua.allotment_class_id) ?? "",
                expense_description: expenseMap.get(ua.expense_id) ?? "",
                m_allocation_amount: new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(ua.allocation_amount),
            }));

            return result;
        } catch (error) {
        console.error('Fetch Record Failed: ', error);
            return [];
        }
    }
    async getOfflineAllocations(): Promise<IAllocation[]> {
    try {
        const papList = await libDb.lib_pap.filter(f => f.is_deleted !== true).toArray();
        const papMap = new Map(papList.map(p => [p.id, p.pap_description || ""]));

        const budgetYearList = await libDb.lib_budget_year.filter(f => f.is_deleted !== true).toArray();
        const budgetYearMap = new Map(budgetYearList.map(b => [b.id, b.budget_year_description || ""]));

        const appropriationSourceList = await libDb.lib_appropriation_source.filter(f => f.is_deleted !== true).toArray();
        const appropriationSourceMap = new Map(appropriationSourceList.map(a => [a.id, a.appropriation_source_description || ""]));

        const appropriationTypeList = await libDb.lib_appropriation_type.filter(f => f.is_deleted !== true).toArray();
        const appropriationTypeMap = new Map(appropriationTypeList.map(a => [a.id, a.appropriation_type_description || ""]));

        const expenseList = await libDb.lib_expense.filter(f => f.is_deleted !== true).toArray();
        const expenseMap = new Map(expenseList.map(e => [e.id, e.expense_description || ""]));

        const allocationsWithComponents = await financeDb.transaction(
        'r',
        [financeDb.allocation, financeDb.allocation_uacs],
        async () => {
            const allocations = await financeDb.allocation.filter(f => f.is_deleted !== true).toArray();
            const allocationUacs = await financeDb.allocation_uacs.filter(f => f.is_deleted !== true).toArray();

            // Left join: for each allocation, include all matching UACS rows (or a single row with null UACS)
            const result: any[] = [];

            for (const allocation of allocations) {
            const matchingUacs = allocationUacs.filter(u => u.allocation_id === allocation.id);

            if (matchingUacs.length > 0) {
                for (const uacs of matchingUacs) {
                result.push({
                    ...allocation,
                    expense_id: uacs.expense_id,
                    allocation_amount: new Intl.NumberFormat('en-PH', {
                        style: 'currency',
                        currency: 'PHP',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(uacs.allocation_amount),
                    uacs_id: uacs.id
                });
                }
                } else {
                    result.push({
                    ...allocation,
                    });
                }
            }

            return result;
        }
        );

        return allocationsWithComponents.map(alloc => ({
        ...alloc,
        pap_description: papMap.get(alloc.pap_id) ?? "",
        budget_year_description: budgetYearMap.get(alloc.budget_year_id) ?? "",
        appropriation_source_description: appropriationSourceMap.get(alloc.appropriation_source_id) ?? "",
        appropriation_type_description: appropriationTypeMap.get(alloc.appropriation_type_id) ?? "",
        expense_description: expenseMap.get(alloc.expense_id)
        }));
    } catch (error) {
        console.error('Fetch Records Failed:', error);
        return [];
    }
    }
    async saveOfflineAllocation(allocation:any):Promise<any | undefined>{
        try{
            let savedItem: IAllocation | undefined;

            await financeDb.transaction('rw', [financeDb.allocation], async trans => {
                trans.meta = {
                    needsAudit: true,
                };

                let data: IAllocation = allocation;
                debugger;
                if(allocation.id === ""){
                    data = {
                        ...allocation,
                        id:uuidv4(),
                        created_date: new Date().toISOString(),
                        created_by: _session.userData.email,
                        push_status_id: 2,
                        remarks: "Record Created by " + _session.userData.email,
                        };
                    } else {
                        const existing = await financeDb.allocation.get(allocation.id);
                        if (!existing) {
                            throw new Error("Record not found for update.");
                        }
                        data = {
                        ...existing,
                        ...allocation,
                        last_modified_date: new Date().toISOString(),
                        last_modified_by: _session.userData.email,
                        push_status_id: 2,
                        remarks: "Record Updated by " + _session.userData.email,
                    };
                }

                await financeDb.allocation.put(data);
                savedItem = data;
            });

            return savedItem;
        }catch(error){
            console.error('Transaction failed: ', error);
            return undefined;
        }
    }
    async checkDuplicateAllocation(allocation:any):Promise<any | undefined>{
        const data = await financeDb.allocation
        .where("date_allocation")
        .equals(allocation.date_allocation)
        .and(item => item.budget_year_id === allocation.budget_year_id && item.region_code === allocation.region_code && item.pap_id === allocation.pap_id 
            && item.appropriation_source_id === allocation.appropriation_source_id && item.appropriation_type_id === allocation.appropriation_type_id
        ).first();

        return data;
    }
    async saveOfflineAllocationUacs(uacs:any):Promise<any | undefined>{
        try{
            let savedItem: IAllocationUacs | undefined;

            await financeDb.transaction('rw', [financeDb.allocation_uacs], async trans => {
                trans.meta = {
                    needsAudit: true,
                };
                let data: IAllocationUacs = uacs;

                if(uacs.id === ""){
                    data = {
                        ...uacs,
                        id:uuidv4(),
                        created_date: new Date().toISOString(),
                        created_by: _session.userData.email,
                        push_status_id: 2,
                        remarks: "Record Created by " + _session.userData.email,
                        };
                    } else {
                        const existing = await financeDb.allocation_uacs.get(uacs.id);
                        if (!existing) {
                            throw new Error("Record not found for update.");
                        }
                        data = {
                        ...existing,
                        ...uacs,
                        last_modified_date: new Date().toISOString(),
                        last_modified_by: _session.userData.email,
                        push_status_id: 2,
                        remarks: "Record Updated by " + _session.userData.email,
                    };
                }

                await financeDb.allocation_uacs.put(data);
                savedItem = data;
            });

            return savedItem;
        }catch(error){
            console.error('Transaction failed: ', error);
            return undefined;
        }
    }
    //MOP
    async getOfflineMOPByUACSId(id: any): Promise<IMonthlyObligationPlan | undefined>{
        try{
            debugger;
            const result = await financeDb.transaction('r', [financeDb.monthly_obligation_plan], async () => {
                const mop = await financeDb.monthly_obligation_plan.where('allocation_uacs_id').equals(id).first();
                if(mop){
                    return mop;
                }else{
                    console.log('No record found with the given ID.');
                    return undefined;
                }
            });
            return result;
        }catch(error){
            console.error('Fetch Record Failed: ', error)
            return undefined;
        }
    }
    async saveOfflineMOP(mop: any): Promise<any | undefined>{
        try{
            let savedItem: IMonthlyObligationPlan | undefined;

            await financeDb.transaction('rw', [financeDb.monthly_obligation_plan], async trans => {
                trans.meta = {
                    needsAudit: true,
                };
                
                let data: IMonthlyObligationPlan = mop;

                if(mop.id === ""){
                    data = {
                        ...mop,
                        id:uuidv4(),
                        created_date: new Date().toISOString(),
                        created_by: _session.userData.email,
                        push_status_id: 2,
                        remarks: "Record Created by " + _session.userData.email,
                        };
                    } else {
                        const existing = await financeDb.monthly_obligation_plan.get(mop.id);
                        if (!existing) {
                            throw new Error("Record not found for update.");
                        }
                        data = {
                        ...existing,
                        ...mop,
                        last_modified_date: new Date().toISOString(),
                        last_modified_by: _session.userData.email,
                        push_status_id: 2,
                        remarks: "Record Updated by " + _session.userData.email,
                    };
                }

                await financeDb.monthly_obligation_plan.put(data);
                savedItem = data;
            });

            return savedItem;
        }catch(error){
            console.error('Transaction failed: ', error);
            return undefined;
        }
    }
}