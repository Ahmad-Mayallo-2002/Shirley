const { config } = require("dotenv");
const { Router } = require("express");
const User = require("../models/user");
const multer = require("multer");
const { resolve } = require("path");
const { hashSync, compareSync } = require("bcrypt");
const { writeFileSync, unlinkSync } = require("fs");
const { log } = require("console");
const { sign } = require("jsonwebtoken");
const authorization = require("../middlewares/authorization");
const SendMail = require("../middlewares/test");

config();

const serverError = process.env.SERVER_ERROR;
const upload = multer();
const router = Router();
const JWT_KEY = process.env.JWT_KEY;

router.post("/sign-up", upload.single("image"), async (req, res) => {
  try {
    const { username, email, password, country, role } = req.body;
    const file = req.file;
    const checkEmail = await User.findOne({ email: email });
    if (checkEmail)
      return res.status(400).json({ msg: "This Email is Already Used" });
    const newUser = new User({
      username: username,
      email: email,
      password: hashSync(password, 10),
      country: country,
    });
    role ? (newUser.role = role) : null;
    if (file) {
      const fileArray = file.originalname.split(".");
      const fileName = `${fileArray[0]}-${Date.now()}.${fileArray[1]}`;
      const filePath = resolve(
        `../../Book Store/frontend/public/users_images/${fileName}`
      );
      writeFileSync(filePath, file.buffer);
      newUser.image = `/users_images/${fileName}`;
    }
    await newUser.save();
    return res.status(201).json({ msg: "Done" });
  } catch (error) {
    log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkEmail = await User.findOne({ email: email });
    const checkPassword = compareSync(password, checkEmail.password);
    if (!checkEmail) return res.status(404).json({ msg: "Invalid Email" });
    if (!checkPassword)
      return res.status(404).json({ msg: "Invalid Password" });
    const payload = {
      id: checkEmail._id,
      email: email,
      role: checkEmail.role,
      username: checkEmail.username,
    };
    const token = sign(payload, JWT_KEY, {
      expiresIn: "30d",
    });
    const data = JSON.stringify({
      _id: checkEmail._id,
      token: token,
      role: checkEmail.role,
    });
    res
      .cookie("token", data, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .send({ msg: "Done" });
  } catch (error) {
    log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.get("/get-users", authorization, async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    const checkUser = await User.findById(req.headers.id);
    if (checkUser.role !== "admin")
      return res.status(400).json({ msg: "You Are Not Admin" });
    if (!users.length) return res.status(404).json({ msg: "No Users Found" });
    return res.status(200).json(users);
  } catch (error) {
    log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.get("/get-users/:id", authorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "No User Found" });
    return res.status(200).json(user);
  } catch (error) {
    log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.delete("/delete-user/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const checkUser = await User.findById(id);
    if (!checkUser)
      return res.status(404).json({ msg: "This User is Not Found" });
    await User.findByIdAndDelete(id);
    return res.status(200).json({ msg: "User is Deleted" });
  } catch (error) {
    log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.patch(
  "/update-user",
  upload.single("image"),
  authorization,
  async (req, res) => {
    try {
      const { username, email, password, country } = req.body;
      const file = req.file;
      const requestBody = {};
      const checkUser = await User.findById(req.headers.id);
      if (!checkUser)
        return res.status(404).json({ msg: "This User is Not Found" });
      if (username) requestBody.username = username;
      if (country) requestBody.country = country;
      if (email) {
        const checkEmail = await User.findOne({ email: email });
        if (checkEmail)
          return res.status(400).json({ msg: "This Email is Already Used" });
        requestBody.email = email;
      }
      if (password) requestBody.password = hashSync(password, 10);
      if (file) {
        const fileArray = file.originalname.split(".");
        const fileName = `${fileArray[0]}-${Date.now()}.${fileArray[1]}`;
        const filePath = resolve(
          `../../Book Store/frontend/public/users_images/${fileName}`
        );
        unlinkSync(
          resolve(
            `../../Book Store/frontend/public/users_images/${checkUser.image}`
          )
        );
        writeFileSync(filePath, file.buffer);
        requestBody.image = `/users_images/${fileName}`;
      }
      await User.findByIdAndUpdate(req.headers.id, { $set: requestBody });
      return res.status(200).json({ msg: "User Update is Done" });
    } catch (error) {
      log(error);
      res.status(500).json({ msg: serverError });
    }
  }
);

router.post("/send-email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ msg: "Invalid Email" });
    const otp = await SendMail(req.body.email);
    console.log(otp);
    return res
      .cookie("OTP", JSON.stringify({ otp: otp }), {
        httpOnly: false,
        secure: true,
        maxAge: 900 * 1000,
        sameSite: "strict",
      })
      .json({ msg: "Done" });
  } catch (error) {
    log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.patch("/update-password", async (req, res) => {
  try {
    const { password, confirmPassword, email } = req.body;
    if (password !== confirmPassword)
      return res.status(400).json({ msg: "Two Passwords Must Be Equal" });
    await User.findOneAndUpdate(
      { email: email },
      { password: hashSync(password, 10) }
    );
    return res.status(200).json({ msg: "Password Updated is Done" });
  } catch (error) {
    log(error);
    res.status(500).json({ msg: serverError });
  }
});

module.exports = { router };
