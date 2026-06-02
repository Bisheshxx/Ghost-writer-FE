import type z from "zod";

import type { accountProfileSchema } from "../schema/account.schema";

export type AccountProfileFormData = z.infer<typeof accountProfileSchema>;
