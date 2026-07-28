import { Router } from "express";
import { NotificationController } from "../controllers/notification.controllers";
import { authenticateUser } from "../middlewares/authorized.middleware";

const notificationRouter = Router();

const notificationController = new NotificationController();


notificationRouter.get(
  "/",
  authenticateUser,
  notificationController.getNotifications
);


notificationRouter.get(
  "/unread-count",
  authenticateUser,
  notificationController.getUnreadCount
);


notificationRouter.patch(
  "/:id/read",
  authenticateUser,
  notificationController.markAsRead
);


notificationRouter.patch(
  "/read-all",
  authenticateUser,
  notificationController.markAllAsRead
);


notificationRouter.delete(
  "/:id",
  authenticateUser,
  notificationController.deleteNotification
);


notificationRouter.delete(
  "/",
  authenticateUser,
  notificationController.deleteAllNotifications
);

export default notificationRouter;