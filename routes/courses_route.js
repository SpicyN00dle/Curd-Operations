const express = require('express');
const { body } = require('express-validator');
const courseController = require('../controller/courses_controller');
const { validationSchema } = require('../middleware/course_middleware');
const verifyToken = require('../middleware/verify_token');
const userRoles = require('../utils/user_roles');
const allowedTo = require('../middleware/allowedUser');

const router = express.Router();

router
  .route('/')
  .get(courseController.getCourses)
  .post(verifyToken, validationSchema(), courseController.createCourse);

router
  .route('/:id')
  .get(courseController.getSingleCourse)
  .patch(courseController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANGER),
    courseController.deleteCourse
  );

module.exports = router;
