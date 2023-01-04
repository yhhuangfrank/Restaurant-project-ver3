//! mongoose connection setting

//! require mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOOSE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", () => {
  console.log("MongoDB connect error!!!");
});
db.once("open", () => {
  console.log("MongoDB connected successfully!!!");
});

//- export db
module.exports = db;
