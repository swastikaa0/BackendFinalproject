import mongoose, { Schema, Document } from "mongoose";
import { BookingType } from "../types/booking.types";

export interface IBooking extends BookingType, Document {
  _id: mongoose.Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
   userId: {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    
    },

    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

    petName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },
    

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },

    amount: {
  type: Number,
  required: true,
},

paymentStatus: {
  type: String,
  enum: ["pending", "paid", "failed"],
  default: "pending",
},
paymentMethod: {
  type: String,
  enum: ["cash", "esewa","khalti"],
  required: true,
},
  },
  {
    timestamps: true,
  }
);

export const BookingModel = mongoose.model<IBooking>(
  "Booking",
  BookingSchema
);