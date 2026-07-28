import { Response } from "express";
import { z } from "zod";

import { AuthRequest } from "../middlewares/authorized.middleware";
import { ApiResponseHelper } from "../utlis/apihelper.util";

import { PetService } from "../services/pet.service";
import { CreatePetDTO, UpdatePetDTO } from "../dtos/pet.dto";

export class PetController {
    private petService: PetService;

    constructor() {
        this.petService = new PetService();
    }

    private sendError(res: Response, error: any) {
        return ApiResponseHelper.error(
            res,
            error?.message ?? "Internal Server Error",
            error?.status ?? 500
        );
    }

    createPet = async (req: AuthRequest, res: Response) => {
        try {

            if (!req.user?.id) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }

            const profileImage = req.file
                ? `/uploads/pets/${req.file.filename}`
                : undefined;

            const validation = CreatePetDTO.safeParse({
                ...req.body,
                ...(profileImage ? { profileImage } : {})
            });

            if (!validation.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(validation.error),
                    400
                );
            }

            const pet = await this.petService.createPet(
                req.user.id,
                validation.data
            );

            return ApiResponseHelper.success(
                res,
                pet,
                "Pet created successfully"
            );

        } catch (error) {
            return this.sendError(res, error);
        }
    };

    getMyPets = async (req: AuthRequest, res: Response) => {
        try {

            if (!req.user?.id) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }

            const pets = await this.petService.getMyPets(req.user.id);

            return ApiResponseHelper.success(
                res,
                pets,
                "Pets fetched successfully"
            );

        } catch (error) {
            return this.sendError(res, error);
        }
    };

    updatePet = async (req: AuthRequest, res: Response) => {

        try {

            const validation = UpdatePetDTO.safeParse(req.body);

            if (!validation.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(validation.error),
                    400
                );
            }

            const pet = await this.petService.updatePet(
              String(req.params.id),
                   validation.data
                   );

            return ApiResponseHelper.success(
                res,
                pet,
                "Pet updated successfully"
            );

        } catch (error) {
            return this.sendError(res, error);
        }

    };

    deletePet = async (req: AuthRequest, res: Response) => {

        try {

           await this.petService.deletePet(
    String(req.params.id)
);

            return ApiResponseHelper.success(
                res,
                null,
                "Pet deleted successfully"
            );

        } catch (error) {
            return this.sendError(res, error);
        }

    };

}