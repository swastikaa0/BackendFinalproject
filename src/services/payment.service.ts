import axios from "axios";
import {
  KHALTI_BASE_URL,
  KHALTI_SECRET_KEY,
} from "../configs/constant";


export class PaymentService {


async khaltiPayment(data:any){

  console.log("KHALTI KEY:", KHALTI_SECRET_KEY);

  const response = await axios.post(
    `${KHALTI_BASE_URL}/epayment/initiate/`,
    {
      return_url:
        "http://localhost:3002/payment/success",

      website_url:
        "http://localhost:3002",

      amount: data.amount * 100,

      purchase_order_id:
        data.bookingId,

      purchase_order_name:
        "Pet Grooming Service",
    },
    {
      headers:{
        Authorization:
        `Key ${KHALTI_SECRET_KEY}`,

        "Content-Type":
        "application/json",
      }
    }
  );


  console.log("KHALTI RESPONSE:", response.data);


  return response.data;

}

  async verifyKhaltiPayment(data:any){

  const response = await axios.post(

    `${KHALTI_BASE_URL}/epayment/lookup/`,

    {
      pidx: data.pidx
    },

    {
      headers:{
        Authorization:
        `Key ${KHALTI_SECRET_KEY}`,

        "Content-Type":
        "application/json",
      }
    }

  );


  return response.data;

}



  async esewaPayment(data:any){

    return {
      message:
      "eSewa integration will be added"
    };

  }

}
