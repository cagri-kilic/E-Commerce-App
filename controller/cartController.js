const Product = require("../models/Product");
const User = require("../models/User");

async function addCart2(req, res) {
  try {
    const product = await Product.findById({ _id: req.body.product_id });
    const user = await User.findByIdAndUpdate(
      { _id: res.locals.user._id },
      {
        $push: { orders: product._id },
      },
      { new: true }
    );
    res.json({ user: user });
    //res.status(200).render("cart", { products, link: "cart" });
  } catch (err) {
    res.status(500).json({
      success: false,
      err,
    });
  }
}

function addProductToCart(req, res) {
  let flag = req.session.cart.find(
    (product) => product[0] == req.body.product_id
  );

  if (flag) {
    let productIndex = req.session.cart.findIndex(
      (product) => product[0] == req.body.product_id
    );
    req.session.cart[productIndex][1]++;
  } else {
    req.session.cart.push([req.body.product_id, 1]);
  }
  res.redirect("/products");
}

function deleteProductFromCart(req, res) {
  let productIndex = req.session.cart.findIndex(
    (product) => product[0] === req.body.product_id
  );
  if (
    req.session.cart.length === 1 &&
    req.session.cart[0][0] == req.body.product_id
  ) {
    req.session.cart = [];
  } else {
    req.session.cart.splice(productIndex, 1);
  }
  res.redirect("/cart");
}

function increaseAmountOfProduct(req, res) {
  let productIndex = req.session.cart.findIndex(
    (product) => product[0] == req.body.product_id
  );
  req.session.cart[productIndex][1]++;

  res.redirect("/cart");
}

function decreaseAmountOfProduct(req, res) {
  let productIndex = req.session.cart.findIndex(
    (product) => product[0] == req.body.product_id
  );
  req.session.cart[productIndex][1]--;
  res.redirect("/cart");
}

module.exports = {
  decreaseAmountOfProduct,
  increaseAmountOfProduct,
  deleteProductFromCart,
  addProductToCart,
};
