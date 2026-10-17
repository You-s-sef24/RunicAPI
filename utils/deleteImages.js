const fs = require("fs/promises");
const path = require("path");

const uploadsPath = path.resolve(__dirname, "../uploads");

const deleteImages = async (images = []) => {
  await Promise.all(
    images.map(async (image) => {
      const imagePath = path.resolve(uploadsPath, image);

      if (!imagePath.startsWith(uploadsPath + path.sep)) {
        throw new Error("Invalid image path");
      }

      try {
        await fs.unlink(imagePath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          throw err;
        }
      }
    }),
  );
};

module.exports = deleteImages;
