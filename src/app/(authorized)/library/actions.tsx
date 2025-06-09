"use server"
import { fetchLibCivilStatus, fetchLibEducationalAttainment, fetchLibLguLevel, fetchLibLguPosition, fetchLibMode, fetchLibRegion, fetchLibSex, fetchModules, fetchPermissions, fetchRoles } from "@/components/_dal/libraries";
import { db } from "@/db";
import { upsertData } from "@/db/utils/offline_crud";
import { lib_civil_status, lib_educational_attainment, lib_lgu_level, lib_lgu_position, lib_mode, lib_region, lib_sex, modules, permissions, roles } from "@/db/schema/libraries";


export async function updateLibrary() {
    try {
        const _roles = await fetchRoles();
        const _modules = await fetchModules();
        const _permissions = await fetchPermissions();
        const _lib_educational_attainment = await fetchLibEducationalAttainment();
        const _lib_lgu_level = await fetchLibLguLevel();
        const _lib_lgu_position = await fetchLibLguPosition();
        const _lib_civil_status = await fetchLibCivilStatus();
        const _lib_mode = await fetchLibMode();
        const _lib_sex = await fetchLibSex();
        const _lib_region = await fetchLibRegion();

        const result = await db.transaction(async (trx) => {
            await upsertData(trx, roles, _roles);
            await upsertData(trx, modules, _modules);
            await upsertData(trx, permissions, _permissions);
            await upsertData(trx, lib_educational_attainment, _lib_educational_attainment);
            await upsertData(trx, lib_lgu_level, _lib_lgu_level);
            await upsertData(trx, lib_lgu_position, _lib_lgu_position);
            await upsertData(trx, lib_civil_status, _lib_civil_status);
            await upsertData(trx, lib_mode, _lib_mode);
            await upsertData(trx, lib_sex, _lib_sex);
            await upsertData(trx, lib_region, _lib_region);
        });
        return { success: true, message: "Library successfully updated!", result };
    } catch (error) {
        return { success: false, message: "Failed to update library.", error: error };
    }
}