const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary");

exports.createPost = async (req, res) => {
  try {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.image,{
      folder:"posts",
    });

    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      },
      owner: req.user._id,
    }

    const newPost = await Post.create(newPostData);

    const user = await User.findById(req.user._id);

    user.posts.push(newPost._id);
    user.save();

    res.status(201).json({
      success: true,
      post: newPost
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.deletePost = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404)
        .json({
          success: false,
          message: "Post not found",
        });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401)
        .json({
          success: false,
          message: "Unauthorized",
        })
    }

    await cloudinary.v2.uploader.destroy(post.image.public_id);

    await post.deleteOne();

    const user = await User.findById(req.user._id);

    const index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);

    await user.save();

    res.status(200)
      .json({
        success: true,
        message: "Post Deleted",
      })

  } catch (err) {
    res.status(500)
      .json({
        success: false,
        message: err.message,
      })
  }
};

exports.likeAndUnlikePost = async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404)
        .json({
          success: false,
          message: "Post not found",
        });
    }

    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);
      await post.save();

      return res.status(200)
        .json({
          success: true,
          message: "Post Unliked",
        });
    }
    else {
      post.likes.push(req.user._id);
      await post.save();

      return res.status(200).
        json({
          success: true,
          message: "Post Liked",
        });
    }

  } catch (err) {
    res.status(500)
      .json({
        success: false,
        message: err.message,
      });
  }

};

exports.getPostOfFollowing = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    const posts = await Post.find({
      owner: {
        $in: user.followings,
      }
    }).populate("owner likes comments.user");

    res.status(200)
      .json({
        success: true,
        posts: posts.reverse(),
      });

  } catch (err) {
    res.status(500)
      .json({
        success: false,
        message: err.message,
      })
  }
};

exports.updateCaption = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404)
        .json({
          success: false,
          message: "Post not found",
        });
    }

    if (post.owner._id.toString() !== req.user._id.toString()) {
      res.status(404)
      json({
        success: false,
        messgae: "Unauthorized",
      });
    }

    post.caption = req.body.caption;
    await post.save();

    res.status(200)
      .json({
        success: true,
        message: "Caption Updated",
      });

  } catch (err) {
    res.status(500)
      .json({
        success: false,
        message: err.message,
      })
  }
};

exports.commentOnPost = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404)
        .json({
          success: false,
          message: "Post not found",
        });
    }

    var commentExist = -1;

    post.comments.forEach((item, index) => {
      if (item.user.toString() === req.user._id.toString()) {
        commentExist = index;
      }
    });

    if (commentExist !== -1) {
      post.comments[commentExist].comment = req.body.comment;

      await post.save();

      res.status(200)
        .json({
          success: true,
          message: "Comment Updated",
        });
    }
    else {
      post.comments.push({
        user: req.user._id,
        comment: req.body.comment,
      });

      await post.save();

      res.status(200)
        .json({
          success: true,
          message: "Comment Added",
        });
    }

  } catch (err) {
    res.status(500)
      .json({
        success: false,
        message: err.message,
      });
  }
};

exports.deleteComment = async (req, res) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404)
        .json({
          success: false,
          message: "Post not found",
        });
    }

    if (post.owner.toString() === req.user._id.toString()) {
      if (req.body.commentId == undefined) {
        return res.status(200)
          .json({
            success: true,
            message: "commentId is required",
          });
      }

      post.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200)
        .json({
          success: true,
          message: "Selected comment has deleted",
        });
    }
    else {
      post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200)
        .json({
          success: true,
          message: "Your comment has deleted",
        });
    }

  } catch (err) {
    res.status(500)
      .json({
        success: false,
        message: err.message,
      });
  }
};
