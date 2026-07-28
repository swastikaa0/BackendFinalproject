import { Router } from "express";

import { BookingController } from "../controllers/booking.controller";
import { authenticateUser } from "../middlewares/authorized.middleware";
import { adminMiddleware } from "../middlewares/authorized.middleware";
const bookingRouter = Router();
const bookingController = new BookingController();

bookingRouter.post(
  "/",
  authenticateUser,
  bookingController.createBooking
);

bookingRouter.get(
  "/",
  authenticateUser,
  bookingController.getMyBookings
);

bookingRouter.get(
  "/all",
  authenticateUser,
  adminMiddleware,
  bookingController.getAllBookings
);

bookingRouter.get(
  "/:id",
  authenticateUser,
  bookingController.getBookingById
);

bookingRouter.patch(
  "/:id",
  authenticateUser,
  bookingController.updateBooking
);

bookingRouter.patch(
  "/:id/cancel",
  authenticateUser,
  bookingController.cancelBooking
);

bookingRouter.delete(
  "/:id",
  authenticateUser,
  bookingController.deleteBooking
);

bookingRouter.get(
  "/admin/all",
  authenticateUser,
  adminMiddleware,
  bookingController.getAllBookings
);


bookingRouter.patch(
  "/admin/:id",
  authenticateUser,
  adminMiddleware,
  bookingController.updateBooking
);


bookingRouter.delete(
  "/admin/:id",
  authenticateUser,
  adminMiddleware,
  bookingController.deleteBooking
);

// Admin see all bookings
bookingRouter.get(
  "/admin/all",
  authenticateUser,
  adminMiddleware,
  bookingController.getAllBookings
);



// Admin update booking status
bookingRouter.patch(
  "/admin/:id",
  authenticateUser,
  adminMiddleware,
  bookingController.updateBooking
);



// Admin delete booking
bookingRouter.delete(
  "/admin/:id",
  authenticateUser,
  adminMiddleware,
  bookingController.deleteBooking
);


export default bookingRouter;