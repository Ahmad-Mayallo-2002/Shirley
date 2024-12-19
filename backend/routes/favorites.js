const { config } = require("dotenv");
const { Router } = require("express");
const Favorites = require("../models/favorites");
const authorization = require("../middlewares/authorization");
const User = require("../models/user");

config();

const serverError = process.env.SERVER_ERROR || "Internal Server Error";
const router = Router();

router.get("/get-favorites", authorization, async (req, res) => {
  try {
    const currentUser = await User.findById(req.headers.id);
    const favorites = await Favorites.find({});
    if (currentUser.role === "admin")
      return res
        .status(400)
        .json({ msg: "You Are Not Admin To Access To Users Favorites Lists" });
    if (!favorites.length)
      return res.status(404).json({ msg: "No Favorites Lists Are Found" });
    return res.status(200).json(favorites);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.get("/get-user-favorite", authorization, async (req, res) => {
  try {
    const favorite = await Favorites.findOne({ user: req.headers.id }).populate(
      "items"
    );
    if (!favorite)
      return res.status(404).json({ msg: "No Favorites List is Found" });
    return res.status(200).json(favorite);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.post("/add-to-favorites/:bookId", authorization, async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.headers.id;
    const favorite = await Favorites.findOne({ user: userId });
    if (!favorite) {
      const newFavorite = new Favorites({
        user: userId,
      });
      newFavorite.items.push(bookId);
      await newFavorite.save();
    } else {
      const currentBook = favorite.items.find(
        (book) => book._id.toString() === bookId
      );
      if (currentBook)
        return res
          .status(400)
          .json({ msg: "This Book is Already in Favorites List" });
      await Favorites.findOneAndUpdate(
        { user: req.headers.id },
        { $push: { items: bookId } }
      );
    }
    return res.status(201).json({ msg: "Book is Added To Favorites List" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.delete(
  "/delete-from-favorites/:bookId",
  authorization,
  async (req, res) => {
    try {
      const favorite = await Favorites.findOne({ user: req.headers.id });
      const currentBook = favorite.items.find(
        (book) => book._id.toString() === req.params.bookId
      );
      if (!currentBook)
        return res
          .status(404)
          .json({ msg: "This Book is Not Found in Favorites" });
      if (!favorite)
        return res
          .status(404)
          .json({ msg: "This User Have Not Favorites List" });

      await Favorites.findOneAndUpdate(
        { user: req.headers.id },
        { $pull: { items: req.params.bookId } }
      );
      return res
        .status(200)
        .json({ msg: "This Book Removed From Favorites List" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: serverError });
    }
  }
);

module.exports = { router };
