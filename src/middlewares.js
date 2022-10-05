import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});
const multerUploader = multerS3({
  s3: s3,
  bucket: "wetube-challenge-2022",
});

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
    req.flash("error", "Login first");
    return res.redirect("/login");
  }
};

export const publickOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Already logged in");
    return res.redirect("/");
  }
};

export const uploadFiles = multer({
  dest: "uploads/",
  limits: {
    fileSize: 500000000,
  },
  storage: multerUploader,
});
export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 20000000,
  },
  storage: multerUploader,
});
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 500000000,
  },
  storage: multerUploader,
});
