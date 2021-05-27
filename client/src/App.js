
import { BrowserRouter as Router, Link } from "react-router-dom";
import Routes  from "./routes/Routes";
import {useSelector, useDispatch, useEffect} from 'react-redux';
import { AppBar, Button, Container, Toolbar, Typography } from "@material-ui/core";
import axios from "axios";

import {logout, login, selectUser} from "./slices/userslice";
import { Fragment } from "react";

function App() {
  const currentUser = useSelector(selectUser);

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
    minHeight: '100%',
    width: '100%',
    height: '100%'
  }

  const navbarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
  }

  const navbarItems = {
    paddingLeft: '1rem'
  }

  const dispatch = useDispatch();

  const logoutHandler = (event) => {
    axios.post(process.env.REACT_APP_API_URL+'/api/logout', {}, {
        withCredentials: true
    }).then((response) => {
        dispatch(logout());
    }).catch((response) => {
        if (response.status == 401) {
        }
    });

    dispatch(login({
      userID: null,
    }))
  };

  return (
    <div className="App" style={{height: '100vh'}}>
        <div style={{height: '100%'}}>
        <Router >
          <AppBar position="sticky" >
            <Toolbar style={navbarStyle}>
              {
                !currentUser ? 
                <Fragment>
                  <Typography  style={navbarItems} variant="h6">
                    <Link to="/login">Login</Link>
                  </Typography>
                  <Typography  style={navbarItems} variant="h6">
                    <Link to="/signin">Signin</Link>
                  </Typography>
                </Fragment>
                :
                <Fragment>
                  <Typography style={navbarItems} variant="h6">
                    <Link to="/">Home</Link>
                  </Typography>
                  <Button style={navbarItems} onClick={logoutHandler} variant="contained" type="submit" color="secondary">Logout</Button>
                </Fragment>
              }
            </Toolbar>
          </AppBar>
          <Container style={containerStyle} className="noPaddingMargin">
            <Routes />
          </Container>
        </Router>
        </div>
    </div>
  );
}

export default App;
