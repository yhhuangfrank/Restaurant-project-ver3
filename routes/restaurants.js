//! /restaurants的route設定
const router = require("express").Router();
const Restaurant = require("../models/restaurant");
//- require checkFormInput
const { checkFormInput } = require("../models/checkFormInput");

//- 驗證登入middleware
const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("authChecking");
    return next();
  } else {
    return res.redirect("/restaurants");
  }
};

router.get("/", authCheck, (req, res) => {
  console.log("get user's restaurants ....");
  //- 取出對應user的餐廳資料
  const user = req.user;
  const userID = req.user._id;
  return Restaurant.find({ userID })
    .lean()
    .then((restaurants) => res.render("index", { restaurants, user }))
    .catch((err) => console.log(err));
});

//- 導向新增餐廳頁面
router.get("/new", authCheck, (req, res) => {
  return res.render("new");
});
//- 接收新增餐廳請求
router.post("/", (req, res) => {
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
  const userID = req.user._id;
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
    userID,
  })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

//- 顯示詳細資訊
router.get("/:_id", (req, res) => {
  const { _id } = req.params;
  //- 透過id查詢導向對應餐廳資料，將查詢結果傳回給show頁面
  return Restaurant.findById(_id)
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((err) => console.log(err));
});

//! search for certain restaurants
router.get("/search", (req, res) => {
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
router.get("/:_id/edit", (req, res) => {
  const { _id } = req.params;
  return Restaurant.findById(_id)
    .lean()
    .then((restaurant) => {
      return res.render("edit", { restaurant, _id });
    })
    .catch((err) => console.log(err));
});
//- 接收修改請求
router.post("/:_id/edit", (req, res) => {
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
router.post("/:_id/delete", (req, res) => {
  const { _id } = req.params;
  return (
    Restaurant.findById(_id)
      //- 找到對應資料並刪除，重新導向
      .then((restaurant) => restaurant.remove())
      .then(() => res.redirect("/"))
      .catch((err) => console.log(err))
  );
});

//- exports router
module.exports = router;
