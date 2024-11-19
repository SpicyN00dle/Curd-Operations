const { validationResult } = require('express-validator');
const Course = require('../models/courses_model');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');

const getCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  console.log(query);

  const limit = query.limit || 10;
  const page = query.page || 1;

  const skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { courses } });
});

const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.id, { __v: false });

  if (!course) {
    const error = appError.create('Course not found', 404, httpStatusText.FAIL);
    return next(error);
  }
  res.json({ status: httpStatusText.SUCCESS, data: { course } });
});

const createCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }

  const newCourse = new Course(req.body);
  await newCourse.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

const updateCourse = asyncWrapper(async (req, res) => {
  const updatedCourse = await Course.updateOne(
    { _id: req.params.id },
    { $set: { ...req.body } }
  );

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: { course: updatedCourse } });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  await Course.deleteOne({ _id: req.params.id });

  res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getCourses,
  getSingleCourse,
  updateCourse,
  createCourse,
  deleteCourse,
};
