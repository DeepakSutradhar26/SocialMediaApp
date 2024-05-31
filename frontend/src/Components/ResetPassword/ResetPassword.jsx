import React, { useEffect, useState } from 'react';
import "./ResetPassword.css";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { Link, useParams } from "react-router-dom";
import { Button, Typography } from '@mui/material';
import { resetPassword } from '../../Actions/User';

const ResetPassword = () => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const params = useParams();

    const { error, loading, message } = useSelector((state) => state.like);

    const [newPassword, setNewPassword] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(resetPassword(params.token, newPassword));
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
        <div className="resetPassword">
            <form className="resetPasswordForm" onSubmit={submitHandler}>
                <Typography varient="h4" style={{ padding: "2vmax" }} gutterBottom>
                    Social Aap
                </Typography>

                <input
                    type="password"
                    placeholder='New Password'
                    required
                    className='resetPasswordInputs'
                    caption={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <Link to="/">
                    <Typography>
                        Login!
                    </Typography>
                </Link>

                <Typography>Or</Typography>

                <Link to="/forgot/password">
                    <Typography>
                        Request Another Token!
                    </Typography>
                </Link>

                <Button disabled={loading} type="submit">
                    Reset Password
                </Button>

            </form>
        </div>
    )
}

export default ResetPassword;