import express from "express";
import {
  movieDetail,
  filterMovie,
  addMovie,
  movieEdit,
  postMovie,
  postEdit,
  vidhome,
} from "../controllers/movieController";
import { protectorMiddlleware, videoUpload } from "../middlewares";

const movieRouter = express.Router();

movieRouter.get("/", vidhome);
movieRouter
  .route("/upload")
  .all(protectorMiddlleware)
  .get(addMovie)
  .post(videoUpload.fields([{ name: "video" }, { name: "thumb" }]), postMovie);
movieRouter.get("/filter", filterMovie);
movieRouter.get("/:id([0-9a-f]{24})", movieDetail);
movieRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddlleware)
  .get(movieEdit)
  .post(postEdit);

export default movieRouter;
