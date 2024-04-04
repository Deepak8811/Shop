import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const fileType = /jpg|png|jpeg/;
  const extname = fileType.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileType.test(file.mimeType);

  if (extname && mimeType) {
    return cb(null, true);
  } else {
    cb("Image only");
  }
}

export const uploads = multer({
  storage,
  // fileFilter: function (req, file, cb) {
  //   checkFileType(file, cb);
  // },
});

router.post("/", uploads.single("image"), (req, res) => {
  try {
    res.send(`/${req.file.path}`);
  } catch (error) {
    console.log(error.message);
  }
});

export default router;
