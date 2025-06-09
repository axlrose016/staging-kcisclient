import { ILibAllotmentClass, ILibAppropriationSource, ILibAppropriationType, ILibBudgetYear, ILibDivision, ILibEmploymentStatus, ILibExpense, ILibHiringProcedure, ILibOffice, ILibPAP, ILibPosition, IModules, IPermissions, IRoles } from "@/components/interfaces/library-interface";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { libDb } from "@/db/offline/Dexie/databases/libraryDb";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import { v4 as uuidv4 } from 'uuid';

const _session = await getSession() as SessionPayload;

export class LibrariesService{
    async saveOfflineRole(role: any): Promise<any | undefined> {
        try {
            let savedItem: IRoles | undefined;
      
            await dexieDb.transaction('rw', [dexieDb.roles], async (trans) => {
            trans.meta = {
              needsAudit: true,
            };
              let data: IRoles = role;
            
              if (role.id === "") {
                data = {
                  ...role,
                  id: uuidv4(),
                  created_date: new Date().toISOString(),
                  created_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Created by " + _session.userData.email,
                };
              } else {
                const existing = await dexieDb.roles.get(role.id);
                if (!existing) {
                  throw new Error("Record not found for update.");
                }

                data = {
                  ...existing,
                  ...role,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session.userData.email,
                };
              }
      
              await dexieDb.roles.put(data);
              savedItem = data;
            });
      
            return savedItem;
          } catch (error) {
            console.error('Transaction failed: ', error);
            return undefined;
          }
    }
    async getOfflineRoleById(id: any): Promise<IRoles | undefined> {
        try {
        const result = await dexieDb.transaction('r', [dexieDb.roles], async () => {
            const role = await dexieDb.roles.where('id').equals(id).first();
            if (role) {
            return role;
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
    async getOfflineRoles(): Promise<IRoles[]> {
        try {
            const result = await dexieDb.transaction('r', [dexieDb.roles], async () => {
            const roles = await dexieDb.roles.toArray();
            return roles;
            });
            return result;
        } catch (error) {
            console.error('Fetch Records Failed: ', error);
            return [];
        }
    }
    async saveOfflinePermission(permission: any): Promise<any | undefined> {
        try {
            let savedItem: IPermissions | undefined;
      
            await dexieDb.transaction('rw', [dexieDb.permissions], async (trans) => {
            trans.meta = {
              needsAudit: true,
            };
              let data: IPermissions = permission;
            
              if (permission.id === "") {
                data = {
                  ...permission,
                  id: uuidv4(),
                  created_date: new Date().toISOString(),
                  created_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Created by " + _session.userData.email,
                };
              } else {     
                const existing = await dexieDb.permissions.get(permission.id);
                if (!existing) {
                  throw new Error("Record not found for update.");
                }

                data = {
                  ...existing,
                  ...permission,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session.userData.email,
                };
              }
      
              await dexieDb.permissions.put(data);
              savedItem = data;
            });
      
            return savedItem;
          } catch (error) {
            console.error('Transaction failed: ', error);
            return undefined;
          }
    }
    async getOfflinePermissionById(id: any): Promise<IPermissions | undefined> {
        try {
        const result = await dexieDb.transaction('r', [dexieDb.permissions], async () => {
            const permission = await dexieDb.permissions.where('id').equals(id).first();
            if (permission) {
            return permission;
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
    async getOfflinePermissions(): Promise<IPermissions[]> {
        try {
            const result = await dexieDb.transaction('r', [dexieDb.permissions], async () => {
            const permissions = await dexieDb.permissions.toArray();
            return permissions;
            });
            return result;
        } catch (error) {
            console.error('Fetch Records Failed: ', error);
            return [];
        }
    }
    async saveOfflineModule(module: any): Promise<any | undefined> {
        try {
            let savedItem: IModules | undefined;
      
            await dexieDb.transaction('rw', [dexieDb.modules], async (trans) => {
            trans.meta = {
              needsAudit: true,
            };
              let data: IModules = module;
            
              if (module.id === "") {
                data = {
                  ...module,
                  id: uuidv4(),
                  created_date: new Date().toISOString(),
                  created_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Created by " + _session.userData.email,
                };
              } else {
                const existing = await dexieDb.modules.get(module.id);
                if (!existing) {
                  throw new Error("Record not found for update.");
                }

                data = {
                  ...existing,
                  ...module,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session.userData.email,
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session.userData.email,
                };
              }
      
              await dexieDb.modules.put(data);
              savedItem = data;
            });
      
            return savedItem;
          } catch (error) {
            console.error('Transaction failed: ', error);
            return undefined;
          }
    }
    async getOfflineModuleById(id: any): Promise<IModules | undefined> {
        try {
        const result = await dexieDb.transaction('r', [dexieDb.modules], async () => {
            const module = await dexieDb.modules.where('id').equals(id).first();
            if (module) {
            return module;
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
    async getOfflineModules(): Promise<IModules[]> {
        try {
            const result = await dexieDb.transaction('r', [dexieDb.modules], async () => {
            const modules = await dexieDb.modules.toArray();
            return modules;
            });
            return result;
        } catch (error) {
            console.error('Fetch Records Failed: ', error);
            return [];
        }
    }
    
    //HR Libraries
    async getOfflineLibHiringProcedure() : Promise<ILibHiringProcedure[]> {
      try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_hiring_procedure], async () => {
          const hiring_procedures = await libDb.lib_hiring_procedure.toArray();
          return hiring_procedures;
        });
        return result;
      }catch(error){
        console.error('Fetch Records Failed: ', error);
        return [];
      }
    }
    async getOfflineLibEmploymentStatus(): Promise<ILibEmploymentStatus[]> {
        try {
            await libDb.open();
            const result = await libDb.transaction('r', [libDb.lib_employment_status], async () => {
                const employment_status = await libDb.lib_employment_status.toArray();
                return employment_status;
            });
            return result;
        } catch (error) {
        console.error('Fetch Records Failed: ', error);
        return [];
        }
    }
    async getOfflineLibPosition(): Promise<ILibPosition[]>{
      try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_position], async () => {
          const positions = await libDb.lib_position.toArray();
          return positions;
        });
        return result;
      }catch(error){
        console.error('Fetch Records Failed: ', error);
        return [];
      }
    }
    async getOfflineLibOffice(): Promise<ILibOffice[]> {
      try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_office], async () => {
          const offices = await libDb.lib_office.toArray();
          return offices;
        });
        return result;
      }catch(error){
        console.error('Fetch Records Failed: ', error);
        return [];
      }
    }
    async getOfflineLibDivision(): Promise<ILibDivision[]> {
      try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_division], async () => {
          const division = await libDb.lib_division.toArray();
          return division;
        });
        return result;
      }catch(error){
        console.error('Fetch Records Failed: ', error);
        return [];
      }
    }
    async getOfflineLibEmploymentStatusById(id:number): Promise<ILibEmploymentStatus | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_employment_status], async () => {
            const employment_status = await libDb.lib_employment_status.where('id').equals(id).first();
            if(employment_status){
              return employment_status;
            }else{
              console.log('No record found with the given ID.');
              return undefined;
            }
        });
        return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async getOfflineLibPositionById(id:number): Promise<ILibPosition | undefined>{
      try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_position], async () => {
          const position = await libDb.lib_position.where('id').equals(id).first();
          if(position){
            return position;
          }else{
            console.log('No record found with the given ID.');
            return undefined;
          }
        });
        return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async getOfflineLibHiringProcedureById(id:number): Promise<ILibHiringProcedure | undefined>{
      try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_hiring_procedure], async () => {
          const hiring_procedure = await libDb.lib_hiring_procedure.where('id').equals(id).first();
          if(hiring_procedure){
            return hiring_procedure;
          }else{
            console.log('No record found with the given ID.');
            return undefined;
          }
      });
      return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async getOfflineLibOfficeById(id:number): Promise<ILibOffice | undefined>{
      try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_office], async () => {
          const office = await libDb.lib_office.where('id').equals(id).first();
          if(office){
            return office;
          }else{
            console.log('No record found with the given ID.');
            return undefined;
          }
        });
        return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async getOfflineLibDivisionById(id:number): Promise<ILibDivision | undefined>{
      try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_division], async () => {
          const division = await libDb.lib_division.where('id').equals(id).first();
          if(division){
            return division;
          }else{
            console.log('No record found with the given ID.');
            return undefined;
          }
        });
        return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async saveOfflineEmploymentStatus(emp: any): Promise<any | undefined>{
      try{
        let savedItem: ILibEmploymentStatus | undefined;

        await libDb.transaction('rw',[libDb.lib_employment_status], async (trans) => {
           trans.meta = {
            needsAudit: true,
          };
          let data: ILibEmploymentStatus = emp;

          if(!emp.id || emp.id === ""){
            data = {
              ...emp,
              created_date: new Date().toISOString(),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            const existing = await libDb.lib_employment_status.get(emp.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...emp,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            }
          }

          await libDb.lib_employment_status.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async saveOfflineOffice(office: any): Promise<any | undefined>{
      try
      {
        let savedItem: ILibOffice | undefined;
        await libDb.transaction('rw', [libDb.lib_office], async (trans) => {
           trans.meta = {
            needsAudit: true,
          };
          let data: ILibOffice = office;

          if(!office.id || office.id === ""){
            data = {
              ...office,
              created_date: new Date().toISOString(),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            const existing = await libDb.lib_office.get(office.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...office,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            }
          }
          await libDb.lib_office.put(data);
          savedItem = data;
        });
        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async saveOfflineDivision(division: any): Promise<any | undefined>{
      try
      {
        let savedItem: ILibDivision | undefined;
        await libDb.transaction('rw', [libDb.lib_division], async (trans) => {
           trans.meta = {
            needsAudit: true,
          };
          let data: ILibDivision = division;

          if(!division.id || division.id === ""){
            data = {
              ...division,
              created_date: new Date().toISOString(),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            const existing = await libDb.lib_division.get(division.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...division,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            }
          }
          await libDb.lib_division.put(data);
          savedItem = data;
        });
        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async saveOfflineLibHiringProcedure(hiring_procedure: any): Promise<any | undefined>{
      try{
        let savedItem: ILibHiringProcedure | undefined;
        await libDb.transaction('rw', [libDb.lib_hiring_procedure], async (trans) => {
           trans.meta = {
            needsAudit: true,
          };
          let data: ILibHiringProcedure = hiring_procedure;

          if(!hiring_procedure.id || hiring_procedure.id === ""){
            data = {
              ...hiring_procedure,
              created_date: new Date().toISOString(),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            const existing = await libDb.lib_hiring_procedure.get(hiring_procedure.id);
            if( !existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...hiring_procedure,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            }
          }
          await libDb.lib_hiring_procedure.put(data);
          savedItem = data;
        });
        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async saveOfflinePosition(pos: any): Promise<any | undefined>{
      try{
        let savedItem: ILibPosition | undefined;
        await libDb.transaction('rw', [libDb.lib_position], async (trans) => {
          trans.meta = {
            needsAudit: true,
          };
          let data: ILibPosition = pos;
          

          if(!pos.id || pos.id === ""){
            data = {
              ...pos,
              created_date: new Date().toISOString(),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            const existing = await libDb.lib_position.get(pos.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...pos, 
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            }
          }

          await libDb.lib_position.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }

    //Finance Libraries
    async getOfflineLibBudgetYear(): Promise<ILibBudgetYear[]> {
        try {
            await libDb.open();
            const result = await libDb.transaction('r', [libDb.lib_budget_year], async () => {
                const budget_years = await libDb.lib_budget_year.filter(f => f.is_deleted !== true).toArray();
                return budget_years;
            });
            return result;
        } catch (error) {
        console.error('Fetch Records Failed: ', error);
        return [];
        }
    }
    async getOfflineLibBudgetYearById(id:number): Promise<ILibBudgetYear | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_budget_year], async () => {
            const budget_year = await libDb.lib_budget_year.where('id').equals(id).first();
            if(budget_year){
              return budget_year;
            }else{
              console.log('No record found with the given ID.');
              return undefined;
            }
        });
        return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async saveOfflineLibBudgetYear(budget_year: any): Promise<any | undefined>{
      try{
        let savedItem: ILibBudgetYear | undefined;

        await libDb.transaction('rw',[libDb.lib_budget_year], async (trans) => {
           trans.meta = {
            needsAudit: true,
          };
          let data: ILibBudgetYear = budget_year;

          if(!budget_year.id || budget_year.id === ""){
            data = {
              ...budget_year,
              created_date: new Date().toISOString(),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            const existing = await libDb.lib_budget_year.get(budget_year.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...budget_year,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            }
          }

          await libDb.lib_budget_year.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async getOfflineLibPAP(): Promise<ILibPAP[]> {
        try {
            await libDb.open();
            const result = await libDb.transaction('r', [libDb.lib_pap], async () => {
                const paps = await libDb.lib_pap.filter(f => f.is_deleted !== true).toArray();
                return paps;
            });
            return result;
        } catch (error) {
        console.error('Fetch Records Failed: ', error);
        return [];
        }
    }
    async getOfflineLibPAPById(id:number): Promise<ILibPAP | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_pap], async () => {
            const pap = await libDb.lib_pap.where('id').equals(id).first();
            if(pap){
              return pap;
            }else{
              console.log('No record found with the given ID.');
              return undefined;
            }
        });
        return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async saveOfflineLibPAP(pap: any): Promise<any | undefined>{
      try{
        let savedItem: ILibPAP | undefined;

        await libDb.transaction('rw',[libDb.lib_pap], async (trans) => {
           trans.meta = {
            needsAudit: true,
          };
          let data: ILibPAP = pap;

          if(!pap.id || pap.id === ""){
            data = {
              ...pap,
              created_date: new Date().toISOString(),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            const existing = await libDb.lib_pap.get(pap.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...pap,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            }
          }

          await libDb.lib_pap.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async getOfflineAppropriationSource(): Promise<ILibAppropriationSource[]> {
      try {
          await libDb.open();
          const result = await libDb.transaction('r', [libDb.lib_appropriation_source], async () => {
              const app_source = await libDb.lib_appropriation_source.filter(f => f.is_deleted !== true).toArray();
              return app_source;
          });
          return result;
      } catch (error) {
      console.error('Fetch Records Failed: ', error);
      return [];
      }
    }
    async getOfflineLibAppropriationSourceById(id:number): Promise<ILibAppropriationSource | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_appropriation_source], async () => {
            const app_source = await libDb.lib_appropriation_source.where('id').equals(id).first();
            if(app_source){
              return app_source;
            }else{
              console.log('No record found with the given ID.');
              return undefined;
            }
        });
        return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async saveOfflineLibAppropriationSource(app_source: any): Promise<any | undefined>{
      try{
        let savedItem: ILibAppropriationSource | undefined;

        await libDb.transaction('rw',[libDb.lib_appropriation_source], async (trans) => {
           trans.meta = {
            needsAudit: true,
          };
          let data: ILibAppropriationSource = app_source;

          if(!app_source.id || app_source.id === ""){
            data = {
              ...app_source,
              created_date: new Date().toISOString(),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            const existing = await libDb.lib_appropriation_source.get(app_source.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...app_source,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            }
          }

          await libDb.lib_appropriation_source.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async getOfflineAppropriationType(): Promise<ILibAppropriationType[]> {
      try {
          await libDb.open();
          const result = await libDb.transaction('r', [libDb.lib_appropriation_type], async () => {
              const app_type = await libDb.lib_appropriation_type.filter(f => f.is_deleted !== true).toArray();
              return app_type;
          });
          return result;
      } catch (error) {
      console.error('Fetch Records Failed: ', error);
      return [];
      }
    }
    async getOfflineLibAppropriationTypeById(id:number): Promise<ILibAppropriationType | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_appropriation_type], async () => {
            const app_type = await libDb.lib_appropriation_type.where('id').equals(id).first();
            if(app_type){
              return app_type;
            }else{
              console.log('No record found with the given ID.');
              return undefined;
            }
        });
        return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async saveOfflineLibAppropriationType(app_type: any): Promise<any | undefined>{
      try{
        let savedItem: ILibAppropriationType | undefined;

        await libDb.transaction('rw',[libDb.lib_appropriation_type], async (trans) => {
           trans.meta = {
            needsAudit: true,
          };
          let data: ILibAppropriationType = app_type;

          if(!app_type.id || app_type.id === ""){
            data = {
              ...app_type,
              created_date: new Date().toISOString(),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            const existing = await libDb.lib_appropriation_type.get(app_type.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...app_type,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            }
          }

          await libDb.lib_appropriation_type.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async getOfflineExpense(): Promise<ILibExpense[]> {
      try {
          await libDb.open();
          const result = await libDb.transaction('r', [libDb.lib_expense], async () => {
              const expenses = await libDb.lib_expense.filter(f => f.is_deleted !== true).toArray();
              return expenses;
          });
          return result;
      } catch (error) {
      console.error('Fetch Records Failed: ', error);
      return [];
      }
    }
    async getOfflineLibExpenseById(id:number): Promise<ILibExpense | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_expense], async () => {
            const expense = await libDb.lib_expense.where('id').equals(id).first();
            if(expense){
              return expense;
            }else{
              console.log('No record found with the given ID.');
              return undefined;
            }
        });
        return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async saveOfflineLibExpense(expense: any): Promise<any | undefined>{
      try{
        let savedItem: ILibExpense | undefined;

        await libDb.transaction('rw',[libDb.lib_expense], async (trans) => {
           trans.meta = {
            needsAudit: true,
          };
          let data: ILibExpense = expense;

          if(!expense.id || expense.id === ""){
            data = {
              ...expense,
              created_date: new Date().toISOString(),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            const existing = await libDb.lib_appropriation_type.get(expense.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...expense,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            }
          }

          await libDb.lib_expense.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async getOfflineAllotmentClass(): Promise<ILibAllotmentClass[]> {
      try {
          await libDb.open();
          const result = await libDb.transaction('r', [libDb.lib_allotment_class], async () => {
              const allotment_class = await libDb.lib_allotment_class.filter(f => f.is_deleted !== true).toArray();
              return allotment_class;
          });
          return result;
      } catch (error) {
      console.error('Fetch Records Failed: ', error);
      return [];
      }
    }
    async getOfflineLibAllotmentClassById(id:number): Promise<ILibAllotmentClass | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_allotment_class], async () => {
            const allotment_class = await libDb.lib_allotment_class.where('id').equals(id).first();
            if(allotment_class){
              return allotment_class;
            }else{
              console.log('No record found with the given ID.');
              return undefined;
            }
        });
        return result;
      }catch(error){
        console.error('Fetch Record Failed: ', error);
        return undefined;
      }
    }
    async saveOfflineLibAllotmentClass(allotment_class: any): Promise<any | undefined>{
      try{
        let savedItem: ILibAllotmentClass | undefined;

        await libDb.transaction('rw',[libDb.lib_allotment_class], async (trans) => {
           trans.meta = {
            needsAudit: true,
          };
          let data: ILibAllotmentClass = allotment_class;

          if(!allotment_class.id || allotment_class.id === ""){
            data = {
              ...allotment_class,
              created_date: new Date().toISOString(),
              created_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session.userData.email,
            };
          }else{
            const existing = await libDb.lib_allotment_class.get(allotment_class.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...allotment_class,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session.userData.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session.userData.email,
            }
          }

          await libDb.lib_allotment_class.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
  }