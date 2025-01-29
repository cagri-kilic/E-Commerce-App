const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, process.env.JWT_KEY, (err) => {
        if (err) {
          console.log(err.message);
          res.redirect("/login");
        } else next();
      });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    res.status(401).json({
      success: false,
      err: "You are not authorized!",
    });
  }
}

async function checkUser(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        const user = await User.findById(decodedToken.userId);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
}

module.exports = { verifyToken, checkUser };
