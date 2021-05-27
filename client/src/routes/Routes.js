import { Route, Switch, Redirect } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux';
import {selectUser} from '../slices/userslice';
import Login from "../components/Login";
import Signin from "../components/Signin";
import { Fragment, useState, useEffect } from "react";
import axios from "axios";

import {login, logout} from "../slices/userslice";
import Dashboard from "../components/Dashboard";
import '../main.css';

function Routes() {
    const currentUser = useSelector(selectUser);

    const dispatch = useDispatch();

    const fetchAuth = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/auth`, {}, {
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
    };

    useEffect(() => {
        fetchAuth();
    }, []);
    
    return (
        <Fragment>
            {
                 currentUser === null  ?
                    <h1 className="fadeoutFast">Loading...</h1>
                :
                    <Switch>
                        <Route exact path={`${process.env.REACT_APP_ROUTE_PREFIX}/`}>
                            {  currentUser ?   <Dashboard /> : <Redirect to={`${process.env.REACT_APP_ROUTE_PREFIX}/login`} />}
                        </Route> 
                            <Route exact path={`${process.env.REACT_APP_ROUTE_PREFIX}/login`}>
                                {  currentUser ? <Redirect to={`${process.env.REACT_APP_ROUTE_PREFIX}/`} /> : <Login className="FormBox" />}
                            </Route>
                            <Route exact path={`${process.env.REACT_APP_ROUTE_PREFIX}/signin`}>
                                {  currentUser ? <Redirect to={`${process.env.REACT_APP_ROUTE_PREFIX}/`} /> : <Signin className="FormBox" />}
                            </Route>
                    </Switch>
            }
           
        </Fragment>
    )
}

export default Routes;