import * as dotenv from "dotenv";
dotenv.config();
import specialtySeeder from "./modules/specialty/specialty_seeder.mjs";
import mongoose from "mongoose";
const mongoClient = new mongoose.mongo.MongoClient(process.env.CONNECT_STRING, {
  useNewUrlParser: true,
  // useUnifiedTopology: true,
});
(function () {
  specialtySeeder(mongoClient, "booking-care", "specialty");
})(10, 20);
