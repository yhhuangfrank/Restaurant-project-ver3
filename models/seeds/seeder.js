//- 建立mongoose 連線與引入Restaurant model
const mongoose = require("mongoose");
const Restaurant = require("../restaurant");
//- require ressttaurant json file
const restaurantSeed = require("../../restaurant.json").results;

//! 僅在非正式環境取用dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//- 連線database
mongoose.connect(process.env.MONGOOSE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", () => {
  console.log("MongoDB connect error!!!");
});
db.once("open", () => {
  console.log("MongoDB connected successfully!!!");
  //- 連線後加入種子資料
  // restaurantSeed.forEach((restaurant) => {
  //   Restaurant.create({
  //     name: restaurant.name,
  //     name_en: restaurant.name_en,
  //     category: restaurant.category,
  //     image: restaurant.image,
  //     location: restaurant.location,
  //     phone: restaurant.phone,
  //     google_map: restaurant.google_map,
  //     rating: restaurant.rating,
  //     description: restaurant.description,
  //   });
  // });
  //- 方法二，種子資料結果屬於array使用insertMany一並加入
  Restaurant.insertMany(restaurantSeed);
  console.log("Seed data added successfully!!");
});
