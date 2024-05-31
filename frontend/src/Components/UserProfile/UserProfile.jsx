import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { followAndUnfollowUser, getUserPosts, getUserProfile } from '../../Actions/User';
import Loader from "../Loader/Loader";
import { useAlert } from 'react-alert';
import { Avatar, Button, Dialog, Typography } from '@mui/material';
import Post from '../Post/Post';
import User from '../User/User';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const params = useParams();

    const { user, loading: userLoading, error: userError } = useSelector((state) => state.userProfile);
    const { loading, error, posts } = useSelector((state) => state.userPosts);
    const { error: followError, message, followLoading } = useSelector((state) => state.like);
    const { user: me } = useSelector((state) => state.user);

    const [followersToggle, setFollowersToggle] = useState(false);
    const [followingsToggle, setFollowingsToggle] = useState(false);
    const [postsToggle, setPostsToggle] = useState(false);
    const [following, setFollowing] = useState(false);
    const [myProfile, setMyProfile] = useState(false);

    const followHandler = async() => {
        setFollowing(!following);
        await dispatch(followAndUnfollowUser(user._id));
        dispatch(getUserProfile(params.id));
    }

    useEffect(() => {
        dispatch(getUserPosts(params.id));
        dispatch(getUserProfile(params.id));
    }, [dispatch, params.id]);

    useEffect(() => {
        if (me._id === params.id) {
            setMyProfile(true);
        }
        if (user) {
            user.followers.forEach(item => {
                if (item._id === me._id) {
                    setFollowing(true);
                } else {
                    setFollowing(false);
                }
            });
        }
    }, [user, me._id, params.id]);

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch({
                type: "clearErrors",
            });
        }
        if (userError) {
            alert.error(userError);
            dispatch({
                type: "clearErrors",
            });
        }
        if (followError) {
            alert.error(followError);
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
    }, [alert, error, userError, message, dispatch, posts]);

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
                        />
                    )) :
                        (<Typography variant='h6'>
                            User have not made any post
                        </Typography>)
                    }
                </div>
                <div className="accountright">

                    {user && (
                        <>
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

                            {myProfile ? null :
                                <Button varient="contained"
                                    disabled={followLoading}
                                    onClick={followHandler}
                                    style={{ background: following ? "red" : "blue", color: "black" }}
                                >
                                    {following ? "Unfollow" : "Follow"}
                                </Button>
                            }
                        </>
                    )}

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

export default UserProfile;