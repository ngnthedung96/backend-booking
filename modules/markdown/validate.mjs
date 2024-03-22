import { check, body, param, query } from "express-validator";
import markdown from "./model.mjs";
import mongoose from "mongoose";
import { ClinicDb, SpecialtyDb, UserDb } from "../index.mjs";
import { UserSvc } from "../../services/index.mjs";
// define constant
const userService = new UserSvc();
const validate = (method) => {
  let err = [];
  switch (method) {
    case "create":
      {
        err = [
          body("doctorId", "Id bác sĩ không hợp lệ")
            .if(body("doctorId").exists())
            .custom(async (value, { req }) => {
              if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Id bác sĩ không hợp lệ");
              } else {
                const formattedUserId = mongoose.Types.ObjectId(value);
                const user = await UserDb.findOne({
                  _id: formattedUserId,
                  role: userService.ROLE_DOCTOR,
                });
                if (!user) {
                  throw new Error("Không tồn tại người dùng");
                }
              }
            }),
          body("clinicId", "Id cơ sở y tế không hợp lệ")
            .if(body("clinicId").exists())
            .custom(async (value, { req }) => {
              if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Id cơ sở y tế không hợp lệ");
              } else {
                const formattedId = mongoose.Types.ObjectId(value);
                const user = await ClinicDb.findOne({
                  _id: formattedId,
                });
                if (!user) {
                  throw new Error("Không tồn tại cơ sở y tế");
                }
              }
            }),
          body("specialtyId", "Id chuyên khoa không hợp lệ")
            .if(body("specialtyId").exists())
            .custom(async (value, { req }) => {
              if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Id chuyên khoa không hợp lệ");
              } else {
                const formattedId = mongoose.Types.ObjectId(value);
                const user = await SpecialtyDb.findOne({
                  _id: formattedId,
                });
                if (!user) {
                  throw new Error("Không tồn tại cơ sở y tế");
                }
              }
            }),
          body("introduce", "Giới thiệu không hợp lệ").notEmpty(),
          body("content", "Nội dung không hợp lệ").notEmpty(),
        ];
      }
      break;

    case "update":
      {
        err = [
          body("doctorId", "Id bác sĩ không hợp lệ")
            .if(body("doctorId").exists())
            .custom(async (value, { req }) => {
              if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Id bác sĩ không hợp lệ");
              } else {
                const formattedUserId = mongoose.Types.ObjectId(value);
                const user = await UserDb.findOne({
                  _id: formattedUserId,
                  role: userService.ROLE_DOCTOR,
                });
                if (!user) {
                  throw new Error("Không tồn tại người dùng");
                }
              }
            }),
          body("clinicId", "Id cơ sở y tế không hợp lệ")
            .if(body("clinicId").exists())
            .custom(async (value, { req }) => {
              if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Id cơ sở y tế không hợp lệ");
              } else {
                const formattedId = mongoose.Types.ObjectId(value);
                const user = await ClinicDb.findOne({
                  _id: formattedId,
                });
                if (!user) {
                  throw new Error("Không tồn tại cơ sở y tế");
                }
              }
            }),
          body("specialtyId", "Id chuyên khoa không hợp lệ")
            .if(body("specialtyId").exists())
            .custom(async (value, { req }) => {
              if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error("Id chuyên khoa không hợp lệ");
              } else {
                const formattedId = mongoose.Types.ObjectId(value);
                const user = await SpecialtyDb.findOne({
                  _id: formattedId,
                });
                if (!user) {
                  throw new Error("Không tồn tại cơ sở y tế");
                }
              }
            }),
          body("introduce", "Giới thiệu không hợp lệ").notEmpty(),
          body("content", "Nội dung không hợp lệ").notEmpty(),
          param("id", "Id không hợp lệ").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return markdown
                .findById(value)
                .exec()
                .then((obj) => {
                  if (!obj) {
                    return Promise.reject("Không tìm thấy mô tả");
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
              return markdown
                .findById(value)
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
  }

  return err;
};

export default validate;
