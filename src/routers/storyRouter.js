import express from "express";

const storyRouter = express.Router();

const handleStory = (req, res) => res.send(`<h1>Story id: ${req.path}</h1>`);
const handleStoryEdit = (req, res) =>
  res.send(`<h1>Edit Story ${req.params.id}</h1>`);
const handleStoryDelete = (req, res) =>
  res.send(`<h1>Delete Story ${req.params.id}</h1>`);

storyRouter.get("/:id", handleStory);
storyRouter.get("/:id/edit", handleStoryEdit);
storyRouter.get("/:id/delete", handleStoryDelete);

export default storyRouter;
