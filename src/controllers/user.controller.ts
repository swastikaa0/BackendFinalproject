

import { Request, Response } from "express";
import { z } from "zod";

import { UserService } from "../services/user.service";
import { CreateUserDTO, LoginUserDTO,UpdateProfileDTO, UpdatePasswordDTO} from "../dtos/user.dtos";
import { ApiResponseHelper } from "../utlis/apihelper.util";
import { AuthRequest } from "../middlewares/authorized.middleware";


export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    private sendError(res: Response, error: any) {
        return ApiResponseHelper.error(
            res,
            error?.message ?? "Internal Server Error",
            error?.status ?? 500
        );
    }

    createUser = async (req: Request, res: Response) => {
        try {
            const validation = CreateUserDTO.safeParse(req.body);

            if (!validation.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(validation.error),
                    400
                );
            }

            const createdUser = await this.userService.createUser(validation.data);

            return ApiResponseHelper.success(
                res,
                createdUser,
                "User created successfully"
            );
        } catch (error) {
            return this.sendError(res, error);
        }
    };

    loginUser = async (req: Request, res: Response) => {
        try {
            const validation = LoginUserDTO.safeParse(req.body);

            if (!validation.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(validation.error),
                    400
                );
            }

            const loginResponse = await this.userService.loginUser(validation.data);

            return ApiResponseHelper.success(
                res,
                {
                    user: loginResponse.user,
                    token: loginResponse.token,
                },
                "Login successful"
            );
        } catch (error) {
            return this.sendError(res, error);
        }
    };

      whoAmI = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }

      const user = await this.userService.getCurrentUser(req.user.id);

      return ApiResponseHelper.success(
        res,
        user,
        "Authenticated user fetched successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

   updateProfile =async(req: AuthRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }
      console.log("DEBUG req.file:", req.file);
      console.log("DEBUG req.body:", req.body);

      

      const profileImage = req.file
        ? `/uploads/profile/${req.file.filename}`
        : undefined;
      const profileData = UpdateProfileDTO.safeParse({
        ...req.body,
        ...(profileImage ? { profileImage } : {}),
      });

      if (!profileData.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(profileData.error),
          400,
        );
      }

      const user = await this.userService.updateProfile(req.user.id, profileData.data);

      return ApiResponseHelper.success(
        res,
        user,
        "Profile updated successfully",
      );
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }


 updatePassword = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }

      const passwordData = UpdatePasswordDTO.safeParse(req.body);

      if (!passwordData.success) {
        return ApiResponseHelper.error(res, z.prettifyError(passwordData.error), 400);
      }

      const user = await this.userService.updatePassword(req.user.id, passwordData.data);

      return ApiResponseHelper.success(res, user, "Password updated successfully");
    } catch (error: Error | any | unknown) {
      return ApiResponseHelper.error(
        res,
        error.message || "Internal Server Error",
        error.status || 500,
      );
    }
  }

}


