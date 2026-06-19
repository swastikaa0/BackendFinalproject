import { z } from "zod";

export const UserSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    
    email: z.string().email("Invalid email address"),

    username: z.string().min(8, "Username must be at least 8 characters long"),

    password: z.string().min(8, "Password must be at least 8 characters long"),

    profileImage: z.string().nullable().optional(),

    role: z.enum(["admin", "user"]).default("user"),



    
});

export type UserType = z.infer<typeof UserSchema>;