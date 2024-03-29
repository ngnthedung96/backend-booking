/* eslint-disable no-console */
/* eslint-disable no-undef */
import passport from "./modules/auth/passport";
import fs from "fs";
import express from "express";
import DailyRotateFile from "winston-daily-rotate-file";

const loadRoutes = async () => {
  const router = express.Router();
  router.use(passport.init());

  const files = fs.readdirSync("./modules");
  const importPromises = files.map(async (name) => {
    const stat = fs.statSync(`./modules/${name}`).isDirectory();
    if (stat) {
      const path = `./modules/${name}`;
      const route = (await import(path)).default;
      router.use(`/${name}`, route);
    }
  });

  // Wait for all imports to finish
  await Promise.all(importPromises);

  // log activity
  // log activitys (do not remove)
  // eslint-disable-next-line no-unused-vars
  router.use((req, res, next) => {
    // Lấy thông tin người dùng từ req.user nếu bạn có thực hiện xác thực người dùng
    let user = "Guest";
    if (req.admin) {
      user = req.admin.email;
    } else if (req.doctor) {
      user = req.doctor.email;
    } else if (req.patient) {
      user = req.patient.email;
    }
    // Lấy thông tin về yêu cầu
    const { method } = req;
    const url = req.originalUrl;
    const date = new Date();

    // Ghi thông tin vào console (hoặc có thể ghi vào file, database,...)
    // eslint-disable-next-line no-console
    gLogger.info(
      `[${date.toString()}] User: ${user}, Method: ${method}, URL: ${url}`
    );
    if (process.env.NODE_ENV !== "production") {
      gLogger.info(
        `Input: ${JSON.stringify(req.body || req.params || req.query)}`
      );
    }

    next();
  });

  return router;
};

export default loadRoutes;
