import { Fragment, useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';

import axios from "axios";

function Statistics(props) {
    const [tasksUserCount, setTasksUserCount] = useState(null);

    const transformTaskArrayToObject = (taskArray) => {
        const taskObject = {};

        taskArray.forEach(function(task) {
            taskObject[task.taskID] = task;
        });

        setTasksUserCount(taskObject);
    }

    const generateData = tasksUserCountArray => {
        return {
            labels: tasksUserCountArray.map(tasksCountUser => tasksCountUser.taskName),
            datasets: [{
                label: '# of Users',
                data: tasksUserCountArray.map(tasksCountUser => parseInt(tasksCountUser.taskUserCount)),
                barThickness: 'flex',
            }]
        };
    };

    const options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };


    const refreshTasksCounts = tasksCountArray => {
        if (tasksCountArray.length === 0) {
            return <h1>No tasks created</h1>
        }

        return <Bar data={generateData(tasksCountArray)} options={options}></Bar>
    };

    const fetchUserTaskCount = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/tasks/get/user/count`, {
            withCredentials: true
        }).then((response) => {
            transformTaskArrayToObject(response.data);
        }).catch((response) => {
            if (response.status == 401) {
            }
        });
    };


    useEffect(() => {
        fetchUserTaskCount();
    }, [])

    return (
        <Fragment>
            {
                tasksUserCount === null ? (
                    <h1 className="fadeoutFast">Loading...</h1>
                )
                :
                (
                    refreshTasksCounts(Object.values(tasksUserCount))
                )
            }
        </Fragment>
    )
}

export default Statistics;