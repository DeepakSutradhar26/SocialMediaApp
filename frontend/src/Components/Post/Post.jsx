import React, { useEffect, useState } from 'react';
import "./Post.css";
import { Link } from "react-router-dom";
import { Avatar, Button, Typography, Dialog } from "@mui/material";
import { Favorite, FavoriteBorder, ChatBubbleOutline, DeleteOutline, MoreVert } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { addComment, deleteMyPost, likePost, updateCation } from '../../Actions/Post';
import { getMyPosts, getPostOfFollowing, loadUser } from '../../Actions/User';
import User from '../User/User';
import CommentsCard from '../CommentsCard/CommentsCard';

const Post = ({
    postId,
    caption,
    postImage,
    likes = [],
    comments = [],
    ownerImage,
    ownerName,
    ownerId,
    isDelete = false,
    isAccount = false
}) => {
    const dispatch = useDispatch();

    const [liked, setLiked] = useState(false);
    const [likesUser, setLikesUser] = useState(false);
    const { user } = useSelector((state) => state.user);
    const [commentValue, setCommentValue] = useState("");
    const [commentToggle, setCommentToggle] = useState(false);
    const [captionValue, setcaptionValue] = useState(caption);
    const [captionToggle, setcaptionToggle] = useState(false);

    const {loading} = useSelector(state=>state.like);


    const handleLike = async () => {
        await dispatch(likePost(postId));
        if (isAccount) {
            dispatch(getMyPosts());
        } else {
            dispatch(getPostOfFollowing());
        }
    }

    const addCommentHandler = () => {
        dispatch(addComment(postId, commentValue));
        if (isAccount) {
            dispatch(getMyPosts());
        } else {
            dispatch(getPostOfFollowing());
        }
    }

    const updateCaptionHandler = (e) => {
        e.preventDefault();
        dispatch(updateCation(captionValue,postId));
        dispatch(getMyPosts());
    }

    const deletePostHandler = async() => {
        await dispatch(deleteMyPost(postId));
        dispatch(getMyPosts());
        dispatch(loadUser());
    }

    useEffect(() => {
        likes.forEach(item => {
            if (item._id === user._id) {
                setLiked(true);
            }
        });
    }, [likes, user._id]);

    return (
        <div className='post'>
            <div className="postHeader">
                {isAccount ?
                    <Button onClick={()=>setcaptionToggle(!captionToggle)}>
                        <MoreVert />
                    </Button> : null}
            </div>

            <img src={postImage} alt="Post" />

            <div className="postDetails">
                <Avatar src={ownerImage} alt="User" sx={{
                    height: "3vmax",
                    width: "3vmax",
                }} />

                <Link to={`/user/${ownerId}`}>
                    <Typography fontWeight={700}>{ownerName}</Typography>
                </Link>

                <Typography
                    fontWeight={100}
                    color="rgba(0,0,0,0.582)"
                    style={{ alignSelf: "center" }}
                >
                    {caption}
                </Typography>
            </div>
            <button style={{
                border: "none",
                backgroundColor: "white",
                cursor: "pointer",
                margin: "1vmax 2vmax"
            }}
                onClick={() => setLikesUser(!likesUser)}
                disabled={likes.length === 0 ? true : false}
            >
                <Typography>
                    {likes.length} likes
                </Typography>
            </button>

            <div className="postFooter">
                <Button onClick={() => handleLike()}>
                    {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
                </Button>

                <Button onClick={() => setCommentToggle(!commentToggle)}>
                    <ChatBubbleOutline />
                </Button>

                <Button disabled={loading} onClick={() => deletePostHandler()}>
                    <DeleteOutline />
                </Button>
            </div>

            <Dialog open={likesUser} onClose={() => setLikesUser(!likesUser)}>
                <div className="DialogBox">
                    <Typography variant='h4'>Liked by</Typography>
                    {likes.map(like => (
                        <User
                            key={like._id}
                            userId={like._id}
                            name={like.name}
                            avatar={like.avatar.url}
                        />
                    ))}
                </div>
            </Dialog>

            <Dialog open={commentToggle} onClose={() => setCommentToggle(!commentToggle)}>
                <div className="DialogBox">
                    <Typography variant='h4'>Comments</Typography>

                    <form className="commentForm" onSubmit={(e) => {
                        e.preventDefault();
                        addCommentHandler();
                    }}>
                        <input
                            type="text"
                            value={commentValue}
                            onChange={(e) => setCommentValue(e.target.value)}
                            placeholder='Comment Here...'
                            required
                        />

                        <Button type='submit' variant='contained'>
                            Add
                        </Button>
                    </form>

                    {comments.length > 0 ? comments.map((item) => (
                        <CommentsCard 
                           key={item._id}
                           userId={item.user._id}
                           avatar={item.user.avatar.url}
                           name={item.user.name}
                           comment={item.comment}
                           commentId={item._id}
                           postId={postId}
                           isAccount={isAccount}
                        />
                    )) :
                        <Typography>
                            No comments yet
                        </Typography>}
                </div>
            </Dialog>

            <Dialog open={captionToggle} onClose={() => setCommentToggle(!captionToggle)}>
                <div className="DialogBox">
                    <Typography variant='h4'>New Caption</Typography>

                    <form className="commentForm" onSubmit={(e) => {
                        e.preventDefault();
                        updateCaptionHandler();
                    }}>
                        <input
                            type="text"
                            value={captionValue}
                            onChange={(e) => setcaptionValue(e.target.value)}
                            placeholder='Caption ...'
                            required
                        />

                        <Button type='submit' variant='contained'>
                            Update
                        </Button>
                    </form>
                </div>
            </Dialog>
        </div>
    )
}

export default Post;