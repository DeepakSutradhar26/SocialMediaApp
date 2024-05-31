import axios from "axios";

export const likePost = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "likeRequest",
        });

        const { data } = await axios.get(`/app/v1/post/${id}`);
        dispatch({
            type: "likeSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "likeFailure",
            payload: error.response.message,
        });
    }
}

export const addComment = (id,comment) => async (dispatch) => {
    try {
        dispatch({
            type: "addCommentRequest",
        });

        const { data } = await axios.put(`/app/v1/post/comment/${id}`, {
            comment,
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        });
        dispatch({
            type: "addCommentSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "addCommentFailure",
            payload: error.response.message,
        });
    }
}

export const deleteComment = (postId,commentId) => async (dispatch) => {
    try {
        dispatch({
            type: "deleteCommentRequest",
        });

        const { data } = await axios.delete(`/app/v1/post/comment/${postId}`,{
            data:{commentId}
        }
        );
        dispatch({
            type: "deleteCommentSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "deleteCommentFailure",
            payload: error.response.message,
        });
    }
}

export const createNewPost = (caption,image) => async (dispatch) => {
    try {
        dispatch({
            type: "newPostRequest",
        });

        const { data } = await axios.post(`/app/v1/post/upload`,{
            caption,image
        },{
            headers:{
                "Content-type":"application/json",
            }
        }
        );
        dispatch({
            type: "newPostSuccess",
            payload: data.posts,
        });
    } catch (error) {
        dispatch({
            type: "newPostFailure",
            payload: error.response.message,
        });
    }
}

export const updateCation = (caption,id) => async (dispatch) => {
    try {
        dispatch({
            type: "updateCaptionRequest",
        });

        const { data } = await axios.put(`/app/v1/post/${id}`,{
            caption
        },{
            headers:{
                "Content-type":"application/json",
            }
        }
        );
        dispatch({
            type: "updateCaptionSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "updateCaptionFailure",
            payload: error.response.message,
        });
    }
}

export const deleteMyPost = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "deletePostRequest",
        });

        const { data } = await axios.delete(`/app/v1/post/${id}`);
        dispatch({
            type: "deletePostSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "deletePostFailure",
            payload: error.response.message,
        });
    }
}