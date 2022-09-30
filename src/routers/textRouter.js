import express from "express";
import {
  getRead,
  getTexts,
  postTexts,
  DeleteText,
} from "../controllers/textController";
import multer from "multer";

const uploadText = multer({
  dest: "upload/texts",
  limits: {
    fileSize: 1000000,
  },
});
const textRouter = express.Router();

textRouter.route("/").get(getTexts).post(uploadText.single("text"), postTexts);
textRouter.get("/:id", getRead);
textRouter.get("/:id/delete", DeleteText);
export default textRouter;
