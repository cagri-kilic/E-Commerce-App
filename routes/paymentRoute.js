const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/verifyToken");
const paymentController = require("../controller/paymentController");

router
  .route("/")
  .get(authMiddleware.verifyToken, paymentController.createPayment);
router
  .route("/success")
  .get(authMiddleware.verifyToken, paymentController.setPaymentDetail);

module.exports = router;
