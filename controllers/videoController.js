import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

// home displaying all videos
// async waits for video database finished(not succeeded) then rendering starts
export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

// search
export const search = async (req, res) => {
  const {
    query: { term: searchingBy }
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" }
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

// upload
export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  console.log(req.file);
  const {
    body: { title, description },
    file: { path }
  } = req;
  const newVideo = await Video.create({
    fileUrl: path,
    title,
    description,
    creator: req.user.id
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  console.log(newVideo);
  res.redirect(routes.videoDetail(newVideo.id));
};

// show the video's detail
export const videoDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate("comments");
    //console.log(video.creator);
    //console.log(video.comments[0]);
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

// edit video's info
export const getEditVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator !== req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

// delete video
export const deleteVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator !== req.user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
    }
  } catch (error) {}
  res.redirect(routes.home);
};

// register video view
export const postRegisterView = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user
  } = req;
  try {
    const video = await Video.findById(id);
    const myUser = await User.findById(user.id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id
    });
    video.comments.push(newComment.id);
    myUser.comments.push(newComment.id);
    video.save();
    myUser.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const getDeleteComment = async (req, res) => {
  const {
    params: { id, cid },
    user
  } = req;
  console.log(id, cid);
  try {
    const comment = await Comment.findById(cid);
    const video = await Video.findById(id);
    const myUser = await User.findById(user.id);
    if (String(comment.creator) !== String(user.id)) {
      throw Error();
    } else {
      await Comment.findOneAndRemove({ _id: comment.id });
      video.comments.remove(comment.id);
      myUser.comments.remove(comment.id);
      video.save();
      myUser.save();
    }
  } catch (error) {
    res.send(400);
  } finally {
    res.end();
  }
};
