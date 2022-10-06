import express from "express";
import {
  join,
  login,
  logout,
  postJoin,
  postLogin,
  handleGoogle,
} from "../controllers/userController";
import { trending, search } from "../controllers/videoController";
import { protectorMiddlleware, publickOnlyMiddleware } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/google99e4017f215aa2bc.html", handleGoogle);
globalRouter.route("/join").all(publickOnlyMiddleware).get(join).post(postJoin);
globalRouter
  .route("/login")
  .all(publickOnlyMiddleware)
  .get(login)
  .post(postLogin);
globalRouter.get("/logout", protectorMiddlleware, logout);
globalRouter.get("/search", search);

export default globalRouter;
