import React, { useEffect, useState } from 'react';
import "./UpdateProfile.css";
import { Avatar, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { loadUser, updateProfile } from '../../Actions/User';
import Loader from "../Loader/Loader";

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error, user } = useSelector((state) => state.user);
    const { loading: updateLoading,
        error: updateError, message
    } = useSelector((state) => state.like);

    const [name, setName] = useState(user.name);
    const [avatar, setAvatar] = useState(null);
    const [avatarPrev, setAvatarPrev] = useState(user.avatar.url);
    const [email, setEmail] = useState(user.email);

    const handleImageHandler = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setAvatar(Reader.result);
                setAvatarPrev(Reader.result);
            }
        }
    }

    const updateProfileHandler = async (e) => {
        e.preventDefault();
        await dispatch(updateProfile(name, avatar, email));
        dispatch(loadUser());
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
        }

        if (updateError) {
            alert.error(updateError);
            dispatch({ type: "clearErrors" });
        }

        if (message) {
            alert.success(message);
            dispatch({ type: "clearMessage" });
        }
    }, [dispatch, error, alert, updateError, message]);

    return (
        loading ? <Loader /> : (
            <div className="updateProfile">
                <form className="updateProfileForm" onSubmit={updateProfileHandler}>
                    <Typography varient="h4" style={{ padding: "2vmax" }} gutterBottom>
                        Social Aap
                    </Typography>

                    <Avatar
                        src={avatarPrev}
                        alt="User"
                        sx={{ height: "10vmax", width: "10vmax" }}
                    />

                    <input type="file" accept="image/*" onChange={handleImageHandler} />

                    <input type="text" value={name}
                        placeholder='Name'
                        className='updateProfileInputs'
                        required
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder='Email'
                        className='updateProfileInputs'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button disabled={updateLoading} type="submit">Update</Button>

                </form>
            </div>)

    )
}

export default UpdateProfile;