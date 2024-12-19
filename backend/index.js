const { config } = require("dotenv");
const { log } = require("console");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connect } = require("mongoose");
const { router: book } = require("./routes/book");
const { router: user } = require("./routes/user");
const { router: cart } = require("./routes/cart");
const { router: favorites } = require("./routes/favorites");
const { router: order } = require("./routes/order");
const cookieParser = require("cookie-parser");
const User = require("./models/user");

config();
const { DATABASE, PORT, SERVER_ERROR } = process.env;
const port = PORT || 5000;
const app = express();
const api = "/api";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

app.use(api, book);
app.use(api, user);
app.use(api, cart);
app.use(api, favorites);
app.use(api, order);

(async function connectDB() {
  try {
    connect(DATABASE);
    log("Database Connection is Successfully");
  } catch (error) {
    log("Database Connection is Failed");
  }
})();

app.get("/", async (req, res) => {
  try {
    res.status(200).json({ msg: "Hello World" });
  } catch (error) {
    log(error);
    res.status(500).json(SERVER_ERROR || "Internal Server Error");
  }
});

app.listen(
  port,
  log(`Server is Running on Port ${port} http://localhost:${port}`)
);
