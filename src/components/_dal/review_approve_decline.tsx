"use server"

import { review_approve } from "@/db/schema/personprofile";
import { createFetchFunction } from "./fetch";

export const fetchReviewApproveDecline = createFetchFunction("/api/review-approve-decline/", "Failed to fetch review-approve-decline", review_approve);
