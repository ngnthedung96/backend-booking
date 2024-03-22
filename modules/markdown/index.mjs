import passport from "../auth/passport.mjs";
import express from "express";
const router = express.Router(); // create new router
import checkValid from "./validate";
import validate from "../validate";
import markdownCtrl from "./controller.mjs";

router.put(
  "/edit-specialty/:id",
  passport.authenticate,
  checkValid("update"),
  validate,
  markdownCtrl.updateSpecialtyIn4
); //update specialty
router.delete("/delete/:id", passport.authenticate, markdownCtrl.delete); // delete specialty
router.post(
  "/create",
  passport.authenticate,
  checkValid("create"),
  validate,
  markdownCtrl.create
);
export default router;
