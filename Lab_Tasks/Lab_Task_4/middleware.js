function requireUser(req, res, next) {
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }
  req.flash("error", "You must be logged in to access this page.");
  res.redirect("/login");
}
function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    req.user = req.session.user;
    return next();
  }
  req.flash("error", "You do not have permission to access this page.");
  res.redirect("/");
}
exports.requireUser = requireUser;
exports.requireAdmin = requireAdmin;
