import express from "express";
import flash from "express-flash";
import morgan from "morgan";
import session from "express-session";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import storyRouter from "./routers/storyRouter";
import movieRouter from "./routers/movieRouter";
import textRouter from "./routers/textRouter";
import { localsMiddleware } from "./middlewares";
import MongoStore from "connect-mongo";
import apiRouter from "./routers/apiRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 604800000,
    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }), // a session is created when a browser visits our backend
  })
);

// app.use((req, res, next) => {
//   // console.log(req.headers.cookie);
//   // res.locals.loggedIn = true;
//   // res.locals.siteName = "Wetube"; // this is accessible inside PUG automatically just use #{siteName}
//   req.sessionStore.all((error, sessions) => {
//     console.dir(sessions);
//     next();
//   });
// });

// app.get("/addone", (req, res, next) => {
//   req.session.potato += 1;
//   return res.send(`${req.session.potato}`);
// });
app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});
app.use("/", globalRouter);
app.use("/texts", textRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/story", storyRouter);
app.use("/movies", movieRouter);
app.use("/api", apiRouter);

export default app;

// requests and responses.// GET requests.// all controllers can be middlewares// (req, res, next)

/*
    const protectedByMiddleWare = (req, res, next) => {
      const url = req.url;
  if (url === "/protected") {
    console.log("You have been stopped by this middleware😉");
    return res.send(
      "<h1>You have been stopped by this middleware for some reason😉</h1>"
    );
  }
  next();
};
const loggerParty = (req, res, next) => {
  // console.log(req.method);
  // console.log("i am in the middle, i'm totally a middleware");
  // console.log(req.secure);
  const date = Date.now();
  const when = new Date(date).toDateString();
  const hour = new Date(date).getHours();
  const minute = new Date(date).getMinutes().toString().padStart(2, 0);
  console.log(
    `Someone is trying to visit "${req.url}" on ${when} at ${hour}:${minute}${
      hour > 11 ? "pm" : "am"
    }. Which is ${req.secure ? "Secure" : "Insecure"}`
  );
  next();
};
const Protected = (req, res) => {
  return res.send(
    "<h1>This page is private, I guess the middleware failed 😥</h1>"
  );
};
*/
