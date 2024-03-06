import express from "express";
const router = express.Router(); // create new router
import { validator, body } from "../validator"; // create new router

import BookingCtrl from "./controller.mjs";

export default router;
