const multer = require("multer");

const upload = (folder) => {
  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folder}`);
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      const fileName = `img-${Date.now() + Math.random()}.${ext}`;

      cb(null, fileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    const type = file.mimetype.split("/")[0];
    if (type === "image") {
      cb(null, true);
    } else {
      cb(new Error("File must be an image"), false);
    }
  };

  return multer({ storage: diskStorage, fileFilter });
};

module.exports = upload;
