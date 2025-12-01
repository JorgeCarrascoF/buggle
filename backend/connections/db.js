const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)

  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connected to MongoDB Atlas:", err));

module.exports = mongoose;
