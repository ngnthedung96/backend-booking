/* eslint-disable consistent-return */
/* eslint-disable no-throw-literal */
/* eslint-disable no-underscore-dangle */
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { isEmpty } from "ramda";
import Users from "../users/model";
import CoreCtrl from "../core";
import hash from "../../libs/hash";
import { UserSvc } from "../../services/index.mjs";

// import multer from "multer ";
dotenv.config();
// setting const
const iterations = +process.env.ITERATIONS;
const keylength = +process.env.KEY_LENGTH;
const digest = process.env.DIGEST;
const secretKey = process.env.SECRET_KEY;
const tokenExpireDate = process.env.TOKEN_EXPIRE_DATE;
const rfTokenExpireDate = process.env.RF_TOKEN_EXPIRE_DATE;
const saltLength = +process.env.SALT_LENGTH;

const userService = new UserSvc();
class Ctrl extends CoreCtrl {
  // eslint-disable-next-line no-useless-constructor, no-restricted-syntax
  constructor(model) {
    super(model);
  }

  login = async (req, res, next) => {
    try {
      console.log(process.env.CONNECT_STRING);
      // define const, variables
      const { cookies } = req;
      const { account, password } = req.body;
      /**
       * Begin logic process
       */

      let user = await super.getOne([
        {
          $match: {
            $or: [{ phone: account }, { email: account }],
          },
        },
      ]);
      user = user[0] ? user[0] : null;
      // check user exist
      if (!user) {
        return next({
          statusCode: 404,
          message: "Không tìm thấy tài khoản!",
        });
      }

      // check locked
      if (user.status === userService.STATUS_DISABLED) {
        return next({
          statusCode: 403,
          message: "Tài khoản đã bị khóa!",
        });
      }

      // check pass is correct
      const passIsValid = await hash.isPasswordCorrect(
        {
          hash: user.password,
          salt: user.salt,
          iterations,
          keylength,
          digest,
        },
        password
      );

      if (!passIsValid) {
        return next({
          statusCode: 401,
          message: "Sai mật khẩu!",
        });
      }

      // pass
      const tokenInfo = {
        id: user._id,
        phone: user.phone,
        roleId: user.roleId,
      };
      const accessToken = jwt.sign(tokenInfo, secretKey, {
        expiresIn: tokenExpireDate,
      });
      const newRefreshToken = jwt.sign(tokenInfo, secretKey, {
        expiresIn: rfTokenExpireDate,
      });

      // Changed to let keyword
      let newRefreshTokenArray = !cookies?.jwt
        ? user.refreshToken
        : user.refreshToken.filter((rt) => rt !== cookies.jwt);
      if (cookies?.jwt) {
        /**
         * 1) Nguoi dung login khong bao gio logout
           2) RT is stolen -- token bi mat cap
           3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
           -- trong ca 2 truong hop deu can xoa RT khi nguoi dung login
         */
        const refreshToken = cookies.jwt;
        const foundToken = await this.model.findOne({ refreshToken });

        // Detected refresh token reuse!
        if (!foundToken) {
          // dua cookies len ma lai khong tim thay trong db => RT bi an cap hoac bi su dung lai
          // eslint-disable-next-line no-console
          console.log("attempted refresh token reuse at login!");
          // clear out ALL previous refresh tokens
          newRefreshTokenArray = [];
        }
      }

      // Saving refreshToken with current user
      await super.newUpdate(
        {
          refreshToken: [...newRefreshTokenArray, newRefreshToken],
        },
        {
          _id: user._id,
        }
      );
      // luu cookie tren client
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      /**
       * End logic process
       */

      // response data success
      res.locals.resData = {
        statusCode: 200,
        message: "Login success",
        data: {
          token: accessToken,
          adminInfo: {
            name: user.name,
            phone: user.phone,
            id: user._id,
          },
          refreshToken: newRefreshToken,
        },
      };
      next();
    } catch (err) {
      next(err);
    }
  };

  // thực hiện logout users
  logout = async (req, res, next) => {
    try {
      // define params
      const { cookies } = req;

      /**
       * Start process logic
       */
      if (cookies?.jwt) {
        const refreshToken = cookies.jwt;
        // Is refreshToken in db?
        const foundUser = await this.model.findOne({ refreshToken });
        if (foundUser) {
          // Delete refreshToken in db
          foundUser.refreshToken = foundUser.refreshToken.filter(
            (rt) => rt !== refreshToken
          );
          await foundUser.save();
          res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          });
        }
      } else {
        throw {
          statusCode: 404,
          message: "Logout fail!",
        };
      }

