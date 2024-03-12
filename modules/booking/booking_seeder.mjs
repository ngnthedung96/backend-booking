// require the necessary libraries
import { faker } from "@faker-js/faker";
import moment from "moment";
import { UserSvc } from "../../services/index.mjs";
// make constant
const userService = new UserSvc();
export default async function seedDB(mongoClient, dbName, collectionName) {
  // Connection URL

  try {
    let items = [];
    const collectionUser = await mongoClient.db(dbName).collection("users");
    let totalDoctors = await collectionUser
      .find({
        role: userService.ROLE_DOCTOR,
      })
      .toArray();
    totalDoctors = Array.isArray(totalDoctors) ? totalDoctors.length : null;
    let totalPatient = await collectionUser
      .find({
        role: userService.ROLE_PATIENT,
      })
      .toArray();
    totalPatient = Array.isArray(totalPatient) ? totalPatient.length : null;
    if (!totalDoctors || !totalPatient) {
      console.log("Database didn't seed! :)");
    } else {
      const listPromiseSeed = [];
      for (let i = 0; i < 15; i++) {
        const seedEntry = new Promise(async (resolve, reject) => {
          const randomIdDoctor = faker.number.int({
            min: 1,
            max: totalDoctors - 1,
          });
          let randomDoctor = collectionUser
            .find()
            .limit(-1)
            .skip(randomIdDoctor)
            .toArray();
          const randomIdPatient = faker.number.int({
            min: 1,
            max: totalPatient - 1,
          });
          let randomPatient = collectionUser
            .find()
            .limit(-1)
            .skip(randomIdPatient)
            .toArray();
          const getRandom = await Promise.all([randomDoctor, randomPatient]);
          if (!getRandom[0] || !getRandom[1]) {
            reject("Không đủ dữ liệu");
          } else {
            randomDoctor = getRandom[0] ? getRandom[0][0] : null;
            randomPatient = getRandom[1] ? getRandom[1][0] : null;
            if (!randomDoctor || !randomPatient) {
              reject("Không đủ dữ liệu");
            }
            items.push({
              doctorId: randomDoctor["_id"],
              patientId: randomPatient["_id"],
              timeStart: moment().unix(),
              timeEnd: moment().unix(),
              timeCreate: moment().unix(),
              time: moment().unix(),
              status: faker.number.int({ min: 0, max: 4 }),
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
      console.log("Database booking seeded! :)");
    }
  } catch (err) {
    console.log(err.stack ? err.stack : err);
  }
}
