import request from "supertest";
import mongoose from "mongoose";


jest.mock("../../middlewares/authorized.middleware", () => ({
  authenticateUser: jest.fn((req: any, res: any, next: any) => {
    req.user = {
      id: "65f1a2b3c4d5e6f789012345",
      email: "test@gmail.com",
      role: "user",
    };
    next();
  }),

  adminMiddleware: jest.fn((req: any, res: any, next: any) => {
    next();
  }),

  authorizedMiddleware: jest.fn((req: any, res: any, next: any) => {
    req.user = {
      id: "65f1a2b3c4d5e6f789012345",
      email: "test@gmail.com",
      role: "user",
    };
    next();
  }),
}));

// Mock unused routes loaded by app.ts
jest.mock("../../routes/admin/user.route", () => {
  const router = require("express").Router();
  return router;
});

jest.mock("../../routes/booking.route", () => {
  const router = require("express").Router();
  return router;
});

jest.mock("../../routes/admin/service.route", () => {
  const router = require("express").Router();
  return router;
});

jest.mock("../../routes/payment.routes", () => {
  const router = require("express").Router();
  return router;
});

jest.mock("../../routes/notification.routes", () => {
  const router = require("express").Router();
  return router;
});

import app from "../../app";
import { PetModel } from "../../models/pet.models";
import { authenticateUser } from "../../middlewares/authorized.middleware";

describe("Pet Integration Test", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/class36a_test");
  });

  beforeEach(async () => {
    await PetModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/v1/pets", () => {
    it("should create pet successfully", async () => {
      const response = await request(app).post("/api/v1/pets").send({
        name: "Buddy",
        breed: "Golden Retriever",
        age: 2,
        weight: 20,
        gender: "Male",
        vaccinated: "Fully Vaccinated",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Pet created successfully");

      const pet = await PetModel.findOne({ name: "Buddy" });

      expect(pet).not.toBeNull();
      expect(pet?.breed).toBe("Golden Retriever");
    });

    it("should return validation error", async () => {
      const response = await request(app).post("/api/v1/pets").send({
        name: "",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/v1/pets", () => {
    it("should return user's pets", async () => {
      await PetModel.create({
        name: "Buddy",
        breed: "Labrador",
        age: 3,
        weight: 25,
        gender: "Male",
        vaccinated: "Fully Vaccinated",
        owner: new mongoose.Types.ObjectId(
          "65f1a2b3c4d5e6f789012345"
        ),
      });

      const response = await request(app).get("/api/v1/pets");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe("PATCH /api/v1/pets/:id", () => {
    it("should update pet successfully", async () => {
      const pet = await PetModel.create({
        name: "Buddy",
        breed: "Labrador",
        age: 3,
        weight: 20,
        gender: "Male",
        vaccinated: "Fully Vaccinated",
        owner: new mongoose.Types.ObjectId(
          "65f1a2b3c4d5e6f789012345"
        ),
      });

      const response = await request(app)
        .patch(`/api/v1/pets/${pet._id}`)
        .send({
          name: "Max",
        });

      expect(response.status).toBe(200);

      const updated = await PetModel.findById(pet._id);

      expect(updated?.name).toBe("Max");
    });
  });

  describe("DELETE /api/v1/pets/:id", () => {
    it("should delete pet successfully", async () => {
      const pet = await PetModel.create({
        name: "Buddy",
        breed: "Labrador",
        age: 3,
        weight: 20,
        gender: "Male",
        vaccinated: "Fully Vaccinated",
        owner: new mongoose.Types.ObjectId(
          "65f1a2b3c4d5e6f789012345"
        ),
      });

      const response = await request(app).delete(`/api/v1/pets/${pet._id}`);

      expect(response.status).toBe(200);

      const deleted = await PetModel.findById(pet._id);

      expect(deleted).toBeNull();
    });
  });
});