const { config } = require("dotenv");
const { Router } = require("express");
const Cart = require("../models/cart");
const authorization = require("../middlewares/authorization");
const User = require("../models/user");
const Book = require("../models/book");
config();

const serverError = process.env.SERVER_ERROR || "Internal Server Error";
const router = Router();

router.get("/get-carts", authorization, async (req, res) => {
  try {
    const carts = await Cart.find({});
    const checkUser = await User.findById(req.headers.id);
    if (checkUser.role !== "admin")
      return res.status(400).json({ msg: "You Are Not Admin" });
    return res.status(200).json(carts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.get("/get-user-cart", authorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.headers.id })
      .select("items")
      .populate({
        path: "items.book",
        select: "-quantity",
      });
    if (!cart) return res.status(404).json({ msg: "This Cart is Not Exist" });
    return res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.post("/add-to-cart/:bookId", authorization, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.headers.id;
    const bookId = req.params.bookId;
    const checkCart = await Cart.findOne({ user: userId });
    const currentBook = await Book.findById(bookId);

    if (!currentBook)
      return res.status(404).json({ msg: "This Book is Not Found" });
    if (!currentBook.quantity)
      return res.status(404).json({ msg: "Book Quantity is 0" });
    if (!checkCart) {
      const newCart = new Cart({
        user: userId,
      });
      newCart.items.push({ amount: amount, book: bookId });
      await newCart.save();
    } else {
      const existBook = checkCart.items.find(
        (book) => book.book._id.toString() === bookId
      );
      if (existBook)
        return res.status(400).json({ msg: "This Book is Already in Cart" });
      await Cart.findOneAndUpdate(
        { user: userId },
        {
          $push: {
            items: { amount: amount, book: bookId },
          },
        }
      );
    }
    await currentBook.updateOne({
      quantity: eval(currentBook.quantity - amount),
    });
    return res.status(201).json({ msg: "This Book is Added To Cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.delete("/remove-from-cart/:bookId", authorization, async (req, res) => {
  try {
    const checkCart = await Cart.findOne({ user: req.headers.id });
    const book = checkCart.items.find(
      (book) => book.book._id.toString() === req.params.bookId
    );
    console.log(book);
    if (!book) return res.status(404).json({ msg: "This Book is Not Found" });
    if (!checkCart)
      return res.status(404).json({ msg: "This Cart is Not Found" });
    await Cart.findOneAndUpdate(
      { user: req.headers.id },
      { $pull: { items: book } }
    );
    await Book.findOneAndUpdate(
      { _id: req.params.bookId },
      { $inc: { quantity: book.amount } }
    );
    return res.status(200).json({ msg: "Book is Deleted From Cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: serverError });
  }
});

module.exports = { router };
