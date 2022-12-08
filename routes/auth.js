//! auth相關route
const router = require("express").Router();
const passport = require("passport");

//- 註冊本地會員
router.get("/register", (req, res) => {
  return res.render("register");
});

//- exports router
module.exports = router;
