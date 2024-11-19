const { body } = require('express-validator');

const validationSchema = () => {
  return [
    body('title')
      .notEmpty()
      .withMessage('Title Is Required')
      .isLength({ min: 2 })
      .withMessage('At least 2 chars'),
    body('price')
      .notEmpty()
      .withMessage('Price Is Required')
      .isLength({ min: 2 })
      .withMessage('At least 2 digits'),
  ];
};

module.exports = {
  validationSchema,
};
