import passport from "../auth/passport.mjs";
import express from "express";
const router = express.Router(); // create new router
import checkValid from "./validate";
import validate from "../validate";
import SpecialtyCtrl from "./controller.mjs";

router.get("/get-list", checkValid("getList"), validate, SpecialtyCtrl.getList); // get clinic
router.get("/get-one/:id", SpecialtyCtrl.getSpecialtyById); //get clinic
router.put(
  "/edit-clinic/:id",
  passport.authenticate,
  checkValid("update"),
  validate,
  SpecialtyCtrl.updateSpecialtyIn4
); //update clinic
router.delete("/delete/:id", SpecialtyCtrl.delete); // delete clinic
router.post(
  "/create",
  passport.authenticate,
  checkValid("create"),
  validate,
  SpecialtyCtrl.create
);
export default router;
