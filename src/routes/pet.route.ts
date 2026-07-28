import { Router, Request, Response, NextFunction } from "express";

import { PetController } from "../controllers/pet.controller";
import { authenticateUser } from "../middlewares/authorized.middleware";
import { uploadPetImage } from "../middlewares/upload.middleware";
import { ApiResponseHelper } from "../utlis/apihelper.util";

const petRouter = Router();
const petController = new PetController();

const handlePetUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadPetImage.single("profileImage")(req, res, (error) => {
    if (error) {
      return ApiResponseHelper.error(res, error.message, 400);
    }

    next();
  });
};

petRouter.post(
  "/",
  authenticateUser,
  handlePetUpload,
  petController.createPet
);

petRouter.get(
  "/",
  authenticateUser,
  petController.getMyPets
);

petRouter.patch(
  "/:id",
  authenticateUser,
  handlePetUpload,
  petController.updatePet
);

petRouter.delete(
  "/:id",
  authenticateUser,
  petController.deletePet
);

export default petRouter;