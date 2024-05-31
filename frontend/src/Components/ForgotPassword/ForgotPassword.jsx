import React, { useEffect, useState } from 'react';
import "./ForgotPassword.css";
import { Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from '../../Actions/User';
import { useAlert } from 'react-alert';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const alert = useAlert();

    const { error, loading, message } = useSelector((state) => state.like);

    const [email, setEmail] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
        }

        if (message) {
            alert.success(message);
            dispatch({ type: "clearMessage" });
        }

    }, [dispatch, error, alert]);

    return (
        <div className="forgotPassword">
            <form className="forgotPasswordForm" onSubmit={submitHandler}>
                <Typography varient="h4" style={{ padding: "2vmax" }} gutterBottom>
                    Social Aap
                </Typography>

                <input
                    type="email"
                    placeholder='Email'
                    className='forgotPasswordInputs'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Button disabled={loading} type="submit">Send Token</Button>
            </form>
        </div>
    )
}

export default ForgotPassword;