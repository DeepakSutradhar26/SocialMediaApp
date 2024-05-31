import {createReducer} from "@reduxjs/toolkit";
const initialState ={};

export const userReducer = createReducer(initialState,(builder) => {
    builder
    .addCase("loginRequest",(state)=>{
        state.loading = true;
    })
    .addCase("loginSuccess",(state,action)=>{
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    })
    .addCase("loginFailure",(state,action)=>{
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    })
    .addCase("registerRequest",(state)=>{
        state.loading = true;
    })
    .addCase("registerSuccess",(state,action)=>{
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    })
    .addCase("registerFailure",(state,action)=>{
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    })
    .addCase("logoutRequest",(state)=>{
        state.loading = true;
    })
    .addCase("logoutSuccess",(state)=>{
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
    })
    .addCase("logoutFailure",(state,action)=>{
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = true;
    })
    .addCase("userLoadRequest",(state)=>{
        state.loading = true;
    })
    .addCase("userLoadSuccess",(state,action)=>{
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
    })
    .addCase("userLoadFailure",(state,action)=>{
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
    });
});

export const postOfFollowingReducer = createReducer(initialState,(builder)=>{
    builder
    .addCase("postOfFollowingRequest",(state)=>{
        state.loading = true;
    })
    .addCase("postOfFollowingSuccess",(state,action)=>{
        state.loading = false;
        state.posts = action.payload;
    })
    .addCase("postOfFollowingFailure",(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("clearErrors",(state)=>{
        state.error = null;
    })
});

export const allUsersReducer = createReducer(initialState,(builder)=>{
    builder
    .addCase("allUsersRequest",(state)=>{
        state.loading = true;
    })
    .addCase("allUsersSuccess",(state,action)=>{
        state.loading = false;
        state.users = action.payload;
    })
    .addCase("allUsersFailure",(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("clearErrors",(state)=>{
        state.error = null;
    })
});

export const userProfileReducer = createReducer(initialState,(builder)=>{
    builder
    .addCase("userProfileRequest",(state)=>{
        state.loading = true;
    })
    .addCase("userProfileSuccess",(state,action)=>{
        state.loading = false;
        state.user = action.payload;
    })
    .addCase("userProfileFailure",(state,action)=>{
        state.loading = false;
        state.error = action.payload;
    })
    .addCase("clearErrors",(state)=>{
        state.error = null;
    })
});
