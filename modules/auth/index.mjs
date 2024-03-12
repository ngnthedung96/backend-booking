import express from "express";
import checkValid from "./validate";
import validate from "../validate";
import ctrl from "./controller";

const router = express.Router();

router.post("/login", checkValid("login"), validate, ctrl.login);
// forgot pass
router.post(
  "/sending-mail-reset-pass",
  checkValid("sendingMailChangePass"),
  validate,
  ctrl.sendingMailChangePass
);
router.post(
  "/check-code-change-pass",
  checkValid("checkCodeChangePass"),
  validate,
  ctrl.checkCodeChangePass
);

// register
router.post("/register", checkValid("register"), validate, ctrl.register);
// verify email
router.get(
  "/verify-email/:id",
  checkValid("verifyEmail"),
  validate,
  ctrl.verifyEmail
);

router.post("/refresh", ctrl.refresh);
router.post("/logout", ctrl.logout);

export default router;
