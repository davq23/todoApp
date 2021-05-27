import {createSlice} from "@reduxjs/toolkit";

export const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: null,
    },
    reducers: {
        save: (state, action) => {
            const tasks = {
                ...state.tasks,
                [action.payload.taskID]: action.payload,
            }

            console.log(tasks);

            return {
                tasks: tasks,
            }
        },

        deleteOne: (state, action) => {
            const copy = {
                ...state.tasks,
            }

            delete copy[action.payload.taskID];

            return {
                tasks: copy
            };
        },

        setDone: (state, action) => {
            let task = {...state.tasks[action.payload]};

            task.taskDone = '1';

            return {tasks: {...state.tasks, [action.payload]: task}};
        },

        addAll: (state, action) => {
            var tasks = {};

            action.payload.forEach(function(task) {
                tasks[task.taskID] = task;
            });

            return {
                tasks: tasks,
            };            
        }
    }
});

export const { save, deleteOne, addAll, setDone } = taskSlice.actions;

export const selectTasks = (state) => state.tasks.tasks;

export default taskSlice.reducer;