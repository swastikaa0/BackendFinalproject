import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { ApiResponseHelper } from "../utlis/apihelper.util";

export class NotificationController {
  private notificationService = new NotificationService();



 
  getNotifications = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const notifications =
        await this.notificationService.getUserNotifications(userId);

      return ApiResponseHelper.success(
        res,
        notifications,
        "Notifications fetched successfully."
      );
    } catch (error: any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch notifications",
        error.statusCode || 500
      );
    }
  };

  
  getUnreadCount = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const count =
        await this.notificationService.getUnreadCount(userId);

      return ApiResponseHelper.success(
        res,
        { unreadCount: count },
        "Unread notification count fetched successfully."
      );
    } catch (error: any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to fetch unread count",
        error.statusCode || 500
      );
    }
  };

 
  markAsRead = async (req: Request, res: Response) => {
    try {
      
      const id = String(req.params.id);

      const notification =
        await this.notificationService.markAsRead(id);

      return ApiResponseHelper.success(
        res,
        notification,
        "Notification marked as read."
      );
    } catch (error: any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to update notification",
        error.statusCode || 500
      );
    }
  };

 
  markAllAsRead = async (req: Request, res: Response) => {
    try {
      const userId = String((req as any).user.id);

      const result =
        await this.notificationService.markAllAsRead(userId);

      return ApiResponseHelper.success(
        res,
        result,
        result.message
      );
    } catch (error: any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to update notifications",
        error.statusCode || 500
      );
    }
  };

  
  deleteNotification = async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id);

      const result =
        await this.notificationService.deleteNotification(id);

      return ApiResponseHelper.success(
        res,
        result,
        result.message
      );
    } catch (error: any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to delete notification",
        error.statusCode || 500
      );
    }
  };

  
  deleteAllNotifications = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;

      const result =
        await this.notificationService.deleteAllNotifications(userId);

      return ApiResponseHelper.success(
        res,
        result,
        result.message
      );
    } catch (error: any) {
      return ApiResponseHelper.error(
        res,
        error.message || "Failed to delete notifications",
        error.statusCode || 500
      );
    }
  };
}