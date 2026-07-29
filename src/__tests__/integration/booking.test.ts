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
}));

// Mock admin route because app imports it
jest.mock("../../routes/admin/user.route", () => {
  const router = require("express").Router();
  return router;
});

import app from "../../app";
import { BookingModel } from "../../models/booking.models";
import { ServiceModel } from "../../models/service.model";
import { authenticateUser } from "../../middlewares/authorized.middleware";

describe("Booking Integration Test", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/class36a_test");
  });

  beforeEach(async () => {
    await BookingModel.deleteMany({});
    await ServiceModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/v1/bookings", () => {
   it("should create booking successfully", async () => {

  const service = await ServiceModel.create({

    name: "Full Grooming",

    description: "Complete pet grooming",

    price: 1000,

    duration: 2

  });


  const response = await request(app)
    .post("/api/v1/bookings")
    .send({

      serviceId: service._id.toString(),

      ownerName: "John",

      petName: "Buddy",

      phone: "9800000000",

      appointmentDate: "2026-01-20",

      appointmentTime: "10:00 AM",

      notes: "Be careful",

      amount: 1000,

      paymentStatus: "pending",

      paymentMethod: "cash"

    });


  expect(response.status).toBe(200);

  expect(response.body.message)
    .toBe("Booking created successfully");


  const booking =
    await BookingModel.findOne({
      petName: "Buddy"
    });


  expect(booking).not.toBeNull();

});

    it("should return validation error for invalid booking data", async () => {
      const response = await request(app)
        .post("/api/v1/bookings")
        .send({
          petName: "",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/v1/bookings", () => {
    it("should return user bookings", async () => {
      await BookingModel.create({
        userId: new mongoose.Types.ObjectId(
          "65f1a2b3c4d5e6f789012345"
        ),
        serviceId: new mongoose.Types.ObjectId(),
        ownerName: "John",
        petName: "Buddy",
        phone: "9800000000",
        appointmentDate: new Date(),
        appointmentTime: "10 AM",
        amount: 1000,
        paymentStatus: "pending",
        paymentMethod: "cash",
        status: "pending",
      });

      const response = await request(app).get("/api/v1/bookings");

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
    });
  });

  describe("GET /api/v1/bookings/:id", () => {
    it("should return booking by id", async () => {
      const booking = await BookingModel.create({
        userId: new mongoose.Types.ObjectId(
          "65f1a2b3c4d5e6f789012345"
        ),
        serviceId: new mongoose.Types.ObjectId(),
        ownerName: "John",
        petName: "Buddy",
        phone: "9800000000",
        appointmentDate: new Date(),
        appointmentTime: "10 AM",
        amount: 1000,
        paymentStatus: "pending",
        paymentMethod: "cash",
        status: "pending",
      });

      const response = await request(app).get(
        `/api/v1/bookings/${booking._id}`
      );

      expect(response.status).toBe(200);
    });
  });

  describe("DELETE /api/v1/bookings/:id", () => {
    it("should delete booking successfully", async () => {
      const booking = await BookingModel.create({
        userId: new mongoose.Types.ObjectId(
          "65f1a2b3c4d5e6f789012345"
        ),
        serviceId: new mongoose.Types.ObjectId(),
        ownerName: "John",
        petName: "Buddy",
        phone: "9800000000",
        appointmentDate: new Date(),
        appointmentTime: "10 AM",
        amount: 1000,
        paymentStatus: "pending",
        paymentMethod: "cash",
        status: "pending",
      });

      const response = await request(app).delete(
        `/api/v1/bookings/${booking._id}`
      );

      expect(response.status).toBe(200);

      const deleted = await BookingModel.findById(booking._id);

      expect(deleted).toBeNull();
    });
  });

  describe("Admin Booking Routes", () => {
    it("should get all bookings as admin", async () => {
      const response = await request(app).get(
        "/api/v1/bookings/all"
      );

      expect(response.status).toBe(200);
    });
  });

  describe("Unauthorized booking request", () => {
    it("should reject without authentication", async () => {
      (authenticateUser as jest.Mock).mockImplementationOnce(
        (req: any, res: any) => {
          return res.status(401).json({
            message: "Unauthorized",
          });
        }
      );

      const response = await request(app).get(
        "/api/v1/bookings"
      );

      expect(response.status).toBe(401);
    });
  });
});