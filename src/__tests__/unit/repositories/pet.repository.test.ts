import { PetMongoRepository } from "../../../repositories/pet.repository";
import { PetModel } from "../../../models/pet.models";

jest.mock("../../../models/pet.models", () => ({
  PetModel: {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe("PetMongoRepository", () => {
  let repository: PetMongoRepository;

  beforeEach(() => {
    repository = new PetMongoRepository();
    jest.clearAllMocks();
  });

  describe("createPet", () => {
    it("should create a pet successfully", async () => {
      const petData = {
        name: "Buddy",
        breed: "Golden Retriever",
        age: 2,
        weight: 20,
        gender: "Male",
        vaccinated: "Fully Vaccinated",
        owner: "user123",
      };

      const createdPet = {
        id: "pet123",
        ...petData,
      };

      (PetModel.create as jest.Mock).mockResolvedValue(createdPet);

      const result = await repository.createPet(petData as any);

      expect(PetModel.create).toHaveBeenCalledWith(petData);
      expect(result).toEqual(createdPet);
    });

    it("should throw error when creation fails", async () => {
      (PetModel.create as jest.Mock).mockRejectedValue(
        new Error("Database Error")
      );

      await expect(
        repository.createPet({ name: "Buddy" })
      ).rejects.toThrow("Database Error");
    });
  });


  describe("getPetById", () => {
    it("should return pet by id", async () => {
      const pet = {
        id: "pet123",
        name: "Buddy",
      };

      (PetModel.findOne as jest.Mock).mockResolvedValue(pet);

      const result = await repository.getPetById("pet123");

      expect(PetModel.findOne).toHaveBeenCalledWith({
        _id: "pet123",
      });

      expect(result).toEqual(pet);
    });

    it("should return null if pet does not exist", async () => {
      (PetModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await repository.getPetById("invalid");

      expect(result).toBeNull();
    });
  });


  describe("getPetsByOwner", () => {
    it("should return owner's pets", async () => {
      const pets = [
        {
          id: "pet123",
          name: "Buddy",
        },
      ];

      (PetModel.find as jest.Mock).mockResolvedValue(pets);

      const result = await repository.getPetsByOwner("user123");

      expect(PetModel.find).toHaveBeenCalledWith({
        owner: "user123",
      });

      expect(result).toEqual(pets);
    });

    it("should return empty array when owner has no pets", async () => {
      (PetModel.find as jest.Mock).mockResolvedValue([]);

      const result = await repository.getPetsByOwner("user123");

      expect(result).toEqual([]);
    });
  });


  describe("getAll", () => {
    it("should return all pets", async () => {
      const pets = [
        {
          id: "pet1",
          name: "Buddy",
        },
        {
          id: "pet2",
          name: "Max",
        },
      ];

      (PetModel.find as jest.Mock).mockResolvedValue(pets);

      const result = await repository.getAll();

      expect(PetModel.find).toHaveBeenCalled();

      expect(result).toEqual(pets);
    });

    it("should return empty array when no pets exist", async () => {
      (PetModel.find as jest.Mock).mockResolvedValue([]);

      const result = await repository.getAll();

      expect(result).toEqual([]);
    });
  });


  describe("update", () => {
    it("should update pet successfully", async () => {
      const updatedPet = {
        id: "pet123",
        name: "Max",
      };

      (PetModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        updatedPet
      );

      const result = await repository.update("pet123", {
        name: "Max",
      });

      expect(PetModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "pet123",
        {
          name: "Max",
        },
        {
          new: true,
        }
      );

      expect(result).toEqual(updatedPet);
    });


    it("should return null if update fails", async () => {
      (PetModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await repository.update("invalid", {
        name: "Max",
      });

      expect(result).toBeNull();
    });
  });


  describe("delete", () => {
    it("should delete pet successfully", async () => {
      (PetModel.findByIdAndDelete as jest.Mock).mockResolvedValue({
        id: "pet123",
      });

      const result = await repository.delete("pet123");

      expect(PetModel.findByIdAndDelete).toHaveBeenCalledWith(
        "pet123"
      );

      expect(result).toBe(true);
    });


    it("should return false when pet does not exist", async () => {
      (PetModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
        null
      );

      const result = await repository.delete("invalid");

      expect(result).toBe(false);
    });
  });
});