//! require passport
const passport = require("passport");

//! load passport strategy
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");
const GoogleStrategy = require("passport-google-oauth20");
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
    return done(null, user._id);
  });

  //! deserialize user
  passport.deserializeUser(async (_id, done) => {
    const foundUser = await User.findById({ _id }).lean();
    return done(null, foundUser);
  });

  //! local strategy setting
  passport.use(
    new LocalStrategy((username, password, done) => {
      return User.findOne({ email: username })
        .then((user) => {
          //- if cannot found user
          if (!user) {
            return done(null, false, { message: "此用戶尚未註冊過!" });
          } else {
            //- compare password
            return bcrypt.compare(password, user.password).then((isMatched) => {
              return isMatched
                ? done(null, user)
                : done(null, false, { message: "密碼錯誤" });
            });
          }
        })
        .catch((err) => console.log(err));
    })
  );

  //! FacebookStrategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["email", "displayName"],
      },
      (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json;
        //- check user if already register
        return User.findOne({ email })
          .then((user) => {
            if (user) return done(null, user);
            //- new user
            const randomPassword = Math.random().toString(36).slice(-8);
            return bcrypt
              .hash(randomPassword, 10)
              .then((hashedPassword) =>
                User.create({
                  name,
                  email,
                  password: hashedPassword,
                })
              )
              .then((user) => done(null, user));
          })
          .catch((err) => done(err, false));
      }
    )
  );

  //! GoogleStrategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
      },
      (accessToken, refreshToken, profile, done) => {
        const { given_name, email } = profile._json;
        //- check if already register
        return User.findOne({ email })
          .then((user) => {
            if (user) return done(null, user);
            //- new user
            const randomPassword = Math.random().toString(36).slice(-8);
            return bcrypt
              .hash(randomPassword, 10)
              .then((hashedPassword) =>
                User.create({
                  name: given_name,
                  email,
                  password: hashedPassword,
                })
              )
              .then((user) => done(null, user));
          })
          .catch((err) => done(err, false));
      }
    )
  );
};
