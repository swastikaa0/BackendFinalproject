import { z } from "zod";
import { PetSchema } from "../types/pet.types";

export const CreatePetDTO = PetSchema.pick({
  name: true,
  breed: true,
  age: true,
  weight: true,
  gender: true,
  vaccinated: true,
  profileImage: true,
  lastGrooming: true,
  medicalNotes: true,
  groomingPreferences: true,
});

export type CreatePetDTO = z.infer<typeof CreatePetDTO>;

export const UpdatePetDTO = PetSchema.partial();

export type UpdatePetDTO = z.infer<typeof UpdatePetDTO>;