module.exports = {
  authCheck: (req, res, next) => {
    console.log("auth checcking")
    if (req.isAuthenticated()) return next();
    return res.redirect("/home");
  },
};
