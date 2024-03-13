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
    const user = req.user ? req.user.username : "Guest";

    // Lấy thông tin về yêu cầu
    const { method } = req;
    const url = req.originalUrl;
    const date = new Date();
    const moduleName = url.split("/")[2] || "";
    const logModule = [
      "jnt",
      "bestexpress",
      "vnpost",
      "ghtk",
      "viettelpost",
      "ghn",
    ];
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
    if (moduleName && logModule.includes(moduleName)) {
      gLogger.add(
        new DailyRotateFile({
          filename: `logs/${moduleName}/%DATE%.log`,
          datePattern: "YYYY-MM-DD",
          prepend: true,
          maxFiles: "7d",
        })
      );
    }
    next();
  });

  return router;
};

export default loadRoutes;
