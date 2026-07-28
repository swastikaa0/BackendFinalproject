import mongoose from "mongoose";
import { z } from "zod";

export type PetType = {
  name: string;
  breed: string;
  age: number;
  weight: number;
  gender: "Male" | "Female";
  profileImage?: string;
  vaccinated: "Fully Vaccinated" | "Booster Due" | "Not Vaccinated";
  lastGrooming?: Date;
  medicalNotes?: string;
  groomingPreferences?: string;
  owner: mongoose.Types.ObjectId;
};

export const PetSchema = z.object({
  name: z.string().min(1, "Pet name is required"),

  breed: z.string().min(1, "Breed is required"),

  age: z.coerce.number().min(0, "Age must be positive"),

  weight: z.coerce.number().min(0, "Weight must be positive"),

  gender: z.enum(["Male", "Female"]),

 vaccinated: z.enum([
  "Fully Vaccinated",
  "Booster Due",
  "Not Vaccinated",
]),

  profileImage: z.string().nullable().optional(),

  lastGrooming: z.coerce.date().optional(),

  medicalNotes: z.string().optional(),

  groomingPreferences: z.string().optional(),
});