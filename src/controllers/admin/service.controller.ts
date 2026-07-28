import { Request, Response } from "express";
import { z } from "zod";

import { ServiceService } from "../../services/service.services";
import {
    CreateServiceDTO,
    UpdateServiceDTO,
} from "../../dtos/service.dto";
import { ApiResponseHelper } from "../../utlis/apihelper.util";

const serviceService = new ServiceService();

interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
}

export class ServiceController {
    async createService(req: Request, res: Response) {
        try {
            const serviceData = CreateServiceDTO.safeParse(req.body);

            if (!serviceData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(serviceData.error),
                    400
                );
            }

            if (req.file) {
                serviceData.data.image = "/uploads/services/" + req.file.filename;
            }

            const service = await serviceService.createService(
                serviceData.data
            );

            return ApiResponseHelper.success(
                res,
                service,
                "Service created successfully"
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async updateService(req: Request<{ id: string }>, res: Response) {
        try {
             console.log(req.body);
            const serviceId = req.params.id;

            const serviceData = UpdateServiceDTO.safeParse(req.body);

            if (!serviceData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(serviceData.error),
                    400
                );
            }

            if (req.file) {
                serviceData.data.image = "/uploads/services/" + req.file.filename;
            }

            const updatedService = await serviceService.updateService(
                serviceId,
                serviceData.data
            );

            return ApiResponseHelper.success(
                res,
                updatedService,
                "Service updated successfully"
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async deleteService(req: Request<{ id: string }>, res: Response) {
        try {
            const serviceId = req.params.id;

            const deleted = await serviceService.deleteService(serviceId);

            if (!deleted) {
                return ApiResponseHelper.error(
                    res,
                    "Service not found",
                    404
                );
            }

            return ApiResponseHelper.success(
                res,
                null,
                "Service deleted successfully"
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async getServiceById(req: Request<{ id: string }>, res: Response) {
        try {
            const serviceId = req.params.id;

            if (!serviceId) {
                return ApiResponseHelper.error(
                    res,
                    "Service ID is required",
                    400
                );
            }

            const service = await serviceService.getServiceById(serviceId);

            return ApiResponseHelper.success(
                res,
                service,
                "Service retrieved successfully"
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async getAllServices(req: Request, res: Response) {
        try {
            const services = await serviceService.getAllServices();

            return ApiResponseHelper.success(
                res,
                services,
                "Services retrieved successfully"
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    async getActiveServices(req: Request, res: Response) {
        try {
            const services = await serviceService.getActiveServices();

            return ApiResponseHelper.success(
                res,
                services,
                "Active services retrieved successfully"
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    // Optional: if your service layer supports pagination
    async getAllServicesPaginated(req: Request, res: Response) {

        try {
            console.log(" getAllServicesPaginated called");
            const { page, limit, search } = req.query as QueryParams;

            const { data, pagination } =
                await serviceService.getAllServicesPaginated(
                    page,
                    limit,
                    search
                );

               console.log(
        data.map(s => ({
            name: s.name,
            status: s.status,
        }))
    ); 

            return ApiResponseHelper.success(
                res,
                data,
                "Services retrieved successfully",
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