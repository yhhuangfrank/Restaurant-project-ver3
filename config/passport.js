//! require passport
const passport = require("passport");

//! load passport strategy
const LocalStrategy = require("passport-local");
//! require bcrypt
const bcrypt = require("bcryptjs");

//! require User schema
const User = require("../models/user");

//- exports passport function for app
module.exports = (app) => {
  //! passport initialize and passport session middlware
  app.use(passport.initialize());
  app.use(passport.session());

  //! serialize user
  passport.serializeUser((user, done) => {
    console.log("Serialization 開始。。。");
    console.log("執行done將user._id存入session");
    return done(null, user._id);
  });

  //! deserialize user
  passport.deserializeUser(async (_id, done) => {
    console.log("Desrialization 開始。。。");
    console.log("使用_id在資料庫找尋資料");
    const foundUser = await User.findById({ _id });
    return done(null, foundUser);
  });

  //! local strategy setting
  passport.use(
    new LocalStrategy((username, password, done) => {
      console.log("local login")
      return User.findOne({ email: username })
        .then((user) => {
          //- if cannot found user
          if (!user) {
            console.log("connot find")
            return done(null, false, { message: "此用戶尚未註冊過!" });
          } else {
            //- compare password
            return bcrypt.compare(password, user.password).then((isMatched) => {
              return isMatched
                ? done(null, user)
                : done(null, false, { message: "信箱或密碼錯誤" });
            });
          }
        })
        .catch((err) => console.log(err));
    })
  );
};
