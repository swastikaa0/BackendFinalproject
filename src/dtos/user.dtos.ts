import { z } from "zod";
import { UserSchema } from "../types/user.types";

// Create a DTO for creating a user
// export const CreateUserDTO = UserSchema.omit({ role: true });
export const CreateUserDTO = UserSchema.pick({
    fullName: true,
    // lastName: true,
    email: true,
    username: true,
    password: true
});
export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = UserSchema.pick({
    email: true,
    password: true
});
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

// DTO for profile update
export const UpdateProfileDTO = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long")
    .optional(),
  profileImage: z.string().nullable().optional(),
});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileDTO>;

// DTO for password update
export const UpdatePasswordDTO = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export type UpdatePasswordDTO = z.infer<typeof UpdatePasswordDTO>;