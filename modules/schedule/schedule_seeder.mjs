// require the necessary libraries
import { faker } from "@faker-js/faker";
import { UserSvc } from "../../services/index.mjs";
import moment from "moment";
// make constant
const userService = new UserSvc();

export default async function seedDB(mongoClient, dbName, collectionName) {
  // Connection URL
  try {
    let items = [];
    const collectionDoctor = await mongoClient.db(dbName).collection("users");
    const totalDoctors = await collectionDoctor
      .find({
        role: userService.ROLE_DOCTOR,
      })
      .toArray();
    const lengthDoctors = totalDoctors.length;
    if (lengthDoctors) {
      const listPromiseSeed = [];
      for (let i = 0; i < 15; i++) {
        const seedEntry = new Promise(async (resolve, reject) => {
          const randomIdDoctor = faker.number.int({
            min: 1,
            max: lengthDoctors - 1,
          });
          let randomDoctor = await collectionDoctor
            .find()
            .limit(-1)
            .skip(randomIdDoctor)
            .toArray();
          randomDoctor = randomDoctor ? randomDoctor[0] : null;
          if (!randomDoctor) {
            reject("Không tìm thấy bác sĩ");
          }
          items.push({
            currentNumber: faker.number.int({ min: 0, max: 5 }),
            maxNumber: faker.number.int({ min: 0, max: 5 }),
            doctorId: randomDoctor["_id"],
            timeStart: moment().unix(),
            timeEnd: moment().add(1, "M").unix(),
            timeCreate: moment().unix(),
            status: faker.number.int({ min: 0, max: 1 }),
            orders: faker.number.int({ min: 0, max: 1 }),
          });
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

      console.log("Database schedule seeded! :)");
    } else {
      console.log("Database didn't seed! :)");
    }
  } catch (err) {
    console.log(err.stack ? err.stack : err);
  }
}
