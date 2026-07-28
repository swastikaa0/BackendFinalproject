import mongoose, { Schema, Document } from "mongoose";
import { PetType } from "../types/pet.types";

export interface IPet extends PetType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PetMongoSchema: Schema = new Schema<IPet>(
  {
    name: {
      type: String,
      required: true,
    },

    breed: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },

    profileImage: {
      type: String,
      required: false,
    },

   vaccinated: {
  type: String,
  enum: ["Fully Vaccinated", "Booster Due", "Not Vaccinated"],
  required: true,
       },

    lastGrooming: {
      type: Date,
      required: false,
    },

    medicalNotes: {
      type: String,
      required: false,
    },

    groomingPreferences: {
      type: String,
      required: false,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PetModel = mongoose.model<IPet>(
  "Pet",
  PetMongoSchema
);