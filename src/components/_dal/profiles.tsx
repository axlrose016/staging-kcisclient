"use server"

import { person_profile } from "@/db/schema/personprofile";
import { createFetchFunction } from "./fetch";

export const fetchProfiles = createFetchFunction("/api/person-profiles/", "Failed to fetch person profiles", person_profile);
