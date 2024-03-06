import express from "express";
import { validator, body } from "../validator"; // create new router

import ctrl from "./controller";

const router = express.Router();

router.post(
  "/login",
  validator([
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
    body("password", "Mật khẩu không hợp lệ").notEmpty(),
  ]),
  ctrl.login
);
router.post(
  "/register",
  validator([
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
  ]),
  ctrl.register
);

router.post("/refresh", ctrl.refresh);
router.post("/logout", ctrl.logout);

export default router;
