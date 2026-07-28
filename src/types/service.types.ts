import { z } from "zod";


export const ServiceSchema = z.object({

    name: z.string()
        .min(2, "Service name is required"),

    description: z.string()
        .min(5, "Description is required"),

    price: z.coerce.number()
        .positive("Price must be greater than 0"),

    duration: z.coerce.number()
        .positive( "Duration is required"),

    image: z.string()
        .optional(),

    status: z.enum([
        "active",
        "inactive"
    ])
    .default("active")

});


export type ServiceType = z.infer<typeof ServiceSchema>;