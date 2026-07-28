import { HttpException } from "../exception/http-exception";
import { NotificationMongoRepository } from "../repositories/notification.repository";

const notificationRepository = new NotificationMongoRepository();

export class NotificationService {
 
  async createNotification(data: {
    recipient: string;
    title: string;
    message: string;
    type: "booking" | "service" | "appointment";
  }) {
    return await notificationRepository.createNotification(data);
  }

  
  async getUserNotifications(userId: string) {
    return await notificationRepository.getUserNotifications(userId);
  }

  
  async getUnreadCount(userId: string) {
    return await notificationRepository.getUnreadCount(userId);
  }

  
  async markAsRead(notificationId: string) {
    const notification =
      await notificationRepository.markAsRead(notificationId);

    if (!notification) {
      throw new HttpException(
        404,
        "Notification not found"
      );
    }

    return notification;
  }

 
  async markAllAsRead(userId: string) {
    await notificationRepository.markAllAsRead(userId);

    return {
      message: "All notifications marked as read",
    };
  }

 
  async deleteNotification(notificationId: string) {
    const notification =
      await notificationRepository.deleteNotification(
        notificationId
      );

    if (!notification) {
      throw new HttpException(
        404,
        "Notification not found"
      );
    }

    return {
      message: "Notification deleted successfully",
    };
  }

  
  async deleteAllNotifications(userId: string) {
    await notificationRepository.deleteAllNotifications(userId);

    return {
      message: "All notifications deleted successfully",
    };
  }
}