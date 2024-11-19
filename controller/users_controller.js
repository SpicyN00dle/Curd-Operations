const asyncWrapper = require('../middleware/asyncWrapper');
const httpStatusText = require('../utils/httpStatusText');
const User = require('../models/users_model');
const appError = require('../utils/appError');
const bcryptjs = require('bcryptjs');
const JWTtoken = require('../utils/generate_JWT');

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;

  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    const error = appError.create(
      'User Already Exists',
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  // Hashing Password
  const hashedPass = await bcryptjs.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPass,
    role,
  });

  // JWT token
  const token = await JWTtoken({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
  await newUser.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    const error = appError.create(
      'Email Or Password May Be Wrong',
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    const error = appError.create('User Not Found', 400, httpStatusText.FAIL);
    return next(error);
  }

  const matchedUser = await bcryptjs.compare(password, user.password);

  if (user && matchedUser) {
    const token = await JWTtoken({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  } else {
    const error = appError.create('Something Wrong', 500, httpStatusText.ERORR);
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
