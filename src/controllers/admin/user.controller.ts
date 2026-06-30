import { UserService } from "../../services/user.service";
import { z } from "zod";
import {
    CreateUserDTOAdmin,
    UpdateProfileDTO,
    UpdatePasswordDTO,
} from "../../dtos/user.dtos";
import { ApiResponseHelper } from "../../utlis/apihelper.util";
import { Request, Response } from "express";

const userService = new UserService();

interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
}

export class AdminUserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData = CreateUserDTOAdmin.safeParse(req.body);

            if (!userData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(userData.error),
                    400
                );
            }

            const user = await userService.createUser(userData.data);

            return ApiResponseHelper.success(
                res,
                user,
                "User created successfully"
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async updateUser(req: Request<{ id: string }>, res: Response) {
        try {
            const userId = req.params.id as string;

            const userData = UpdateProfileDTO.safeParse(req.body);

            if (!userData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(userData.error),
                    400
                );
            }

            // Upload profile image if available
            if (req.file) {
                userData.data.profileImage = "/uploads/" + req.file.filename;
            }

            const updatedUser = await userService.updateProfile(
                userId,
                userData.data
            );

            return ApiResponseHelper.success(
                res,
                updatedUser,
                "User updated successfully"
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async updatePassword(req: Request<{ id: string }>, res: Response) {
        try {
            const userId = req.params.id as string;

            const userData = UpdatePasswordDTO.safeParse(req.body);

            if (!userData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(userData.error),
                    400
                );
            }

            const updatedUser = await userService.updatePassword(
                userId,
                userData.data
            );

            return ApiResponseHelper.success(
                res,
                updatedUser,
                "Password updated successfully"
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async deleteUser(req: Request<{ id: string }>, res: Response) {
        try {
            const userId = req.params.id;

            const deleted = await userService.deleteUser(userId);

            if (!deleted) {
                return ApiResponseHelper.error(
                    res,
                    "User not found",
                    404
                );
            }

            return ApiResponseHelper.success(
                res,
                null,
                "User deleted successfully"
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async getUserById(req: Request<{ id: string }>, res: Response) {
        try {
            const userId = req.params.id;

            if (!userId) {
                return ApiResponseHelper.error(
                    res,
                    "User ID is required",
                    400
                );
            }

            const user = await userService.getUserById(userId);

            return ApiResponseHelper.success(
                res,
                user,
                "User retrieved successfully"
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async getAllUserPaginated(req: Request, res: Response) {
        try {
            const { page, limit, search } = req.query as QueryParams;

            const { data, pagination } =
                await userService.getAllUserPaginated(
                    page,
                    limit,
                    search
                );

            return ApiResponseHelper.success(
                res,
                data,
                "Users retrieved successfully",
                200,
                pagination
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }
}