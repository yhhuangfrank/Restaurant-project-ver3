//! auth相關route
const router = require("express").Router();
const passport = require("passport");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

//- 註冊本地會員
router.get("/register", (req, res) => {
  return res.render("register");
});

router.post("/register", async (req, res) => {
  const { name, username, password } = req.body;
  if (password.length < 8) {
    //* 更新flash 的error_msg
    req.flash("fail_msg", "密碼長度過短，至少需要8位字元");
    console.log("提交表單");
    return res.render("register", { name, username, password });
  }
  try {
    //- 若輸入內容通過->檢查是否註冊過
    const foundUser = await User.findOne({ email: username });
    if (foundUser) {
      req.flash("fail_msg", "此信箱已被註冊過囉!");
      return res.redirect("/auth/register");
    }
    //- 若為新用戶(進行密碼雜湊與存入資料庫)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: username,
      password: hashedPassword,
    });
    await newUser.save();
    req.flash(req.flash("success_msg", "註冊成功!現在可以登入系統了!"));
    return res.redirect("/home");
  } catch (err) {
    console.log(err);
  }
});

//- 驗證本地會員登入(使用passport提供middleware)
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/home",
    failureFlash: true,
  }),
  (req, res) => {
    console.log("本地會員登入成功!");
    return res.redirect("/restaurants");
  }
);

//- 會員登出
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/home");
  });
});

//- exports router
module.exports = router;
