import passport from "../auth/passport.mjs";
import express from "express";
const router = express.Router(); // create new router
import checkValid from "./validate";
import validate from "../validate";
import UserCtrl from "./controller.mjs";

router.get("/get-one/:id", UserCtrl.getUserById); // get user
router.put("/edit/:id", UserCtrl.update); // update user
router.put("/change/:id", UserCtrl.changePass); //change password
router.delete("/delete/:id", UserCtrl.delete); // delete user
router.post(
  "/create",
  passport.authenticate,
  checkValid("create"),
  validate,
  UserCtrl.create
);
export default router;
