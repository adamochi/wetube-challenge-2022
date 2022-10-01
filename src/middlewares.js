import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  if (res.locals.loggedIn) {
    res.locals.loggedInUser = req.session.user.username;
    res.locals.user = req.session.user;
  }
  // res.locals.loggedInUser = req.session.user;
  next();
};

export const protectorMiddlleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not Authorized");
    return res.redirect("/login");
  }
};

export const publickOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not Authorized");
    return res.redirect("/");
  }
};

export const uploadFiles = multer({
  dest: "uploads/",
  limits: {
    fileSize: 2000000000,
  },
});
export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 7000000,
  },
});
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 2000000000,
  },
});
