const router = require("express").Router();
const Restaurant = require("../../models/restaurant");

//! search for certain restaurants
router.get("/", (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim();
  let { sort } = req.query;
  const lastSortMethod = sort;
  //- 尋找包含keyword的餐廳
  const userID = req.user._id;
  if (sort === "asc" || sort === "desc") {
    sort = { name_en: sort };
  }
  //- search by rating (若輸入數字or空字串)
  if (!isNaN(Number(keyword))) {
    return Restaurant.find({ rating: { $gte: Number(keyword) }, userID })
      .lean()
      .collation({ locale: "en" })
      .sort(sort)
      .then((restaurants) => {
        if (!restaurants.length) {
          return res.render("error", { keyword, lastSortMethod });
        }
        return res.render("index", {
          restaurants,
          keyword,
          lastSortMethod,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.render("error", { error: err.message });
      });
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
    .collation({ locale: "en" })
    .sort(sort)
    .then((restaurants) => {
      if (!restaurants.length) {
        return res.render("error", { keyword, lastSortMethod });
      }
      return res.render("index", {
        restaurants,
        keyword,
        lastSortMethod,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.render("error", { error: err.message });
    });
});

module.exports = router;
