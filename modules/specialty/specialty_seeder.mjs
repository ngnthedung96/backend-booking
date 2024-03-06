import { faker } from "@faker-js/faker";

let items = [];
for (let i = 0; i < 15; i++) {
  items.push({
    description: faker.lorem.text(),
    imageLink: faker.lorem.text(),
    status: faker.number.int({ min: 0, max: 1 }),
    orders: faker.number.int({ min: 0, max: 1 }),
  });
}

// require the necessary libraries

export default async function seedDB(mongoClient, dbName, collectionName) {
  // Connection URL

  try {
    await mongoClient.connect();
    const collection = mongoClient.db(dbName).collection(collectionName);

    // The drop() command destroys all data from a collection.
    // Make sure you run it against proper database and collection.
    // collection.drop();

    // make a bunch of time series data
    collection.insertMany(items);

    console.log("Database seeded! :)");
    mongoClient.close();
  } catch (err) {
    console.log(err.stack);
  }
}
