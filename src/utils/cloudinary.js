const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'peoples-power-technology',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});



const upload = async (file) => {
  const image = await cloudinary.uploader.upload(
    file,
    (result) => result
  );
  return image;
};

module.exports = { upload };