import { Response } from "express";
import { AuthRequest } from "../middlewares/authorized.middleware";
import { ApiResponseHelper } from "../utlis/apihelper.util";
import { PaymentService } from "../services/payment.service";
import { BookingService } from "../services/booking.service";

export class PaymentController {


private paymentService: PaymentService;
private bookingService: BookingService;


constructor(){

this.paymentService =
new PaymentService();

this.bookingService =
new BookingService();

}

esewaPayment = async(
req: AuthRequest,
res: Response
)=>{

try{

const result =
await this.paymentService.esewaPayment(
req.body
);


return ApiResponseHelper.success(
res,
result,
"eSewa payment initialized"
);


}catch(error:any){

return ApiResponseHelper.error(
res,
error.message,
500
);

}

};


khaltiPayment = async (
  req: AuthRequest,
  res: Response
) => {

  console.log("KHALTI TEST ROUTE HIT");

  try {

    console.log("REQUEST BODY:", req.body);


    const result =
      await this.paymentService.khaltiPayment(
        req.body
      );


    console.log("KHALTI RESULT:", result);


    return ApiResponseHelper.success(
      res,
      result,
      "Khalti payment initialized"
    );


  } catch(error:any){

    console.log("KHALTI ERROR:", error);

    return ApiResponseHelper.error(
      res,
      error.message,
      500
    );

  }

};

verifyKhaltiPayment = async(
req: AuthRequest,
res: Response
)=>{

try{


// Verify payment with Khalti
const result =
await this.paymentService.verifyKhaltiPayment(
req.body
);



// Check Khalti payment status
if(result.status !== "Completed"){

return ApiResponseHelper.error(
res,
"Payment verification failed",
400
);

}



// Update booking payment status
const booking =
await this.bookingService.updatePaymentStatus(
req.body.bookingId
);



return ApiResponseHelper.success(
res,
{
 khalti: result,
 booking
},
"Payment verified and booking confirmed"
);



}catch(error:any){


return ApiResponseHelper.error(
res,
error.message,
500
);


}

};






}