import { Response } from "express";
import { BookingController } from "../../../controllers/booking.controller";
import { BookingService } from "../../../services/booking.service";

jest.mock("../../../services/booking.service");


describe("BookingController", () => {

  let controller: BookingController;


  const mockResponse = () => {

    const res: Partial<Response> = {};

    res.status = jest.fn().mockReturnValue(res);

    res.json = jest.fn().mockReturnValue(res);

    return res as Response;

  };



  beforeEach(() => {

    controller = new BookingController();

    jest.clearAllMocks();

  });




  describe("createBooking", () => {


    it("should create booking successfully", async () => {

  const req: any = {
    user: {
      id: "65f1a2b3c4d5e6f789012345",
    },

    body: {
      serviceId: "service123",
      ownerName: "John Doe",
      petName: "Buddy",
      phone: "9876543210",
      appointmentDate: "2026-01-20",
      appointmentTime: "10:00 AM",
      amount: 500,
      paymentStatus: "pending",
      paymentMethod: "cash",
    },
  };


  const res = mockResponse();


  jest.spyOn(
    BookingService.prototype,
    "createBooking"
  ).mockResolvedValue({
    id: "booking123",
  } as any);



  await controller.createBooking(
    req,
    res
  );


  expect(
    BookingService.prototype.createBooking
  ).toHaveBeenCalledWith(
    "65f1a2b3c4d5e6f789012345",
    expect.any(Object)
  );


  expect(res.status)
    .toHaveBeenCalledWith(200);

});

    it("should return unauthorized if user missing", async () => {


      const req: any = {

        body: {},

      };


      const res = mockResponse();



      await controller.createBooking(
        req,
        res
      );


      expect(res.status)
        .toHaveBeenCalledWith(401);


    });





    it("should return validation error", async () => {


      const req: any = {

        user: {

          id: "65f1a2b3c4d5e6f789012345",

        },

        body: {},

      };


      const res = mockResponse();



      await controller.createBooking(
        req,
        res
      );


      expect(res.status)
        .toHaveBeenCalledWith(400);


    });





    it("should handle service error", async () => {

  const req: any = {

    user: {
      id: "65f1a2b3c4d5e6f789012345",
    },

    body: {

      serviceId: "service123",

      ownerName: "John Doe",

      petName: "Buddy",

      phone: "9876543210",

      appointmentDate: "2026-01-20",

      appointmentTime: "10:00 AM",

      amount: 500,

      paymentStatus: "pending",

      paymentMethod: "cash",

    },

  };


  const res = mockResponse();



  jest.spyOn(
    BookingService.prototype,
    "createBooking"
  ).mockRejectedValue({

    message: "Database Error",

    status: 500,

  });



  await controller.createBooking(
    req,
    res
  );


  expect(
    BookingService.prototype.createBooking
  ).toHaveBeenCalled();



  expect(res.status)
    .toHaveBeenCalledWith(500);


});

  });







  describe("getMyBookings", () => {



    it("should return user's bookings", async () => {


      const req: any = {

        user: {

          id: "user123",

        },

      };


      const res = mockResponse();



      jest.spyOn(
        BookingService.prototype,
        "getMyBookings"
      ).mockResolvedValue([

        {

          id: "booking123",

        },

      ] as any);



      await controller.getMyBookings(
        req,
        res
      );



      expect(
        BookingService.prototype.getMyBookings
      )
      .toHaveBeenCalledWith(
        "user123"
      );



      expect(res.status)
        .toHaveBeenCalledWith(200);


    });




    it("should return unauthorized", async () => {


      const req: any = {};

      const res = mockResponse();



      await controller.getMyBookings(
        req,
        res
      );


      expect(res.status)
        .toHaveBeenCalledWith(401);


    });




    it("should handle service error", async () => {


      const req: any = {

        user: {

          id: "user123",

        },

      };


      const res = mockResponse();



      jest.spyOn(
        BookingService.prototype,
        "getMyBookings"
      ).mockRejectedValue({

        message: "Error",

        status: 500,

      });



      await controller.getMyBookings(
        req,
        res
      );



      expect(res.status)
        .toHaveBeenCalledWith(500);


    });


  });







  describe("getBookingById", () => {



    it("should return booking", async () => {


      const req: any = {

        params: {

          id: "booking123",

        },

      };


      const res = mockResponse();



      jest.spyOn(
        BookingService.prototype,
        "getBookingById"
      ).mockResolvedValue({

        id: "booking123",

      } as any);



      await controller.getBookingById(
        req,
        res
      );



      expect(
        BookingService.prototype.getBookingById
      )
      .toHaveBeenCalledWith(
        "booking123"
      );


      expect(res.status)
        .toHaveBeenCalledWith(200);


    });





    it("should handle error", async () => {


      const req: any = {

        params: {

          id: "booking123",

        },

      };


      const res = mockResponse();



      jest.spyOn(
        BookingService.prototype,
        "getBookingById"
      ).mockRejectedValue({

        message: "Not found",

        status: 404,

      });



      await controller.getBookingById(
        req,
        res
      );



      expect(res.status)
        .toHaveBeenCalledWith(404);


    });


  });







  describe("updateBooking", () => {


    it("should update booking successfully", async () => {


      const req: any = {

        params: {

          id: "booking123",

        },

        body: {

          status: "completed",

        },

      };


      const res = mockResponse();



      jest.spyOn(
        BookingService.prototype,
        "updateBooking"
      ).mockResolvedValue({

        id: "booking123",

      } as any);



      await controller.updateBooking(
        req,
        res
      );



      expect(res.status)
        .toHaveBeenCalledWith(200);


    });




   it("should return validation error", async () => {


    const req: any = {

      params: {
        id: "booking123",
      },


      body: {

        status: "INVALID_STATUS",

      },

    };


    const res = mockResponse();



    await controller.updateBooking(
      req,
      res
    );



    expect(res.status)
      .toHaveBeenCalledWith(400);


  });


});








  describe("cancelBooking", () => {



    it("should cancel booking successfully", async () => {


      const req: any = {

        params: {

          id: "booking123",

        },

      };


      const res = mockResponse();



      jest.spyOn(
        BookingService.prototype,
        "cancelBooking"
      ).mockResolvedValue(true as any);



      await controller.cancelBooking(
        req,
        res
      );



      expect(res.status)
        .toHaveBeenCalledWith(200);


    });


  });







  describe("deleteBooking", () => {


    it("should delete booking successfully", async () => {


      const req: any = {

        params: {

          id: "booking123",

        },

      };


      const res = mockResponse();



      jest.spyOn(
        BookingService.prototype,
        "deleteBooking"
      ).mockResolvedValue(true);



      await controller.deleteBooking(
        req,
        res
      );



      expect(res.status)
        .toHaveBeenCalledWith(200);


    });


  });







  describe("getAllBookings", () => {


    it("should return all bookings", async () => {


      const req: any = {};

      const res = mockResponse();



      jest.spyOn(
        BookingService.prototype,
        "getAllBookings"
      ).mockResolvedValue([] as any);



      await controller.getAllBookings(
        req,
        res
      );



      expect(res.status)
        .toHaveBeenCalledWith(200);


    });


  });







  describe("adminUpdateBooking", () => {


  it("should update booking by admin", async () => {


    const req: any = {

      params: {

        id: "booking123",

      },


      body: {

        status: "completed",

      },

    };


    const res = mockResponse();



    jest.spyOn(
      BookingService.prototype,
      "updateBooking"
    ).mockResolvedValue({

      id: "booking123",

    } as any);



    await controller.adminUpdateBooking(
      req,
      res
    );



    expect(
      BookingService.prototype.updateBooking
    ).toHaveBeenCalledWith(
      "booking123",
      {
        status: "completed",
      }
    );



    expect(res.status)
      .toHaveBeenCalledWith(200);


  });


});





  describe("adminDeleteBooking", () => {


    it("should delete booking by admin", async () => {


      const req: any = {

        params: {

          id: "booking123",

        },

      };


      const res = mockResponse();



      jest.spyOn(
        BookingService.prototype,
        "deleteBooking"
      ).mockResolvedValue(true);



      await controller.adminDeleteBooking(
        req,
        res
      );



      expect(res.status)
        .toHaveBeenCalledWith(200);


    });


  });


});