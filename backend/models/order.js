const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // References the 'User' model
      ref: "User",
      required: true, // Ensures the order belongs to a user
    },
    items: [
      {
        book: {
          type: mongoose.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        amount: {
          type: Number,
          min: 1,
          default: 1,
        },
        _id: false,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true, // Shipping address for the order
    },
    orderStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"], // Order status options
      default: "pending", // Default status is 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"], // Payment status options
      default: "pending", // Default status is 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ["credit card", "paypal", "cash"], // Payment method options
      required: true, // Payment method is mandatory
    },
    // Credit Card Payment Fields
    creditCardDetails: {
      cardNumber: {
        type: String,
        required: function () {
          return this.paymentMethod === "credit card"; // Only required for credit card payments
        },
      },
      cardExpiry: {
        type: String,
        required: function () {
          return this.paymentMethod === "credit card"; // Only required for credit card payments
        },
      },
      cardCVV: {
        type: String,
        required: function () {
          return this.paymentMethod === "credit card"; // Only required for credit card payments
        },
      },
      cardHolderName: {
        type: String,
        required: function () {
          return this.paymentMethod === "credit card"; // Only required for credit card payments
        },
      },
    },
    // PayPal Payment Fields
    paypalDetails: {
      payerId: {
        type: String,
        required: function () {
          return this.paymentMethod === "paypal"; // Only required for PayPal payments
        },
      },
      paymentId: {
        type: String,
        required: function () {
          return this.paymentMethod === "paypal"; // Only required for PayPal payments
        },
      },
      payerEmail: {
        type: String,
        required: function () {
          return this.paymentMethod === "paypal"; // Only required for PayPal payments
        },
      },
    },
  },
  { timestamps: true, collection: "Orders" } // Adds createdAt and updatedAt timestamps
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
