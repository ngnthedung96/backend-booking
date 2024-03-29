import { faker } from "@faker-js/faker";
import moment from "moment";

let items = [];
for (let i = 0; i < 15; i++) {
  items.push({
    name: faker.lorem.text(),
    address: faker.lorem.text(),
    introduce: faker.lorem.text(),
    strength: faker.lorem.text(),
    equipment: faker.lorem.text(),
    address: faker.lorem.text(),
    process: faker.lorem.text(),
    imageLink: faker.lorem.text(),
    time: moment().unix(),
    status: faker.number.int({ min: 0, max: 1 }),
    orders: faker.number.int({ min: 0, max: 1 }),
  });
}

// require the necessary libraries

export default async function seedDB(mongoClient, dbName, collectionName) {
  // Connection URL

  try {
    const collection = await mongoClient.db(dbName).collection(collectionName);
    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    // collection.drop();

    // make a bunch of time series data
    await collection.insertMany(items);

    console.log("Database clinic seeded! :)");
  } catch (err) {
    console.log(err.stack ? err.stack : err);
  }
}
