const BlogModel = require("../models/blog.model");
const UserModel = require("../models/user.model");
const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const env = require("dotenv").config();

// create
router.post("/blog", (req, res) => {
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }

    if (!req.body.username || !req.body.blogdata || !req.body.storedPassword) {
        console.log("Fields Are not Available in body");
        res.send({ status: false, error: "body is not available" });
    }
    UserModel.findOne({
        username: req.body.username,
        password: CryptoJS.AES.decrypt(req.body.storedPassword, process.env.ENC_KEY).toString(
            CryptoJS.enc.Utf8
        ),
    }).then((doc) => {
        console.log(doc);
        if (!doc || doc.length === 0) {
            res.send({ success: false });
        } else {
            let blogModelData = {
                username: req.body.username,
                blogData: JSON.stringify(req.body.blogdata),
                createdAt: new Date(),
            };
            let model = new BlogModel(blogModelData);
            model
                .save()
                .then((doc) => {
                    let success = true;
                    if (!doc || doc.length === 0) {
                        success = false;
                    }
                    res.status(200).send({ success: success });
                })
                .catch((err) => {
                    console.log("err", err);
                    res.status(200).json({ success: false, error: err.errmsg });
                });
        }
    });
});

// getAllBlogs
router.get("/getblogs", (req, res) => {
    BlogModel.find({})
        .then((doc) => {
            let success = true;
            if (!doc || doc.length === 0) {
                success = false;
            }

            res.status(200).send({ success: success, blogs: doc });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

module.exports = router;
