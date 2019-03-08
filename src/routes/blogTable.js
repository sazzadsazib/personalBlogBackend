const BlogModel = require("../models/blog.model");
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

    let blogModelData = {
        username: req.body.username,
        blogData: CryptoJS.AES.encrypt(
            JSON.stringify(req.body.blogdata),
            process.env.ENC_KEY
        ).toString(),
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
});

// getAllBlogs
router.get("/getblogs", (req, res) => {
    BlogModel.find({})
        .then((doc) => {
            let success = true;
            if (!doc || doc.length === 0) {
                success = false;
            }
            let docLocal = doc;
            docLocal.map((elem) => {
                elem.blogData = CryptoJS.AES.decrypt(elem.blogData, process.env.ENC_KEY).toString(
                    CryptoJS.enc.Utf8
                );
                return elem;
            });
            res.status(200).send({ success: success, blogs: docLocal });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

// DELETE
// router.delete("/user", (req, res) => {
//     if (!req.body.username) {
//         return res.status(400).send("Missing body username");
//     }
//
//     UserModel.findOneAndRemove({
//         username: req.body.username,
//     })
//         .then((doc) => {
//             let success = true;
//             if (!doc || doc.length === 0) {
//                 success = false;
//             }
//             res.status(200).send({ success: success });
//         })
//         .catch((err) => {
//             res.status(500).json(err);
//         });
// });

module.exports = router;
