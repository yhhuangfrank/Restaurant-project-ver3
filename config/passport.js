//! require passport
const passport = require("passport");

//! load passport strategy
const LocalStrategy = require("passport-local");
//! require bcrypt
const bcrypt = require("bcrypt");

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
      User.findOne({ email: username })
        .then((user) => {
          //- if found user
          if (user) {
            bcrypt.compare(password, user.password, (err, isMatched) => {
              if (err) throw err;
              return isMatched
                ? done(null, user)
                : done(null, false, { message: "Incorrect email or password" });
            });
          } else {
            return done(null, false, {
              message: "Incorrect email or password",
            });
          }
        })
        .catch((err) => console.log(err));
    })
  );
}



