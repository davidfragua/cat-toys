const isLoggedIn = (req, res, next) => {
  if (req.session.activeUser === undefined) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.activeUser.role !== "admin") {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

const photoChecker =(req, res, next)=>{
  res.locals.photoChecker = req.body.photo
}

module.exports = {
  isLoggedIn,
  isAdmin,
  photoChecker,
};
