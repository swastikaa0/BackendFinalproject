import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
    _id: mongoose.Types.ObjectId;

    name: string;
    description: string;
    price: number;
    duration: number;

    image?: string;

    status: "active" | "inactive";

    createdAt: Date;
    updatedAt: Date;
}

const ServiceMongoSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export const ServiceModel = mongoose.model<IService>(
  "Service",
  ServiceMongoSchema
);