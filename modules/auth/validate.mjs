import { body, header, param, query } from "express-validator";
import mongoose from "mongoose";
import moment from "moment";
import { UserDb } from "../index.mjs";
// define service
const validate = (method) => {
  let err = [];
  switch (method) {
    case "register":
      {
        err = [
          body("phone", "Số điện thoại không hợp lệ")
            .notEmpty()
            .custom(async (value) => {
              try {
                const regexPhone = /^[0-9]{10,11}$/;
                if (!regexPhone.test(value)) {
                  throw new Error("Số điện thoại không hợp lệ");
                }
              } catch (err) {
                throw new Error(err);
              }
            }),
          body("email", "Email không hợp lệ")
            .notEmpty()
            .custom(async (value) => {
              try {
                const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
                if (!regexEmail.test(value)) {
                  throw new Error("Email không hợp lệ");
                }
              } catch (err) {
                throw new Error(err);
              }
            }),
          body("password", "Mật khẩu không hợp lệ").notEmpty(),
          body("name", "Tên người dùng không hợp lệ").notEmpty(),
        ];
      }
      break;
    case "login":
      {
        err = [
          body("account", "Số điện thoại hoặc email không hợp lệ")
            .notEmpty()
            .isString()
            .custom(async (value) => {
              try {
                const regexPhone = /^[0-9]{10,11}$/;
                const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
                if (!regexPhone.test(value) && !regexEmail.test(value)) {
                  throw new Error("Số điện thoại hoặc email không hợp lệ");
                }
              } catch (err) {
                throw new Error(err);
              }
            }),
          body("password", "Mật khẩu không hợp lệ")
            .notEmpty()
            .isString()
            .isLength({ min: 6 }),
        ];
      }
      break;
    case "sendingMailChangePass":
      {
        err = [
          query("email", "Email không hợp lệ")
            .notEmpty()
            .isString()
            .custom(async (value) => {
              try {
                const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
                if (!regexEmail.test(value)) {
                  throw new Error("Email không hợp lệ");
                }
              } catch (err) {
                throw new Error(err);
              }
            }),
        ];
      }
      break;
    case "checkCodeChangePass":
      {
        err = [
          body("id", "Id người dùng không hợp lệ")
            .notEmpty()
            .custom(async (value, { req }) => {
              if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Id người dùng không hợp lệ");
              } else {
                return true;
              }
            }),
          body("code", "Mã không hợp lệ")
            .notEmpty()
            .isNumeric()
            .isLength({ min: 5 }),
          body("newPassword", "Mật khẩu không hợp lệ")
            .notEmpty()
            .isString()
            .isLength({ min: 6 }),
        ];
      }
      break;
    case "verifyEmail":
      {
        err = [
          param("id", "Id người dùng không hợp lệ")
            .notEmpty()
            .custom(async (value, { req }) => {
              if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Id người dùng không hợp lệ");
              } else {
                const formattedUserId = mongoose.Types.ObjectId(value);
                const user = await UserDb.findOne({
                  _id: formattedUserId,
                });
                if (!user) {
                  throw new Error("Không tồn tại người dùng");
                }
              }
            }),
        ];
      }
      break;

    default:
      err = [];
      break;
  }
  return err;
};

export default validate;
