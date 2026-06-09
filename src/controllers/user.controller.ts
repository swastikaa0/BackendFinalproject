

import { Request, Response } from "express";
import { z } from "zod";

import { UserService } from "../services/user.service";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dtos";
import { ApiResponseHelper } from "../utlis/apihelper.util";

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

    async createUser(req: Request, res: Response) {
        try {
            const validation = CreateUserDTO.safeParse(req.body);

            if (!validation.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(validation.error),
                    400
                );
            }

            const createdUser = await this.userService.createUser(
                validation.data
            );

            return ApiResponseHelper.success(
                res,
                createdUser,
                "User created successfully"
            );
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const validation = LoginUserDTO.safeParse(req.body);

            if (!validation.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(validation.error),
                    400
                );
            }

            const loginResponse = await this.userService.loginUser(
                validation.data
            );

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
    }
}