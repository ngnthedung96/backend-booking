import passport from "../auth/passport.mjs";
import express from "express";
const router = express.Router(); // create new router
import checkValid from "./validate";
import validate from "../validate";
import UserCtrl from "./controller.mjs";

// --------------------doctor----------------------
router.get("/get-doctor/:id", UserCtrl.getDoctorById); //get doctor
router.get(
  "/get-list-doctor",
  checkValid("getList"),
  validate,
  UserCtrl.getListDoctor
); // get doctor
router.put(
  "/edit-doctor/:id",
  passport.authenticate,
  checkValid("update"),
  validate,
  UserCtrl.updateDoctorIn4
); //update doctor
// ---------------------user-----------------------------
router.get(
  "/get-list-user",
  passport.authenticate,
  checkValid("getList"),
  validate,
  UserCtrl.getListUser
); // get user
router.get("/get-one/:id", UserCtrl.getUserById); //get user
router.put(
  "/edit-user/:id",
  passport.authenticate,
  checkValid("update"),
  validate,
  UserCtrl.updateUserIn4
); //update user
router.put("/change/:id", passport.authenticate, UserCtrl.changePass); //change password
router.delete("/delete/:id", passport.authenticate, UserCtrl.delete); // delete user
// ------------------------chung---------------------
router.post(
  "/create",
  // passport.authenticate,
  checkValid("create"),
  validate,
  UserCtrl.create
);
export default router;
