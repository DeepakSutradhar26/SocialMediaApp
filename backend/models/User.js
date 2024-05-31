const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },

    avatar: {
        public_id: String,
        url: String
    },

    email: {
        type: String,
        required: [true, "Please enter email address"],
        unique: true,
    },

    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Password should be atleast 6 character"],
        select: false
    },

    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
    ],

    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],

    followings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],

    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

//arrow function dont have this.anything property
userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = async function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
}

userSchema.methods.getResetPasswordToken = function () {

    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model("User", userSchema);