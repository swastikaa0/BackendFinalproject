import { z } from "zod";

export const PaymentDTO = z.object({
  bookingId: z.string(),
  amount: z.number(),
  method: z.enum([
    "esewa",
    "khalti"
  ]),
});

export type PaymentDTO = z.infer<typeof PaymentDTO>;