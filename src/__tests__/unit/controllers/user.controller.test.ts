import { Request, Response } from "express";
import { UserController } from "../../../controllers/user.controller";
import { UserService } from "../../../services/user.service";

jest.spyOn(UserService.prototype, "createUser")

describe("UserController", () => {
  let controller: UserController;

  const mockResponse = () => {
    const res: Partial<Response> = {};

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);

    return res as Response;
  };

  beforeEach(() => {
    controller = new UserController();
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      const req = {
        body: {
          fullName: "John Doe",
          email: "john@gmail.com",
          username: "john12345",
          password: "password123",
        },
      } as Request;

      const res = mockResponse();

      const createdUser = {
        id: "1",
        fullName: "John Doe",
        email: "john@gmail.com",
        username: "john12345",
      };

      jest
        .spyOn(UserService.prototype, "createUser")
        .mockResolvedValue(createdUser);

      await controller.createUser(req, res);

      expect(UserService.prototype.createUser).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 when validation fails", async () => {
      const req = {
        body: {
          fullName: "",
        },
      } as Request;

      const res = mockResponse();

      await controller.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return error if service throws", async () => {
      const req = {
        body: {
          fullName: "John",
          email: "john@gmail.com",
          username: "john12345",
          password: "password123",
        },
      } as Request;

      const res = mockResponse();

      jest
        .spyOn(UserService.prototype, "createUser")
        .mockRejectedValue({
          message: "Email already exists",
          status: 400,
        });

      await controller.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("loginUser", () => {
    it("should login successfully", async () => {
      const req = {
        body: {
          email: "john@gmail.com",
          password: "password123",
        },
      } as Request;

      const res = mockResponse();

      jest.spyOn(UserService.prototype, "loginUser").mockResolvedValue({
        user: {
          id: "1",
          email: "john@gmail.com",
        },
        token: "jwt-token",
      });

      await controller.loginUser(req, res);

      expect(UserService.prototype.loginUser).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return validation error", async () => {
      const req = {
        body: {},
      } as Request;

      const res = mockResponse();

      await controller.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("whoAmI", () => {
    it("should return authenticated user", async () => {
      const req: any = {
        user: {
          id: "123",
        },
      };

      const res = mockResponse();

      jest.spyOn(UserService.prototype, "getCurrentUser").mockResolvedValue({
        id: "123",
        fullName: "John",
        username: "john12345",
        email: "john@gmail.com",
        role: "usernpm",
      });

      await controller.whoAmI(req, res);

      expect(UserService.prototype.getCurrentUser).toHaveBeenCalledWith("123");

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return unauthorized", async () => {
      const req: any = {};

      const res = mockResponse();

      await controller.whoAmI(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("updatePassword", () => {
    it("should update password", async () => {
      const req: any = {
        user: {
          id: "123",
        },
        body: {
          currentPassword: "oldpassword",
          newPassword: "newpassword123",
        },
      };

      const res = mockResponse();

      jest.spyOn(UserService.prototype, "updatePassword").mockResolvedValue({
           id: "123",
             fullName: "Test User",
            username: "testuser",
               email: "test@gmail.com",
               profileImage: null,
                 role: "user",
              });

      await controller.updatePassword(req, res);

      expect(UserService.prototype.updatePassword).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("forgotPassword", () => {
    it("should send reset email", async () => {
      const req = {
        body: {
          email: "john@gmail.com",
        },
      } as Request;

      const res = mockResponse();

      jest
        .spyOn(UserService.prototype, "forgotPassword")
        .mockResolvedValue({
          message: "Password reset email sent successfully",
        });

      await controller.forgotPassword(req, res);

      expect(UserService.prototype.forgotPassword).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("resetPassword", () => {
    it("should reset password", async () => {
      const req = {
        body: {
          token: "jwt-token",
          password: "newpassword123",
          confirmPassword: "newpassword123",
        },
      } as Request;

      const res = mockResponse();

      jest
        .spyOn(UserService.prototype, "resetPassword")
        .mockResolvedValue({
          message: "Password reset successfully",
        });

      await controller.resetPassword(req, res);

      expect(UserService.prototype.resetPassword).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});