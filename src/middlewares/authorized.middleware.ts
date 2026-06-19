// import { Request, Response, NextFunction } from 'express';
// import { SECRET_KEY } from '../configs/constant';
// import jwt from 'jsonwebtoken';
// import { IUser } from '../models/user.models';
// import { UserMongoRepository } from '../repositories/user.repository';
// import { HttpException } from '../exception/http-exception';
// import { ApiResponseHelper } from '../utlis/apihelper.util';

// declare global {
//     namespace Express {
//         interface Request {
//             user?: Record<string, any> | IUser
//         }
//     }
// } // adding tag (user) to request, can use req.user
// let userRepository = new UserMongoRepository();
// export const authorizedMiddleware =
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             const authHeader = req.headers.authorization;
//             if (!authHeader || !authHeader.startsWith('Bearer '))
//                 throw new HttpException(401, 'Unauthorized JWT invalid');
//             // JWT token should start with "Bearer <token>"
//             const token = authHeader.split(' ')[1]; // 0 -> Bearer, 1 -> token
//             if (!token) throw new HttpException(401, 'Unauthorized JWT missing');
//             const decodedToken = jwt.verify(token, SECRET_KEY) as Record<string, any>;
//             if (!decodedToken || !decodedToken.id) {
//                 throw new HttpException(401, 'Unauthorized JWT unverified');
//             } // make function async
//             const user = await userRepository.getUserById(decodedToken.id);
//             if (!user) throw new HttpException(401, 'Unauthorized user not found');
//             req.user = user; // attach user to request (like tag)
//             return next();
//         } catch (err: Error | any) {
//             return ApiResponseHelper.error(
//                 res,
//                 err.message || 'Internal Server Error',
//                 err.status || 500
//             );
//         }
//     }

// export const adminMiddleware = async (
//     req: Request, res: Response, next: NextFunction
// ) => {
//     try {
//         if (!req.user) {
//             throw new HttpException(401, 'Unauthorized no user info');
//         }
//         if (req.user.role !== 'admin') {
//             throw new HttpException(403, 'Forbidden not admin');
//         }
//         return next();
//     } catch (err: Error | any) {
//         return ApiResponseHelper.error(
//             res,
//             err.message || 'Internal Server Error',
//             err.status || 500
//         );
//     }
// }
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import { HttpException } from "../exception/http-exception";
import { UserMongoRepository } from "../repositories/user.repository";
import { ApiResponseHelper } from "../utlis/apihelper.util";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const userRepository = new UserMongoRepository();

const getTokenFromCookies = (cookieHeader?: string) => {
  if (!cookieHeader) return "";

  const cookies = cookieHeader.split(";").reduce<Record<string, string>>(
    (acc, cookie) => {
      const [key, ...value] = cookie.trim().split("=");
      acc[key] = decodeURIComponent(value.join("="));
      return acc;
    },
    {},
  );

  return cookies.auth_token || "";
};

const getTokenFromRequest = (req: Request) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return getTokenFromCookies(req.headers.cookie);
};

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      throw new HttpException(401, "Access token is required");
    }

    const decoded = jwt.verify(token, SECRET_KEY) as {
      id: string;
      email: string;
      role: string;
    };

    const user = await userRepository.getUserById(decoded.id);

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    if (error instanceof HttpException) {
      return ApiResponseHelper.error(res, error.message, error.status);
    }

    if (error.name === "JsonWebTokenError") {
      return ApiResponseHelper.error(res, "Invalid token", 401);
    }

    if (error.name === "TokenExpiredError") {
      return ApiResponseHelper.error(res, "Token has expired", 401);
    }

    return ApiResponseHelper.error(res, "Internal server error", 500);
  }
};
