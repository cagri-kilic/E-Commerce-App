const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username area is required"],
      unique: true,
      lowercase: true,
      validate: [
        validator.isAlphanumeric,
        "Username must only contain alphanumeric characters",
      ],
    },
    email: {
      type: String,
      required: [true, "Email area is required"],
      unique: true,
      validate: [validator.isEmail, "Valid email required"],
    },
    password: {
      type: String,
      required: [true, "Password area is required"],
      minLength: [6, "Password must be at least 6 characters"],
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", userSchema);
