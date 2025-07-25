// entry point to backend bootstrapping
// index.js at the project root as the entry‑point that boots up the server
require("dotenv").config();

const connectDB = require("./config/db.js");
const app = require("./app.js");

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ucart";

const startServer = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error starting the server:", err);
    process.exit(1); // Exit the process with failure
  }
};

startServer();
