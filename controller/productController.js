const Product = require("../models/Product");

async function getAllProducts(req, res) {
  try {
    const products = await Product.find({});
    res.status(200).render("products", { products, link: "products" });
  } catch (err) {
    res.status(500).json({
      success: false,
      err,
    });
  }
}

async function createProduct(req, res) {
  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
    img: req.body.img,
  });
  try {
    const savedProduct = await newProduct.save();
    res.json({
      savedProduct: savedProduct,
      message: "Created Product",
    });
  } catch (err) {
    res.json(err);
  }
}

module.exports = { getAllProducts, createProduct };
