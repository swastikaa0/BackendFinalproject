import { Response } from "express";
import { PetController } from "../../../controllers/pet.controller";
import { PetService } from "../../../services/pet.service";

jest.mock("../../../services/pet.service");

describe("PetController", () => {
  let controller: PetController;

  const mockResponse = () => {
    const res: Partial<Response> = {};

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res as Response;
  };

  const validPetBody = {
    name: "Buddy",
    breed: "Golden Retriever",
    age: 2,
    weight: 20,
    gender: "Male",
    vaccinated: "Fully Vaccinated",
  };

  beforeEach(() => {
    controller = new PetController();
    jest.clearAllMocks();
  });

  describe("createPet", () => {
    it("should create pet successfully", async () => {
      const req: any = {
        user: {
          id: "user123",
        },
        body: validPetBody,
        file: {
          filename: "buddy.jpg",
        },
      };

      const res = mockResponse();

      jest
        .spyOn(PetService.prototype, "createPet")
        .mockResolvedValue({
          id: "1",
          name: "Buddy",
        } as any);

      await controller.createPet(req, res);

      expect(PetService.prototype.createPet).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return unauthorized if user is missing", async () => {
      const req: any = {
        body: {},
      };

      const res = mockResponse();

      await controller.createPet(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return validation error", async () => {
      const req: any = {
        user: {
          id: "user123",
        },
        body: {},
      };

      const res = mockResponse();

      await controller.createPet(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should handle service error", async () => {
      const req: any = {
        user: {
          id: "user123",
        },
        body: validPetBody,
        file: {
          filename: "buddy.jpg",
        },
      };

      const res = mockResponse();

      jest
        .spyOn(PetService.prototype, "createPet")
        .mockRejectedValue({
          message: "Database Error",
          status: 500,
        });

      await controller.createPet(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getMyPets", () => {
    it("should return pets", async () => {
      const req: any = {
        user: {
          id: "user123",
        },
      };

      const res = mockResponse();

      jest.spyOn(PetService.prototype, "getMyPets").mockResolvedValue([
        {
          id: "1",
          name: "Buddy",
        },
      ] as any);

      await controller.getMyPets(req, res);

      expect(PetService.prototype.getMyPets).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return unauthorized", async () => {
      const req: any = {};

      const res = mockResponse();

      await controller.getMyPets(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should handle service error", async () => {
      const req: any = {
        user: {
          id: "user123",
        },
      };

      const res = mockResponse();

      jest.spyOn(PetService.prototype, "getMyPets").mockRejectedValue({
        message: "Error",
        status: 500,
      });

      await controller.getMyPets(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("updatePet", () => {
    it("should update pet successfully", async () => {
      const req: any = {
        params: {
          id: "pet123",
        },
        body: {
          name: "Max",
        },
      };

      const res = mockResponse();

      jest.spyOn(PetService.prototype, "updatePet").mockResolvedValue({
        id: "pet123",
        name: "Max",
      } as any);

      await controller.updatePet(req, res);

      expect(PetService.prototype.updatePet).toHaveBeenCalledWith(
        "pet123",
        expect.any(Object)
      );

      expect(res.status).toHaveBeenCalledWith(200);
    });

    // it("should return validation error", async () => {
    //   const req: any = {
    //     params: {
    //       id: "pet123",
    //     },
    //     body: {},
    //   };

    //   const res = mockResponse();

    //   await controller.updatePet(req, res);

    //   expect(res.status).toHaveBeenCalledWith(400);
    // });

    it("should handle service error", async () => {
      const req: any = {
        params: {
          id: "pet123",
        },
        body: {
          name: "Max",
        },
      };

      const res = mockResponse();

      jest.spyOn(PetService.prototype, "updatePet").mockRejectedValue({
        message: "Pet not found",
        status: 404,
      });

      await controller.updatePet(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deletePet", () => {
    it("should delete pet successfully", async () => {
      const req: any = {
        params: {
          id: "pet123",
        },
      };

      const res = mockResponse();

      jest.spyOn(PetService.prototype, "deletePet").mockResolvedValue(true);

      await controller.deletePet(req, res);

      expect(PetService.prototype.deletePet).toHaveBeenCalledWith("pet123");

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle service error", async () => {
      const req: any = {
        params: {
          id: "pet123",
        },
      };

      const res = mockResponse();

      jest.spyOn(PetService.prototype, "deletePet").mockRejectedValue({
        message: "Pet not found",
        status: 404,
      });

      await controller.deletePet(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});