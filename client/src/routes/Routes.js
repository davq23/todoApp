import { Route, Switch, Redirect } from "react-router-dom";
import {useSelector, useDispatch, useEffect} from 'react-redux';
import {selectUser} from '../slices/userslice';
import { useCookies } from 'react-cookie';
import Login from "../components/Login";
import Signin from "../components/Signin";
import { Fragment, useState } from "react";
import axios from "axios";

import {login, logout} from "../slices/userslice";
import Dashboard from "../components/Dashboard";
import '../main.css';


function Routes() {
    const currentUser = useSelector(selectUser);

    const dispatch = useDispatch();
    
    if (currentUser == null) {
        axios.post('http://localhost/react-1/server/public/api/auth', {}, {
            withCredentials: true,
        }).then((response) => {
            if (!currentUser) {
                dispatch(login({
                    userID: response.data.userID,
                    username: response.data.username,
                }));
            } 
        }).catch((response) => {
            dispatch(logout());
        });
    }
    
    return (
        <Fragment>
            {
                 currentUser === null  ?
                    <h1 className="fadeoutFast">Loading...</h1>
                :
                    <Switch>
                        <Route exact path="/">
                            {  currentUser ?   <Dashboard /> : <Redirect to="/login" />}
                        </Route> 
                            <Route exact path="/login">
                                {  currentUser ? <Redirect to="/" /> : <Login className="FormBox" />}
                            </Route>
                            <Route exact path="/signin">
                                {  currentUser ? <Redirect to="/" /> : <Signin className="FormBox" />}
                            </Route>
                    </Switch>
            }
           
        </Fragment>
    )
}

export default Routes;