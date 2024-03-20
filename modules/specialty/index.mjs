import passport from "../auth/passport.mjs";
import express from "express";
const router = express.Router(); // create new router
import checkValid from "./validate";
import validate from "../validate";
import SpecialtyCtrl from "./controller.mjs";

router.get("/get-list", checkValid("getList"), validate, SpecialtyCtrl.getList); // get specialty
router.get("/get-one/:id", SpecialtyCtrl.getSpecialtyById); //get specialty
router.put(
  "/edit-specialty/:id",
  passport.authenticate,
  checkValid("update"),
  validate,
  SpecialtyCtrl.updateSpecialtyIn4
); //update specialty
router.delete("/delete/:id", passport.authenticate, SpecialtyCtrl.delete); // delete specialty
router.post(
  "/create",
  passport.authenticate,
  checkValid("create"),
  validate,
  SpecialtyCtrl.create
);
export default router;
