const mongoose = require("mongoose");

function conn() {
  mongoose
    .connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
      console.log(`DB connection err:,${err}`);
    });
}

module.exports = { conn };
