import { z } from "zod";
import { ServiceSchema } from "../types/service.types";


export const CreateServiceDTO = ServiceSchema.pick({

    name: true,

    description: true,

    price: true,

    duration: true,

    image: true,

    status: true,

});


export type CreateServiceDTO = z.infer<typeof CreateServiceDTO>;



export const UpdateServiceDTO = ServiceSchema.partial();


export type UpdateServiceDTO = z.infer<typeof UpdateServiceDTO>;