import dotenv from "dotenv";
dotenv.config(); 

export const PORT: number = Number(process.env.PORT) || 5000; 
export const DUMMY: string = process.env.DUMMY || "Dummy Export";    
export const MONGODB_URL: string = process.env.MONGODB_URL || "mongodb://localhost:27017/WEBpetgrooming"; 
export const SECRET_KEY: string =
    process.env.SECRET_KEY || "merosecretkey";

// Khalti Configuration
export const KHALTI_SECRET_KEY: string =
  process.env.KHALTI_SECRET_KEY || "";

export const KHALTI_BASE_URL: string =
  process.env.KHALTI_BASE_URL ||
  "https://a.khalti.com/api/v2";

  // eSewa Configuration
export const ESEWA_PRODUCT_CODE: string =
  process.env.ESEWA_PRODUCT_CODE || "";

export const ESEWA_SECRET_KEY: string =
  process.env.ESEWA_SECRET_KEY || "";

export const ESEWA_SUCCESS_URL: string =
  process.env.ESEWA_SUCCESS_URL ||
  "http://localhost:5000/payment/success";

export const ESEWA_FAILURE_URL: string =
  process.env.ESEWA_FAILURE_URL ||
  "http://localhost:5000/payment/failure"
export const EMAIL_USER: string =
    process.env.EMAIL_USER || "example@gmail.com";
export const EMAIL_PASS: string =
    process.env.EMAIL_PASS || "password123";
export const CLIENT_URL: string =
    process.env.CLIENT_URL || 'http://localhost:3002';