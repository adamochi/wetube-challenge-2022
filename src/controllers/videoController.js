import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

export const trending = async (req, res) => {
  try {
    const videos = await Video.find({})
      .populate("owner")
      .sort({ createdAt: "desc" });
    // console.log(videos);
    return res
      .status(200)
      .render("home", { pageTitle: "Welcome to Wetube", videos });
  } catch (error) {
    return res.status(404).render("404", { error });
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("owner")
    .populate({
      path: "comments",
      populate: {
        path: "owner",
      },
    }); // .populate() instead of hitting the DB twice!!!!!!!
  // console.log("DEEP POPULATION!!!", video.comments);
  res.render("watch", {
    pageTitle: `${video.title}`,
    video,
    id,
  });
};

export const editVideo = async (req, res) => {
  const videoId = req.params.id;
  if (!req.session.user) {
    req.flash("error", "Login first");
    return res.redirect("/login");
  }
  const { _id } = req.session.user;
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  // console.log("vid owner", video.owner.toString(), "_id", _id);
  if (video.owner.toString() !== String(_id)) {
    return res.status(403).redirect("/");
  }
  res.render("edit", { pageTitle: "Edit", video });
};
export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    req.flash("info", "Changes saved.");
    res.redirect(`/videos/${id}`);
  } catch (error) {
    req.flash("error", error);
    return res.render("404", { pageTitle: error });
  }
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const removeVideo = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", {
      pageTitle: "video not found",
    });
  }
  if (video.owner.toString() !== String(_id)) {
    return res.status(403).redirect("/");
  }
  try {
    await Video.findByIdAndDelete(id);
  } catch {
    console.log("i guess i messed up");
  }
  return res.redirect("/");
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200); // We are not setting a status then rendering. so use sendStatus
};
export const createComment = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;
  const { user } = req.session;
  const video = await Video.findById(id);
  if (!video) return res.sendStatus(404);
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  await video.save();
  return res.status(201).json({ newCommentId: comment._id });
};
export const handleRemoveComment = async (req, res) => {
  const { id } = req.body;
  const sessionUserId = req.session.user._id;
  const thisComment = await Comment.findById(id)
    .populate("owner")
    .populate("video");
  const commentOwner = await User.findById(thisComment.owner._id);
  const commentOwnerId = commentOwner._id.valueOf();
  if (sessionUserId === commentOwnerId) {
    await Comment.findByIdAndDelete(id);
    // TRY TO ALSO REMOVE THE OBJECTID FROM THE VIDEO>>>>>
    console.log(thisComment.video.comments, "COMMENTS<<", id, "ID<<");
    // await Video.findByIdAndUpdate(thisComment.video, {
    //   ...(thisComment.video.comments !== id),
    // });
    return res.sendStatus(200);
  } else {
    return res.sendStatus(400);
  }
};
