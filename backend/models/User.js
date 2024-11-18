const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please Enter your userName"],
    unique: false,
    trim: true,
    maxLenght: [20, "username cant be exceed 100 character"],
    default: 0.0,
  },
  email: {
    type: String,
    unique: false,
    required: [true, "Please enter your email"],
    validate: [validator.isEmail, "Please enter a valid email address"],
  },

  password: {
    type: String,
    required: [true, "Please enter the password"],
    minlength: [6, "Your password must be longer than 6 characters"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "Admin"],
    },
  },
  permissions: {
    type: [String],
    default: ["read", "write", "delete", "update"],
    enum: ["read", "write", "delete", "update"],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && new Set(v).size === v.length;
      },
      message:
        'Permissions should be unique and limited to "read", "write", "delete" and "update"',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};
const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
