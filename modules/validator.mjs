import { validationResult, body } from "express-validator";

// sequential processing, stops running validations chain if the previous one have failed.
const validator = (validations) => async (req, _res, next) => {
  for (const validation of validations) {
    // eslint-disable-next-line no-await-in-loop
    const result = await validation.run(req);
    if (result.errors.length) break;
  }

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return next({
    statusCode: 400,
    message: errors.errors[0].msg,
  });
};

export { validator, body };
