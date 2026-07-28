import { z } from "zod";
import { UserSchema } from "../types/user.types";


export const CreateUserDTO = UserSchema.pick({
    fullName: true,
    // lastName: true,
    email: true,
    username: true,
    password: true
});
export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export const CreateUserDTOAdmin = UserSchema.pick({
    fullName:true,
    email: true,
    username: true,
    password: true,
    role: true
});
export type CreateUserDTOAdmin = z.infer<typeof CreateUserDTOAdmin>;

export const LoginUserDTO = UserSchema.pick({
    email: true,
    password: true
});
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;

// DTO for profile update
export const UpdateProfileDTO = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long")
    .optional(),

     email: z
    .string()
    .email("Invalid email address")
    .optional(),
    
     role: z
    .enum(["user", "admin"])
    .optional(),
  profileImage: z.string().nullable().optional(),


});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileDTO>;

// // DTO for password update
export const UpdatePasswordDTO = z.object({
 currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "New password must be at least 6 characters").optional(),
}).refine(
  (data) => {
    if (data.newPassword && !data.currentPassword) return false;
    return true;
  },
  {
    message: "Current password is required to set a new password",
    path: ["currentPassword"],
});

export type UpdatePasswordDTO = z.infer<typeof UpdatePasswordDTO>;

export const ForgotPasswordDTO = z.object({
  email: z.string().email("Invalid email"),
});

export const ResetPasswordDTO = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ForgotPasswordDTOType = z.infer<typeof ForgotPasswordDTO>;
export type ResetPasswordDTOType = z.infer<typeof ResetPasswordDTO>;