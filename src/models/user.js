const mongoose = require("mongoose");
const validator = require("validator");

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        unique: false,
        lowercase: true,
    },
});
module.exports = mongoose.model("User", userSchema);
