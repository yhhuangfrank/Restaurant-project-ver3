//! require express
const express = require("express");
const app = express();
const port = 3000;
// - require express-handlebars
const exphbs = require("express-handlebars");
//- require Restaurant model
const Restaurant = require("./models/restaurant");
//! require mongoose
const mongoose = require("mongoose");
//- require bodyparser
const bodyParser = require("body-parser");
//- require checkFormInput
const checkFormInput = require("./models/checkFormInput");

//! connect to db
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //- 僅在非正式環境時使用dotenv
}

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
});

//! template engine setting
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//! load static files
app.use(express.static("public"));
//! body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

//! set server route
app.get("/", (req, res) => {
  //- 取出所有餐廳資料
  return Restaurant.find()
    .lean()
    .then((restaurants) => res.render("index", { restaurants }))
    .catch((err) => console.log(err));
});

//- 導向新增餐廳頁面
app.get("/restaurants/new", (req, res) => {
  return res.render("new");
});
//- 接收新增餐廳請求
app.post("/restaurants", (req, res) => {
  const restaurant = req.body;
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body;
  //- check form input
  const errMessage = checkFormInput(restaurant);
  if (errMessage) {
    return res.render("new", {
      errMessage,
      restaurant,
    });
  }
  //- create new restaurant in db and redirect to index page
  return Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

app.get("/restaurants/:_id", (req, res) => {
  const { _id } = req.params;
  //- 透過id查詢導向對應餐廳資料，將查詢結果傳回給show頁面
  return Restaurant.findById(_id)
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((err) => console.log(err));
});

//! search for certain restaurants
app.get("/search", (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim();
  //- 尋找包含keyword的餐廳

  //- search by rating (若輸入數字)
  if (!isNaN(Number(keyword))) {
    return Restaurant.find({ rating: { $gte: Number(keyword) } })
      .lean()
      .then((restaurants) => {
        if (!restaurants.length) {
          return res.render("error", { keyword });
        }
        return res.render("index", { restaurants, keyword });
      })
      .catch((err) => console.log(err));
  }

  //- 如果輸入文字
  return Restaurant.find({
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { name_en: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ],
  })
    .lean()
    .then((restaurants) => {
      if (!restaurants.length) {
        return res.render("error", { keyword });
      }
      return res.render("index", { restaurants, keyword });
    })
    .catch((err) => console.log(err));
});

//- 導向修改頁面
app.get("/restaurants/:_id/edit", (req, res) => {
  const { _id } = req.params;
  return Restaurant.findById(_id)
    .lean()
    .then((restaurant) => {
      return res.render("edit", { restaurant, _id });
    })
    .catch((err) => console.log(err));
});
//- 接收修改請求
app.post("/restaurants/:_id/edit", (req, res) => {
  const { _id } = req.params;
  const restaurant = req.body;
  //- check form input
  const errMessage = checkFormInput(restaurant);
  if (errMessage) {
    return res.render("edit", {
      errMessage,
      restaurant,
      _id,
    });
  }
  return Restaurant.findById(_id)
    .then((restaurant) => {
      //- 取得資料後修改並儲存
      for (const prop in req.body) {
        restaurant[prop] = req.body[prop];
      }
      return restaurant.save();
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch((err) => console.log(err));
});

//- 接收delete請求
app.post("/restaurants/:_id/delete", (req, res) => {
  const { _id } = req.params;
  return (
    Restaurant.findById(_id)
      //- 找到對應資料並刪除，重新導向
      .then((restaurant) => restaurant.remove())
      .then(() => res.redirect("/"))
      .catch((err) => console.log(err))
  );
});

//! route for not found (undefined route)
app.get("*", (req, res) => {
  res.render("error");
});

//! listen to server
app.listen(port, () => {
  console.log(`Server is listening to http://localhost:${port}`);
});
