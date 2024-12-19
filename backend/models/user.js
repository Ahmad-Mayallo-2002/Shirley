const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true, // Makes the field mandatory
      trim: true, // Removes whitespace from the beginning and end
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate emails
    },
    country: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Restricts the value to these options
      default: "user", // Default role is 'user'
      required: true,
    },
  },
  { timestamps: true, collection: "Users" } // Adds createdAt and updatedAt timestamps
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
