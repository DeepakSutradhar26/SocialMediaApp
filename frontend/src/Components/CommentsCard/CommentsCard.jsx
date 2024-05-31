import React from 'react';
import "./CommentsCard.css";
import { Link } from 'react-router-dom';
import { Button, Typography } from "@mui/material";
import { Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment } from '../../Actions/Post';
import { getMyPosts, getPostOfFollowing } from '../../Actions/User';

const CommentsCard = ({
    userId,
    name,
    avatar,
    comment,
    commentId,
    postId,
    isAccount
}) => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const deleteCommentHandler = () => {
        dispatch(deleteComment(postId, commentId));

        if (isAccount) {
            dispatch(getMyPosts());
        } else {
            dispatch(getPostOfFollowing());
        }
    }

    return (
        <div className="commentUser">
            <Link to={`/user/${userId}`}>
                <img src={avatar} alt={name} />
                <Typography style={{ minWidth: "6vmax" }}>{name}</Typography>
            </Link>
            <Typography>
                {comment}
            </Typography>

            {isAccount ? (<Button onClick={() => deleteCommentHandler()}>
                <Delete />
            </Button>) : userId === user._id ?
                (<Button onClick={() => deleteCommentHandler()}>
                    <Delete />
                </Button>) : null}
        </div>
    );
}

export default CommentsCard;