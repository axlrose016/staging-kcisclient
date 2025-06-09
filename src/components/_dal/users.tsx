"use server"

import { useraccess, users } from "@/db/schema/users"
import { createFetchFunction, createFetchFunctionWithExpression } from "./fetch"

export const fetchUsers = createFetchFunction("/api/users/", "Failed to fetch users", users);
export const fetchUser = createFetchFunctionWithExpression("/api/users/", "Failed to fetch user", users);
export const fetchUserAccess = createFetchFunctionWithExpression("/api/useraccess/", "Failed to fetch User Access", useraccess);