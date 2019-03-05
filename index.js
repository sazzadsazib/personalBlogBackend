const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const env = require('dotenv').config();

// Connection URL
const url = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASS+"@cluster0-tosfm.mongodb.net/test?retryWrites=true";
console.log(url);
// Database Name
const dbName = 'testDB';

// Use connect method to connect to the server
MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection('user');
    collection.find().toArray((err, items) => {console.log(items)});
    client.close();
});
