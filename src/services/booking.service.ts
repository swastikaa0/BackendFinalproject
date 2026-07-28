import mongoose from "mongoose";
import { CreateBookingDTO, UpdateBookingDTO } from "../dtos/booking.dto";
import { HttpException } from "../exception/http-exception";
import { IBooking } from "../models/booking.models";
import { BookingMongoRepository } from "../repositories/booking.repository";
import { ServiceMongoRepository } from "../repositories/service.repository";
import { NotificationService } from "./notification.service";
import { UserMongoRepository } from "../repositories/user.repository";

const notificationService = new NotificationService();
const bookingRepository = new BookingMongoRepository();
const serviceRepository = new ServiceMongoRepository();
const userRepository = new UserMongoRepository();

export class BookingService {

  async createBooking(
    userId: string,
    bookingData: CreateBookingDTO
  ): Promise<IBooking> {

    const service = await serviceRepository.getServiceById(
    bookingData.serviceId
  );

  if (!service) {
    throw new HttpException(404, "Service not found");
  }

  const booking = await bookingRepository.createBooking({

    ...bookingData,

    userId: new mongoose.Types.ObjectId(userId),

    serviceId: new mongoose.Types.ObjectId(
      bookingData.serviceId
    ),
    amount: service.price,

    paymentStatus:"pending",

    paymentMethod: bookingData.paymentMethod,

    
    

  });

 const admins =
  await userRepository.getAdmins();


for (const admin of admins) {

  await notificationService.createNotification({

    recipient: admin._id.toString(),

    title: "New Booking Received",

    message:
      `A new booking has been created for ${service.name}.`,

    type: "booking",

  });

}


    return booking;
  }

  async getMyBookings(userId: string): Promise<IBooking[]> {

    return await bookingRepository.getBookingsByUser(userId);

  }

  async getBookingById(id: string): Promise<IBooking> {

    const booking = await bookingRepository.getBookingById(id);

    if (!booking) {
      throw new HttpException(404, "Booking not found");
    }

    return booking;
  }

  async updateBooking(
    id: string,
    bookingData: UpdateBookingDTO
): Promise<IBooking> {


    const updateData:any = {
        ...bookingData,
    };


    if(updateData.serviceId){

        updateData.serviceId =
            new mongoose.Types.ObjectId(
                updateData.serviceId
            );

    }


    const updated =
        await bookingRepository.updateBooking(
            id,
            updateData
        );


    if (!updated) {

        throw new HttpException(
            404,
            "Booking not found"
        );

    }


    if(
        bookingData.appointmentDate ||
        bookingData.appointmentTime
    ){

        await notificationService.createNotification({

            recipient: updated.userId.toString(),

            title:"Booking Rescheduled",

            message:
            `Your appointment has been rescheduled to ${updated.appointmentDate} at ${updated.appointmentTime}.`,

            type:"appointment"

        });

         const admins = await userRepository.getAdmins();


    for(const admin of admins){

        await notificationService.createNotification({

            recipient: admin._id.toString(),

            title:"Booking Rescheduled",

            message:
            `A user has rescheduled their booking to ${updated.appointmentDate} at ${updated.appointmentTime}.`,

            type:"appointment"

        });

    }

    }


    return updated;
}

  async cancelBooking(id: string): Promise<IBooking> {

    const booking = await bookingRepository.getBookingById(id);

    if (!booking) {
      throw new HttpException(404, "Booking not found");
    }

    const cancelled = await bookingRepository.updateBookingStatus(
      id,
      "cancelled"
    );

    if (!cancelled) {
      throw new HttpException(500, "Failed to cancel booking");
    }

    await notificationService.createNotification({
    recipient: cancelled.userId.toString(),
    title: "Booking Cancelled",
    message: `Your booking for ${cancelled.petName} has been cancelled.`,
    type: "appointment",
});

    return cancelled;
  }

  async deleteBooking(id: string): Promise<boolean> {

    const booking = await bookingRepository.getBookingById(id);

    if (!booking) {
      throw new HttpException(404, "Booking not found");
    }

    const deleted = await bookingRepository.deleteBooking(id);

    if (!deleted) {
      throw new HttpException(500, "Failed to delete booking");
    }

    return deleted;
  }

  async getAllBookings(): Promise<IBooking[]> {

    return await bookingRepository.getAllBookings();

  }

  async adminUpdateBooking(
  id: string,
  bookingData: UpdateBookingDTO
): Promise<IBooking> {


  const updateData:any = {
    ...bookingData,
  };


  // Convert serviceId string to ObjectId
  if(updateData.serviceId){

    updateData.serviceId =
      new mongoose.Types.ObjectId(
        updateData.serviceId
      );

  }



  const booking =
    await bookingRepository.updateBooking(
      id,
      updateData
    );


  if(!booking){

    throw new HttpException(
      404,
      "Booking not found"
    );

  }
  let title = "Booking Updated";
let message = "Your booking has been updated.";

switch (booking.status) {
  case "confirmed":
    title = "Booking Confirmed";
    message = "Your appointment has been confirmed by the admin.";
    break;

  case "cancelled":
    title = "Booking Cancelled";
    message = "Your appointment has been cancelled by the admin.";
    break;

  case "completed":
    title = "Service Completed";
    message = "Your pet grooming service has been completed.";
    break;

  case "pending":
    title = "Booking Pending";
    message = "Your booking is currently pending.";
    break;
}

   await notificationService.createNotification({
    recipient: booking.userId.toString(),
    title: "Booking Updated",
    message: `Your booking has been updated. Current status: ${booking.status}.`,
    type: "appointment",
  });

  return booking;


  return booking;

}

  async updatePaymentStatus(
  id: string
): Promise<IBooking> {

  const booking =
    await bookingRepository.updatePaymentStatus(
      id,
      "paid"
    );


  if (!booking) {
    throw new HttpException(
      404,
      "Booking not found"
    );
  }

  await notificationService.createNotification({
    recipient: booking.userId.toString(),
    title: "Payment Successful",
    message: `Your payment has been received successfully.`,
    type: "booking",
});


  return booking;
}
}