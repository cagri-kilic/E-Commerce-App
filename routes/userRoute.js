const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authMiddleware = require("../middlewares/verifyToken");
router.route("/register").post(userController.createUser);
router.route("/login").post(userController.loginUser);

module.exports = router;
