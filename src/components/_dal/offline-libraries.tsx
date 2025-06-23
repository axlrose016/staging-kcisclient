import { getOfflineLibListData, getOfflineListData } from "./offline-fetch";

export const getOfflineLibModules = getOfflineLibListData('modules');
export const getOfflineLibRoles = getOfflineLibListData('roles');
export const getOfflineLibPermissions = getOfflineLibListData('permissions');