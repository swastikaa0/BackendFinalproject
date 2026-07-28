import { BookingModel, IBooking } from "../models/booking.models";

export interface IBookingRepository {
  createBooking(booking: Partial<IBooking>): Promise<IBooking>;

  getBookingById(id: string): Promise<IBooking | null>;

  getBookingsByUser(userId: string): Promise<IBooking[]>;

  getAllBookings(): Promise<IBooking[]>;

  updateBooking(
    id: string,
    booking: Partial<IBooking>
  ): Promise<IBooking | null>;

  updateBookingStatus(
    id: string,
    status: string
  ): Promise<IBooking | null>;

  deleteBooking(id: string): Promise<boolean>;
}

export class BookingMongoRepository implements IBookingRepository {
  async createBooking(
    booking: Partial<IBooking>
  ): Promise<IBooking> {
    const created = await BookingModel.create(booking);
    return created;
  }

  async getBookingById(id: string): Promise<IBooking | null> {
    const booking = await BookingModel.findById(id)
  .populate("serviceId")
  .populate("userId");
    return booking;
  }

  async getBookingsByUser(userId: string): Promise<IBooking[]> {
   const bookings = await BookingModel.find({ userId })
  .populate("serviceId")
  .sort({
    appointmentDate: 1,
  });

    return bookings;
  }

  async getAllBookings(): Promise<IBooking[]> {
    const bookings = await BookingModel.find()
  .populate("userId")
  .populate("serviceId")
  .sort({
    createdAt: -1,
  });
    return bookings;
  }

  async updateBooking(
    id: string,
    booking: Partial<IBooking>
  ): Promise<IBooking | null> {
    const updated = await BookingModel.findByIdAndUpdate(
      id,
      booking,
      {
        new: true,
      }
    );

    return updated;
  }

  async updateBookingStatus(
    id: string,
    status: string
  ): Promise<IBooking | null> {
    const updated = await BookingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return updated;
  }


  async deleteBooking(id: string): Promise<boolean> {
    const deleted = await BookingModel.findByIdAndDelete(id);

    return !!deleted;
  }

  async updatePaymentStatus(
  id:string,
  paymentStatus:string
): Promise<IBooking | null>{

  const updated =
  await BookingModel.findByIdAndUpdate(
    id,
    {
      paymentStatus
    },
    
    {
      new:true
    }
  );


  return updated;

}
}