import passport from "../auth/passport.mjs";
import express from "express";
const router = express.Router(); // create new router
import checkValid from "./validate";
import validate from "../validate";
import ClinicCtrl from "./controller.mjs";

router.get("/get-list", checkValid("getList"), validate, ClinicCtrl.getList); // get clinic
router.get("/get-one/:id", ClinicCtrl.getClinicById); //get clinic
router.put(
  "/edit-clinic/:id",
  passport.authenticate,
  checkValid("update"),
  validate,
  ClinicCtrl.updateClinicIn4
); //update clinic
router.delete("/delete/:id", passport.authenticate, ClinicCtrl.delete); // delete clinic
router.post(
  "/create",
  passport.authenticate,
  checkValid("create"),
  validate,
  ClinicCtrl.create
);
export default router;
