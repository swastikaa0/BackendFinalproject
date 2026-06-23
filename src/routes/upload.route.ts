// import { Router ,Request,Response} from "express";
// import { uploads } from "../middlewares/upload.middleware";
// import { HttpException } from "../exception/http-exception";
// import { ApiResponseHelper } from "../utlis/apihelper.util";


// interface UploadRequest extends Request {
//   file?: Express.Multer.File;
// }

// const router = Router();

// // Single file upload
// router.post("/upload", 
  
//   uploads.single("file"), (req, res) => {
//   try {
//     if (!req.file) {
//       throw new HttpException(400, "No file uploaded");
//     }
//     req.file.path = "/uploads/"+ req.file.filename;// set file path for response 
//     return ApiResponseHelper.success(
//       res,
//       req.file,
//       "File uploaded successfully",
//     );
//   } catch (error) {
//     return ApiResponseHelper.error(res, error);
//   }
// });

// export default router