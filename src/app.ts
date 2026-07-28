import express, { Application, NextFunction, Request, Response } from "express";
import userRouter from "./routes/user.route";
import { HttpException } from "./exception/http-exception";
import { ApiResponseHelper } from "./utlis/apihelper.util";
import cors from "cors";
import path from "path";

import userRoutes from "./routes/user.route";
import adminUserRoutes from "./routes/admin/user.route";
import petRouter from "./routes/pet.route";
import bookingRouter from "./routes/booking.route";
import serviceRouter from "./routes/admin/service.route";
import paymentRoutes from "./routes/payment.routes";
import notificationRouter from "./routes/notification.routes";

const app: Application = express();
 app.use(
  cors({
    origin: "http://localhost:3002",
    credentials: true,
  })
);
app.use(express.json()); // json input
app.use(express.urlencoded({ extended: true })); 


app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.use("/api/v1/auth", userRouter);

app.use("/api/v1/admin/users", adminUserRoutes); // admin user related routes
app.use("/api/v1/pets", petRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/admin/services", serviceRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/notifications", notificationRouter);
app.get("/", (req: Request, res: Response) => {
    return res.send("Hello, TypeScript-Express!");
});

const PORT: number = 5000;


app.use((req: Request, res: Response) => {
    return res.status(404).json({ message: "API not found" });
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);

    if (err instanceof HttpException) {
        return ApiResponseHelper.error(res, err.message, err.status);
    }

    return ApiResponseHelper.error(res, "Internal Server Error", 500);
});


const DUMMY: string = "Dummy Export";

export {
    PORT,
    DUMMY
};


export default app;