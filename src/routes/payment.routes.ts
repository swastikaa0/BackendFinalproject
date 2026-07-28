import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authenticateUser } from "../middlewares/authorized.middleware";


const paymentRoutes = Router();


const paymentController =
new PaymentController();

paymentRoutes.get("/", (req,res)=>{
  res.send("Payment route working");
});

paymentRoutes.post(
"/khalti",
authenticateUser,
paymentController.khaltiPayment
);



paymentRoutes.post(
"/khalti/verify",
authenticateUser,
paymentController.verifyKhaltiPayment
);

paymentRoutes.post(
"/esewa",
authenticateUser,
paymentController.esewaPayment
);



export default paymentRoutes;
