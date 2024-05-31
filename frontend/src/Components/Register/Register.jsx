import React, { useEffect, useState } from 'react';
import "./Register.css";
import { Avatar, Button, Typography } from '@mui/material';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { registerUser } from '../../Actions/User';

const Register = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, error } = useSelector((state) => state.user);

    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleImageHandler = (e) => {
        const file = e.target.files[0];

        const Reader = new FileReader();
        Reader.readAsDataURL(file);

        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setAvatar(Reader.result);
            }
        }
    }

    const registerHandler = (e) => {
        e.preventDefault();
        dispatch(registerUser(name, avatar, email, password));
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
        }
    }, [dispatch, error, alert]);

    return (
        <div className="register">
            <form className="registerForm" onSubmit={registerHandler}>
                <Typography varient="h4" style={{ padding: "2vmax" }} gutterBottom>
                    Social Aap
                </Typography>

                <Avatar
                    src={avatar}
                    alt="User"
                    sx={{ height: "10vmax", width: "10vmax" }}
                />

                <input type="file" accept="image/*" onChange={handleImageHandler} />

                <input type="text" value={name}
                    placeholder='Name'
                    className='registerInputs'
                    required
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder='Email'
                    className='registerInputs'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder='Password'
                    className='registerInputs'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Link to="/"><Typography>Already Signed Up? Login Now</Typography></Link>

                <Button disabled={loading} type="submit">Sign Up</Button>

            </form>
        </div>
    )
}

export default Register;