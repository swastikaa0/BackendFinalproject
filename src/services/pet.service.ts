import { CreatePetDTO, UpdatePetDTO } from "../dtos/pet.dto";
import { HttpException } from "../exception/http-exception";
import { IPet } from "../models/pet.models";
import { PetMongoRepository } from "../repositories/pet.repository";
import mongoose from "mongoose";

const petRepository = new PetMongoRepository();

export class PetService {

    async createPet(ownerId: string, petData: CreatePetDTO): Promise<IPet> {

        const pet = await petRepository.createPet({
            ...petData,
            owner:new mongoose.Types.ObjectId(ownerId),
        });

        return pet;
    }

    async getMyPets(ownerId: string): Promise<IPet[]> {

        return await petRepository.getPetsByOwner(ownerId);

    }

    async getPetById(id: string): Promise<IPet> {

        const pet = await petRepository.getPetById(id);

        if (!pet) {
            throw new HttpException(404, "Pet not found");
        }

        return pet;
    }

    async updatePet(
        id: string,
        petData: UpdatePetDTO
    ): Promise<IPet> {

        const updated = await petRepository.update(id, petData);

        if (!updated) {
            throw new HttpException(404, "Pet not found");
        }

        return updated;
    }

    async deletePet(id: string): Promise<boolean> {

        const pet = await petRepository.getPetById(id);

        if (!pet) {
            throw new HttpException(404, "Pet not found");
        }

        const deleted = await petRepository.delete(id);

        if (!deleted) {
            throw new HttpException(500, "Failed to delete pet");
        }

        return deleted;
    }

}