import express from "express";
import { addMovie, postMovie } from "../controllers/movieController";
import {
  watch,
  editVideo,
  removeVideo,
  postEditVideo,
} from "../controllers/videoController";
import { protectorMiddlleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/upload")
  .all(protectorMiddlleware)
  .get(addMovie)
  .post(
    videoUpload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumb", maxCount: 1 },
    ]),
    postMovie
  );
videoRouter.route("/:id([0-9a-f]{24})/edit").get(editVideo).post(postEditVideo);
videoRouter.get("/:id([0-9a-f]{24})/delete", removeVideo);

export default videoRouter;
/*
(\\d+) -> need two \\ because this is javascript

*/
