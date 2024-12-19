const { config } = require("dotenv");
const { Router } = require("express");
const Book = require("../models/book");
const authorization = require("../middlewares/authorization");
const multer = require("multer");
const { writeFileSync, unlinkSync, readFileSync } = require("fs");
const User = require("../models/user");
const { log } = require("console");
const { resolve } = require("path");

config();

const upload = multer();
const serverError = process.env.SERVER_ERROR || "Internal Server Error";
const router = Router();

router.post(
  "/add-book",
  upload.single("image"),
  authorization,
  async (req, res) => {
    try {
      // Request Body
      const { title, author, description, category, price, quantity } =
        req.body;
      const file = req.file;
      const fileArray = file.originalname.split(".");
      const fileName = `${fileArray[0]}-${Date.now()}.${fileArray[1]}`;
      const filePath = resolve(
        `../../Book Store/frontend/public/books_images/${fileName}`
      );
      const requestBody = {
        title: title,
        author: author,
        description: description,
        category: category,
        price: Number(price),
        quantity: Number(quantity),
        image: `/books_images/${fileName}`,
      };
      const checkBook = await Book.findOne({ title: title });
      const currentUser = await User.findById(req.headers.id);
      // Check User is Author or Not
      if (currentUser.role !== "admin")
        return res.status(400).json({ msg: "You Are Not Admin" });
      // Check if Book is Already Exist or Not
      if (checkBook)
        return res.status(400).json({ msg: "This Book is Already Exist" });
      // Make New Book
      const newBook = new Book(requestBody);
      writeFileSync(filePath, file.buffer);
      await newBook.save();
      return res.status(201).json({ msg: `${title} Book is Published` });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: serverError });
    }
  }
);

router.get("/get-books", async (req, res) => {
  try {
    const category = req.query.search;
    let books;
    category === "all" || !category
      ? (books = await Book.find({}).limit(req.query.limit))
      : (books = await Book.find({ category: category }).limit(
          req.query.limit
        ));
    if (!books.length) return res.status(404).json({ msg: "No Books Found" });
    return res.status(200).json(books);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.get("/get-books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: "No Book Found" });
    return res.status(200).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.delete("/delete-book/:id", authorization, async (req, res) => {
  try {
    const currentBook = await Book.findById(req.params.id);
    const checkUser = await User.findById(req.headers.id);
    if (checkUser.role !== "admin")
      return res.status(400).json({ msg: "You Are Not Author" });
    if (!currentBook)
      return res.status(404).json({ msg: "This Book is Not Found" });
    await Book.findByIdAndDelete(req.params.id);
    return res.status(200).json({ msg: "This Book is Deleted" });
  } catch (error) {
    log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.patch("/update-book/:id", authorization, async (req, res) => {
  try {
    const { title, author, description, category, price, quantity } = req.body;
    const requestBody = {};
    const file = req.file;
    const checkBook = await Book.findById(req.params.id);
    const currentUser = await User.findById(req.headers.id);
    if (currentUser.role !== "admin")
      return res.status(400).json({ msg: "You are Not Admin" });
    if (!checkBook)
      return res.status(404).json({ msg: "This Book is Not Found" });
    if (file) {
      const fileArray = file.originalname.split(".");
      const fileName = `${fileArray[0]}-${Date.now()}.${fileArray[1]}`;
      const filePath = resolve(
        `../../Book Store/frontend/public/books_images/${fileName}`
      );
      unlinkSync(
        resolve(
          `../../Book Store/frontend/public/books_images/${checkBook.image}`
        )
      );
      writeFileSync(filePath, file.buffer);
      requestBody.image = `/books_images/${fileName}`;
    }
    if (title) {
      const checkBook = await Book.findOne({ title: title });
      if (checkBook)
        return res.status(400).json({ msg: "This Book is Already Exist" });
      requestBody.title = title;
    }
    if (author) requestBody.author = author;
    if (description) requestBody.description = description;
    if (category) requestBody.category = category;
    if (price) requestBody.price = price;
    if (quantity) requestBody.quantity = quantity;
    await Book.findByIdAndUpdate(req.params.id, { $set: requestBody });
    return res.status(200).json({ msg: "Updated is Done" });
  } catch (error) {
    log(error);
    res.status(500).json({ msg: serverError });
  }
});

module.exports = { router };
