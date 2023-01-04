module.exports = {
  authCheck: (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash("warning_msg", "需先登入才能使用!");
    return res.redirect("/");
  },
};
