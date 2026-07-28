import { IService, ServiceModel } from "../models/service.model";


export interface IServiceRepository {

    createService(service: Partial<IService>): Promise<IService>;

    getServiceById(id: string): Promise<IService | null>;

    getAll(): Promise<IService[]>;

    getAllPaginated(
        page: number,
        limit: number,
        search?: string
    ): Promise<{
        data: IService[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;


    getActiveServices(): Promise<IService[]>;

    update(id: string, service: Partial<IService>): Promise<IService | null>;

    delete(id: string): Promise<boolean>;
}



export class ServiceMongoRepository implements IServiceRepository {


    async createService(service: Partial<IService>): Promise<IService> {

        const created = await ServiceModel.create(service);

        return created;
    }



    async getServiceById(id: string): Promise<IService | null> {

        const found = await ServiceModel.findOne({
            _id: id
        });

        return found;
    }



    async getAll(): Promise<IService[]> {

        const found = await ServiceModel.find();

        return found;
    }

    async getAllPaginated(
    page: number,
    limit: number,
    search?: string
): Promise<{
    data: IService[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}> {
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (search) {
        filter.name = {
            $regex: search,
            $options: "i",
        };
    }

    const [data, total] = await Promise.all([
        ServiceModel.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),

        ServiceModel.countDocuments(filter),
    ]);

    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}



    async getActiveServices(): Promise<IService[]> {

        const found = await ServiceModel.find({
            status: "active"
        });

        return found;
    }



    async update(
        id: string,
        service: Partial<IService>
    ): Promise<IService | null> {


        const updated = await ServiceModel.findByIdAndUpdate(
            id,
            service,
            {
                new:true
            }
        );


        return updated;
    }



    async delete(id: string): Promise<boolean> {

        const deleted = await ServiceModel.findByIdAndDelete(id);


        return !!deleted;
    }

}