const { config } = require("dotenv");
const { verify } = require("jsonwebtoken");
config();
const JWT_KEY = process.env.JWT_KEY || "JWT_KEY";
const authorization = (req, res, next) => {
  const reqHeaders = req.headers;
  const token =
    reqHeaders["authorization"] && reqHeaders["authorization"].split(" ")[1];
  if (!token)
    return res.status(403).json({ msg: "Token is Not Found or Expired" });
  verify(token, JWT_KEY, (error, user) => {
    if (error) return res.status(403).json(error);
    req.user = user;
  });
  next();
};
module.exports = authorization;
