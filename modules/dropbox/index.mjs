import express from "express"; // create new router
import Ctrl from "./controller.mjs";
import passport from "../auth/passport.mjs";
import checkValid from "./validate";
import validate from "../validate";

const router = express.Router();

router.get("/", Ctrl.getList);
router.post(
  "/create",
  passport.authenticate,
  checkValid("create"),
  validate,
  Ctrl.create
);
router.put(
  "/edit/:id",
  passport.authenticate,
  checkValid("update"),
  validate,
  Ctrl.update
);
router.delete(
  "/delete/:id",
  passport.authenticate,
  checkValid("delete"),
  validate,
  Ctrl.delete
);

export default router;