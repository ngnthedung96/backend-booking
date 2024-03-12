import * as dotenv from "dotenv";
dotenv.config();
import specialtySeeder from "./modules/specialty/specialty_seeder.mjs";
import scheduleSeeder from "./modules/schedule/schedule_seeder.mjs";
import bookingSeeder from "./modules/booking/booking_seeder.mjs";
import clinicSeeder from "./modules/clinic/clinic_seeder.mjs";
import doctorClinicSeeder from "./modules/doctor-clinic/doctor_clinic_seeder.mjs";
import userSeeder from "./modules/users/user_seeder.mjs";
import mongoose from "mongoose";
const mongoClient = new mongoose.mongo.MongoClient(process.env.CONNECT_STRING, {
  useNewUrlParser: true,
  // useUnifiedTopology: true,
});

(async function () {
  await mongoClient.connect();
  await userSeeder(mongoClient, "booking-care", "users");
  await specialtySeeder(mongoClient, "booking-care", "specialties");
  await clinicSeeder(mongoClient, "booking-care", "clinics");
  bookingSeeder(mongoClient, "booking-care", "bookings");
  scheduleSeeder(mongoClient, "booking-care", "schedules");
  doctorClinicSeeder(mongoClient, "booking-care", "doctor-clinic");
  // await mongoClient.close();
})();
