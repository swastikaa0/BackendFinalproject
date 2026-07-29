import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.models";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";

jest.mock("../../configs/email", () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
}));

describe("Authentication API Integration Tests", () => {
  const testUser = {
    fullName: "Test User",
    email: "testuser@gmail.com",
    username: "testuser123",
    password: "password123",
  };
  

  let token: string;

  beforeAll(async () => {
    // Remove existing test user
    await UserModel.deleteOne({ email: testUser.email });
  });

  afterAll(async () => {
    // Clean up
    await UserModel.deleteOne({ email: testUser.email });
  });

  
  describe("POST /api/v1/auth/register", () => {
    test("should validate missing fields", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          fullName: testUser.fullName,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test("should register a new user", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("User created successfully");
    });

    test("should not register duplicate email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  /**
   * --------------------------
   * Login
   * --------------------------
   */

  describe("POST /api/v1/auth/login", () => {
    test("should login successfully", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      expect(res.body.data.token).toBeDefined();

      token = res.body.data.token;
    });

    test("should fail with wrong password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: testUser.email,
          password: "wrongpassword",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test("should fail with wrong email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "wrong@gmail.com",
          password: testUser.password,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  /**
   * --------------------------
   * WhoAmI
   * --------------------------
   */

  describe("GET /api/v1/auth/whoami", () => {
    test("should return logged in user", async () => {
      const res = await request(app)
        .get("/api/v1/auth/whoami")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
    });

    test("should fail without token", async () => {
      const res = await request(app).get("/api/v1/auth/whoami");

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  /**
   * --------------------------
   * Update Password
   * --------------------------
   */

  describe("PATCH /api/v1/auth/update-password", () => {
    test("should update password", async () => {
      const res = await request(app)
        .patch("/api/v1/auth/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "password123",
          newPassword: "newpassword123",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("should fail with incorrect current password", async () => {
      const res = await request(app)
        .patch("/api/v1/auth/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "wrongpassword",
          newPassword: "anotherpassword",
        });

      expect(res.body.success).toBe(false);
    });
  });

  /**
   * --------------------------
   * Forgot Password
   * --------------------------
   */

  describe("POST /api/v1/auth/forgot-password", () => {
    test("should send password reset email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({
          email: testUser.email,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("should fail for unknown email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/forgot-password")
        .send({
          email: "unknown@gmail.com",
        });

      expect(res.body.success).toBe(false);
    });
  });

  /**
   * --------------------------
   * Reset Password
   * --------------------------
   */

  describe("POST /api/v1/auth/reset-password", () => {
    test("should reset password successfully", async () => {
      const user = await UserModel.findOne({
        email: testUser.email,
      });

      const resetToken = jwt.sign(
        {
          id: user!._id,
        },
        SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      const res = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          token: resetToken,
          password: "password123",
          confirmPassword: "password123",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("should fail with invalid token", async () => {
      const res = await request(app)
        .post("/api/v1/auth/reset-password")
        .send({
          token: "invalidtoken",
          password: "password123",
          confirmPassword: "password123",
        });

      expect(res.body.success).toBe(false);
    });
  });
});