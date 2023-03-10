//! auth相關route
const router = require("express").Router();
const passport = require("passport");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

//- 註冊本地會員
router.get("/register", (req, res) => {
  return res.render("register");
});

router.post("/register", (req, res) => {
  const { name, username, password, confirmPassword } = req.body;
  let register_fail_msg = [];
  if (password.length < 8) {
    register_fail_msg.push({ message: "密碼過短，至少需8位" });
  }
  if (password !== confirmPassword) {
    register_fail_msg.push({ message: "密碼與確認密碼不符!" });
  }
  if (register_fail_msg.length) {
    return res.render("register", {
      name,
      username,
      password,
      confirmPassword,
      register_fail_msg,
    });
  }
  //- 若輸入內容通過->檢查是否註冊過
  return User.findOne({ email: username })
    .then((user) => {
      if (user) {
        req.flash("fail_msg", "此信箱已被註冊過囉!");
        return res.redirect("/auth/register");
      }
      //- 若為新用戶(進行密碼雜湊與存入資料庫)
      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) =>
          User.create({
            name,
            email: username,
            password: hashedPassword,
          })
        )
        .then(() => {
          req.flash(req.flash("success_msg", "註冊成功!現在可以登入系統了!"));
          return res.redirect("/");
        });
    })
    .catch((err) => {
      console.log(err);
      return res.render("error", { error: err.message });
    });
});

//- 驗證本地會員登入(使用passport提供middleware)
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    failureFlash: true,
  }),
  (req, res) => res.redirect("/restaurants")
);

//- 會員登出
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "已成功登出!");
    res.redirect("/");
  });
});

//- facebook登入
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] }) //- 向facebook索取資訊
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/restaurants",
    failureRedirect: "/",
  })
);

//- google 登入
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/restaurants",
    failureRedirect: "/",
  })
);

//- exports router
module.exports = router;
