import { UserController } from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/authorized.middleware";
import { NextFunction, Request, Response, Router } from "express";
import { uploadProfileImage } from "../middlewares/upload.middleware";

import { ApiResponseHelper } from "../utlis/apihelper.util";


const userRouter = Router();
const userController = new UserController();

const handleProfileUpload = (req: Request, res: Response, next: NextFunction) => {
  uploadProfileImage.single("profileImage")(req, res, (error) => {
    if (error) {
      return ApiResponseHelper.error(res, error.message, 400);
    }

    next();
  });
};

userRouter.post("/register", userController.createUser);
userRouter.post("/login",userController.loginUser);
userRouter.get("/whoami", authenticateUser, userController.whoAmI);
userRouter.patch(
  "/update",
  authenticateUser,
  handleProfileUpload,
  userController.updateProfile,
);
userRouter.patch(
  "/update-password",
  authenticateUser,
  userController.updatePassword,
);
// Forgot Password
userRouter.post(
  "/forgot-password",
  userController.forgotPassword
);

userRouter.post(
  "/reset-password",
  userController.resetPassword
);



export default userRouter;
