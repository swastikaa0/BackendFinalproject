import { z } from "zod";

export const BookingSchema = z.object({
  serviceId: z.string().min(1, "Service is required"),

  ownerName: z
    .string()
    .min(2, "Owner name must be at least 2 characters"),

  petName: z
    .string()
    .min(2, "Pet name must be at least 2 characters"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),

  appointmentDate: z.coerce.date(),

  appointmentTime: z
    .string()
    .min(1, "Appointment time is required"),

  notes: z.string().optional(),

  status: z.enum([
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ]),

  amount: z.number(),

paymentStatus: z.enum([
  "pending",
  "paid",
  "failed",
]),

paymentMethod: z.enum([
  "cash",
  "khalti",
  "eswea",
]),

});

export const CreateBookingDTO = BookingSchema.pick({
  serviceId: true,
  ownerName: true,
  petName: true,
  phone: true,
  appointmentDate: true,
  appointmentTime: true,
  notes: true,
   amount: true,
  paymentStatus: true,
  paymentMethod: true,
});

export type CreateBookingDTO = z.infer<typeof CreateBookingDTO>;

export const UpdateBookingDTO = BookingSchema.pick({
  serviceId: true,
  ownerName: true,
  petName: true,
  phone: true,
  appointmentDate: true,
  appointmentTime: true,
  notes: true,
  status: true,
}).partial();

export type UpdateBookingDTO = z.infer<typeof UpdateBookingDTO>;

export const UpdateBookingStatusDTO = z.object({
  status: z.enum([
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
  ]),
});

export type UpdateBookingStatusDTO = z.infer<
  typeof UpdateBookingStatusDTO
>;