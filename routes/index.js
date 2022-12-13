//! 總路由
const router = require("express").Router();
//- require subroutes

//- routers
const authRoutes = require("./modules/auth");
const restaurantRoutes = require("./modules/restaurants");
const searchRoutes = require("./modules/search");

//- setting routes
//! set server routes
router.use("/auth", authRoutes);
router.use("/restaurants", restaurantRoutes);
router.use("/search", searchRoutes);

//- homepage
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/restaurants");
  }
  return res.render("home");
});

//! route for not found (undefined route)
router.get("*", (req, res) => {
  res.render("error");
});

module.exports = router;
