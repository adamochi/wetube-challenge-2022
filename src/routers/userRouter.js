import express from "express";
import {
  handleEditUser,
  seeUser,
  logout,
  startGithubLogin,
  githubLogin,
  postEditUser,
  changePassword,
  postChangePassword,
} from "../controllers/userController";
import {
  avatarUpload,
  protectorMiddlleware,
  publickOnlyMiddleware,
} from "../middlewares";
const userRouter = express.Router();

userRouter.get("/logout", protectorMiddlleware, logout);
userRouter.get("/github/start", publickOnlyMiddleware, startGithubLogin);
userRouter.get("/github/callback", publickOnlyMiddleware, githubLogin);
userRouter.get("/:id", seeUser);
userRouter
  .route("/:id/edit-profile")
  .all(protectorMiddlleware)
  .get(handleEditUser)
  .post(avatarUpload.single("avatar"), postEditUser);
userRouter
  .route("/:id/change-password")
  .all(protectorMiddlleware)
  .get(changePassword)
  .post(postChangePassword);

export default userRouter;
