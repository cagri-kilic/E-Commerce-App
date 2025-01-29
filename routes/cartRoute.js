const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/verifyToken");
const cartController = require("../controller/cartController");

router
  .route("/add")
  .post(authMiddleware.verifyToken, cartController.addProductToCart);

router.post(
  "/delete",
  authMiddleware.verifyToken,
  cartController.deleteProductFromCart
);
router.post(
  "/increase",
  authMiddleware.verifyToken,
  cartController.increaseAmountOfProduct
);
router.post(
  "/decrease",
  authMiddleware.verifyToken,
  cartController.decreaseAmountOfProduct
);

module.exports = router;
