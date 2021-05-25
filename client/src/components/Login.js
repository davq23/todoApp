import axios from "axios";
import FormControl from '@material-ui/core/FormControl';
import TextField from "@material-ui/core/TextField";
import {useSelector, useDispatch, useEffect} from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Fragment, useState } from "react";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import '../main.css';

import {login} from "../slices/userslice";

const Login = () => {
    const [loginState, setLoginState] = useState({
        'username': '', 
        'password':'', 
        'errorLogin': false,
        'helperLogin': ''
    });

    const [disableInputs, setDisableInputs] = useState(false)

    const dispatch = useDispatch();

    const history = useHistory();

    const componentStyle = {
        width: '25rem',
    };

    /**
     * 
     * @param {Event} event 
     */
    const submitLogin = event => {
        event.preventDefault();

        const credentials = {
            username: loginState.username,
            password: loginState.password
        }

        setDisableInputs(true);

        axios.post('http://localhost/react-1/server/public/api/login', credentials, {
            withCredentials: true,
        })
            .then((response) => {
                setDisableInputs(false);

                dispatch(login({
                    userID: response.data.userID,
                    username: response.data.username,
                }));

                
            })
            .catch((error) => {
                setDisableInputs(false);

                if (error.response && error.response.status == 401) {
                    setLoginState(prevLoginState => ({
                        ...prevLoginState, 
                        'errorLogin': true,
                        'helperLogin': 'Invalid username or password',
                    }));
                } else {
                    setLoginState(prevLoginState => ({
                        ...prevLoginState, 
                        'errorLogin': true,
                        'helperLogin': 'Unknown error',
                    }));
                }
            });
    };

    /**
     * 
     * @param {Event} event 
     */
    const changeLoginState = event => {
        const {name, value} = event.target;

        setLoginState(prevLoginState => ({
            ...prevLoginState, 
            'errorLogin': false,
            'helperLogin': '',
            [name]: value,
        }));
    };

    return ( 
        <Fragment>
            <Box className="FormBox">
                <form onSubmit={submitLogin}>
                    <FormControl size="medium" fullWidth >
                        <Grid 
                        container
                        direction="column"
                        className="justify-xs-space-between"
                        justify="center"
                        alignItems="center"
                        spacing={3}>
                            <Typography variant="h4">
                                Log In
                            </Typography>
                            <Grid item>
                                <TextField required
                                    disabled={disableInputs} 
                                    error={loginState.errorLogin}
                                    name="username" 
                                    label="Username" 
                                    type="text" 
                                    helperText={loginState.helperLogin}
                                    onChange={changeLoginState} />
                            </Grid>
                            <Grid item>
                                <TextField disabled={disableInputs}  required name="password" label="Password" type="password" onChange={changeLoginState} />
                            </Grid>
                            <Grid item>
                                <Button disabled={disableInputs}  variant="contained" type="submit" color="primary">ACCEDER</Button>
                            </Grid>
                        </Grid>
                    </FormControl>
                </form>
            </Box>
        </Fragment>
        
    );
}
 
export default Login;