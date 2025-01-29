const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    res.redirect("/login");
  } catch (err) {
    res.status(500).json({
      success: false,
      err,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    let isSame = false;
    if (user) {
      isSame = await bcrypt.compare(password, user.password);
    } else {
      return res.status(401).json({
        success: false,
        err: "User not found!",
      });
    }
    if (isSame) {
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * 60 * 30 });
      res.redirect("/");
    } else {
      res.status(401).json({
        success: false,
        err: "Password did not match!",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      err,
    });
  }
}

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: 60 * 30 });
}

module.exports = { createUser, loginUser };
