const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const env = require("dotenv").config();
const port = process.env.SERVER_PORT;

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

    let userModel = require("./src/models/user");
    let msg = new userModel({
        username: "mahirmusleh",
        password: "bie korbo",
    });
    msg.save()
        .then((doc) => {
            console.log(doc);
        })
        .catch((err) => {
            console.error(err);
        });

    return res.send(username);
});

app.listen(port, () => console.log(`Running on ${port}!`));
