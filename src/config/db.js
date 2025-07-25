const mongoose = require("mongoose");

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.log("❌ Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
