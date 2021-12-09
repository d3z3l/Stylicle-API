const multer = require('multer');
const AppError = require('./../utils/appError');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const name=`user-${req.user}-${Date.now()}.${ext}`;
    req.image_name=name;
    console.log('file namr   '+name);
    cb(null, name);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video') ) {
    cb(null, true);
  } else {
    // cb(null, true);
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('image');
