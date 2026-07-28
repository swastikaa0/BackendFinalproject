import { Response } from "express";
import { z } from "zod";

import { AuthRequest } from "../middlewares/authorized.middleware";
import { ApiResponseHelper } from "../utlis/apihelper.util";

import { BookingService } from "../services/booking.service";
import {
  CreateBookingDTO,
  UpdateBookingDTO,
} from "../dtos/booking.dto";

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  private sendError(res: Response, error: any) {
    return ApiResponseHelper.error(
      res,
      error?.message ?? "Internal Server Error",
      error?.status ?? 500
    );
  }

  createBooking = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }

      const validation = CreateBookingDTO.safeParse(req.body);

      if (!validation.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(validation.error),
          400
        );
      }

      const booking = await this.bookingService.createBooking(
        req.user.id,
        validation.data
      );

      return ApiResponseHelper.success(
        res,
        booking,
        "Booking created successfully"
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  getMyBookings = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return ApiResponseHelper.error(res, "Unauthorized", 401);
      }

      const bookings = await this.bookingService.getMyBookings(req.user.id);

      return ApiResponseHelper.success(
        res,
        bookings,
        "Bookings fetched successfully"
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  getBookingById = async (req: AuthRequest, res: Response) => {
    try {
      const booking = await this.bookingService.getBookingById(
        String(req.params.id)
      );

      return ApiResponseHelper.success(
        res,
        booking,
        "Booking fetched successfully"
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  updateBooking = async (req: AuthRequest, res: Response) => {
    try {
      const validation = UpdateBookingDTO.safeParse(req.body);

      if (!validation.success) {
        return ApiResponseHelper.error(
          res,
          z.prettifyError(validation.error),
          400
        );
      }

      const booking = await this.bookingService.updateBooking(
        String(req.params.id),
        validation.data
      );

      return ApiResponseHelper.success(
        res,
        booking,
        "Booking updated successfully"
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  cancelBooking = async (req: AuthRequest, res: Response) => {
    try {
      const booking = await this.bookingService.cancelBooking(
        String(req.params.id)
      );

      return ApiResponseHelper.success(
        res,
        booking,
        "Booking cancelled successfully"
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  deleteBooking = async (req: AuthRequest, res: Response) => {
    try {
      await this.bookingService.deleteBooking(
        String(req.params.id)
      );

      return ApiResponseHelper.success(
        res,
        null,
        "Booking deleted successfully"
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  getAllBookings = async (req: AuthRequest, res: Response) => {
    try {
      const bookings = await this.bookingService.getAllBookings();

      return ApiResponseHelper.success(
        res,
        bookings,
        "All bookings fetched successfully"
      );
    } catch (error) {
      return this.sendError(res, error);
    }
  };

  adminUpdateBooking = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const validation = UpdateBookingDTO.safeParse(req.body);

    if (!validation.success) {
      return ApiResponseHelper.error(
        res,
        z.prettifyError(validation.error),
        400
      );
    }


    const booking =
      await this.bookingService.updateBooking(
        String(req.params.id),
        validation.data
      );


    return ApiResponseHelper.success(
      res,
      booking,
      "Admin updated booking successfully"
    );


  } catch(error){

    return this.sendError(res,error);

  }
};

adminDeleteBooking = async (
  req: AuthRequest,
  res: Response
) => {

try{


await this.bookingService.deleteBooking(
  String(req.params.id)
);


return ApiResponseHelper.success(
  res,
  null,
  "Admin deleted booking successfully"
);


}catch(error){

return this.sendError(res,error);

}

};

  
}