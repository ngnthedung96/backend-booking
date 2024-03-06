/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} results
 * @param   {number} statusCode
 */

const success = (message, results) => ({
  message,
  error: false,
  code: 200,
  data: results,
});

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 * @param   {number} statusCode
 */
const error = (message, statusCode) => {
  // List of common HTTP request code
  const codes = [200, 201, 400, 401, 404, 403, 422, 500];

  // Get matched code
  const findCode = codes.find((code) => code == statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return {
    message,
    code: statusCode,
    error: true,
  };
};

/**
 * @desc    Send any validation response
 *
 * @param   {object | array} errors
 */
const validation = (errors) => ({
  message: 'Validation errors',
  error: true,
  code: 422,
  errors,
});

export default {
  success,
  error,
  validation,
};
