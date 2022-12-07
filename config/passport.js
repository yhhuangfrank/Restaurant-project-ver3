//! require passport
const passport = require("passport");

//! load passport strategy
const LocalStrategy = require("passport-local");
//! require bcrypt
const bcrypt = require("bcrypt");

//! require User schema
const User = require("../models/user");

//! serialize user
passport.serializeUser((user, done) => {
  console.log("Serialization 開始。。。");
  console.log("執行done將user._id存入session");
  done(null, user._id);
});

//! deserialize user
passport.deserializeUser((_id, done) => {
  console.log("Desrialization 開始。。。");
  console.log("使用_id在資料庫找尋資料");
  User.findById({ _id })
    .then((user) => done(null, user))
    .catch((err) => console.log(err));
});

//! local strategy setting
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ email: username }).then((user) => {
      //- if found user
      if (user) {
        bcrypt.compare(password, user.password, (err, isMatched) => {
          if (isMatched) {
            console.log("本地會員資料比對成功");
            return done(null, user);
          }
          return done(null, false, { message: "Incorrect email or password" });
        });
      }
      return done(null, false, { message: "Incorrect email or password" });
    });
  })
);
