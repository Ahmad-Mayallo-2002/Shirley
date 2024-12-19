const { config } = require("dotenv");
const { Router } = require("express");
const { hashSync } = require("bcrypt");
const Order = require("../models/order");
const User = require("../models/user");
const Cart = require("../models/cart");
const Book = require("../models/book");
const authorization = require("../middlewares/authorization");

config();

const serverError = process.env.SERVER_ERROR || "Internal Server Error";
const router = Router();

router.get("/get-orders", authorization, async (req, res) => {
  try {
    const checkUser = await User.findById(req.headers.id);
    const orders = await Order.find({}).populate({
      path: "user",
      select: ["username", "email", "image", "country", "_id"],
    });
    if (checkUser.role !== "admin")
      return res.status(400).json({ msg: "You Are Not Admin" });
    if (!orders.length)
      return res.status(404).json({ msg: "No Orders Are Found" });
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json(serverError);
  }
});

router.get("/get-user-order", authorization, async (req, res) => {
  try {
    const currentOrder = await Order.find({
      user: req.headers.id,
      orderStatus: "shipped",
    }).select(["_id", "-user", "-paypalDetails"]);
    if (!currentOrder)
      return res.status(404).json({ msg: "This Order is Not Found" });

    return res.status(200).json(currentOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.post("/add-order", authorization, async (req, res) => {
  try {
    const {
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      creditCardDetails,
      paypalDetails,
    } = req.body;
    const requestBody = {
      user: req.headers.id,
      items: items,
      orderStatus: "shipped",
      totalPrice: totalPrice,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
    };
    if (paymentMethod === "credit card")
      requestBody.creditCardDetails = {
        cardNumber: hashSync(creditCardDetails.cardNumber, 10),
        cardExpiry: creditCardDetails.cardExpiry,
        cardCVV: hashSync(creditCardDetails.cardCVV, 10),
        cardHolderName: creditCardDetails.cardHolderName,
      };
    if (paymentMethod === "paypal")
      requestBody.paypalDetails = {
        payerId: hashSync(paypalDetails.payerId, 10),
        paymentId: hashSync(paypalDetails.paymentId, 10),
        payerEmail: paypalDetails.payerEmail,
      };
    if (paymentMethod === "paypal" || paymentMethod === "credit card") {
      requestBody.paymentStatus = "paid";
    }
    await Cart.findOneAndUpdate(
      { user: req.headers.id },
      { $set: { items: [] } }
    );
    const newOrder = new Order(requestBody);
    await newOrder.save();
    return res.status(201).json({ msg: "New Order is Made" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.patch("/update-order-status/:id", authorization, async (req, res) => {
  try {
    const currentOrder = await Order.findById(req.params.id);
    if (!currentOrder)
      return res.status(404).json({ msg: "Order is Not Found" });
    await Order.findByIdAndUpdate(req.params.id, req.body);
    if (req.body.orderStatus === "delievered")
      return res.status(200).json({ msg: "Deliver Order is Done" });
    if (req.body.orderStatus === "cancelled") {
      for (let i = 0; i < currentOrder.items.length; i++) {
        await Book.findOneAndUpdate(
          { _id: currentOrder.items[i].book._id },
          {
            quantity:
              currentOrder.items[i].book.quantity +
              currentOrder.items[i].amount,
          }
        );
      }
      return res.status(200).json({ msg: "Cancel Order is Done" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: serverError });
  }
});

router.delete("/delete-order/:id", authorization, async (req, res) => {
  try {
    const currentOrder = await Order.findById(req.params.id);
    if (!currentOrder)
      return res.status(404).json({ msg: "Order is Not Found" });
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({ msg: "Order is Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: serverError });
  }
});

module.exports = { router };
