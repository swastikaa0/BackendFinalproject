import mongoose from "mongoose";

export type BookingType = {
  userId: mongoose.Types.ObjectId;

serviceId: mongoose.Types.ObjectId;


  ownerName: string;

  petName: string;

  phone: string;

  appointmentDate: Date;

  appointmentTime: string;

  notes?: string;

  amount: number;


  paymentStatus: "pending" | "paid" | "failed";

  paymentMethod: "cash" | "khalti"|"eswea";

  status: "pending" | "confirmed" | "completed" | "cancelled";

  
};