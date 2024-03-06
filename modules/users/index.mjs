import express from "express";
const router = express.Router(); // create new router
import { validator, body } from "../validator"; // create new router

import UserCtrl from "./controller.mjs";
import { UserSvc } from "../../services/index.mjs";
const userService = new UserSvc();
// // get all users
// router.get("/", UserCtrl.getList);
// router.get("/:id", UserCtrl.getUserById);

// // create user
// router.post(
//   "/search/:data",

//   UserCtrl.search
// );
// router.post(
//   "/search-short/:data",

//   UserCtrl.search_short
// );
// router.post("/", UserCtrl.create);
// router.put("/:id", UserCtrl.update); // update user
// router.put("/change/:id", UserCtrl.changePass); //change password
// router.post(
//   "/forgot/:id",
//   UserCtrl.forgotPass
// ); // thực hiện khi người dùng quên mật khẩu
// router.post(
//   "/forgot",
//   UserCtrl.forgotPass2
// ); // thực hiện khi người dùng quên mật khẩu
// router.delete("/:id", UserCtrl.delete); // delete user
router.post(
  "/",
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
  ]),
  UserCtrl.create
);
export default router;
