const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_KEY,
});

async function createPayment(req, res) {
  const cart_detail = await create_cart_detail(req);
  paypal.payment.create(
    create_payment_json(cart_detail.items, cart_detail.total),
    function (err, payment) {
      if (err) {
        throw err;
      } else {
        payment.links.forEach((url) => {
          if (url.rel === "approval_url") {
            res.redirect(url.href);
          }
        });
      }
    }
  );
}

async function setPaymentDetail(req, res) {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const cart_detail = await create_cart_detail(req);

  paypal.payment.execute(
    paymentId,
    execute_payment_json(payerId, cart_detail.total),
    async function (err, payment) {
      if (err) {
        throw console.error();
      } else {
        let user = await User.findOne({
          email: res.locals.user.email,
        });

        let tempOrder = new Order({
          paymentId: payment.cart,
          status: payment.state,
          total: cart_detail.total,
        });
        let products = [];
        let amounts = [];

        cart_detail.items.forEach(async (x) => {
          let p = await Product.findOne({ name: x.name });
          products.push(p._id);
          amounts.push(x.quantity);
        });

        await user.orders.push(tempOrder._id);
        await user.save();
        await tempOrder.save();
        await Order.findOneAndUpdate(
          { _id: tempOrder._id },
          { products: products }
        );
        await Order.findOneAndUpdate(
          { _id: tempOrder._id },
          { amounts: amounts }
        );

        req.session.destroy();
        res.redirect("/");
      }
    }
  );
}

async function create_cart_detail(req) {
  let cart = req.session.cart;
  let items = [];
  let total = 0;
  let products = await Product.find({});

  cart.forEach((cartProduct) => {
    let product = products.find((p) => p._id == cartProduct[0]);
    items.push(create_item_json(product, cartProduct[1]));
    total += product.price * cartProduct[1];
  });
  return {
    items: items,
    total: total,
  };
}

function create_payment_json(items, total) {
  return {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `${process.env.BASE_URL}/payment/success`,
      cancel_url: `${process.env.BASE_URL}/cart`,
    },
    transactions: [
      {
        item_list: {
          items: items,
        },
        amount: {
          currency: "USD",
          total: `${total}`,
        },
        description: "OSF Digital PayPal transaction.",
      },
    ],
  };
}

function create_item_json(product, quantity) {
  return {
    name: `${product.name}`,
    sku: "item",
    price: `${product.price}`,
    currency: "USD",
    quantity: `${quantity}`,
  };
}

function execute_payment_json(payerId, total) {
  return {
    payer_id: `${payerId}`,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: `${total}`,
        },
      },
    ],
  };
}

module.exports = { setPaymentDetail, createPayment };
