import {z } from "zod";
export const UserSchema =z.object ({
    firstName: z.string().min(1,"First name is required"),
    lastName:z.string().min(1,"Last name is required"),
    email:z.email("Invalid email address"),
    username:z.string().min(8,"Username must be at least 8 character long"),
    password:z.string().min(8,"Password must be at least 8 character long"),
     role: z.enum(["admin", "user"]).default("user")
});
export type UserType = z.infer<typeof UserSchema>;