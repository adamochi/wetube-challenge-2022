import Video from "../models/Video";
import User from "../models/User";

export const vidhome = async (req, res) => {
  let videos = [];
  try {
    videos = await Video.find({}).sort({ createdAt: "desc" });
    // console.log(videos);
    res.render("home", { pageTitle: "Home", videos });
  } catch {
    res.render("server-error");
  }
};

export const movieDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    res.render("moviedetail", { pageTitle: "Detail", video, id });
  } catch {
    res.render("server-error");
  }
};

export const filterMovie = (req, res) => {
  const { year, rating } = req.query;
  let movies = [];
  if (year) {
    movies = getMovieByMinimumYear(year);
  }
  if (rating) {
    movies = getMovieByMinimumRating(rating);
  }
  res.render("moviefilter", { pageTitle: "Search", movies });
};
export const addMovie = (req, res) => {
  res.render("addmovie", { pageTitle: "Upload or Start Recording!" });
};
export const movieEdit = (req, res) => {
  const { id } = req.params;
  let vid = getMovieById(id);
  res.render("movieedit", { pageTitle: `Editing: ${vid.title}`, vid });
};

export const postMovie = async (req, res) => {
  const { video, thumb } = req.files;
  const { _id } = req.session.user;

  const { title, description, hashtags } = req.body;
  try {
    const newVid = await Video.create({
      owner: _id,
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVid._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const vid = getMovieById(id);
  return res.redirect(`/movies/${id}`, { pageTitle: `${vid.title}`, id });
};
