const express = require("express");
const router = express.Router();
const pageController = require("../controller/pageController");

router.route("/").get(pageController.getIndexPage);
router.route("/register").get(pageController.getRegisterPage);
router.route("/login").get(pageController.getLoginPage);
router.route("/logout").get(pageController.getLogout);
router.route("/cart").get(pageController.getCartPage);

module.exports = router;
