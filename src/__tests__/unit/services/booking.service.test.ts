import { HttpException } from "../../../exception/http-exception";

jest.mock("../../../repositories/booking.repository", () => ({
  BookingMongoRepository: jest.fn(),
}));

jest.mock("../../../repositories/service.repository", () => ({
  ServiceMongoRepository: jest.fn(),
}));

jest.mock("../../../repositories/user.repository", () => ({
  UserMongoRepository: jest.fn(),
}));

jest.mock("../../../services/notification.service", () => ({
  NotificationService: jest.fn(),
}));

describe("BookingService", () => {
  let service: any;
  let bookingRepo: any;
  let serviceRepo: any;
  let userRepo: any;
  let notification: any;

  beforeEach(() => {
    jest.resetModules();

    const { BookingMongoRepository } = require("../../../repositories/booking.repository");
    const { ServiceMongoRepository } = require("../../../repositories/service.repository");
    const { UserMongoRepository } = require("../../../repositories/user.repository");
    const { NotificationService } = require("../../../services/notification.service");

    bookingRepo = {
      createBooking: jest.fn(),
      getBookingById: jest.fn(),
      getBookingsByUser: jest.fn(),
      updateBooking: jest.fn(),
      updateBookingStatus: jest.fn(),
      deleteBooking: jest.fn(),
      updatePaymentStatus: jest.fn(),
    };

    serviceRepo = {
      getServiceById: jest.fn(),
    };

    userRepo = {
      getAdmins: jest.fn(),
    };

    notification = {
      createNotification: jest.fn(),
    };

    BookingMongoRepository.mockImplementation(() => bookingRepo);
    ServiceMongoRepository.mockImplementation(() => serviceRepo);
    UserMongoRepository.mockImplementation(() => userRepo);
    NotificationService.mockImplementation(() => notification);

    const { BookingService } = require("../../../services/booking.service");
    service = new BookingService();

    jest.clearAllMocks();
  });

  describe("createBooking", () => {
    it("should create booking successfully", async () => {
      const bookingData = {
        serviceId: "65f1a2b3c4d5e6f789012345",
        ownerName: "John",
        petName: "Buddy",
        phone: "9876543210",
        appointmentDate: "2026-01-20",
        appointmentTime: "10:00",
        amount: 500,
        paymentStatus: "pending",
        paymentMethod: "cash",
      };

      serviceRepo.getServiceById.mockResolvedValue({
        _id: bookingData.serviceId,
        name: "Grooming",
        price: 500,
      });

      bookingRepo.createBooking.mockResolvedValue({
        _id: "booking123",
        ...bookingData,
      });

      userRepo.getAdmins.mockResolvedValue([]);

      const result = await service.createBooking(
        "65f1a2b3c4d5e6f789012345",
        bookingData
      );

      expect(serviceRepo.getServiceById).toHaveBeenCalledWith(
        bookingData.serviceId
      );
      expect(bookingRepo.createBooking).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("should throw 404 when service does not exist", async () => {
      serviceRepo.getServiceById.mockResolvedValue(null);

      await expect(
        service.createBooking("65f1a2b3c4d5e6f789012345", {
          serviceId: "invalid",
        } as any)
      ).rejects.toMatchObject({
        status: 404,
        message: "Service not found",
      });
    });
  });

  describe("getBookingById", () => {
    it("should return booking", async () => {
      const booking = {
        _id: "booking123",
        petName: "Buddy",
      };

      bookingRepo.getBookingById.mockResolvedValue(booking);

      const result = await service.getBookingById("booking123");

      expect(bookingRepo.getBookingById).toHaveBeenCalledWith("booking123");
      expect(result).toEqual(booking);
    });

    it("should throw 404 when booking not found", async () => {
      bookingRepo.getBookingById.mockResolvedValue(null);

      await expect(service.getBookingById("invalid")).rejects.toMatchObject({
        status: 404,
        message: "Booking not found",
      });
    });
  });

  describe("updateBooking", () => {
    it("should update booking successfully", async () => {
      const updatedBooking = {
        _id: "booking123",
        status: "confirmed",
      };

      bookingRepo.updateBooking.mockResolvedValue(updatedBooking);

      const result = await service.updateBooking("booking123", {
        status: "confirmed",
      } as any);

      expect(bookingRepo.updateBooking).toHaveBeenCalled();
      expect(result).toEqual(updatedBooking);
    });

    it("should throw 404 when booking does not exist", async () => {
      bookingRepo.updateBooking.mockResolvedValue(null);

      await expect(
        service.updateBooking("invalid", {
          status: "confirmed",
        } as any)
      ).rejects.toMatchObject({
        status: 404,
        message: "Booking not found",
      });
    });
  });

  describe("cancelBooking", () => {
    it("should cancel booking successfully", async () => {
      bookingRepo.getBookingById.mockResolvedValue({
        _id: "booking123",
      });

      bookingRepo.updateBookingStatus.mockResolvedValue({
        _id: "booking123",
        status: "cancelled",
        petName: "Buddy",
        userId: {
          toString: () => "user123",
        },
      });

      const result = await service.cancelBooking("booking123");

      expect(result.status).toBe("cancelled");
    });
  });

  describe("deleteBooking", () => {
    it("should delete booking successfully", async () => {
      bookingRepo.getBookingById.mockResolvedValue({
        _id: "booking123",
      });

      bookingRepo.deleteBooking.mockResolvedValue(true);

      const result = await service.deleteBooking("booking123");

      expect(result).toBe(true);
    });
  });
});



 