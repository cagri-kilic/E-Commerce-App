const Product = require("../models/Product");

function getIndexPage(req, res) {
  res.render("index", { link: "index" });
}

function getRegisterPage(req, res) {
  res.render("register", { link: "register" });
}

function getLoginPage(req, res) {
  res.render("login", { link: "login" });
}

function getLogout(req, res) {
  res.cookie("jwt", "", { maxAge: 1 });
  req.session.destroy();
  res.redirect("/");
}

async function getCartPage(req, res) {
  try {
    const cart = req.session.cart;
    const products = await Product.find({});
    let cartProducts = [];

    products.forEach((product) => {
      const cartItem = cart.find((item) => product._id == item[0]);

      if (cartItem) {
        cartProducts.push([product, cartItem[1]]);
      }
    });
    res.render("cart", {
      link: "cart",
      products: cartProducts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      err,
    });
  }
}

module.exports = {
  getLogout,
  getIndexPage,
  getRegisterPage,
  getLoginPage,
  getCartPage,
};
