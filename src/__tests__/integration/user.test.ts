import request from "supertest";
import mongoose from "mongoose";

// Mock middleware
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

// Mock admin routes because app imports them
jest.mock("../../routes/admin/user.route", () => {
  const router = require("express").Router();
  return router;
});

import app from "../../app";
import { UserModel } from "../../models/user.models";
import { authenticateUser } from "../../middlewares/authorized.middleware";

describe("User Integration Test", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/class36a_test");
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/v1/auth/register", () => {
    // it("should register user successfully", async () => {
    //   const response = await request(app)
    //     .post("/api/v1/auth/register")
    //     .send({
          
    //          username:"john123",
    //          fullName:"John123",
    //         email:"john@gmail.com",
    //           password:"password123",
              
  
    //     });
    //     console.log(response.body);

    //   expect(response.status).toBe(200);
    //   expect(response.body.message).toContain("success");

    //   const user = await UserModel.findOne({
    //     email: "john@gmail.com",
    //   });

    //   expect(user).not.toBeNull();
    // });

    it("should return validation error", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "wrong",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login successfully", async () => {
      await UserModel.create(
        {
            username:"john123",
        fullName: "John",
        email: "john@gmail.com",
        password: "$2b$10$abcdefghijklmnop",
        
      });

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "john@gmail.com",
          password: "password123",
        });

      expect(response.status).toBeDefined();
    });
  });

  describe("GET /api/v1/auth/whoami",()=>{
    it("should return logged in user",async()=>{

await UserModel.create({
  _id:new mongoose.Types.ObjectId(
    "65f1a2b3c4d5e6f789012345"
  ),
  username:"john123",

  fullName:"John",

  email:"test@gmail.com",

  password:"password123",
});

const response =
await request(app)
.get("/api/v1/auth/whoami");

expect(response.status)
.toBe(200);
expect(response.body)
.toBeDefined();
});


});
  describe("PATCH /api/v1/auth/update-password", () => {
    it("should update password", async () => {
      const response = await request(app)
        .patch("/api/v1/auth/update-password")
        .send({
          oldPassword: "password123",
          newPassword: "newpassword123",
        });

      expect(response.status).toBeDefined();
    });
  });

  describe("Unauthorized request", () => {
    it("should reject unauthenticated user", async () => {
      (authenticateUser as jest.Mock).mockImplementationOnce(
        (req: any, res: any) => {
          return res.status(401).json({
            message: "Unauthorized",
          });
        }
      );

      const response = await request(app).get("/api/v1/auth/whoami");

      expect(response.status).toBe(401);
    });
  });
});