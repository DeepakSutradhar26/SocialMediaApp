import React, { useEffect, useState } from 'react';
import "./Account.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteMyProfile, getMyPosts, logoutUser } from '../../Actions/User';
import Loader from "../Loader/Loader";
import { useAlert } from 'react-alert';
import { Avatar, Button, Dialog, Typography } from '@mui/material';
import Post from '../Post/Post';
import { Link } from 'react-router-dom';
import User from '../User/User';

const Account = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { user, loading: userLoading, error: loginError } = useSelector((state) => state.user);
  const { loading, error, posts } = useSelector((state) => state.myPosts);
  const { error: likeError, message, loading: deleteLoading } = useSelector((state) => state.like);

  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingsToggle, setFollowingsToggle] = useState(false);
  const [postsToggle, setPostsToggle] = useState(false);

  const logoutHandler = () => {
    dispatch(logoutUser());
    alert.success("Logged out successfully");
  }

  const deleteProfileHandler = async() => {
    await dispatch(deleteMyProfile());
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(getMyPosts());
  }, [dispatch, message]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({
        type: "clearErrors",
      });
    }
    if (loginError) {
      alert.error(loginError);
      dispatch({
        type: "clearErrors",
      });
    }
    if (likeError) {
      alert.error(likeError);
      dispatch({
        type: "clearErrors",
      });
    }
    if (message) {
      alert.success(message);
      dispatch({
        type: "clearMessage",
      });
    }
  }, [alert, error, likeError, message, dispatch, posts]);

  return (
    loading === true || userLoading === true ? <Loader /> :
      (<div className="account">
        <div className="accountleft">
          {posts && posts.length > 0 ? posts.map(post => (
            <Post key={post._id}
              postId={post._id}
              caption={post.caption}
              postImage={post.image.url}
              likes={post.likes}
              comments={post.comments}
              ownerImage={post.owner.avatar.url}
              ownerName={post.owner.name}
              ownerId={post.owner._id}
              isAccount={true}
              isDelete={true}
            />
          )) :
            (<Typography variant='h6'>
              You have not made any post
            </Typography>)
          }
        </div>
        <div className="accountright">
          <Avatar
            src={user.avatar.url}
            style={{ height: "8vmax", width: "8vmax" }}
          />

          <Typography variant='h5'>{user.name}</Typography>

          <div>
            <button onClick={() => setFollowersToggle(!followersToggle)}>
              <Typography>followers</Typography>
            </button>
            <Typography>{user.followers.length}</Typography>
          </div>

          <div>
            <button onClick={() => setFollowingsToggle(!followingsToggle)}>
              <Typography>followings</Typography>
            </button>
            <Typography>{user.followings.length}</Typography>
          </div>

          <div>
            <button onClick={() => setPostsToggle(!postsToggle)}>
              <Typography>Posts</Typography>
            </button>
            <Typography>{user.posts.length}</Typography>
          </div>

          <Button varient="contained" onClick={() => logoutHandler()}>
            Logout
          </Button>

          <Link to="/update/profile">Edit Profile</Link>
          <Link to="/update/password">Change Password</Link>

          <Button
            disabled={deleteLoading}
            onClick={deleteProfileHandler}
            variant='text'
            style={{ color: "red", margin: "2vmax" }}>
            DELETE MY ACCOUNT
          </Button>

          <Dialog open={followersToggle} onClose={() => setFollowersToggle(!followersToggle)}>
            <div className="DialogBox">
              <Typography variant='h4'>Followers</Typography>
              {user && user.followers.length > 0 ? (user.followers.map(user => (
                <User
                  key={user._id}
                  userId={user._id}
                  name={user.name}
                  avatar={user.avatar.url}
                />
              ))) :
                (<Typography style={{ margin: "2vmax" }}>
                  You have no followers
                </Typography>)}
            </div>
          </Dialog>


          <Dialog open={followingsToggle} onClose={() => setFollowingsToggle(!followingsToggle)}>
            <div className="DialogBox">
              <Typography variant='h4'>Followings</Typography>
              {user && user.followings.length > 0 ? (user.followings.map(user => (
                <User
                  key={user._id}
                  userId={user._id}
                  name={user.name}
                  avatar={user.avatar.url}
                />
              ))) :
                (<Typography style={{ margin: "2vmax" }}>
                  You have not followed anyone yet
                </Typography>)}
            </div>
          </Dialog>
        </div>
      </div>)
  )
}

export default Account;