import z from "zod";

export const accountProfileSchema = z.object({
  firstName: z.string().trim().max(50, "First name must be 50 characters or less"),
  lastName: z.string().trim().max(50, "Last name must be 50 characters or less"),
  username: z
    .string()
    .trim()
    .max(40, "Username must be 40 characters or less")
    .regex(/^[a-zA-Z0-9_-]*$/, "Use letters, numbers, underscores, or hyphens only"),
});
