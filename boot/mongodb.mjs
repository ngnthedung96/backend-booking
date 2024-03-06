/* eslint-disable no-console */
import mongoose from "mongoose";
import * as dotenv from "dotenv";
const Admin = mongoose.mongo.Admin;
dotenv.config();

mongoose.set("debug", false);
mongoose.set("useCreateIndex", true);

// eslint-disable-next-line import/no-mutable-exports
let mongoConnect = {};
const initializeMongoDb = () => {
  try {
    console.log(process.env.CONNECT_STRING, 123123);
    mongoConnect = mongoose.createConnection(process.env.CONNECT_STRING, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    mongoConnect.on("connected", () => {
      console.log("Db is connected");
    });

    mongoConnect.on("open", () => {
      console.log("Db App is open");
      new Admin(mongoConnect.db).listDatabases(function (err, result) {
        console.log("listDatabases succeeded");
        // database list stored in result.databases
        var allDatabases = result.databases;
        console.log(allDatabases);
      });
    });
  } catch (error) {
    console.log("err conenct", error);
  }
};
initializeMongoDb();

export { mongoose, mongoConnect };
