import { configureStore } from "@reduxjs/toolkit";
import {
    allUsersReducer,
    postOfFollowingReducer,
    userProfileReducer,
    userReducer
} from "./Reducers/User";
import {
    likeReducer,
    myPostReducer,
    userPostReducer
} from "./Reducers/Post";

const store = configureStore({
    reducer: {
        user: userReducer,
        postOfFollowing: postOfFollowingReducer,
        allUsers: allUsersReducer,
        like: likeReducer,
        myPosts: myPostReducer,
        userProfile: userProfileReducer,
        userPosts: userPostReducer
    },
});

export default store;