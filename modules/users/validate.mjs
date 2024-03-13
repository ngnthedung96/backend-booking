import { check, body, param } from "express-validator";
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
          body("gender", "Giới tính không hợp lệ")
            .if(body("gender").exists())
            .isString(),
          body("address", "Địa chỉ không hợp lệ")
            .if(body("gender").exists())
            .isString(),
          body("roleId", "Loại tài khoản không hợp lệ")
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
          body("name", "Name khong hop le").notEmpty(),
          body("phone", "phone khong hop le").notEmpty(),
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
          body("name", "Name khong hop le").notEmpty(),
          body("password", "password khong hop le").notEmpty(),
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
              throw new Error(
                "Id must be a string of 12 bytes or a string of 24 hex characters or an integer"
              );
            }
          }),
        ];
      }
      break;
    //search
    case "search":
      {
        err = [param("keysearch", "thông tin đầu vào chưa đúng").notEmpty()];
      }
      break;
    case "checkId":
      {
        err = [
          param("id", "Id khong hop le").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return Users.findById(value)
                .exec()
                .then((obj) => {
                  if (!obj) {
                    return Promise.reject("Không tồn tại user có id như trên");
                  }
                });
            } else {
              throw new Error("Id user không tồn tại");
            }
          }),
        ];
      }
      break;
  }

  return err;
};

export default validate;
