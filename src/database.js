const mongoose = require("mongoose");
const env = require("dotenv").config();
const server =
    "mongodb+srv://" +
    process.env.DB_USER +
    ":" +
    process.env.DB_PASS +
    "@cluster0-tosfm.mongodb.net/test?retryWrites=true";
const database = process.env.DB_NAME;

class Database {
    constructor() {
        this._connect();
    }
    _connect() {
        mongoose
            .connect(`mongodb://${server}/${database}`)
            .then(() => {
                console.log("Database connection successful");
            })
            .catch((err) => {
                console.error("Database connection error");
            });
    }
}
module.exports = new Database();
