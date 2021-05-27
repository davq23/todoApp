import {Button, Input, Popper, TableCell, TableFooter, TableRow, TextareaAutosize, Snackbar} from '@material-ui/core';
import Container from '@material-ui/core/Container';
import {useState, useImperativeHandle, useRef, useEffect} from 'react';
import '../main.css';
import axios from "axios";
import {useSelector, useDispatch} from 'react-redux';
import Task from "../models/Task";
import MuiAlert from '@material-ui/lab/Alert';

const TaskForm = (props) => {
    const popperID = 'editDescriptionPopper';
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [disableForm, setDisableForm] = useState(false);
    const [task, setTask] = useState(new Task());
    const [actionName, setActionName] = useState('ADD');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState(null);


    useEffect(() => {
        if (props.selectedTask) {
            setTask({...props.selectedTask});

            setActionName('EDIT');

            props.setSelectedTask(null);
        }
    });

    const clearTask = (event) => {
        setTask(new Task());

        setActionName('ADD');
    }

    const addTask = (event) => {
        const apiURL = `${process.env.REACT_APP_API_URL}/api/tasks/${(task.taskID !== ''? 'update' : 'new')}`;

        setDisableForm(true);
        
        axios.post(apiURL, task, {
            withCredentials: true,
        }).then((response) => {
            setDisableForm(false);
            
            const taskExistent = {...task};
            
            setTask(new Task());

            setActionName('ADD');

            props.addTask(response.data);
        }).catch((error) => {
            setDisableForm(false);

            if (error.response.status === 400) {
                if (error.response.data.messages.taskName) {
                    setMessage(error.response.data.messages.taskName);
                }
                else if (error.response.data.messages.taskDescription) {
                    setMessage(error.response.data.messages.taskDescription);
                }
                else {
                    setMessage(error.response.data.messages.unknown);
                }
                setShowMessage(true);
            }

        });
    }

    const handleTask = (event) => {
        const {name, value} = event.target;

        setTask(prevTaskState => ({
            ...task, 
            [name]: value,
        }));
    }

    const handleDescribe = (event) => {
        setAnchorEl(event.target);
        setOpen(!open);
    };

    const handleClose = (event) => {
        console.log(event);

        if (open) {
            setOpen(false);
        }
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setShowMessage(false);
      };

    return (
        <TableFooter>
            <TableRow>
                    <TableCell>
                        <Input readOnly={true} name="taskID" value={task.taskID}/>
                    </TableCell>
                    <TableCell>
                        <Input name="taskName" onInput={handleTask} disabled={disableForm} value={task.taskName}/>
                    </TableCell>
                    <TableCell>
                        <Button variant="contained" aria-describedby={popperID} disabled={disableForm}
                            color="primary" className='bgGreen' onClick={handleDescribe}>DESCRIBE</Button>
                    </TableCell>
                    <TableCell style={{display: 'flex', justifyContent: 'space-evenly'}}>
                        <Button  variant="contained" onClick={addTask} color="primary" disabled={disableForm}>{actionName}</Button>
                        <Button  variant="contained" onClick={clearTask} style={{backgroundColor: 'gray', color: 'white'}} disabled={disableForm}>CLEAR</Button>
                    </TableCell>
            </TableRow>
            <Popper id={popperID} open={open} onClose={handleClose} disabled={disableForm} anchorEl={anchorEl} >
                <Container>
                    <TextareaAutosize placeholder='Describe your task' name="taskDescription" 
                        onInput={handleTask} value={task.taskDescription} onBlur={handleClose} >
                    </TextareaAutosize>
                </Container>
            </Popper>
            <Snackbar open={showMessage} >
                <MuiAlert onClose={handleCloseAlert} severity="error">
                    {`Error: ${message}`}
                </MuiAlert>
            </Snackbar>
        </TableFooter>
    )
}

export default TaskForm;