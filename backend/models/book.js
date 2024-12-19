const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Makes the title mandatory
      trim: true, // Removes whitespace from the beginning and end
      unique: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    publishedDate: {
      type: Date,
      default: Date.now(), // Default to the current date if not specified
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "Books" }
);

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
