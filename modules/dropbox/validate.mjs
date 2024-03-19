import { check, body, param } from "express-validator";
import mongoose from "mongoose";
import DropboxDb from "./model.mjs";
import { DropboxSvc } from "../../services/index.mjs";
// define constant
const dropboxService = new DropboxSvc();
const validate = (method) => {
  let err = [];
  switch (method) {
    case "authorizeDropbox":
      {
        err = [
          body("code", "Authorized Code không hợp lệ").notEmpty().isString(),
        ];
      }
      break;
    case "create":
      {
        err = [
          body("clientId", "Số điện thoại không hợp lệ").notEmpty(),
          body("clientSecret", "Email không hợp lệ").notEmpty(),
          body("isDefault", "Lựa chọn mặc định không hợp lệ")
            .isNumeric()
            .notEmpty()
            .custom((value) => {
              if (
                value != dropboxService.IS_DEFAULT &&
                value != dropboxService.IS_NOT_DEFAULT
              ) {
                throw new Error("Lựa chọn mặc định không hợp lệ");
              } else {
                return true;
              }
            }),
        ];
      }
      break;

    case "update":
      {
        err = [
          body("isDefault", "Lựa chọn mặc định không hợp lệ")
            .isNumeric()
            .notEmpty()
            .custom((value) => {
              if (
                value != dropboxService.IS_DEFAULT &&
                value != dropboxService.IS_NOT_DEFAULT
              ) {
                throw new Error("Lựa chọn mặc định không hợp lệ");
              } else {
                return true;
              }
            }),
          body("clientId", "Số điện thoại không hợp lệ").notEmpty(),
          body("clientSecret", "Email không hợp lệ").notEmpty(),
          param("id", "Id không hợp lệ").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return DropboxDb.findById(value)
                .exec()
                .then((obj) => {
                  if (!obj) {
                    return Promise.reject("Không tìm thấy bản ghi dropbox");
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
          param("id", "Id không hợp lệ").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return DropboxDb.findById(value)
                .exec()
                .then((obj) => {
                  if (!obj) {
                    return Promise.reject("Không tìm thấy bản ghi dropbox");
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
            .notEmpty()
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
