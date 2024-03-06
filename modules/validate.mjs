import { validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      statusCode: 422,
      message: errors.errors[0].msg,
    });
  }
  return next();
};

export default validate;
