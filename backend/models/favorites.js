const mongoose = require("mongoose");

const FavoritesListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId, // Reference to the 'User' model
      ref: "User",
      required: true, // Ensures the list belongs to a user
    },
    items: [
      {
        type: mongoose.Types.ObjectId, // Reference to the 'Book' model
        ref: "Book",
        required: true, // Ensures each item references a valid book
      },
    ],
  },
  { timestamps: true, collection: "Favorites" } // Adds createdAt and updatedAt timestamps to the schema
);

const Favorites = mongoose.model("Favorites", FavoritesListSchema);

module.exports = Favorites;
