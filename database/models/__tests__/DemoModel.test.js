import mongoose from "mongoose";
import DemoModel from "../DemoModel";

const demoValueData = {
  demoValue1: "abcd123",
  demoValue2: 5,
  demoValue3: "juancruztubio@gmail.com"
};

describe("Wish Model Test", () => {
  // open db connection
  beforeAll(async () => {
    await mongoose.connect(
      global.__MONGO_URI__,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
      },
      err => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
  });

  async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      const collection = mongoose.connection.collections[collectionName];
      await collection.deleteMany();
    }
  }

  afterEach(async () => {
    await removeAllCollections();
  });

  it("Creates & Saves a demo value successfully", async () => {
    const savedDemoValue = await DemoModel.create(demoValueData);

    expect(savedDemoValue._id).toBeDefined();
    expect(savedDemoValue.demoValue1).toBe(demoValueData.demoValue1);
    expect(savedDemoValue.demoValue2).toBe(demoValueData.demoValue2);
    expect(savedDemoValue.demoValue3).toBe(demoValueData.demoValue3);
  });

  it("Creates & Saves a demo value successfully and ignores properties not defined in the schema", async () => {
    const demoValueDataWithInvalidField = {
      ...demoValueData,
      invalidProperty: "invalid"
    };

    const savedDemoValue = await DemoModel.create(demoValueDataWithInvalidField);

    expect(savedDemoValue._id).toBeDefined();
    expect(savedDemoValue.demoValue1).toBe(demoValueDataWithInvalidField.demoValue1);
    expect(savedDemoValue.demoValue2).toBe(demoValueDataWithInvalidField.demoValue2);
    expect(savedDemoValue.demoValue3).toBe(demoValueDataWithInvalidField.demoValue3);
    expect(savedDemoValue.invalidProperty).toBeUndefined();
  });

  it("Fails to create a demo value with missing required fields", async () => {
    const demoValueDataWithMissingFields = { demoValue1: "This is a dummy demoValue." };
    let err;

    try {
      const savedDemoValueWithMissingFields = await DemoModel.create(
        demoValueDataWithMissingFields
      );
      error = savedDemoValueWithMissingFields;
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.demoValue3).toBeDefined();
  });

  it("Updates and saves a demo value successfully", async () => {
    const secondDemoValue = {
      demoValue1: "abcd1234",
      demoValue2: 8,
      demoValue3: "juancruztubio2@gmail.com"
    };

    const savedDemoValue = await DemoModel.create(demoValueData);
    const query = { _id: savedDemoValue._id };

    const updatedDemoValue = await DemoModel.update(query, secondDemoValue);

    expect(updatedDemoValue._id).toBeDefined();
    expect(updatedDemoValue.demoValue1).toBe(secondDemoValue.demoValue1);
    expect(updatedDemoValue.demoValue2).toBe(secondDemoValue.demoValue2);
    expect(updatedDemoValue.demoValue3).toBe(secondDemoValue.demoValue3);
  });

  it("Deletes a demo value successfully", async () => {
    const savedDemoValue = await DemoModel.create(demoValueData);
    const query = { _id: savedDemoValue._id };

    const deletedWish = await DemoModel.delete(query);

    expect(String(deletedWish._id)).toBe(String(query._id));
  });

  it("Gets all demo values with a specified demoValue1", async () => {
    const secondDemoValue = {
      demoValue1: "abcd1234",
      demoValue2: 8,
      demoValue3: "juancruztubio2@gmail.com"
    };

    await DemoModel.create(demoValueData);
    await DemoModel.create(secondDemoValue);

    const query = "abcd123";

    const response = await DemoModel.getById(query);

    expect(response).toHaveLength(1);
    expect(response[0]).toHaveProperty("_id");
    expect(response[0]).toHaveProperty("demoValue1");
    expect(response[0]).toHaveProperty("demoValue2");
    expect(response[0]).toHaveProperty("demoValue3");
  });
});
