const User = require("../models/User");
const Post = require("../models/Post");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const { sendEmail } = require("../middlewares/sendEmail");

exports.register = async (req, res) => {
    try {
        const { name, avatar, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res
                .status(400)
                .json({ success: false, message: "User already exits" });
        }

        const myCloud = await cloudinary.v2.uploader.upload(avatar, { folder: "avatars" });

        user = await User.create({ name, email, password, avatar: { public_id: myCloud.public_id, url: myCloud.secure_url } });

        const token = await user.generateToken();

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }

        res.status(201).cookie("token", token, options)
            .json({
                success: true,
                user,
                token,
            });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email }).select("+password").populate("posts followers followings");

        if (!user) {
            return res.status(400)
                .json({
                    success: false,
                    message: "User does not exist"
                });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400)
                .json({
                    success: false,
                    message: "Incorrect Password"
                });
        }

        const token = await user.generateToken();

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.status(201).cookie("token", token, options)
            .json({
                success: true,
                user,
                token,
            });
    } catch (err) {
        res.status(500)
            .json({
                success: false,
                message: err.message
            });
    }
};

exports.logout = async (req, res) => {
    try {

        res
            .status(200)
            .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true, })
            .json({
                success: true,
                message: "Logged Out",
            });

    } catch (err) {
        res.status(500)
            .json({
                success: false,
                message: err.message,
            });
    }
};

exports.followUser = async (req, res) => {
    try {

        const userToFollow = await User.findById(req.params.id);
        const userLoggedIn = await User.findById(req.user._id);

        if (!userToFollow) {
            return res.status(404)
                .json({
                    success: false,
                    message: "User not found",
                });
        }

        if (userLoggedIn._id === userToFollow._id) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Unable to Follow",
                });
        }

        if (userLoggedIn.followings.includes(userToFollow._id)) {

            const indexFollowing = userLoggedIn.followings.indexOf(userToFollow._id);
            userLoggedIn.followings.splice(indexFollowing, 1);

            const indexFollower = userToFollow.followers.indexOf(userLoggedIn._id);
            userToFollow.followers.splice(indexFollower, 1);

            await userLoggedIn.save();
            await userToFollow.save();

            res.status(200)
                .json({
                    success: true,
                    message: "User Unfollowed"
                });
        }

        else {

            userLoggedIn.followings.push(userToFollow._id);
            userToFollow.followers.push(userLoggedIn._id);

            await userLoggedIn.save();
            await userToFollow.save();

            res.status(200)
                .json({
                    success: true,
                    message: "User Followed",
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

exports.updatePassword = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select("+password");

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            res.status(404)
                .json({
                    success: false,
                    message: "Please enter both password",
                });
        }

        const isMatch = await user.matchPassword(oldPassword);

        if (!isMatch) {
            res.status(404)
                .json({
                    success: false,
                    message: "Incorrect Password",
                });
        };

        user.password = newPassword;
        await user.save();

        res.status(200)
            .json({
                success: true,
                message: "Password Updated"
            });

    } catch (err) {
        res.status(500)
            .json({
                success: false,
                message: err.message,
            })
    }
};

exports.updateProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        const { name, avatar, email } = req.body;

        if (email) {
            user.email = email;
        }

        if (name) {
            user.name = name;
        }

        if (avatar) {
            if (user.avatar.public_id) {
                await cloudinary.v2.uploader.destroy(user.avatar.public_id);
            }

            const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                folder: "avatars"
            });
            user.avatar.public_id = myCloud.public_id;
            user.avatar.url = myCloud.secure_url;
        }

        await user.save();

        res.status(200)
            .json({
                success: true,
                message: "Profile Updated"
            });

    } catch (err) {
        res.status(500)
            .json({
                success: false,
                message: err.message,
            });
    }
};

