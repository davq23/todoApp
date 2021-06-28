import React, { useState, useEffect, Fragment } from 'react';
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import axios from "axios";
import {selectUser} from '../slices/userslice';
import {useSelector, useDispatch} from 'react-redux';

const LatestTaskList = (props) => {
    const [tasks, setTasks] = useState({});
    const [disableRows, setDisableRows] = useState(false);
    const currentUser = useSelector(selectUser); 

    const transformTaskArrayToObject = (taskArray) => {
        const taskObject = {};

        taskArray.forEach(function(task) {
            taskObject[task.taskID] = task;
        });

        setTasks(taskObject);
    }

    const addTask = (task) => {
        task['taskCreatorID'] = currentUser;
        setTasks({...tasks, [task.taskID]: task});
    }
    
    const fetchTasks = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/get/recent/${props.limit}`, {
            withCredentials: true
        }).then((response) => {
            transformTaskArrayToObject(response.data);
        }).catch((response) => {
            if (response.status == 401) {
            }
        });
    };

    const deleteTaskState = (taskID) => {
        const taskObject = {
            ...tasks,
        };

        delete taskObject[taskID];

        setTasks(taskObject);
    }

    const joinTask = (taskID) => {
        setDisableRows(true);

        axios.post(`${process.env.REACT_APP_API_URL}/api/tasks/join/${taskID}`, {}, {
            withCredentials: true
        }).then((response) => {
            setDisableRows(false);

            const copyTask = {
                ...tasks[taskID],
            }

            props.setJoinTask(copyTask);
            
            deleteTaskState(taskID);

        }).catch((response) => {
            setDisableRows(false);
            
            if (response.status == 401) {
            }
        });
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (props.leftTask) {
            setTasks({
                ...tasks,
                [props.leftTask.taskID]: props.leftTask
            });

            props.setLeftTask(null);
        }
    }, [props.leftTask]);

    useEffect(() => {
        console.log(props.selectedTasks);
    }, [props.selectedTasks])


    const refreshTasks = (taskList) => {
        if (props.selectedTasks === null) {
            return <TableRow key={0}>
                <TableCell style={{textAlign: 'center'}} colSpan="5">Loading Tasks</TableCell>
            </TableRow>
        }

        if (taskList.length === 0) {
            return <TableRow key={0}>
                <TableCell style={{textAlign: 'center'}} colSpan="5">Add tasks to your TODO list</TableCell>
            </TableRow>
        }

        return taskList.map(task => {
            if (task.taskID in props.selectedTasks) {
                return;
            }

            return <TableRow key={task.taskID}>
                <TableCell>{task.taskID}</TableCell>
                <TableCell>{task.taskName}</TableCell>
                <TableCell>{task.taskDescription}</TableCell>
                <TableCell>{task.taskCreatorName}</TableCell>
                <TableCell style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    {
                        task.taskCreatorID !== currentUser ? 
                        <Button disabled={disableRows} variant="contained" color="primary"  onClick={() => {
                            joinTask(task.taskID);
                        }}>JOIN</Button> :  '---'
                    }
                </TableCell>
            </TableRow>
        });
    }
    
    return (
        <TableContainer style={{ maxHeight: '30rem', justifyContent: 'center' }}>
            <Table stickyHeader>
                <TableHead color="primary">
                    <TableRow className="textAlignCenter">
                        <TableCell>ID</TableCell>
                        <TableCell>Task Name</TableCell>
                        <TableCell>Task Description</TableCell>
                        <TableCell>Task Creator</TableCell>
                        <TableCell style={{textAlign: 'center'}}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    {
                        (tasks instanceof Object && props.selectedTasks) ?
                        refreshTasks(Object.values(tasks))
                        :
                        <TableRow className="fadeoutFast">
                            <TableCell colSpan="4">Loading tasks</TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
           
        </TableContainer>
        
    )
}

export default LatestTaskList;