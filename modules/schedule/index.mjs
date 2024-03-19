import express from "express";
const router = express.Router(); // create new router
import { validator, body } from "../validator"; // create new router
import ScheduleCtrl from "./controller.mjs";
import passport from "../auth/passport.mjs";
import checkValid from "./validate";
import validate from "../validate";

router.get("/get-list", ScheduleCtrl.getList);
router.post(
  "/create",
  passport.authenticate,
  checkValid("create"),
  validate,
  ScheduleCtrl.create
);
router.put(
  "/edit/:id",
  passport.authenticate,
  checkValid("update"),
  validate,
  ScheduleCtrl.update
);
router.delete(
  "/delete/:id",
  passport.authenticate,
  checkValid("delete"),
  validate,
  ScheduleCtrl.delete
);

export default router;
