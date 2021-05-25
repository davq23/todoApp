
import React, { useState, useEffect, Fragment } from 'react';
import axios from "axios";

const TaskList = (props) => {
    const [list, setList] = useState([]);
    const [listLoaded, setListLoaded] = useState(false);

    const fetchTasks = () => {
        axios.get('http://localhost/react-1/server/public/api/tasks/get/'+props.limit, {
            withCredentials: true
        }).then((response) => {
            setList(response.data);
            setListLoaded(true);
        }).catch((response) => {
            if (response.status == 401) {
            }
        });
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <table>
            <thead>
                <th>ID</th>
                <th>Task Name</th>
                <th>Task Description</th>
            </thead>
            <tbody>
                {
                    listLoaded ?
                    list.map(task => {
                        return <tr key={task.taskID}>
                            <td>{task.taskID}</td>
                            <td>{task.taskName}</td>
                            <td>{task.taskDescription}</td>
                        </tr>
                    })
                    :
                    <tr className="fadeoutFast">
                        <td colspan="4">Wait..</td>
                    </tr>
                    
                }
            </tbody>
        </table>
    )
}

export default TaskList;
