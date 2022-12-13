const router = require("express").Router();
const Restaurant = require("../../models/restaurant");

const authCheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("authChecking");
    return next();
  } else {
    return res.redirect("/");
  }
};

//! search for certain restaurants
router.get("/", authCheck, (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim();
  //- 尋找包含keyword的餐廳
  const user = req.user;
  const userID = req.user._id;
  //- search by rating (若輸入數字)
  if (!isNaN(Number(keyword))) {
    return Restaurant.find({ rating: { $gte: Number(keyword) }, userID })
      .lean()
      .then((restaurants) => {
        if (!restaurants.length) {
          return res.render("error", { keyword, user });
        }
        return res.render("index", { restaurants, keyword, user });
      })
      .catch((err) => console.log(err));
  }

  //- 如果輸入文字(使用regular expression, options: i 表示不分大小寫(insensitive match))
  return Restaurant.find({
    $and: [
      {
        userID,
      },
      {
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { name_en: { $regex: keyword, $options: "i" } },
          { category: { $regex: keyword, $options: "i" } },
        ],
      },
    ],
  })
    .lean()
    .then((restaurants) => {
      if (!restaurants.length) {
        return res.render("error", { keyword, user });
      }
      return res.render("index", { restaurants, keyword, user });
    })
    .catch((err) => console.log(err));
});

module.exports = router;