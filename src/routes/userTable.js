const UserModel = require("../models/user.model");
const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const env = require("dotenv").config();

// register
router.post("/user", (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    if (!req.body.username || !req.body.password) {
        // console.log("Fields Are not Available in body");
        res.send({ success: false });
    }

    let userModelData = {
        username: req.body.username,
        password: CryptoJS.SHA256(req.body.password).toString(),
    };
    console.log(userModelData);

    let model = new UserModel(userModelData);
    model
        .save()
        .then((doc) => {
            if (!doc || doc.length === 0) {
                return res.status(500).send({ success: false });
            }

            res.status(201).send({ success: true });
        })
        .catch((err) => {
            res.status(500).json({ success: false, error: err.errmsg });
        });
});

// Login
router.post("/userAuth", (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    if (!req.body.username || !req.body.password) {
        console.log("Fields Are not Available in body");
    }

    let userModelData = {
        username: req.body.username,
        password: CryptoJS.SHA256(req.body.password).toString(),
    };
    console.log(userModelData);
    UserModel.findOne(userModelData)
        .then((doc) => {
            let success = true;
            if (!doc || doc.length === 0) {
                success = false;
            }
            let docLocal = doc;
            if (docLocal.password) {
                docLocal.password = CryptoJS.AES.encrypt(
                    docLocal.password,
                    process.env.ENC_KEY
                ).toString();
            }
            // // Decrypt
            // let bytes  = CryptoJS.AES.decrypt(docLocal.password,process.env.ENC_KEY);
            // let originalText = bytes.toString(CryptoJS.enc.Utf8);

            res.status(200).send({ success: success, data: docLocal });
        })
        .catch(() => {
            res.status(200).json({ success: false });
        });
});

// Edit user
router.put("/user", (req, res) => {
    if (!req.query.username) {
        return res.status(400).send("Missing URL parameter: user");
    }

    let userModelData = {};
    if (!req.body.password) {
        userModelData = req.body;
    } else {
        userModelData = {
            username: req.body.username,
            password: CryptoJS.SHA256(req.body.password).toString(),
        };
    }

    // Decrypt
    const bytes = CryptoJS.AES.decrypt(req.body.storedPassword, process.env.ENC_KEY);
    const originalPass = bytes.toString(CryptoJS.enc.Utf8);
    // check the stored state password is same for validation if user has access to modify this user

    UserModel.findOneAndUpdate(
        {
            username: req.query.username,
            password: originalPass,
        },
        userModelData,
        {
            new: true,
        }
    )
        .then((doc) => {
            let success = true;
            if (!doc || doc.length === 0) {
                success = false;
            }
            console.log(doc);
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
    // Decrypt
    const bytes = CryptoJS.AES.decrypt(req.body.storedPassword, process.env.ENC_KEY);
    const originalPass = bytes.toString(CryptoJS.enc.Utf8);

    UserModel.findOneAndRemove({
        username: req.body.username,
        password: originalPass,
    })
        .then((doc) => {
            console.log(doc);
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
