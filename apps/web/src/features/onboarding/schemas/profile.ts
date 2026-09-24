import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80),
  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .max(24, "24 characters or fewer")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, and underscores only"),
  intent: z.enum(["personal", "work", "study"], { error: "Choose what you'll use Notter for" }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
