import mongoose from "mongoose";
import {
  INotification,
  NotificationModel,
} from "../models/notification.model";

export class NotificationMongoRepository {
  
  async createNotification(data: {
    recipient: string;
    title: string;
    message: string;
    type: "booking" | "service" | "appointment";
  }): Promise<INotification> {

    console.log("Creating notification:", data);
    const notification = await NotificationModel.create({
      recipient: new mongoose.Types.ObjectId(data.recipient),
      title: data.title,
      message: data.message,
      type: data.type,
    });

    return notification;
  }

  
  async getUserNotifications(
    userId: string
  ): Promise<INotification[]> {
    return NotificationModel.find({
      recipient: userId,
    })
      .sort({ createdAt: -1 })
      .lean();
  }

  
  async markAsRead(
    notificationId: string
  ): Promise<INotification | null> {
    return NotificationModel.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
      },
      {
        new: true,
      }
    );
  }

  
  async markAllAsRead(
    userId: string
  ) {
    return NotificationModel.updateMany(
      {
        recipient: userId,
      },
      {
        isRead: true,
      }
    );
  }

  
  async deleteNotification(
    notificationId: string
  ) {
    return NotificationModel.findByIdAndDelete(notificationId);
  }

  
  async deleteAllNotifications(
    userId: string
  ) {
    return NotificationModel.deleteMany({
      recipient: userId,
    });
  }

  
  async getUnreadCount(
    userId: string
  ): Promise<number> {
    return NotificationModel.countDocuments({
      recipient: userId,
      isRead: false,
    });
  }

   async createMany(data:any[]){

    const notifications =
        data.map(notification => ({
            
            recipient:
                new mongoose.Types.ObjectId(
                    notification.recipient
                ),

            title: notification.title,

            message: notification.message,

            type: notification.type,

            isRead:false

        }));


    return await NotificationModel.insertMany(
        notifications
    );

}


    async getNotificationsByUser(
        recipient:string
    ){

        return await NotificationModel.find({
            recipient
        })
        .sort({
            createdAt:-1
        });

    }

     


}
