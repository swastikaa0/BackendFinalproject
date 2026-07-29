import { UserService } from "../../../services/user.service";
import { UserMongoRepository } from "../../../repositories/user.repository";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../configs/email";
import { HttpException } from "../../../exception/http-exception";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../configs/email");

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe("createUser()", () => {
    it("should create user", async () => {
      jest
        .spyOn(UserMongoRepository.prototype, "getUserByEmail")
        .mockResolvedValue(null);

      jest
        .spyOn(UserMongoRepository.prototype, "getUserByUsername")
        .mockResolvedValue(null);

      (bcryptjs.hash as jest.Mock).mockResolvedValue("hashedPassword");

      jest
        .spyOn(UserMongoRepository.prototype, "createUser")
        .mockResolvedValue({
          _id: "1",
          fullName: "John",
          username: "john12345",
          email: "john@gmail.com",
          password: "hashedPassword",
          role: "user",
          profileImage: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          toObject() {
            return {
              _id: "1",
              fullName: "John",
              username: "john12345",
              email: "john@gmail.com",
              password: "hashedPassword",
              role: "user",
            };
          },
        } as any);

      const result = await service.createUser({
        fullName: "John",
        username: "john12345",
        email: "john@gmail.com",
        password: "password123",
      });

      expect(result.email).toBe("john@gmail.com");
      expect(result.password).toBeUndefined();
    });

    it("should throw if email exists", async () => {
      jest
        .spyOn(UserMongoRepository.prototype, "getUserByEmail")
        .mockResolvedValue({} as any);

      await expect(
        service.createUser({
          fullName: "John",
          username: "john12345",
          email: "john@gmail.com",
          password: "password123",
        })
      ).rejects.toThrow(HttpException);
    });

    it("should throw if username exists", async () => {
      jest
        .spyOn(UserMongoRepository.prototype, "getUserByEmail")
        .mockResolvedValue(null);

      jest
        .spyOn(UserMongoRepository.prototype, "getUserByUsername")
        .mockResolvedValue({} as any);

      await expect(
        service.createUser({
          fullName: "John",
          username: "john12345",
          email: "john@gmail.com",
          password: "password123",
        })
      ).rejects.toThrow(HttpException);
    });
  });

  describe("loginUser()", () => {
    it("should login", async () => {
      jest
        .spyOn(UserMongoRepository.prototype, "getUserByEmail")
        .mockResolvedValue({
          _id: "1",
          fullName: "John",
          username: "john12345",
          email: "john@gmail.com",
          password: "hashedPassword",
          role: "user",
          toObject() {
            return {
              _id: "1",
              fullName: "John",
              username: "john12345",
              email: "john@gmail.com",
              password: "hashedPassword",
              role: "user",
            };
          },
        } as any);

      (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const result = await service.loginUser({
        email: "john@gmail.com",
        password: "password123",
      });

      expect(result.token).toBe("jwt-token");
    });

    it("should throw invalid email", async () => {
      jest
        .spyOn(UserMongoRepository.prototype, "getUserByEmail")
        .mockResolvedValue(null);

      await expect(
        service.loginUser({
          email: "wrong@gmail.com",
          password: "password123",
        })
      ).rejects.toThrow(HttpException);
    });

    it("should throw invalid password", async () => {
      jest
        .spyOn(UserMongoRepository.prototype, "getUserByEmail")
        .mockResolvedValue({
          password: "hashedPassword",
        } as any);

      (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.loginUser({
          email: "john@gmail.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow(HttpException);
    });
  });
});