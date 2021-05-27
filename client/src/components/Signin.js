import axios from "axios";
import FormControl from '@material-ui/core/FormControl';
import TextField from "@material-ui/core/TextField";
import {useSelector, useDispatch, useEffect} from 'react-redux';
import { useState } from "react";
import MuiAlert from '@material-ui/lab/Alert';
import { Box, Button, Grid, Snackbar, Typography } from "@material-ui/core";
import { logout, login } from "../slices/userslice";

const Signin = () => {
    const [signinState, setSigninState] = useState({
        'username': '', 
        'password':'', 
        'errorUsername': false,
        'errorPassword': false,
        'helperUsername': '', 
        'helperPassword': ''});

    const [disableInputs, setDisableInputs] = useState(false)

    const dispatch = useDispatch();

    const [showMessage, setShowMessage] = useState(false);

    const componentStyle = {
        width: '25vw',
        minWidth: '120px'
    };

    /**
     * 
     * @param {Event} event 
     */
    const submitLogin = event => {
        event.preventDefault();

        const credentials = {
            username: signinState.username,
            password: signinState.password
        }

        setDisableInputs(true);

        axios.post(`${process.env.REACT_APP_API_URL}/api/users/new`, credentials, {
        })
            .then((result) => {
                setSigninState(prevSigninState => ({...prevSigninState, 'username': '', 'password':''}));

                setShowMessage(true);

                setDisableInputs(false);
            })
            .catch((error) => {
                setDisableInputs(false);
                
                if (error.response && error.response.status == 400) {
                    const messages = error.response.data.messages;

                    dispatch(logout());

                    const errorState = {};

                    for (const prop in messages) {
                        if (!messages[prop]) 
                            continue;

                        switch(prop) {
                            case 'username':
                                errorState['errorUsername'] = true;
                                errorState['helperUsername'] = messages[prop];
                                break;

                            case 'password':
                                errorState['errorPassword'] = true;
                                errorState['helperPassword'] = messages[prop];
                                break;
                        }
                    }

                    setSigninState(prevSigninState => ({...prevSigninState, ...errorState}));
                }
            });
    };

    /**
     * 
     * @param {Event} event 
     */
    const changeSigninState = event => {
        const {name, value} = event.target;

        setSigninState(prevSigninState => ({
            ...prevSigninState, 
            'errorUsername': false,
            'errorPassword': false,
            'helperUsername': '', 
            'helperPassword': '',
            [name]: value,
        }));
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setShowMessage(false);
      };

    return ( 
        <Box className="FormBox" >
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
                            Sign In
                        </Typography>
                        <Grid item>
                            <TextField required 
                                disabled={disableInputs}
                                error={signinState.errorUsername}
                                name="username" 
                                label="Username" 
                                type="text" 
                                helperText={signinState.helperUsername}
                                value={signinState.username || ''} 
                                onChange={changeSigninState} />
                        </Grid>
                        <Grid item>
                            <TextField required 
                                disabled={disableInputs}
                                error={signinState.errorPassword}
                                name="password" 
                                label="Password" 
                                type="password" 
                                helperText={signinState.helperPassword}
                                value={signinState.password || ''}
                                onChange={changeSigninState} />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" type="submit" color="primary">ACCEDER</Button>
                        </Grid>
                    </Grid>
                </FormControl>
            </form>
            <Snackbar open={showMessage} >
                <MuiAlert onClose={handleClose} severity="success">
                    {`Usuario ${signinState.username} created successfully`}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
}
 
export default Signin;