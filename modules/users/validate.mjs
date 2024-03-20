import { check, body, param, query } from "express-validator";
import Users from "./model.mjs";
import { UserSvc } from "../../services/index.mjs";
import mongoose from "mongoose";
const userService = new UserSvc();
const validate = (method) => {
  let err = [];
  switch (method) {
    case "create":
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
          body("gender", "Giới tính không hợp lệ").custom(async (value) => {
            try {
              if (!value) {
                return true;
              } else {
                if (
                  value != userService.GENDER_FEMALE &&
                  value != userService.GENDER_MALE &&
                  value != userService.UNKNOWN_GENDER
                )
                  throw new Error("Giới tính không hợp lệ");
              }
            } catch (err) {
              throw new Error(err);
            }
          }),
          body("role", "Loại tài khoản không hợp lệ")
            .notEmpty()
            .custom(async (value) => {
              try {
                if (
                  value != userService.ROLE_ADMIN &&
                  value != userService.ROLE_DOCTOR &&
                  value != userService.ROLE_PATIENT
                ) {
                  throw new Error("Loại tài khoản không hợp lệ");
                }
              } catch (err) {
                throw new Error(err);
              }
            }),
        ];
      }
      break;

    case "update":
      {
        err = [
          body("name", "Tên không hợp lệ").notEmpty(),
          body("phone", "Số điện thoại không hợp lệ").notEmpty(),
          body("gender", "Giới tính không hợp lệ").custom(async (value) => {
            try {
              if (!value) {
                return true;
              } else {
                if (
                  value != userService.GENDER_FEMALE &&
                  value != userService.GENDER_MALE &&
                  value != userService.UNKNOWN_GENDER
                )
                  throw new Error("Giới tính không hợp lệ");
              }
            } catch (err) {
              throw new Error(err);
            }
          }),
          param("id", "Id không hợp lệ").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return Users.findById(value)
                .exec()
                .then((obj) => {
                  if (!obj) {
                    return Promise.reject("Không tìm thấy khách hàng");
                  }
                });
            } else {
              throw new Error(
                "Id must be a string of 12 bytes or a string of 24 hex characters or an integer"
              );
            }
          }),
        ];
      }
      break;

    case "delete":
      {
        err = [
          param("id", "Id khong hop le").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return Users.findById(value)
                .exec()
                .then((obj) => {
                  if (!obj) {
                    return Promise.reject("Object not found");
                  }
                });
            } else {
              console.log("vao day ma");
              throw new Error(
                "Id must be a string of 12 bytes or a string of 24 hex characters or an integer"
              );
            }
          }),
        ];
      }
      break;
    case "change":
      {
        err = [
          body("password", "Mật khẩu cũ không hợp lệ").notEmpty(),
          body("newPassword", "Mật khẩu mới không hợp lệ").notEmpty(),
          param("id", "Id không hợp lệ").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return Users.findById(value)
                .exec()
                .then((obj) => {
                  if (!obj) {
                    return Promise.reject("Object not found");
                  }
                });
            } else {
              throw new Error(
                "Id must be a string of 12 bytes or a string of 24 hex characters or an integer"
              );
            }
          }),
        ];
      }
      break;
    //get list
    case "getList":
      {
        err = [
          query("search", "Lọc ngày không hợp lệ")
            .if(query("search").exists())
            .isString(),
          query("dateRange", "Lọc ngày không hợp lệ")
            .if(query("dateRange").exists())
            .custom(async (value, { req }) => {
              if (value) {
                const arrDate = value.split(" - ");
                const start = moment(arrDate[0], "DD/MM/YYYY", true).isValid();
                const end = moment(arrDate[1], "DD/MM/YYYY", true).isValid();
                if (!start || !end) {
                  throw new Error("Lọc ngày không hợp lệ");
                }
              } else {
                throw new Error("Lọc ngày không hợp lệ");
              }
            }),
          query("page", "Số trang không hợp lệ")
            .notEmpty()
            .isNumeric()
            .custom(async (value, { req }) => {
              if (!Number(value) || Number(value) <= 0) {
                throw new Error("Số trang không hợp lệ");
              }
              return true;
            }),
          query("limit", "Giới hạn không hợp lệ")
            .notEmpty()
            .isNumeric()
            .custom(async (value, { req }) => {
              if (!Number(value) || Number(value) <= 0) {
                throw new Error("Giới hạn không hợp lệ không hợp lệ");
              }
              return true;
            }),
        ];
      }
      break;
  }

  return err;
};

export default validate;
