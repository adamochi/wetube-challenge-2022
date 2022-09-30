import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, trim: true, minLength: 1, maxLength: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, trim: true, minLength: 4, maxLength: 300 },
  createdAt: { type: Date, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" }, // need to tell mongoose this ObjectId is of the model "user"
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => word.trim())
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const Video = mongoose.model("video", videoSchema); // this "movie" is the movies collection on MongoDB
export default Video;
