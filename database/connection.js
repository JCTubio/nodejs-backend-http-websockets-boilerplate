import mongoose from "mongoose";

const database = process.env.DB_NAME;
const address = `${process.env.DB_URL}:${process.env.DB_PORT}`;
const url = `mongodb://${address}/${database}`;

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    if(database && address){
      mongoose.set("useCreateIndex", true);
      mongoose
        .connect(url, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useFindAndModify: false,
          useCreateIndex: true
        })
        .then(() => {
          console.log("Database connection successful");
        })
        .catch(err => {
          console.error("Database connection error: ", err);
        });
    } else {
      console.error("Environment variables for database not found, database: %s, address: %s", database, address)
    }
  }
}

export default new Database();
