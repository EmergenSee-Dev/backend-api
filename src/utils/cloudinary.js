const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier'); // To convert Buffer to a stream

cloudinary.config({
  cloud_name: 'dqkonynzk',
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },  // auto type detection
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to stream and pipe it to Cloudinary
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// const upload = async (file) => {
//   const image = await cloudinary.uploader.upload(
//     file,
//     (result) => result
//   );
//   return image;
// };

module.exports = { uploadToCloudinary };