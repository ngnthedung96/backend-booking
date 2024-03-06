import crypto from 'crypto'
import { promisify } from 'util'
const pbkdf2 = promisify(crypto.pbkdf2)

export default { 
  createHashPasswordFn, 
  isPasswordCorrect 
}

/**
 * @typedef {Object} HashPassword
 * @property {String} hash
 * @property {String} salt
 * @property {Number} iterations - HMAC digest: Iterations
 * @property {Number} keylength - HMAC digest: Key byte length
 * @property {String} digest - HMAC digest: algorithm, see crypto.getHashes()
 */

/**
 * Create a hashPassword function
 * @param {Number} saltlength - Number of random salt bytes
 * @param {Number} iterations
 * @param {Number} keylength
 * @param {String} digest
 * @return {Function}
 */
function createHashPasswordFn(saltlength, iterations, keylength, digest) {
  /**
   * Hash a password with a random salt
   * @param {String} password
   * @return {Promise<HashPassword>}
   */
  return async function hashPassword(password) {
    const salt = crypto.randomBytes(saltlength).toString('base64')
    const hashBuffer = await pbkdf2(password, salt, iterations, keylength, digest)
    const hash = hashBuffer.toString('hex')
    return { hash, salt, iterations, keylength, digest }
  }
}

/**
 * Compare password attempt to a saved salt-hash-password
 * @param {HashPassword} hashPassword - Saved salt-hash-password
 * @param {String} passwordAttempt - Plain text password attempt
 * @return {Promise<Boolean>}
 */
async function isPasswordCorrect(hashPassword, passwordAttempt) {
  const hashBuffer = await pbkdf2(
    passwordAttempt,
    hashPassword.salt,
    hashPassword.iterations,
    hashPassword.keylength,
    hashPassword.digest
  )
  const hashAttempt = hashBuffer.toString('hex')
  return hashPassword.hash == hashAttempt
}