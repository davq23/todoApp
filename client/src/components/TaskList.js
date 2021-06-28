
import React, { useState, useEffect, Fragment, forwardRef } from 'react';
import TaskForm from './TaskForm';
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import axios from "axios";
import '../main.css';
import {useSelector, useDispatch} from 'react-redux';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { selectUser } from '../slices/userslice';

const TaskList = (props) => {
    const [editTask, setEditTask] = useState(null);
    const [disableRows, setDisableRows] = useState(false);
    const [tasks, setTasks] = useState({});

    const transformTaskArrayToObject = (taskArray) => {
        const taskObject = {};

        taskArray.forEach(function(task) {
            taskObject[task.taskID] = task;
        });

        setTasks(taskObject);
        props.setSelectedTask(taskObject);
    }

    const addTask = (task) => {
        setTasks({...tasks, [task.taskID]: task});
        props.setSelectedTask(tasks);
    }

    const deleteTaskState = (taskID) => {
        const taskObject = {
            ...tasks,
        };

        delete taskObject[taskID];

        setTasks(taskObject);
        props.setSelectedTask(taskObject);
    }

    const updateTaskState = (done) => {
        const taskObject = {
            ...tasks,
        }

        taskObject[task.taskID] = task;

        setTasks(taskObject);
        props.setSelectedTask(taskObject);
    }

    const updateTaskDone = (task) => {
        const taskObject = {
            ...tasks,
        }

        taskObject[task.taskID].taskDone = '1';

        setTasks(taskObject);
    }

    const currentUser = useSelector(selectUser);

    const fetchTasks = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/get/user/${currentUser}`, {
            withCredentials: true
        }).then((response) => {
            transformTaskArrayToObject(response.data);
        }).catch((response) => {
            if (response.status == 401) {
            }
        });
    };

    const deleteTask = (taskID) => {
        setDisableRows(true);

        axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/delete/${taskID}`, {
            withCredentials: true
        }).then((response) => {
            setDisableRows(false);

            deleteTaskState(taskID);
        }).catch((response) => {
            setDisableRows(false);

            if (response.status == 401) {
            }
        });
    };

    const toggleTask = (event) => {
        const checked = event.currentTarget.checked;
        const taskID = event.currentTarget.value;
        
        if (checked) {
            setDisableRows(true);
            
            axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/set/done/${taskID}`, {}, {
                withCredentials: true
            }).then((response) => {
                setDisableRows(false);

                updateTaskDone(response.data)
            }).catch((response) => {
                setDisableRows(false);
    
                if (response.status == 401) {
                }
            });
        }
    };

    const leaveTask = (taskID) => {
        setDisableRows(true);
        
        axios.post(`${process.env.REACT_APP_API_URL}/api/tasks/leave/${taskID}`, {}, {
            withCredentials: true
        }).then((response) => {
            setDisableRows(false);

            props.setLeftTask({
                ...tasks[taskID]
            });
            
            deleteTaskState(taskID);
        }).catch((response) => {
            setDisableRows(false);
            if (response.status == 401) {
            }
        });
    }

    const refreshTasks = (taskList) => {
        if (taskList.length == 0) {
            return <TableRow key={0}>
                <TableCell style={{textAlign: 'center'}} colSpan="4">Add tasks to your TODO list</TableCell>
            </TableRow>
        }

        return taskList.map(task => {
            return <TableRow key={task.taskID}>
                <TableCell>{task.taskID}</TableCell>
                <TableCell>{task.taskName}</TableCell>
                <TableCell>{task.taskDescription}</TableCell>
                <TableCell style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    {
                        currentUser === task.taskCreatorID ? 
                        <Fragment>
                            <Button disabled={disableRows} variant="contained" color="primary"  onClick={() => {
                                setEditTask(task);
                            }}>EDIT</Button>
                            <Button disabled={disableRows} variant="contained" color="secondary" onClick={() => {
                                deleteTask(task.taskID);
                            }}>DELETE</Button>
                        </Fragment>
                        :
                        <Button disabled={disableRows} variant="contained" color="secondary" onClick={() => {
                            leaveTask(task.taskID);
                        }}>LEAVE</Button>
                    }
                   
                    <FormControlLabel
                        control={
                        <Checkbox 
                            disabled={disableRows}
                            fontSize="large"
                            name='done'
                            color="primary"
                            onChange={toggleTask}
                            checked={(task.taskDone === '1' ? true : false)}
                            value={task.taskID}
                        />
                        }
                    />
                </TableCell>
            </TableRow>
        });
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (props.joinTask) {
            
            addTask(props.joinTask);
    
            props.setJoinTask(null);
        }
    }, [props.joinTask])

    return (
        <TableContainer style={{ maxHeight: '30rem', justifyContent: 'center' }}>
            <Table stickyHeader>
                <TableHead color="primary">
                    <TableRow className="textAlignCenter">
                        <TableCell>ID</TableCell>
                        <TableCell>Task Name</TableCell>
                        <TableCell>Task Description</TableCell>
                        <TableCell style={{textAlign: 'center'}}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TaskForm selectedTask={editTask} setSelectedTask={setEditTask} 
                    editTask={updateTaskState} addTask={addTask} />
                <TableBody >
                    {
                        (tasks instanceof Object) ?
                        refreshTasks(Object.values(tasks))
                        :
                        <TableRow className="fadeoutFast">
                            <TableCell colSpan="4"></TableCell>
                        </TableRow>
                    }
                </TableBody>
              
            </Table>
           
        </TableContainer>
        
    )
}

export default TaskList;
