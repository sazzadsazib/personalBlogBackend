const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const env = require("dotenv").config();
//Mongo staffs;
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dbName = process.env.DB_NAME;
const port = process.env.SERVER_PORT;
const url =
    "mongodb+srv://" +
    process.env.DB_USER +
    ":" +
    process.env.DB_PASS +
    "@cluster0-tosfm.mongodb.net/test?retryWrites=true";

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => res.send({ message: "sorry no endpoint available for this root path" }));

app.post("/login", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    let statusData = null;
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
        assert.equal(null, err);
        // console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collection = db.collection("user");
        collection.findOne({ name: username }, (err, item) => {
            console.log(item);
        });
        client.close();
    });
    return res.send(statusData);
});

app.listen(port, () => console.log(`Running on ${port}!`));
