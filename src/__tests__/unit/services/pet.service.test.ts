
import { HttpException } from "../../../exception/http-exception";

jest.mock("../../../repositories/pet.repository");

describe("PetService", () => {
  let service: any;
  let repositoryMock: any;

  beforeEach(() => {
    jest.resetModules();

    const { PetMongoRepository } = require(
      "../../../repositories/pet.repository"
    );

    repositoryMock = {
      createPet: jest.fn(),
      getPetById: jest.fn(),
      getPetsByOwner: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };


    PetMongoRepository.mockImplementation(
      () => repositoryMock
    );


    const { PetService } = require(
      "../../../services/pet.service"
    );


    service = new PetService();


    jest.clearAllMocks();
  });


  describe("createPet", () => {
    it("should create a pet successfully", async () => {
      const petData = {
        name: "Buddy",
        breed: "Golden Retriever",
        age: 2,
        weight: 20,
        gender: "Male" as const,
        vaccinated: "Fully Vaccinated" as const,
      };

      const createdPet = {
        id: "pet123",
        ...petData,
      };

      repositoryMock.createPet.mockResolvedValue(
        createdPet as any
      );

      const result = await service.createPet(
        "65f1a2b3c4d5e6f789012345",
        petData
      );

      expect(repositoryMock.createPet)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            ...petData,
            owner: expect.any(Object),
          })
        );

      expect(result).toEqual(createdPet);
    });


    it("should throw error when repository fails", async () => {
      repositoryMock.createPet.mockRejectedValue(
        new Error("Database error")
      );

      await expect(
        service.createPet(
          "65f1a2b3c4d5e6f789012345",
          {
            name: "Buddy",
            breed: "Golden Retriever",
            age: 2,
            weight: 20,
            gender: "Male",
            vaccinated: "Fully Vaccinated",
          }
        )
      ).rejects.toThrow("Database error");
    });
  });


  describe("getMyPets", () => {
    it("should return user's pets", async () => {
      const pets = [
        {
          id: "pet123",
          name: "Buddy",
        },
      ];

      repositoryMock.getPetsByOwner.mockResolvedValue(
        pets as any
      );

      const result = await service.getMyPets(
        "65f1a2b3c4d5e6f789012345"
      );

      expect(
        repositoryMock.getPetsByOwner
      ).toHaveBeenCalledWith(
        "65f1a2b3c4d5e6f789012345"
      );

      expect(result).toEqual(pets);
    });
  });


  describe("getPetById", () => {
    it("should return pet when found", async () => {
      const pet = {
        id: "pet123",
        name: "Buddy",
      };

      repositoryMock.getPetById.mockResolvedValue(
        pet as any
      );

      const result = await service.getPetById(
        "pet123"
      );

      expect(repositoryMock.getPetById)
        .toHaveBeenCalledWith("pet123");

      expect(result).toEqual(pet);
    });


    it("should throw 404 when pet not found", async () => {
      repositoryMock.getPetById.mockResolvedValue(
        null
      );

      await expect(
           service.getPetById("pet123")
           ).rejects.toMatchObject({
                status: 404,
                message: "Pet not found",
});
  });


  describe("updatePet", () => {
    it("should update pet successfully", async () => {
      const pet = {
        id: "pet123",
        name: "Max",
      };

      repositoryMock.update.mockResolvedValue(
        pet as any
      );
    

      const result = await service.updatePet(
        "pet123",
        {
          name: "Max",
        }
      );

      expect(repositoryMock.update)
        .toHaveBeenCalledWith(
          "pet123",
          {
            name: "Max",
          }
        );

      expect(result).toEqual(pet);
    });


    it("should throw 404 when pet does not exist", async () => {
      repositoryMock.update.mockResolvedValue(
        null
      );

      await expect(
  service.updatePet(
    "pet123",
    {
      name: "Max",
    }
  )
).rejects.toMatchObject({
  status: 404,
  message: "Pet not found",
});
  });
});
});


  describe("deletePet", () => {
    it("should delete pet successfully", async () => {
      repositoryMock.getPetById.mockResolvedValue({
        id: "pet123",
      } as any);

      repositoryMock.delete.mockResolvedValue(
        true
      );

      const result = await service.deletePet(
        "pet123"
      );

      expect(repositoryMock.getPetById)
        .toHaveBeenCalledWith("pet123");

      expect(repositoryMock.delete)
        .toHaveBeenCalledWith("pet123");

      expect(result).toBe(true);
    });


    it("should throw 404 if pet does not exist", async () => {
      repositoryMock.getPetById.mockResolvedValue(
        null
      );

      await expect(
  service.deletePet("pet123")
).rejects.toMatchObject({
  status: 404,
  message: "Pet not found",
});
    });



    it("should throw 500 if delete fails", async () => {
      repositoryMock.getPetById.mockResolvedValue({
        id: "pet123",
      } as any);

      repositoryMock.delete.mockResolvedValue(
        false
      );

      await expect(
       service.deletePet("pet123")
           ).rejects.toMatchObject({
              status: 500,
            message: "Failed to delete pet",
             });
  });
});

});
  