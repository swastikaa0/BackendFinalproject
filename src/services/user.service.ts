import { UserMongoRepository } from "../repositories/user.repository";
import { CreateUserDTO, LoginUserDTO, UpdateProfileDTO, UpdatePasswordDTO } from "../dtos/user.dtos";
import { IUser } from "../models/user.models";
import { HttpException } from "../exception/http-exception";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import { CLIENT_URL, SECRET_KEY } from "../configs/constant";
import { sendEmail } from "../configs/email";
const userRepository = new UserMongoRepository();

export type PublicUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  profileImage?: string | null;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserService {
    private toPublicUser(user: IUser): PublicUser {
        return {
            id: user._id.toString(),
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage || null,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async createUser(userData: CreateUserDTO): Promise<any> {
        const existingEmail = await userRepository.getUserByEmail(userData.email);
        if (existingEmail) {
            throw new HttpException(400, "Email already exists");
        }

        const existingUsername = await userRepository.getUserByUsername(userData.username);
        if (existingUsername) {
            throw new HttpException(400, "Username already exists");
        }

        const hashedPassword = await bcryptjs.hash(userData.password, 10);
        userData.password = hashedPassword;

        const user = await userRepository.createUser(userData);

        const userObj = user.toObject();
        delete userObj.password;

        return userObj;
    }

    async loginUser(loginData: LoginUserDTO) {
        const user = await userRepository.getUserByEmail(loginData.email);

        if (!user) {
            throw new HttpException(400, "Invalid email");
        }

        const isPasswordValid = await bcryptjs.compare(loginData.password, user.password);

        if (!isPasswordValid) {
            throw new HttpException(400, "Invalid password");
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "30d" }
        );

        const userObj = user.toObject();
        delete userObj.password;

        return { user: userObj, token };
    }

    async getCurrentUser(userId: string): Promise<PublicUser> {
        const user = await userRepository.getUserById(userId);

        if (!user) {
            throw new HttpException(404, "User not found");
        }

        return this.toPublicUser(user);
    }

    async updateProfile(userId: string, profileData: UpdateProfileDTO): Promise<PublicUser> {
        const updatePayload: any = { ...profileData }; 

        if (updatePayload.username) {
            const existingUser = await userRepository.getUserByUsername(updatePayload.username);
            if (existingUser && existingUser._id.toString() !== userId) {
                throw new HttpException(400, "Username already taken");
            }
        }

        const updatedUser = await userRepository.update(userId, updatePayload);

        if (!updatedUser) {
            throw new HttpException(404, "User not found");
        }

        return this.toPublicUser(updatedUser);
    }

    
    async updatePassword(userId: string, passwordData: UpdatePasswordDTO) {
        const user = await userRepository.getUserById(userId);

        if (!user) {
            throw new HttpException(404, "User not found");
        }

        const isPasswordValid = await bcryptjs.compare(
            passwordData.currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            throw new HttpException(400, "Current password is incorrect");
        }

        const hashedPassword = await bcryptjs.hash(passwordData.newPassword, 10);
        const updatedUser = await userRepository.update(userId, {
            password: hashedPassword,
        });

        if (!updatedUser) {
            throw new HttpException(404, "User not found");
        }

        return this.toPublicUser(updatedUser);
    }
    async deleteUser(id: string): Promise<boolean> {
        const existingUser = await userRepository.getUserById(id);
        if (!existingUser) {
            throw new HttpException(404, "User not found");
        }
        const deleted = await userRepository.delete(id);
        if (!deleted) {
            throw new HttpException(500, "Failed to delete user");
        }
        return deleted;
    }


    async getUserById(id: string): Promise<IUser | null> {
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new HttpException(404, "User not found");
        }
        return user;
    }

    async getAllUserPaginated(page?: string, limit?: string, search?: string) {
        const currentPage = page && parseInt(page) > 0 ? parseInt(page) : 1;
        const currentLimit = limit && parseInt(limit) > 0 ? parseInt(limit) : 10;
        const currentSearch = search && search.trim() !== "" ? search : undefined;

        const { data, total } = await userRepository.getAllPaginated(currentPage, currentLimit, currentSearch);
        const totalPages = Math.ceil(total / currentLimit);
        const pagination = {
            page: currentPage,
            limit: currentLimit,
            totalPages: totalPages,
            total: total,
        }
        return { data, pagination };
    }

    async forgotPassword(email: string) {
    if (!email) {
        throw new HttpException(400, "Email is required");
    }

    const user = await userRepository.getUserByEmail(email);

    if (!user) {
        throw new HttpException(404, "User not found");
    }

    const token = jwt.sign(
        { id: user._id },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;

    const html = `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password.</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
    `;

    await sendEmail(
        user.email,
        "Password Reset",
        html
    );

    return {
        message: "Password reset email sent successfully",
    };
}

async resetPassword(token: string, newPassword: string) {
    try {

        if (!token || !newPassword) {
            throw new HttpException(
                400,
                "Token and new password are required"
            );
        }

        const decoded: any = jwt.verify(
            token,
            SECRET_KEY
        );

        const user = await userRepository.getUserById(decoded.id);

        if (!user) {
            throw new HttpException(404, "User not found");
        }

        const hashedPassword = await bcryptjs.hash(
            newPassword,
            10
        );

        await userRepository.update(user._id.toString(), {
            password: hashedPassword,
        });

        return {
            message: "Password reset successfully",
        };

    } catch (error) {
        throw new HttpException(
            400,
            "Invalid or expired token"
        );
    }
}
} 