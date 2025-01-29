const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    amounts: [
      {
        type: Number,
        required: true,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    paymentId: {
      type: String,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
