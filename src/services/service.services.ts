import { CreateServiceDTO, UpdateServiceDTO } from "../dtos/service.dto";
import { HttpException } from "../exception/http-exception";
import { IService } from "../models/service.model";
import { ServiceMongoRepository } from "../repositories/service.repository";
import { NotificationMongoRepository } from "../repositories/notification.repository";
import { UserMongoRepository } from "../repositories/user.repository";

const serviceRepository = new ServiceMongoRepository();
const notificationRepository = new NotificationMongoRepository();
const userRepository = new UserMongoRepository();


export class ServiceService {



    async createService(
        serviceData: CreateServiceDTO
    ): Promise<IService> {


        const existingService =
            await serviceRepository.getAll();


        const duplicate =
            existingService.find(
                service => service.name === serviceData.name
            );


        if (duplicate) {
            throw new HttpException(
                400,
                "Service already exists"
            );
        }



        const service =
            await serviceRepository.createService(
                serviceData
            );

            const users =
        await userRepository.getAll();



    // Prepare notifications
    const notifications =
        users.map(user => ({

            recipient: user._id,

            title: "New Service Added",

            message:
            `${service.name} service is now available.`,

            type: "service",

            isRead: false

        }));



    // Save notifications
    await notificationRepository.createMany(
        notifications
    );


        return service;
    }

async getAllServices(): Promise<IService[]> {
    return await serviceRepository.getAll();
}



   async getAllServicesPaginated(
    page?: string,
    limit?: string,
    search?: string
) {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    return await serviceRepository.getAllPaginated(
        pageNumber,
        limitNumber,
        search
    );
}




    async getActiveServices(): Promise<IService[]> {


        return await serviceRepository.getActiveServices();

    }





    async getServiceById(
        id:string
    ): Promise<IService> {


        const service =
            await serviceRepository.getServiceById(id);



        if(!service){

            throw new HttpException(
                404,
                "Service not found"
            );

        }


        return service;

    }





    async updateService(
        id:string,
        serviceData:UpdateServiceDTO
    ): Promise<IService> {


        const updated =
            await serviceRepository.update(
                id,
                serviceData
            );



        if(!updated){

            throw new HttpException(
                404,
                "Service not found"
            );

        }


        return updated;

    }





    async deleteService(
        id:string
    ): Promise<boolean> {


        const service =
            await serviceRepository.getServiceById(id);



        if(!service){

            throw new HttpException(
                404,
                "Service not found"
            );

        }



        const deleted =
            await serviceRepository.delete(id);



        if(!deleted){

            throw new HttpException(
                500,
                "Failed to delete service"
            );

        }



        return deleted;

    }


}