import { faker } from "@faker-js/faker";
import moment from "moment";
import hash from "../../libs/hash.mjs";
import * as dotenv from "dotenv";

// import multer from "multer ";
dotenv.config();
// setting const
const iterations = +process.env.ITERATIONS;
const keylength = +process.env.KEY_LENGTH;
const digest = process.env.DIGEST;
const saltLength = +process.env.SALT_LENGTH;

let items = [];
for (let i = 0; i < 15; i++) {
  const hashFn = hash.createHashPasswordFn(
    saltLength,
    iterations,
    keylength,
    digest
  );
  const passHash = await hashFn("1234567");
  items.push({
    name: faker.lorem.text(),
    description: faker.lorem.text(),
    imageLink: faker.lorem.text(),
    status: faker.number.int({ min: 0, max: 1 }),
    orders: faker.number.int({ min: 0, max: 1 }),
    name: faker.finance.accountName(),
    phone: faker.phone.number(),
    email: faker.internet.email(),
    imageLink: faker.lorem.text(),
    gender: faker.number.int({ min: 0, max: 2 }),
    address: faker.lorem.text(),
    position: faker.number.int({ min: 1, max: 4 }),
    password: passHash.hash,
    salt: passHash.salt,
    time: moment().unix(),
    status: faker.number.int({ min: 0, max: 1 }),
    orders: faker.number.int({ min: 0, max: 1 }),
    role: faker.number.int({ min: 1, max: 3 }),
  });
}

// require the necessary libraries

export default async function seedDB(mongoClient, dbName, collectionName) {
  // Connection URL

  try {
    const collection = mongoClient.db(dbName).collection(collectionName);
    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    // collection.drop();

    // make a bunch of time series data
    await collection.insertMany(items);

    console.log("Database user seeded! :)");
  } catch (err) {
    console.log(err.stack ? err.stack : err);
  }
}
