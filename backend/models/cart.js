const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // References the 'User' model
      ref: "User",
      required: true, // Ensures the cart belongs to a user
    },
    items: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId, // References the 'Book' model
          ref: "Book",
          required: true, // Ensures the item references a valid book
        },
        amount: {
          type: Number,
          default: 1,
          required: true,
        },
        _id: false,
      },
    ],
  },
  { timestamps: true, collection: "Carts" } // Adds createdAt and updatedAt timestamps
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
