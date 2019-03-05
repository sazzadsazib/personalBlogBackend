const express = require("express");
const app = express();
const port = 5001;
//Mongo staffs;
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const env = require("dotenv").config();
const dbName = process.env.DB_NAME;
const url =
    "mongodb+srv://" +
    process.env.DB_USER +
    ":" +
    process.env.DB_PASS +
    "@cluster0-tosfm.mongodb.net/test?retryWrites=true";

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection("user");
    collection.find().toArray((err, items) => {
        console.log(items);
    });
    client.close();
});

app.get("/", (req, res) =>
    res.send({ message: "sorry no endpoint available for this root path" })
);

app.get("/userAuth", (req, res) => {
    console.log("hi");
    return res.send({ userAUTH: "LEL" });
});

app.listen(port, () => console.log(`Running on ${port}!`));
