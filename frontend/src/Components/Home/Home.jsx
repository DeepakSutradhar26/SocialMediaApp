import React, { useEffect } from 'react';
import "./Home.css";
import User from '../User/User';
import Post from '../Post/Post';
import { useDispatch, useSelector } from "react-redux";
import { allUsers, getPostOfFollowing } from '../../Actions/User';
import Loader from '../Loader/Loader';
import { Typography } from "@mui/material";
import { useAlert } from 'react-alert';

const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, posts, error } = useSelector((state) => state.postOfFollowing);
  const { users, loading: usersLoading } = useSelector((state) => state.allUsers);
  const { error:likeError, message } = useSelector((state) => state.like);

  useEffect(() => {
    dispatch(getPostOfFollowing());
    dispatch(allUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert.error(error);
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

  return (loading === true || usersLoading === true ? <Loader /> :
    (<div className='home'>
      <div className="homeleft">
        {posts && posts.length > 0 ? posts.map((post) =>
        (<Post key={post._id}
          postId={post._id}
          caption={post.caption}
          postImage={post.image.url}
          likes={post.likes}
          comments={post.comments}
          ownerImage={post.owner.avatar.url}
          ownerName={post.owner.name}
          ownerId={post.owner._id}
        />)) :
          (<Typography varient="h6">
            No posts yet
          </Typography>)}
      </div>
      <div className="homeright">
        {users && users.length > 0 ?
          users.map((user) => (
            <User
              key={user._id}
              userId={user._id}
              name={user.name}
              avatar={user.avatar.url}
            />
          )) :
          (<Typography>
            No users yet
          </Typography>)
        }
      </div>

    </div>)
  )
}

export default Home;