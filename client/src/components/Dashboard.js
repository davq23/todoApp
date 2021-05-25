import React, { useState, Fragment } from 'react';
import Title from './Title';
import UserList from './UserList';
import '../main.css';

const Dashboard = () => {
    const styles = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    };

    return (
        <Fragment >
            <div className='DashboardGrid'>
                <UserList limit="100"/>
                <Title />
            </div>
        </Fragment>
    )
};

export default Dashboard;