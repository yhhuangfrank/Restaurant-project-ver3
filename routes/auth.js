//! auth相關route
const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcrypt");

//- 註冊本地會員
router.get("/register", (req, res) => {
  return res.render("register");
});

router.post("/register", async (req, res) => {
  const { name, username, password } = req.body;
  if (password.length < 8) {
    //* 更新flash 的error_msg
    req.flash("fail_msg", "密碼長度過短，至少需要8位字元。");
    return res.redirect("/auth/register");
  }
  //- 若輸入內容通過->檢查是否註冊過
  const foundUser = await User.findOne({ email: username });
  if (foundUser) {
    req.flash(
      "fail_msg",
      "此信箱已被註冊過，請使用此信箱嘗試登入或是使用新信箱註冊。"
    );
    return res.redirect("/auth/register");
  }
  //- 若為新用戶(進行密碼加密與存入資料庫)
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    name,
    email: username, 
    password: hashedPassword,
  })
  await newUser.save();
  req.flash(req.flash("success_msg", "恭喜註冊成功，現在可以登入系統了!"))
  return res.redirect("/")
});

//- exports router
module.exports = router;
