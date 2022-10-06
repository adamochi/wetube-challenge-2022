import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const join = (req, res) => {
  res.render("join", { pageTitle: "Create Account" });
};
export const postJoin = async (req, res) => {
  const { username, email, password, password2, name } = req.body;
  const pageTitle = "Create an Account";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "passwords are not matching",
    });
  }
  const usernameExists = await User.exists({ username });
  if (usernameExists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Username already exists",
    });
  }
  const emailExists = await User.exists({ email });
  if (emailExists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This email already has an account",
    });
  }
  try {
    await User.create({
      username,
      email,
      password: await User.hashpassword(password),
      name,
    });

    return res.status(201).redirect(`/login`);
  } catch (error) {
    res.status(404).render("404", { pageTitle: error });
  }
};

export const login = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, socialOnly: false });
    if (!user) {
      return res.render("login", {
        errorMessage: "username was not recognised, please try again",
      });
    }
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.render("login", {
        pageTitle: "Login",
        errorMessage: "Password doesn't match this username",
      });
    }
    if (user && pass) {
      req.session.loggedIn = true;
      req.session.user = user;

      return res.redirect(`/users/${username}`);
    } else {
      req.flash("error", "Login error");
      return res.render("404", { pageTitle: "Something went wrong" });
    }
  } catch (error) {
    res.render("404", { pageTitle: error._message });
  }
};

export const seeUser = async (req, res) => {
  const { id } = req.params;
  const thisUser = await User.findOne({ username: id }).populate("videos");
  if (!thisUser) {
    res.status(404).render("404", { pageTitle: "user not found" });
  }
  const videoss = thisUser.videos;
  res.render("user", {
    pageTitle: `${thisUser.name}'s Profile`,
    thisUser,
    videoss,
  });
};

export const handleEditUser = async (req, res) => {
  res.render("editprofile", { pageTitle: "Edit My Profile" });
};
export const postEditUser = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const pageTitle = "Edit My Profile";
  const { username, name, email } = req.body;
  const { file } = req;
  // console.log(file);
  const { _id, avatarUrl } = req.session.user;
  if (username !== req.session.user.username) {
    const usernameExists = await User.exists({ username });
    if (usernameExists) {
      return res.status(400).render("editprofile", {
        pageTitle,
        errorMessage: "that username already exists",
      });
    }
  }
  if (email !== req.session.user.email) {
    const emailExists = await User.exists({ email });
    if (emailExists) {
      return res.status(400).render("editprofile", {
        pageTitle,
        errorMessage: "That email belongs to another account",
      });
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        avatarUrl: file ? file.location : avatarUrl,
        username,
        name,
        email,
      },
      { new: true } // this is needed!!!!!!!! otherwise updatedUser^^ will still be the old one...
    );
    req.session.user = updatedUser;
    return res.redirect(`/users/${username}`);
  } catch (err) {
    req.flash("error", err);
    return res.status(400).redirect("/");
  }
};

export const changePassword = (req, res) => {
  res.render("changepassword");
};
export const postChangePassword = async (req, res) => {
  const { oldpassword, newpassword, confirmpassword } = req.body;
  if (newpassword !== confirmpassword) {
    return res.status(400).render("changepassword", {
      errorMessage: "new password confirmation doesn't match",
    });
  }
  const { user } = req.session;
  const { _id } = req.session.user;
  if (!user.socialOnly) {
    const ok = await bcrypt.compare(oldpassword, user.password);
    if (!ok) {
      return res.status(400).render("changepassword", {
        errorMessage: "old password doesn't match",
      });
    }
  }
  const updatedSocialUser = await User.findById(_id);
  updatedSocialUser.password = await User.hashpassword(newpassword);
  updatedSocialUser.socialOnly = false;
  await updatedSocialUser.save();
  req.session.user = updatedSocialUser;
  return res.redirect(`/users/${req.session.user.username}`);
};

export const logout = async (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      req.flash("error", "Something went wrong");
      console.log(err);
      return res.status(400).redirect("/");
    } else {
      console.log("bye bye");
      console.log("bye bye");
      return res.redirect("/login");
    }
  });
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const potato = new URLSearchParams(config).toString();
  const letsGO = `${baseUrl}?${potato}`;
  return res.redirect(letsGO);
};

export const githubLogin = async (req, res) => {
  const baseURL = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const searchParams = new URLSearchParams(config).toString();
  const letsGooo = `${baseURL}?${searchParams}`;
  const tokenRequest = await (
    await fetch(letsGooo, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json(); // instead of using .then()
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiURL = "https://api.github.com";
    const userData = await (
      await fetch(`${apiURL}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiURL}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = await emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        name: userData.name,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    if (req.session.loggedIn === true) {
      return res.redirect(`/users/${user.username}`);
    } else {
      req.flash(err);
      return res.status(400).redirect("/login");
    }
  } else
    (err) => {
      req.flash(err);
      return res.redirect("/login");
    };
};
