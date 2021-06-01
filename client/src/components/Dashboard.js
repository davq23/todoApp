import React, { useState, Fragment } from 'react';
import Title from './Title';
import UserList from './UserList';
import TaskList from './TaskList';
import '../main.css';
import LatestTaskList from './LatestTaskList';

const Dashboard = () => {
    const [joinTask, setJoinTask] = useState(null);
    const [leftTask, setLeftTask] = useState(null);

    return (
        <Fragment >
            <div className='DashboardGrid'>
                <UserList limit="100"/>
                <div>
                    <Title />
                    <TaskList limit="100" joinTask={joinTask} setJoinTask={setJoinTask} setLeftTask={setLeftTask}/>
                    <h1>Latest TODOs</h1>
                    <LatestTaskList limit="100" setJoinTask={setJoinTask} leftTask={leftTask} setLeftTask={setLeftTask} />
                </div>
            </div>
        </Fragment>
    )
};

export default Dashboard;