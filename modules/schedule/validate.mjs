import { check, body, param } from "express-validator";
import Users from "./model.mjs";
import mongoose from "mongoose";
import { ScheduleSvc } from "../../services/index.mjs";
// define constant
const scheduleService = new ScheduleSvc();
const validate = (method) => {
  let err = [];
  switch (method) {
    case "create":
      {
        err = [
          body("doctorId", "Số điện thoại không hợp lệ")
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
          body("scheduleData", "Dữ liệu lịch không hợp lệ")
            .notEmpty()
            .isArray()
            .custom(async (value) => {
              try {
                const validateSchedule =
                  scheduleService.validateScheduleData(value);
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
