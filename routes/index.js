//! 總路由
const router = require("express").Router();
//- require authCheck
const { authCheck } = require("../middleware/authCheck");

//- routers
const authRoutes = require("./modules/auth");
const restaurantRoutes = require("./modules/restaurants");
const searchRoutes = require("./modules/search");
const homeRoute = require("./modules/home");

//- setting routes
//! set server routes
router.use("/auth", authRoutes);
router.use("/restaurants", authCheck, restaurantRoutes);
router.use("/search", authCheck, searchRoutes);
router.use("/home", homeRoute);

//! route for not found (undefined route)
router.get("*", (req, res) => {
  res.render("error");
});

module.exports = router;
