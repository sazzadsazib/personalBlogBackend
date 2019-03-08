let UserModel = require("../models/user.model");
let express = require("express");
let router = express.Router();

// Create
router.post("/user", (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    if (!req.body.username || !req.body.password) {
        console.log("Fields Are not Available in body");
    }

    let model = new UserModel(req.body);
    model
        .save()
        .then((doc) => {
            if (!doc || doc.length === 0) {
                return res.status(500).send(doc);
            }

            res.status(201).send(doc);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// USER VALIDATION
router.post("/userAuth", (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    if (!req.body.username || !req.body.password) {
        console.log("Fields Are not Available in body");
    }

    // let model = new UserModel(req.body);
    UserModel.find(req.body)
        .then((doc) => {
            let success = true;
            if (!doc || doc.length === 0) {
                success = false;
            }
            res.status(200).send({ success: success });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// UPDATE
router.put("/user", (req, res) => {
    if (!req.query.username) {
        return res.status(400).send("Missing URL parameter: user");
    }

    UserModel.findOneAndUpdate(
        {
            username: req.query.username,
        },
        req.body,
        {
            new: true,
        }
    )
        .then((doc) => {
            let success = true;
            if (!doc || doc.length === 0) {
                success = false;
            }
            res.status(200).send({ success: success });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// DELETE
router.delete("/user", (req, res) => {
    if (!req.body.username) {
        return res.status(400).send("Missing body username");
    }

    UserModel.findOneAndRemove({
        username: req.body.username,
    })
        .then((doc) => {
            let success = true;
            if (!doc || doc.length === 0) {
                success = false;
            }
            res.status(200).send({ success: success });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

module.exports = router;
