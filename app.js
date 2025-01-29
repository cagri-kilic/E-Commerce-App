const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const { conn } = require("./db");
const pageRoute = require("./routes/pageRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const userRoute = require("./routes/userRoute");
const paymentRoute = require("./routes/paymentRoute");
const expressSession = require("express-session");
const { createProduct } = require("./controller/productController");
const { checkUser } = require("./middlewares/verifyToken");
dotenv.config();

conn();
const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);
app.use(
  expressSession({
    secret: process.env.SESSION_KEY,
    saveUninitialized: false,
    resave: false,
  })
);
app.use(function (req, res, next) {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});
app.set("view engine", "ejs");

//routes
app.use("*", checkUser);
app.use("/", pageRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);
app.use("/users", userRoute);
app.use("/payment", paymentRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on ${PORT}`));
