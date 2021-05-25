import React, { useState, Fragment } from 'react';
import Title from './Title';
import UserList from './UserList';
import TaskList from './TaskList';
import '../main.css';

const Dashboard = () => {
    return (
        <Fragment >
            <div className='DashboardGrid'>
                <UserList limit="100"/>
                <div>
                    <Title />
                    <TaskList limit="100" />
                </div>
            </div>
        </Fragment>
    )
};

export default Dashboard;