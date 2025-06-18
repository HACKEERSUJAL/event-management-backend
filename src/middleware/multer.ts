import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads";
    // console.log("test from multer");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, path.extname(Date.now() + "-" + file.originalname));
    // console.log("test 2 from multer");
  },
});

export const upload = multer({ storage });
// export const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });
