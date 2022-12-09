//- 建立mongoose 連線與引入Restaurant model
const mongoose = require("mongoose");
const Restaurant = require("../restaurant");
const User = require("../user");
//- require ressttaurant json file
const restaurantSeeds = require("../../restaurant.json").results;
const userSeeds = require("../../user.json").userList;
const bcrypt = require("bcrypt");

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
  // //- 方法二，種子資料結果屬於array使用insertMany一並加入
  // Restaurant.insertMany(restaurantSeed);

  //! 每筆餐廳資料有對應使用者
  //- 將種子使用者密碼加密存入db -> 前4筆餐廳為user1，後4筆餐廳為user2
  userSeeds.forEach((userSeed, index) => {
    bcrypt.hash(userSeed.password, 12, (err, hash) => {
      if (err) throw err;
      User.create({
        name: userSeed.name,
        email: userSeed.username,
        password: hash,
      }).then((user) => {
        //- index:0 -> user1, 前4筆餐廳
        //- index:1 -> user2, 後4筆餐廳
        const restaurants = index
          ? restaurantSeeds.slice(4)
          : restaurantSeeds.slice(0, 4);
        //- 建立餐廳種子資料
        restaurants.forEach((restaurant) => {
          Restaurant.create({
            name: restaurant.name,
            name_en: restaurant.name_en,
            category: restaurant.category,
            image: restaurant.image,
            location: restaurant.location,
            phone: restaurant.phone,
            google_map: restaurant.google_map,
            rating: restaurant.rating,
            description: restaurant.description,
            userID: user._id,
          });
        });
      });
    });
  });
  console.log("Seed data added successfully!!");
});
