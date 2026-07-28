

import fs from "fs";
import path from "path";
import multer from "multer";


const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "profile"
);

const petUploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "pets"
);

const serviceUploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "services"
);



[
  uploadDirectory,
  petUploadDirectory,
  serviceUploadDirectory

].forEach((directory)=>{

  if(!fs.existsSync(directory)){

    fs.mkdirSync(directory,{
      recursive:true
    });

  }

});



// Common file name generator

const generateFileName = (
  file: Express.Multer.File
)=>{

  const extension =
    path.extname(file.originalname);


  const safeName =
    `${Date.now()}-${Math.round(Math.random()*1e9)}${extension}`;


  return safeName;

};



// File validation

const fileFilter: multer.Options["fileFilter"] =
(_req,file,callback)=>{

  if(file.mimetype.startsWith("image/")){

    callback(null,true);

    return;

  }


  callback(
    new Error("Only image uploads are allowed")
  );

};




// Profile storage

const storage = multer.diskStorage({

  destination:(_req,_file,callback)=>{

    callback(
      null,
      uploadDirectory
    );

  },


  filename:(_req,file,callback)=>{

    callback(
      null,
      generateFileName(file)
    );

  }

});




// Pet storage

const petStorage = multer.diskStorage({

  destination:(_req,_file,callback)=>{

    callback(
      null,
      petUploadDirectory
    );

  },


  filename:(_req,file,callback)=>{

    callback(
      null,
      generateFileName(file)
    );

  }

});




// Service storage

const serviceStorage = multer.diskStorage({

  destination:(_req,_file,callback)=>{

    callback(
      null,
      serviceUploadDirectory
    );

  },


  filename:(_req,file,callback)=>{

    callback(
      null,
      generateFileName(file)
    );

  }

});




// Export upload handlers

export const uploadProfileImage = multer({

  storage,

  fileFilter,

  limits:{
    fileSize:5 * 1024 * 1024
  }

});



export const uploadPetImage = multer({

  storage:petStorage,

  fileFilter,

  limits:{
    fileSize:5 * 1024 * 1024
  }

});



export const uploadServiceImage = multer({

  storage:serviceStorage,

  fileFilter,

  limits:{
    fileSize:5 * 1024 * 1024
  }

});