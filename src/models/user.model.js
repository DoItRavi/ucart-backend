const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: "CUSTOMER" },
  mobile: { type: String },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  paymentInformation: [
    { type: mongoose.Schema.Types.ObjectId, ref: "PaymentInformation" },
  ],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  createdAt: { type: Date, default: Date.now },
});

// The first arg here (“User”) becomes the collection name “users”
module.exports = mongoose.model("User", userSchema);
// The model name "User" is used to create the collection "users" in MongoDB