      /**
       * End process logic
       */

      // response success data api
      res.locals.resData = {
        statusCode: 200,
        message: "logout success",
        data: {},
      };
      next();
    } catch (e) {
      next(e);
    }
  };

  // tạo mới user
  register = async (req, res, next) => {
    try {
      // get params in body
      const { name, phone, email, password } = req.body;

      // define response params
      let statusCode;
      let message = "";
      let data = {};

      /**
       * Start block code for logic processs
       */

      // check user exist, check email, name, phone
      const existUser = await this.model.find({
        $or: [
          { name: { $regex: name, $options: "i" } },
          { phone: { $regex: phone, $options: "i" } },
          { email: { $regex: email, $options: "i" } },
        ],
      });

      if (isEmpty(existUser)) {
        const hashFn = hash.createHashPasswordFn(
          saltLength,
          iterations,
          keylength,
          digest
        );
        const passHash = await hashFn(password);
        const newUser = await super.create({
          name,
          phone,
          email,
          password: passHash.hash,
          salt: passHash.salt,
          status: 1,
        });

        // set reponse message + data
        statusCode = 201;
        message = "Register successfully!";
        data = {
          _id: newUser._id,
          name: newUser.name,
          phone: newUser.phone,
        };
      } else {
        statusCode = 409;
        message = "Đã tồn tại tài khoản";
      }

      /**
       * End block code for logic processs
       */

      // response data to router for success api
      res.locals.resData = { statusCode, message, data };
      next();
    } catch (err) {
      // route to error reponse
      next(err);
    }
  };

  // change password
  changePass = async (req, res, next) => {
    try {
      const { password, newPassword } = req.body;
      const { id } = req.params;
      const hashFn = hash.createHashPasswordFn(
        saltLength,
        iterations,
        keylength,
        digest
      );
      const user = await Users.findOne({ _id: id });
      const passHash = await hashFn(newPassword);
      const passIsValid = await hash.isPasswordCorrect(
        {
          hash: user.password,
          salt: user.salt,
          iterations,
          keylength,
          digest,
        },
        password
      );

      if (!passIsValid) {
        throw new Error({
          statusCode: 401,
          message: "Password incorrect!",
        });
      } else {
        password = newPassword;
      }
      // pass
      const result = await super.update(id, {
        password: passHash.hash,
        salt: passHash.salt,
      });

      res.locals.resData = {
        statusCode: 200,
        message: "success",
        data: result,
      };
      next();
    } catch (err) {
      next(err);
    }
  };

  // Refresh Token base
  refresh = async (req, res, next) => {
    try {
      // define params
      const { cookies } = req;

      /**
       * Begin logic
       */
      if (!cookies?.jwt) {
        return next({
          statusCode: 401,
          message: "Unauthorized!",
        });
      }

      const refreshToken = cookies.jwt;
      const decoded = await jwt.verify(refreshToken, secretKey);
      const foundUser = await this.model.findOne({ refreshToken });

      // Detected refresh token reuse! if refresh token not found, user is reuse
      if (!foundUser) {
        const hackedUser = await this.model.findOne({ phone: decoded.phone });
        hackedUser.refreshToken = [];
        hackedUser.status = 0;
        await hackedUser.save();

        return next({
          statusCode: 403,
          message: "Tài khoản bị khóa!",
        });
      }

      // remove old refresh token and add new refreshtoken
      const newRefreshTokenArray = foundUser.refreshToken.filter(
        (rt) => rt !== refreshToken
      );

      // Refresh token was still valid
      const tokenInfo = {
        id: foundUser._id,
        phone: foundUser.phone,
        roleId: foundUser.roleId,
      };
      const accessToken = jwt.sign(tokenInfo, secretKey, {
        expiresIn: tokenExpireDate,
      });
      const newRefreshToken = jwt.sign(tokenInfo, secretKey, {
        expiresIn: rfTokenExpireDate,
      });
      // Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await foundUser.save();
      res.locals.resData = {
        statusCode: 200,
        message: "success",
        data: {
          token: accessToken,
          refreshToken: newRefreshToken,
          userInfo: {
            name: foundUser.name,
            email: foundUser.email,
            phone: foundUser.phone,
          },
        },
      };

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });
      next();
    } catch (err) {
      next(err);
    }
  };
}

export default new Ctrl(Users);
