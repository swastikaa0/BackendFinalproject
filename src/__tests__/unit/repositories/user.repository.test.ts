import mongoose from "mongoose";
import { UserMongoRepository } from "../../../repositories/user.repository";
import { UserModel } from "../../../models/user.models";

jest.mock("../../../models/user.models", () => ({
  UserModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

describe("UserMongoRepository", () => {
  let repository: UserMongoRepository;

  beforeEach(() => {
    repository = new UserMongoRepository();
    jest.clearAllMocks();
  });

  describe("getUserByEmail", () => {
    it("should return a user", async () => {
      const mockUser = {
        email: "john@gmail.com",
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await repository.getUserByEmail("john@gmail.com");

      expect(UserModel.findOne).toHaveBeenCalledWith({
        email: "john@gmail.com",
      });

      expect(result).toEqual(mockUser);
    });

    it("should return null if user does not exist", async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await repository.getUserByEmail("unknown@gmail.com");

      expect(result).toBeNull();
    });
  });

  describe("getUserByUsername", () => {
    it("should return user", async () => {
      const mockUser = {
        username: "john123",
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await repository.getUserByUsername("john123");

      expect(UserModel.findOne).toHaveBeenCalledWith({
        username: "john123",
      });

      expect(result).toEqual(mockUser);
    });
  });

  describe("getUserById", () => {
    it("should return user by id", async () => {
      const id = new mongoose.Types.ObjectId().toString();

      const mockUser = {
        _id: id,
      };

      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await repository.getUserById(id);

      expect(UserModel.findOne).toHaveBeenCalledWith({
        _id: id,
      });

      expect(result).toEqual(mockUser);
    });
  });

  describe("createUser", () => {
    it("should create user", async () => {
      const user = {
        fullName: "John",
        email: "john@gmail.com",
        username: "john12345",
        password: "password123",
      };

      (UserModel.create as jest.Mock).mockResolvedValue(user);

      const result = await repository.createUser(user);

      expect(UserModel.create).toHaveBeenCalledWith(user);

      expect(result).toEqual(user);
    });
  });

  describe("update", () => {
    it("should update user", async () => {
      const id = new mongoose.Types.ObjectId().toString();

      const updatedUser = {
        _id: id,
        fullName: "Updated Name",
      };

      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        updatedUser
      );

      const result = await repository.update(id, {
        fullName: "Updated Name",
      });

      expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        {
          fullName: "Updated Name",
        },
        { new: true }
      );

      expect(result).toEqual(updatedUser);
    });
  });

  describe("delete", () => {
    it("should delete user", async () => {
      const id = new mongoose.Types.ObjectId().toString();

      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue({
        _id: id,
      });

      const result = await repository.delete(id);

      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(id);

      expect(result).toBe(true);
    });

    it("should return false if user not found", async () => {
      const id = new mongoose.Types.ObjectId().toString();

      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await repository.delete(id);

      expect(result).toBe(false);
    });
  });

  describe("getAll", () => {
    it("should return all users", async () => {
      const users = [
        {
          email: "a@gmail.com",
        },
        {
          email: "b@gmail.com",
        },
      ];

      (UserModel.find as jest.Mock).mockResolvedValue(users);

      const result = await repository.getAll();

      expect(UserModel.find).toHaveBeenCalled();

      expect(result).toEqual(users);
    });
  });

  describe("getAdmins", () => {
    it("should return admin users", async () => {
      const admins = [
        {
          role: "admin",
        },
      ];

      (UserModel.find as jest.Mock).mockResolvedValue(admins);

      const result = await repository.getAdmins();

      expect(UserModel.find).toHaveBeenCalledWith({
        role: "admin",
      });

      expect(result).toEqual(admins);
    });
  });

  describe("getAllPaginated", () => {
    it("should return paginated users", async () => {
      const users = [
        {
          email: "john@gmail.com",
        },
      ];

      (UserModel.countDocuments as jest.Mock).mockResolvedValue(1);

      const limitMock = jest.fn().mockResolvedValue(users);
      const skipMock = jest.fn().mockReturnValue({
        limit: limitMock,
      });

      (UserModel.find as jest.Mock).mockReturnValue({
        skip: skipMock,
      });

      const result = await repository.getAllPaginated(
        1,
        10
      );

      expect(UserModel.countDocuments).toHaveBeenCalled();

      expect(skipMock).toHaveBeenCalledWith(0);

      expect(limitMock).toHaveBeenCalledWith(10);

      expect(result).toEqual({
        data: users,
        total: 1,
      });
    });

    it("should search users", async () => {
      (UserModel.countDocuments as jest.Mock).mockResolvedValue(0);

      const limitMock = jest.fn().mockResolvedValue([]);
      const skipMock = jest.fn().mockReturnValue({
        limit: limitMock,
      });

      (UserModel.find as jest.Mock).mockReturnValue({
        skip: skipMock,
      });

      await repository.getAllPaginated(
        1,
        10,
        "john"
      );

      expect(UserModel.find).toHaveBeenCalledWith({
        $or: [
          {
            username: {
              $regex: "john",
              $options: "i",
            },
          },
          {
            email: {
              $regex: "john",
              $options: "i",
            },
          },
        ],
      });
    });
  });
});