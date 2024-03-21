import { check, body, param } from "express-validator";
import Schedules from "./model.mjs";
import mongoose from "mongoose";
import { ScheduleSvc, UserSvc } from "../../services/index.mjs";
import { UserDb } from "../index.mjs";
// define constant
const scheduleService = new ScheduleSvc();
const userService = new UserSvc();
const validate = (method) => {
  let err = [];
  switch (method) {
    case "create":
      {
        err = [
          body("doctorId", "Id bác sĩ không hợp lệ").custom((value) => {
            if (mongoose.Types.ObjectId.isValid(value)) {
              return UserDb.findOne({
                _id: value,
                role: userService.ROLE_DOCTOR,
              })
                .exec()
                .then((obj) => {
                  if (!obj) {
                    return Promise.reject("Không tìm thấy bác sĩ");
                  }
                });
            } else {
              throw new Error(
                "Id must be a string of 12 bytes or a string of 24 hex characters or an integer"
              );
            }
          }),
          body("month", "Tháng không hợp lệ")
            .notEmpty()
            .custom((value) => {
              if (value <= 0 || value > 12) {
                throw new Error("Tháng không hợp lệ");
              } else {
                return true;
              }
            }),
          body("scheduleData", "Dữ liệu lịch không hợp lệ")
            .notEmpty()
            .isArray()
            .custom(async (value, { req }) => {
              try {
                const month = req.body.month;
                const validateSchedule = scheduleService.validateScheduleData(
                  value,
                  month
                );
                if (validateSchedule.status) {
                  return true;
                } else {
                  throw new Error(validateSchedule.message);
                }
              } catch (err) {
                throw new Error(err);
              }
            }),
        ];
      }
      break;
  }

  return err;
};

export default validate;
