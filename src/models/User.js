import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  socialOnly: { type: Boolean, default: false },
  password: { type: String },
  name: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "comment" },
  ],
  videos: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "video" },
  ],
});

// userSchema.pre("save", async function () {
//  if (this.isModified("password")) {
//   this.password = await bcrypt.hash(this.password, 5);
// }
// }); // in this context: inside this function the word "this" refers to the user that is being created.
userSchema.static("hashpassword", async function (password) {
  const hashed = await bcrypt.hash(password, 5);
  return hashed;
});

const User = mongoose.model("user", userSchema);
export default User;
