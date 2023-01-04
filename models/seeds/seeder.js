//- 引入Restaurant, User model
const Restaurant = require("../restaurant");
const User = require("../user");
//- require ressttaurant json file
const restaurantSeeds = require("../../restaurant.json").results;
const userSeeds = require("../../user.json").userList;
const bcrypt = require("bcryptjs");

//! 僅在非正式環境取用dotenv
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//- 建立mongoose 連線
const db = require("../../config/mongoose");

db.once("open", () => {
  //! 每筆餐廳資料有對應使用者
  //- 將種子使用者密碼加密存入db -> 前4筆餐廳為user1，後4筆餐廳為user2
  userSeeds.forEach((userSeed, index) => {
    bcrypt.hash(userSeed.password, 10, (err, hash) => {
      if (err) throw err;
      return User.create({
        name: userSeed.name,
        email: userSeed.username,
        password: hash,
      })
        .then(async (user) => {
          const userID = user._id;
          //- index:0 -> user1, 前4筆餐廳
          //- index:1 -> user2, 後4筆餐廳
          const restaurants = index
            ? restaurantSeeds.slice(4)
            : restaurantSeeds.slice(0, 4);
          //- 建立餐廳種子資料
          const promiseArr = Array.from({ length: 4 }, (value, i) =>
            Restaurant.create({
              name: restaurants[i].name,
              name_en: restaurants[i].name_en,
              category: restaurants[i].category,
              image: restaurants[i].image,
              location: restaurants[i].location,
              phone: restaurants[i].phone,
              google_map: restaurants[i].google_map,
              rating: restaurants[i].rating,
              description: restaurants[i].description,
              userID,
            })
          );
          return await Promise.all(promiseArr);
        })
        .then(() => {
          console.log("Seed data added successfully!!");
          process.exit(); //- end seeder program
        })
        .catch((err) => console.log(err));
    });
  });
});
