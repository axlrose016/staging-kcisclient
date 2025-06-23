import { ILibAllotmentClass, ILibAppropriationSource, ILibAppropriationType, ILibBrgy, ILibBudgetYear, ILibCity, ILibDivision, ILibEmploymentStatus, ILibExpense, ILibFundSource, ILibHiringProcedure, ILibModality, ILibOffice, ILibPAP, ILibPosition, ILibProvince, ILibRegion, IModules, IPermissions, IRoles } from "@/components/interfaces/library-interface";
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
      
            await libDb.transaction('rw', [libDb.roles], async (trans) => {
            trans.meta = {
              needsAudit: true,
            };
              let data: IRoles = role;
            
              if (role.id === "") {
                data = {
                  ...role,
                  id: uuidv4(),
                  created_date: new Date().toISOString(),
                  created_by: _session?.userData?.email,
                  push_status_id: 2,
                  remarks: "Record Created by " + _session?.userData?.email,
                };
              } else {
                const existing = await libDb.roles.get(role.id);
                if (!existing) {
                  throw new Error("Record not found for update.");
                }

                data = {
                  ...existing,
                  ...role,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session?.userData?.email,
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session?.userData?.email,
                };
              }
      
              await libDb.roles.put(data);
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
        const result = await libDb.transaction('r', [libDb.roles], async () => {
            const role = await libDb.roles.where('id').equals(id).first();
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
            const result = await libDb.transaction('r', [libDb.roles], async () => {
            const roles = await libDb.roles.toArray();
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
      
            await libDb.transaction('rw', [libDb.permissions], async (trans) => {
            trans.meta = {
              needsAudit: true,
            };
              let data: IPermissions = permission;
            
              if (permission.id === "") {
                data = {
                  ...permission,
                  id: uuidv4(),
                  created_date: new Date().toISOString(),
                  created_by: _session?.userData?.email,
                  push_status_id: 2,
                  remarks: "Record Created by " + _session?.userData?.email,
                };
              } else {     
                const existing = await libDb.permissions.get(permission.id);
                if (!existing) {
                  throw new Error("Record not found for update.");
                }

                data = {
                  ...existing,
                  ...permission,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session?.userData?.email,
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session?.userData?.email,
                };
              }
      
              await libDb.permissions.put(data);
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
        const result = await libDb.transaction('r', [libDb.permissions], async () => {
            const permission = await libDb.permissions.where('id').equals(id).first();
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
            const result = await libDb.transaction('r', [libDb.permissions], async () => {
            const permissions = await libDb.permissions.toArray();
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
      
            await libDb.transaction('rw', [libDb.modules], async (trans) => {
            trans.meta = {
              needsAudit: true,
            };
              let data: IModules = module;
            
              if (module.id === "") {
                data = {
                  ...module,
                  id: uuidv4(),
                  created_date: new Date().toISOString(),
                  created_by: _session?.userData?.email,
                  push_status_id: 2,
                  remarks: "Record Created by " + _session?.userData?.email,
                };
              } else {
                const existing = await libDb.modules.get(module.id);
                if (!existing) {
                  throw new Error("Record not found for update.");
                }

                data = {
                  ...existing,
                  ...module,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session?.userData?.email,
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session?.userData?.email,
                };
              }
      
              await libDb.modules.put(data);
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
        const result = await libDb.transaction('r', [libDb.modules], async () => {
            const module = await libDb.modules.where('id').equals(id).first();
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
            const result = await libDb.transaction('r', [libDb.modules], async () => {
            const modules = await libDb.modules.toArray();
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
              created_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
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
              last_modified_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
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
              created_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
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
              last_modified_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
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
              created_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
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
              last_modified_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
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
              created_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
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
              last_modified_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
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
              created_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
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
              last_modified_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
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
              created_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
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
              last_modified_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
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
    async getOfflineLibModality(): Promise<ILibModality[]> {
        try {
            await libDb.open();
            const result = await libDb.transaction('r', [libDb.lib_modality], async () => {
                const modalities = await libDb.lib_modality.filter(f => f.is_deleted !== true).toArray();
                return modalities;
            });
            return result;
        } catch (error) {
        console.error('Fetch Records Failed: ', error);
        return [];
        }
    }
    async getOfflineLibModalityById(id:number): Promise<ILibModality | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_modality], async () => {
            const modality = await libDb.lib_modality.where('id').equals(id).first();
            if(modality){
              return modality;
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
    async saveOfflineLibModality(modality: any): Promise<any | undefined>{
      try{
        let savedItem: ILibModality | undefined;

        await libDb.transaction('rw',[libDb.lib_modality], async (trans) => {
           trans.meta = {
            needsAudit: true,
          };
          let data: ILibModality = modality;

          if(!modality.id || modality.id === ""){
            data = {
              ...modality,
              created_date: new Date().toISOString(),
              created_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
            };
          }else{
            const existing = await libDb.lib_modality.get(modality.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...modality,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
            }
          }

          await libDb.lib_modality.put(data);
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
              created_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
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
              last_modified_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
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
              created_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
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
              last_modified_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
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
              created_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
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
              last_modified_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
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
              created_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
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
              last_modified_by: _session?.userData?.email,
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
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
    async getOfflineLibFundSource(): Promise<ILibFundSource[]> {
      try {
          await libDb.open();
          const result = await libDb.transaction('r', [libDb.lib_fund_source], async () => {
              const fund_source = await libDb.lib_fund_source.filter(f => f.is_deleted !== true).toArray();
              return fund_source;
          });
          return result;
      } catch (error) {
      console.error('Fetch Records Failed: ', error);
      return [];
      }
    }
    async getOfflineLibFundSourceById(id:number): Promise<ILibFundSource | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_fund_source], async () => {
            const fund_source = await libDb.lib_fund_source.where('id').equals(id).first();
            if(fund_source){
              return fund_source;
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
    async saveOfflineLibFundSource(fund_source: any): Promise<any | undefined>{
      try{
        let savedItem: ILibFundSource | undefined;

        await libDb.transaction('rw',[libDb.lib_fund_source], async (trans) => {
           trans.meta = {
            needsAudit: true,
          };
          let data: ILibFundSource = fund_source;

          if(!fund_source.id || fund_source.id === 0){
            data = {
              ...fund_source,
              created_date: new Date().toISOString(),
              created_by: _session?.userData?.email ?? "unknown",
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
            };
          }else{
            const existing = await libDb.lib_fund_source.get(fund_source.id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...fund_source,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session?.userData?.email ?? "unknown",
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
            }
          }

          await libDb.lib_fund_source.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }


    //AREA 
    async getOfflineLibRegion(): Promise<ILibRegion[]>{
       try {
          await libDb.open();
          const result = await libDb.transaction('r', [libDb.lib_region], async () => {
              const region = await libDb.lib_region.toArray();
              return region;
          });
          return result;
      } catch (error) {
      console.error('Fetch Records Failed: ', error);
      return [];
      }
    }
    async getOfflineLibRegionByCodeCorrespondence(code:string): Promise<ILibRegion | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_region], async () => {
            const region = await libDb.lib_region.where('code_correspondence').equals(code).first();
            if(region){
              return region;
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
    async saveOfflineLibRegion(region: any): Promise<any | undefined>{
      try{
        let savedItem: ILibRegion | undefined;

        await libDb.transaction('rw',[libDb.lib_region], async (trans) => {
      
          let data: ILibRegion = region;

          if(!region.reg_id || region.reg_id === 0){
            data = {
              ...region,
              created_date: new Date().toISOString(),
              created_by: _session?.userData?.email ?? "unknown",
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
            };
          }else{
            const existing = await libDb.lib_fund_source.get(region.reg_id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...region,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session?.userData?.email ?? "unknown",
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
            }
          }

          await libDb.lib_region.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async saveOfflineLibRegionBulk(regions: any[]): Promise<ILibRegion[] | undefined> {
      try {
        const savedItems: ILibRegion[] = [];

        await libDb.transaction('rw', [libDb.lib_region], async () => {
          for (let region of regions) {
            let data: ILibRegion = region;

            const existing = await libDb.lib_region.get(region.reg_id);
            if (!existing) {
               data = {
                  ...region,
                  created_date: new Date().toISOString(),
                  created_by: _session?.userData?.email ?? "unknown",
                  push_status_id: 2,
                  remarks: "Record Created by " + _session?.userData?.email,
              };
            }else{
                data = {
                  ...existing,
                  ...region,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session?.userData?.email ?? "unknown",
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session?.userData?.email,
              };
            }
            savedItems.push(data);
          }

          if (savedItems.length > 0) {
            await libDb.lib_region.bulkPut(savedItems);
          }
        });

        return savedItems;
      } catch (error) {
        console.error('Bulk transaction failed:', error);
        return undefined;
      }
    }

    async getOfflineLibProvince(): Promise<ILibProvince[]>{
       try {
          await libDb.open();
          const result = await libDb.transaction('r', [libDb.lib_province], async () => {
              const province = await libDb.lib_province.toArray();
              return province;
          });
          return result;
      } catch (error) {
      console.error('Fetch Records Failed: ', error);
      return [];
      }
    }
    async getOfflineLibProvinceByCodeCorrespondence(code:string): Promise<ILibProvince | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_province], async () => {
            const province = await libDb.lib_province.where('code_correspondence').equals(code).first();
            if(province){
              return province;
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
    async saveOfflineLibProvince(province: any): Promise<any | undefined>{
      try{
        let savedItem: ILibProvince | undefined;

        await libDb.transaction('rw',[libDb.lib_province], async (trans) => {
       
          let data: ILibProvince = province;

          if(!province.prov_id || province.prov_id === 0){
            data = {
              ...province,
              created_date: new Date().toISOString(),
              created_by: _session?.userData?.email ?? "unknown",
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
            };
          }else{
            const existing = await libDb.lib_fund_source.get(province.prov_id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...province,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session?.userData?.email ?? "unknown",
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
            }
          }

          await libDb.lib_province.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async saveOfflineLibProvinceBulk(provinces: any[]): Promise<ILibProvince[] | undefined> {
      try {
        const savedItems: ILibProvince[] = [];

        await libDb.transaction('rw', [libDb.lib_province], async () => {
          for (let province of provinces) {
            let data: ILibProvince = province;

            const existing = await libDb.lib_province.get(province.prov_id);
            if (!existing) {
               data = {
                  ...province,
                  created_date: new Date().toISOString(),
                  created_by: _session?.userData?.email ?? "unknown",
                  push_status_id: 2,
                  remarks: "Record Created by " + _session?.userData?.email,
              };
            }else{
                data = {
                  ...existing,
                  ...province,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session?.userData?.email ?? "unknown",
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session?.userData?.email,
              };
            }
            savedItems.push(data);
          }

          if (savedItems.length > 0) {
            await libDb.lib_province.bulkPut(savedItems);
          }
        });

        return savedItems;
      } catch (error) {
        console.error('Bulk transaction failed:', error);
        return undefined;
      }
    }

    async getOfflineLibCity(): Promise<ILibCity[]>{
       try {
          await libDb.open();
          const result = await libDb.transaction('r', [libDb.lib_city], async () => {
              const city = await libDb.lib_city.toArray();
              return city;
          });
          return result;
      } catch (error) {
      console.error('Fetch Records Failed: ', error);
      return [];
      }
    }
    async getOfflineLibCityByCodeCorrespondence(code:string): Promise<ILibCity | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_city], async () => {
            const city = await libDb.lib_city.where('code_correspondence').equals(code).first();
            if(city){
              return city;
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
    async saveOfflineLibCity(city: any): Promise<any | undefined>{
      try{
        let savedItem: ILibCity | undefined;

        await libDb.transaction('rw',[libDb.lib_city], async (trans) => {
       
          let data: ILibCity = city;

          if(!city.city_id || city.city_id === 0){
            data = {
              ...city,
              created_date: new Date().toISOString(),
              created_by: _session?.userData?.email ?? "unknown",
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
            };
          }else{
            const existing = await libDb.lib_city.get(city.city_id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...city,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session?.userData?.email ?? "unknown",
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
            }
          }

          await libDb.lib_city.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async saveOfflineLibCityBulk(cities: any[]): Promise<ILibCity[] | undefined> {
      try {
        const savedItems: ILibCity[] = [];

        await libDb.transaction('rw', [libDb.lib_city], async () => {
          for (let city of cities) {
            let data: ILibCity = city;

            const existing = await libDb.lib_city.get(city.city_id);
            if (!existing) {
               data = {
                  ...city,
                  created_date: new Date().toISOString(),
                  created_by: _session?.userData?.email ?? "unknown",
                  push_status_id: 2,
                  remarks: "Record Created by " + _session?.userData?.email,
              };
            }else{
                data = {
                  ...existing,
                  ...city,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session?.userData?.email ?? "unknown",
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session?.userData?.email,
              };
            }
            savedItems.push(data);
          }

          if (savedItems.length > 0) {
            await libDb.lib_city.bulkPut(savedItems);
          }
        });

        return savedItems;
      } catch (error) {
        console.error('Bulk transaction failed:', error);
        return undefined;
      }
    }

     async getOfflineLibBrgy(): Promise<ILibBrgy[]>{
       try {
          await libDb.open();
          const result = await libDb.transaction('r', [libDb.lib_brgy], async () => {
              const brgy = await libDb.lib_brgy.toArray();
              return brgy;
          });
          return result;
      } catch (error) {
      console.error('Fetch Records Failed: ', error);
      return [];
      }
    }
    async getOfflineLibBrgyByCodeCorrespondence(code:string): Promise<ILibBrgy | undefined>{
    try{
        await libDb.open();
        const result = await libDb.transaction('r', [libDb.lib_brgy], async () => {
            const brgy = await libDb.lib_brgy.where('code_correspondence').equals(code).first();
            if(brgy){
              return brgy;
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
    async saveOfflineLibBrgy(brgy: any): Promise<any | undefined>{
      try{
        let savedItem: ILibBrgy | undefined;

        await libDb.transaction('rw',[libDb.lib_brgy], async (trans) => {
       
          let data: ILibBrgy = brgy;

          if(!brgy.city_id || brgy.city_id === 0){
            data = {
              ...brgy,
              created_date: new Date().toISOString(),
              created_by: _session?.userData?.email ?? "unknown",
              push_status_id: 2,
              remarks: "Record Created by " + _session?.userData?.email,
            };
          }else{
            const existing = await libDb.lib_brgy.get(brgy.city_id);
            if (!existing) {
              throw new Error("Record not found for update.");
            }

            data = {
              ...existing,
              ...brgy,
              last_modified_date: new Date().toISOString(),
              last_modified_by: _session?.userData?.email ?? "unknown",
              push_status_id: 2,
              remarks: "Record Updated by " + _session?.userData?.email,
            }
          }

          await libDb.lib_brgy.put(data);
          savedItem = data;
        });

        return savedItem;
      }catch(error){
        console.error('Transaction failed: ', error);
        return undefined;
      }
    }
    async saveOfflineLibBrgyBulk(brgys: any[]): Promise<ILibBrgy[] | undefined> {
      try {
        const savedItems: ILibBrgy[] = [];

        await libDb.transaction('rw', [libDb.lib_brgy], async () => {
          for (let brgy of brgys) {
            let data: ILibBrgy = brgy;

            const existing = await libDb.lib_brgy.get(brgy.brgy_id);
            if (!existing) {
               data = {
                  ...brgy,
                  created_date: new Date().toISOString(),
                  created_by: _session?.userData?.email ?? "unknown",
                  push_status_id: 2,
                  remarks: "Record Created by " + _session?.userData?.email,
              };
            }else{
                data = {
                  ...existing,
                  ...brgy,
                  last_modified_date: new Date().toISOString(),
                  last_modified_by: _session?.userData?.email ?? "unknown",
                  push_status_id: 2,
                  remarks: "Record Updated by " + _session?.userData?.email,
              };
            }
            savedItems.push(data);
          }

          if (savedItems.length > 0) {
            await libDb.lib_brgy.bulkPut(savedItems);
          }
        });

        return savedItems;
      } catch (error) {
        console.error('Bulk transaction failed:', error);
        return undefined;
      }
    }
  }