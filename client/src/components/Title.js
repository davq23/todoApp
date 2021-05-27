import { Typography } from '@material-ui/core';
import React, { useState, Fragment } from 'react';
import {useSelector, useDispatch, useEffect} from 'react-redux';
import { selectUsername } from '../slices/userslice';

const Title = () => {
  
    const username = useSelector(selectUsername);

    return (
        <Fragment>
            <Typography variant="h2">
                {`Welcome ${username}!`}
            </Typography>
            <Typography variant="h4">
                {`Here are your TODO's`}
            </Typography>
        </Fragment>
    )
};

export default Title;