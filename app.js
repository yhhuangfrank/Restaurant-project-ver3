//! require express
const express = require("express");
const app = express();
const port = 3000;
// - require express-handlebars
const exphbs = require("express-handlebars");
//! require mongoose
const mongoose = require("mongoose");
//- routers
const authRoutes = require("./routes/auth");
const restaurantRoutes = require("./routes/restaurants");
const searchRoutes = require("./routes/search");
//- require bodyparser
const bodyParser = require("body-parser");

//- require session for flash and passport
const session = require("express-session");
//- require flash for short message
const flash = require("connect-flash");
const passport = require("passport");

//! connect to db
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config(); //- 僅在非正式環境時使用dotenv
}

//- run passport
require("./config/passport");

mongoose.connect(process.env.MONGOOSE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => {
  console.log("MongoDB connect error!!!");
});
db.once("open", () => {
  console.log("MongoDB connected successfully!!!");
});

//! template engine setting
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//! load static files
app.use(express.static("public"));
//! body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

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

//! set server routes
app.use("/auth", authRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/search", searchRoutes);

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/restaurants");
  }
  return res.render("home");
});

//! route for not found (undefined route)
app.get("*", (req, res) => {
  res.render("error");
});

//! listen to server
app.listen(port, () => {
  console.log(`Server is listening to http://localhost:${port}`);
});
