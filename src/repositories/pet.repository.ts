import { IPet, PetModel } from "../models/pet.models";

export interface IPetRepository {
  createPet(pet: Partial<IPet>): Promise<IPet>;

  getPetById(id: string): Promise<IPet | null>;

  getPetsByOwner(ownerId: string): Promise<IPet[]>;

  getAll(): Promise<IPet[]>;

  update(id: string, pet: Partial<IPet>): Promise<IPet | null>;

  delete(id: string): Promise<boolean>;
}

export class PetMongoRepository implements IPetRepository {
  async createPet(pet: Partial<IPet>): Promise<IPet> {
    const created = await PetModel.create(pet);
    return created;
  }

  async getPetById(id: string): Promise<IPet | null> {
    const found = await PetModel.findOne({ _id: id });
    return found;
  }

  async getPetsByOwner(ownerId: string): Promise<IPet[]> {
    const found = await PetModel.find({ owner: ownerId });
    return found;
  }

  async getAll(): Promise<IPet[]> {
    const found = await PetModel.find();
    return found;
  }

  async update(id: string, pet: Partial<IPet>): Promise<IPet | null> {
    const updated = await PetModel.findByIdAndUpdate(id, pet, {
      new: true,
    });

    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await PetModel.findByIdAndDelete(id);

    return !!deleted;
  }
}