import { BookingMongoRepository } from "../../../repositories/booking.repository";
import { BookingModel } from "../../../models/booking.models";


jest.mock("../../../models/booking.models", () => ({
  BookingModel: {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe("BookingMongoRepository", () => {
  let repository: BookingMongoRepository;
  beforeEach(() => {
    repository = new BookingMongoRepository();

    jest.clearAllMocks();

  });




  describe("createBooking", () => {


    it("should create booking successfully", async () => {


      const bookingData = {

        serviceId: "service123",

        ownerName: "John",

        petName: "Buddy",

        phone: "9876543210",

      };


      const createdBooking = {

        id: "booking123",

        ...bookingData,

      };



      (BookingModel.create as jest.Mock)
        .mockResolvedValue(createdBooking);



      const result = await repository.createBooking(
        bookingData as any
      );



      expect(
        BookingModel.create
      ).toHaveBeenCalledWith(
        bookingData
      );



      expect(result)
        .toEqual(createdBooking);


    });



    it("should throw error when creation fails", async () => {


      (BookingModel.create as jest.Mock)
        .mockRejectedValue(
          new Error("Database error")
        );



      await expect(
        repository.createBooking({})
      ).rejects.toThrow(
        "Database error"
      );


    });


  });







  describe("getBookingById", () => {


    it("should return booking by id", async () => {


      const booking = {

        id: "booking123",

        ownerName: "John",

      };



      const populateMock = jest
        .fn()
        .mockReturnThis();



      (BookingModel.findById as jest.Mock)
        .mockReturnValue({

          populate: populateMock,

        });



      populateMock
        .mockReturnValueOnce({

          populate: jest
            .fn()
            .mockResolvedValue(booking),

        });



      const result =
        await repository.getBookingById(
          "booking123"
        );



      expect(
        BookingModel.findById
      ).toHaveBeenCalledWith(
        "booking123"
      );


      expect(result)
        .toEqual(booking);


    });


  });







  describe("getBookingsByUser", () => {


    it("should return user's bookings", async () => {


      const bookings = [

        {
          id: "booking123",
        },

      ];



      const sortMock = jest
        .fn()
        .mockResolvedValue(bookings);



      const populateMock = jest
        .fn()
        .mockReturnValue({

          sort: sortMock,

        });



      (BookingModel.find as jest.Mock)
        .mockReturnValue({

          populate: populateMock,

        });



      const result =
        await repository.getBookingsByUser(
          "user123"
        );



      expect(
        BookingModel.find
      ).toHaveBeenCalledWith({

        userId: "user123",

      });



      expect(result)
        .toEqual(bookings);


    });


  });







  describe("getAllBookings", () => {


    it("should return all bookings", async () => {


      const bookings = [

        {
          id: "booking123",
        },

      ];



      const sortMock = jest
        .fn()
        .mockResolvedValue(bookings);



      const populateMock = jest
        .fn()
        .mockReturnValue({

          populate: jest
            .fn()
            .mockReturnValue({

              sort: sortMock,

            }),

        });



      (BookingModel.find as jest.Mock)
        .mockReturnValue({

          populate: populateMock,

        });



      const result =
        await repository.getAllBookings();



      expect(
        BookingModel.find
      ).toHaveBeenCalled();



      expect(result)
        .toEqual(bookings);


    });


  });







  describe("updateBooking", () => {


    it("should update booking successfully", async () => {


      const updatedBooking = {

        id: "booking123",

        status: "completed",

      };



      (BookingModel.findByIdAndUpdate as jest.Mock)
        .mockResolvedValue(updatedBooking);



      const result =
        await repository.updateBooking(
          "booking123",
          {
            status: "completed",
          } as any
        );



      expect(
        BookingModel.findByIdAndUpdate
      ).toHaveBeenCalledWith(
        "booking123",
        {
          status: "completed",
        },
        {
          new: true,
        }
      );



      expect(result)
        .toEqual(updatedBooking);


    });


  });







  describe("updateBookingStatus", () => {


    it("should update booking status", async () => {


      const updated = {

        id: "booking123",

        status: "confirmed",

      };



      (BookingModel.findByIdAndUpdate as jest.Mock)
        .mockResolvedValue(updated);



      const result =
        await repository.updateBookingStatus(
          "booking123",
          "confirmed"
        );



      expect(
        BookingModel.findByIdAndUpdate
      ).toHaveBeenCalledWith(
        "booking123",
        {
          status: "confirmed",
        },
        {
          new: true,
        }
      );



      expect(result)
        .toEqual(updated);


    });


  });







  describe("deleteBooking", () => {


    it("should delete booking successfully", async () => {


      (BookingModel.findByIdAndDelete as jest.Mock)
        .mockResolvedValue({

          id: "booking123",

        });



      const result =
        await repository.deleteBooking(
          "booking123"
        );



      expect(
        BookingModel.findByIdAndDelete
      ).toHaveBeenCalledWith(
        "booking123"
      );



      expect(result)
        .toBe(true);


    });





    it("should return false when booking not found", async () => {


      (BookingModel.findByIdAndDelete as jest.Mock)
        .mockResolvedValue(null);



      const result =
        await repository.deleteBooking(
          "invalid"
        );



      expect(result)
        .toBe(false);


    });


  });







  describe("updatePaymentStatus", () => {


    it("should update payment status successfully", async () => {


      const updated = {

        id: "booking123",

        paymentStatus: "paid",

      };



      (BookingModel.findByIdAndUpdate as jest.Mock)
        .mockResolvedValue(updated);



      const result =
        await repository.updatePaymentStatus(
          "booking123",
          "paid"
        );



      expect(
        BookingModel.findByIdAndUpdate
      ).toHaveBeenCalledWith(
        "booking123",
        {
          paymentStatus: "paid",
        },
        {
          new: true,
        }
      );



      expect(result)
        .toEqual(updated);


    });


  });


});