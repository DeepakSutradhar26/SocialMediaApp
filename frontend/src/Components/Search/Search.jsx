import React, { useEffect, useState } from 'react';
import "./Search.css";
import { Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { allUsers } from '../../Actions/User';
import User from "../User/User";

const Search = () => {
    //packages
    const dispatch = useDispatch();

    //variables
    const [name, setName] = useState("");

    //accessing store
    const { loading, users } = useSelector((state) => state.allUsers);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(allUsers(name));
    }

    return (
        <div className="search">
            <form className="searchForm" onSubmit={submitHandler}>
                <Typography varient="h4"
                    style={{ padding: "2vmax" }}
                    gutterBottom
                >
                    Social Aap
                </Typography>

                <input type="text"
                    value={name}
                    placeholder='Name'
                    required
                    onChange={(e) => setName(e.target.value)}
                />

                <Button type="submit" disabled={loading}>
                    Search
                </Button>

                <div className="searchResults">
                    {users &&
                        users.map((user) => (
                            <User
                                key={user._id}
                                userId={user._id}
                                name={user.name}
                                avatar={user.avatar.url}
                            />
                        ))}
                </div>
            </form>
        </div>
    )
}

export default Search;