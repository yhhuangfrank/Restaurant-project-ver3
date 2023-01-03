//! /restaurants的route設定
const router = require("express").Router();
const Restaurant = require("../../models/restaurant");
//- require checkFormInput
const { checkFormInput } = require("../../models/checkFormInput");

router.get("/", (req, res) => {
  //- 取出對應user的餐廳資料
  const userID = req.user._id;
  return Restaurant.find({ userID })
    .lean()
    .sort({ _id: "asc" })
    .then((restaurants) => res.render("index", { restaurants}))
    .catch((err) => console.log(err));
});

//- 導向新增餐廳頁面
router.get("/new", (req, res) => {
  const userID = req.user._id;
  //- 取得目前收藏餐廳所有類別
  return Restaurant.find({ userID }, { category: 1, _id: 0 })
    .lean()
    .then((userCategories) => {
      const categories = userCategories
        .map((category) => category.category)
        .filter(
          (category, index, mappedArr) => mappedArr.indexOf(category) === index
        );
      return res.render("new", { categories });
    })
    .catch((err) => console.log(err));
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
    .then(() => res.redirect("/restaurants"))
    .catch((err) => console.log(err));
});

//- 顯示詳細資訊
router.get("/:_id", (req, res) => {
  const userID = req.user._id;
  const { _id } = req.params;
  //- 透過id查詢導向對應餐廳資料，將查詢結果傳回給show頁面
  return Restaurant.findOne({ _id, userID })
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((err) => console.log(err));
});

//- 導向修改頁面
router.get("/:_id/edit", (req, res) => {
  const userID = req.user._id;
  const { _id } = req.params;
  return Restaurant.findById(_id)
    .lean()
    .then((restaurant) => {
      return Restaurant.find({ userID }, { category: 1, _id: 0 })
        .lean()
        .then((userCategories) => {
          const categories = userCategories
            .map((category) => category.category)
            .filter(
              (category, index, mappedArr) =>
                mappedArr.indexOf(category) === index
            );
          //- 使用filter第三個參數調取呼叫filter前(經過map之後)的array
          return res.render("edit", { restaurant, _id, categories });
        });
    })
    .catch((err) => console.log(err));
});
//- 接收修改請求(使用method-override 改為PUT)
router.put("/:_id", (req, res) => {
  const userID = req.user._id;
  const { _id } = req.params;
  const restaurant = req.body;
  //- check form input
  const errMessage = checkFormInput(restaurant);
  if (errMessage) {
    return res.render("edit", {
      errMessage,
      restaurant,
      _id,
      user,
    });
  }
  return Restaurant.findOne({ _id, userID })
    .then((restaurant) => {
      //- 取得資料後修改並儲存
      restaurant = Object.assign(restaurant, req.body);
      return restaurant.save();
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch((err) => console.log(err));
});

//- 接收delete請求(使用method-override改為DELETE)
router.delete("/:_id", (req, res) => {
  const userID = req.user._id;
  const { _id } = req.params;
  return (
    //- 找到對應資料並刪除，重新導向
    Restaurant.findOneAndDelete({ _id, userID })
      .then(() => res.redirect("/restaurants"))
      .catch((err) => console.log(err))
  );
});

//- exports router
module.exports = router;
