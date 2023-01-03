const router = require("express").Router();

//- homepage
router.get("/", (req, res) => {
  return res.render("home");
});

module.exports = router;