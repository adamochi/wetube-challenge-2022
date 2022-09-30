import Video from "../models/Video";

export const trending = async (req, res) => {
  try {
    const videos = await Video.find({})
      .populate("owner")
      .sort({ createdAt: "desc" });
    console.log(videos);
    return res
      .status(200)
      .render("home", { pageTitle: "Welcome to Wetube", videos });
  } catch (error) {
    return res.status(404).render("404", { error });
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner"); // instead of hitting the DB twice!!!!!!!
  // const vidOwner = await User.findById(video.owner);
  // console.log(video);
  res.render("watch", {
    pageTitle: `${video.title}`,
    video,
    id,
  });
};

export const editVideo = async (req, res) => {
  const videoId = req.params.id;
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
    res.redirect(`/videos/${id}`);
  } catch (error) {
    console.log(error);
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
    console.log("i guess i fucked up");
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
