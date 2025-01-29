const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

module.exports = router;
