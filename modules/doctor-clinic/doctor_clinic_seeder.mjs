import { faker } from "@faker-js/faker";
import moment from "moment";
import { UserSvc } from "../../services/index.mjs";
// require the necessary libraries
const userService = new UserSvc();

export default async function seedDB(mongoClient, dbName, collectionName) {
  // Connection URL
  try {
    let items = [];
    const collectionDoctor = mongoClient.db(dbName).collection("users");
    let totalDoctors = await collectionDoctor
      .find({
        role: userService.ROLE_DOCTOR,
      })
      .toArray();
    totalDoctors = Array.isArray(totalDoctors) ? totalDoctors.length : null;
    const collectionClinic = mongoClient.db(dbName).collection("clinics");
    let totalClinics = await collectionClinic.find().toArray();
    totalClinics = Array.isArray(totalClinics) ? totalClinics.length : null;
    const collectionSpecialty = mongoClient
      .db(dbName)
      .collection("specialties");
    let totalSpecialties = await collectionSpecialty.find().toArray();
    totalSpecialties = Array.isArray(totalSpecialties)
      ? totalSpecialties.length
      : null;
    if (!totalDoctors || !totalClinics || !totalSpecialties) {
      console.log("Database didn't seed! :)");
    } else {
      const listPromiseSeed = [];
      for (let i = 0; i < 15; i++) {
        const seedEntry = new Promise(async (resolve, reject) => {
          const randomIdDoctor = faker.number.int({
            min: 1,
            max: totalDoctors - 1,
          });
          let randomDoctor = collectionDoctor
            .find()
            .limit(-1)
            .skip(randomIdDoctor)
            .toArray();
          const randomIdClinic = faker.number.int({
            min: 1,
            max: totalClinics - 1,
          });
          let randomClinic = collectionClinic
            .find()
            .limit(-1)
            .skip(randomIdClinic)
            .toArray();

          const randomIdSpecialty = faker.number.int({
            min: 1,
            max: totalSpecialties - 1,
          });
          let randomSpecialty = collectionSpecialty
            .find()
            .limit(-1)
            .skip(randomIdSpecialty)
            .toArray();
          const getRandom = await Promise.all([
            randomDoctor,
            randomClinic,
            randomSpecialty,
          ]);
          if (!getRandom[0] || !getRandom[1] || !getRandom[2]) {
            reject("Không đủ dữ liệu");
          } else {
            randomDoctor = getRandom[0] ? getRandom[0][0] : null;
            randomClinic = getRandom[1] ? getRandom[1][0] : null;
            randomSpecialty = getRandom[2] ? getRandom[2][0] : null;
            if (!randomDoctor || !randomClinic || !randomSpecialty) {
              reject("Không đủ dữ liệu");
            }
            items.push({
              doctorId: randomDoctor["_id"],
              clinicId: randomClinic["_id"],
              specialtyId: randomSpecialty["_id"],
              time: moment().unix(),
              status: faker.number.int({ min: 0, max: 1 }),
              orders: faker.number.int({ min: 0, max: 1 }),
            });
          }

          resolve();
        });
        listPromiseSeed.push(seedEntry);
      }
      await Promise.all(listPromiseSeed);
      const collectionSchedule = mongoClient
        .db(dbName)
        .collection(collectionName);
      // The drop() command destroys all data from a collection.
      // Make sure you run it against proper database and collection.
      // collection.drop();

      // make a bunch of time series data
      collectionSchedule.insertMany(items);

      console.log("Database doctor-clinic seeded! :)");
    }
  } catch (err) {
    console.log(err.stack ? err.stack : err);
  }
}
