import { getOfflineListData } from "./offline-fetch";

export const getOfflineLibModules = getOfflineListData('modules');
export const getOfflineLibRoles = getOfflineListData('roles');
export const getOfflineLibPermissions = getOfflineListData('permissions');