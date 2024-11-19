const express = require('express');
const router = express.Router();
const usersController = require('../controller/users_controller');
const verifyToken = require('../middleware/verify_token');
const multer = require('multer');
const appError = require('../utils/appError');

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});
const fileFilter = (req, res, cb) => {
  const imageType = file.mimetype.split('/')[0];

  if (imageType == 'image') {
    return cb(null, true);
  } else {
    return cb(appError.create('Must Be Image', 400), false);
  }
};

const upload = multer({
  Storage: diskStorage,
  fileFilter,
});

//get all users
//register
//login

router.route('/').get(verifyToken, usersController.getAllUsers);
router
  .route('/register')
  .post(upload.single('avatar'), usersController.register);
router.route('/login').post(usersController.login);

module.exports = router;
