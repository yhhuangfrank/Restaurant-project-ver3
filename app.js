//! require express
const express = require("express");
// - require express-handlebars
const exphbs = require("express-handlebars");
//- require bodyparser
const bodyParser = require("body-parser");
//- require session for flash and passport
const session = require("express-session");
//- require flash for short message
const flash = require("connect-flash");
//- require passport
const passport = require("passport");
//- require method-override
const methodOverride = require("method-override");
//- require router
const router = require("./routes/index");
const app = express();
const port = 3000;

//! connect to db
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //- 僅在非正式環境時使用dotenv
}
//- run mongoose setting
require("./config/mongoose");
//- run passport
require("./config/passport");

const hbs = exphbs.create({ 
  defaultLayout: "main", 
  //- create custom helper
  helpers: {
    isLastSelected: function(lastSortMethod, sortMethod) {
      if (sortMethod === lastSortMethod) return 'selected';
    }
  }
});

//! template engine setting
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

//! load static files
app.use(express.static("public"));
//! body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
//! method override
app.use(methodOverride("_method"));

//! session setting
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

//! passport initialize and passport session middlware
app.use(passport.initialize());
app.use(passport.session());

//! flash middlware
app.use(flash());
//* customize middleware to store flash message
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.fail_msg = req.flash("fail_msg");
  res.locals.error = req.flash("error");
  next();
});

//- routes
app.use(router);

//! listen to server
app.listen(port, () => {
  console.log(`Server is listening to http://localhost:${port}`);
});
