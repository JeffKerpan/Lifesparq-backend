const cloudinary = require('cloudinary');
const queries = require('../queries');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

exports.postPdf = function (file, callback) {
  console.log(file);
  cloudinary.uploader.upload(file, function(err, result) {
    if (err) {
      console.log('1', err);
    } else {
      callback(null, result);
    }
  })
}

exports.postImage = function (file, callback) {
  cloudinary.v2.uploader.upload(file,
    function(error, result) {
      callback(null, result);
    });
}
