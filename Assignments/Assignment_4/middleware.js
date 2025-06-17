function requireUser(req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }
  req.flash("error", "You must be logged in to access this page.");
  res.redirect("/login");
}
