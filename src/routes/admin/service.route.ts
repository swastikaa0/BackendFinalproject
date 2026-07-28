import { Router } from "express";

import { ServiceController } from "../../controllers/admin/service.controller";

import {
    authorizedMiddleware,
    adminMiddleware
} from "../../middlewares/authorized.middleware";

import {
    uploadServiceImage as uploads
} from "../../middlewares/upload.middleware";


const router = Router();

const serviceController = new ServiceController();





router.get(
    "/active",
    serviceController.getActiveServices
);


router.get(
    "/:id",
    serviceController.getServiceById
);






router.use(
    authorizedMiddleware,
    adminMiddleware
);



router.post(
    "/",
    uploads.single("image"),
    serviceController.createService
);



router.get(
    "/",
    serviceController.getAllServicesPaginated
);



router.put(
    "/:id",
    uploads.single("image"),
    serviceController.updateService
);



router.delete(
    "/:id",
    serviceController.deleteService
);



export default router;