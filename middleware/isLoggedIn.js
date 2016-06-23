module.exports = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.flash("Error", "Please login");
    res.redirect("/auth/login");
  }
}
