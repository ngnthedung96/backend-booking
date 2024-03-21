import { check, body, param, query } from "express-validator";
import Clinic from "./model.mjs";
import mongoose from "mongoose";
const validate = (method) => {
  let err = [];
  switch (method) {
    case "create":
      {
        err = [
          body("name", "Tên không hợp lệ").notEmpty(),
          body("introduce", "Giới thiệu không hợp lệ").notEmpty(),
          body("strength", "Thế mạnh chuyên môn không hợp lệ").notEmpty(),
          body("equipment", "Trang thiết bị không hợp lệ").notEmpty(),
          body("process", "Quy trình khám bệnh không hợp lệ").notEmpty(),
          body("address", "Địa chỉ không hợp lệ").notEmpty(),
        ];
      }
      break;

    case "update":
      {
        err = [
          body("name", "Tên không hợp lệ").notEmpty(),
          body("introduce", "Giới thiệu không hợp lệ").notEmpty(),
          body("strength", "Thế mạnh chuyên môn không hợp lệ").notEmpty(),
          body("equipment", "Trang thiết bị không hợp lệ").notEmpty(),
          body("process", "Quy trình khám bệnh không hợp lệ").notEmpty(),
          body("address", "Địa chỉ không hợp lệ").notEmpty(),
          param("id", "Id không hợp lệ").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return Clinic.findById(value)
                .exec()
                .then((obj) => {
                  if (!obj) {
                    return Promise.reject("Không tìm thấy chuyên khoa");
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
              return Clinic.findById(value)
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

    case "getList":
      {
        err = [
          query("search", "Dữ liệu tìm kiếm không hợp lệ")
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
    case "getOne":
      {
        err = [
          param("id", "Id không hợp lệ").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return Clinic.findById(value)
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
  }

  return err;
};

export default validate;