exports.deleteMyProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);
        const posts = user.posts;
        const followersArray = user.followers;
        const followingsArray = user.followings;
        const id = user._id;

        //deleting photo from cloudinary
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        await user.deleteOne();

        //logout user
        res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true, })


        if (!user) {
            res.status(404)
                .json({
                    success: false,
                    message: "User not found",
                });
        }

        for (let i = 0; i < posts.length; i++) {
            const post = await Post.findById(posts[i]._id);
            await cloudinary.v2.uploader.destroy(post.image.public_id);
            await post.deleteOne();
        }

        //removing users from followers followings
        for (let i = 0; i < followersArray.length; i++) {
            const user2 = await User.findById(followersArray[i]);
            const index = user2.followings.indexOf(id);
            user2.followings.splice(index, 1);
            await user2.save();
        }

        //removing users from followings followers
        for (let i = 0; i < followingsArray.length; i++) {
            const user2 = await User.findById(followingsArray[i]);
            const index = user2.followers.indexOf(id);
            user2.followers.splice(index, 1);
            await user2.save();
        }

        //removing all comments of user
        const allPosts = await Post.find();

        for (let i = 0; i < allPosts.length; i++) {
            const post = await Post.findById(allPosts[i]._id);

            for (let j = 0; j < allPosts.comments.length; j++) {
                if (allPosts.comments[j].user === id) {
                    post.comments.splice(j, 1);
                }
            }
            await post.save();
        }

        //removing likes of user from all posts
        for (let i = 0; i < allPosts.length; i++) {
            const post = await Post.findById(allPosts[i]._id);

            for (let j = 0; j < allPosts.likes.length; j++) {
                if (allPosts.likes[j].user === id) {
                    post.likes.splice(j, 1);
                }
            }
            await post.save();
        }

        res.status(200)
            .json({
                success: true,
                message: "User Deleted"
            });

    } catch (err) {
        res.status(500)
            .json({
                success: false,
                message: err.message,
            });
    }
};

exports.myProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).populate("posts followers followings");

        res.status(201)
            .json({
                success: true,
                user,
            });

    } catch (err) {
        res.status(500)
            .json({
                success: false,
                message: err.message,
            });
    }
};

exports.getUserProfile = async (req, res) => {
    try {

        const user = await User.findById(req.params.id).populate("posts followers followings");

        if (!user) {
            res.status(404)
                .json({
                    success: true,
                    message: "User not found",
                });
        }

        res.status(200)
            .json({
                success: true,
                user,
            });

    } catch (err) {
        res.status(500)
            .json({
                success: true,
                message: err.message,
            })
    }
};

exports.getAllUsers = async (req, res) => {
    try {

        const users = await User.find({
            name: { $regex: req.query.name, $options: 'i' }
        });

        res.status(200)
            .json({
                success: true,
                users,
            });

    } catch (err) {
        res.status(500)
            .json({
                success: false,
                message: err.message,
            })
    }
};

exports.getMyPosts = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        const posts = [];

        for (var i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate("likes owner comments.user");
            posts.push(post);
        }

        res.status(200)
            .json({
                success: true,
                posts,
            });

    } catch (err) {
        res.status(500)
            .json({
                success: true,
                message: err.message,
            })
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404)
                .json({
                    success: false,
                    message: "User not found",
                });
        }

        const resetPasswordToken = user.getResetPasswordToken();

        await user.save();

        const resetURL = `${req.protocol}://${req.get("host")}/password/reset/${resetPasswordToken}`;

        const message = `To rest your password click the link below:\n\n${resetURL}`;

        try {

            await sendEmail({
                email: user.email,
                subject: "Reset password",
                message,
            });

            res.status(200)
                .json({
                    success: true,
                    message: `Email sent to ${user.email}`,
                });

        } catch (error) {

            res.status(500)
                .json({
                    success: false,
                    message: error.message,
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

exports.resetPassword = async (req, res) => {
    try {

        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(401)
                .json({
                    success: false,
                    message: "Token has expired"
                });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.save();

        res.status(200)
            .json({
                success: true,
                message: "Password has been updated",
            });

    } catch (err) {
        res.status(500)
            .json({
                success: false,
                message: err.message,
            });
    }
};

exports.getUserPosts = async (req, res) => {
    try {

        const user = await User.findById(req.params.id).populate("posts followings followers");

        const posts = [];

        for (var i = 0; i < user.posts.length; i++) {
            const post = await Post.findById(user.posts[i]).populate("likes owner comments.user");
            posts.push(post);
        }

        res.status(200)
            .json({
                success: true,
                posts,
            });

    } catch (err) {
        res.status(500)
            .json({
                success: true,
                message: err.message,
            })
    }
};