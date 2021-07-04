<?php

namespace App\Controllers;

use App\Models\TaskModel;
use App\Models\TaskUserModel;
use CodeIgniter\API\ResponseTrait;

class Task extends BaseController
{
	use ResponseTrait;

    private static $taskRules = [
        'taskName'        => 'required|min_length[10]|max_length[120]',
        'taskDescription' => 'permit_empty|max_length[255]',
        'userID'        => 'required|integer',
    ];

    private static $taskMessages = [
        'taskName' =>  [
            'required'              => 'Task name required',
            'min_length'            => 'Task name must be at least 10 chars long',
            'max_length'            => 'Task name must be up to 120 chars long',
        ],
        'taskDescription' =>  [
            'max_length'            => 'Task description must be up to 255 chars long',
        ],

        'userID' => [
            'required'              => 'Missing user',
            'integer'               => 'Invalid type for user ID',
        ]
    ];

    public function deleteTask(int $taskID) {
        $taskModel = new TaskModel();

        $userID = session('u_id');

        $result = $taskModel->builder()
                    ->where('tsk_id', $taskID)
                    ->where('tsk_user', $userID)
                    ->delete();

        $affectedRows = $taskModel->db->affectedRows();

        if (!$result || $affectedRows === 0) {
            return $this->failUnauthorized();
        }

        return $this->respondDeleted(['taskID' => $taskID]);
    }

    public function fetchAllRecentTask(int $limit) {
        $taskModel = new TaskModel();

        $result = $taskModel->fetchAllRecent($limit);

        return $this->respond($result);
    }

    public function fetchAllTaskFromUser(int $userID) {
        $taskModel = new TaskModel();

        $result = $taskModel->fetchAllFromUser($userID);

        return $this->respond($result);
    }

    public function join(int $taskID) {
        $taskUserModel = new TaskUserModel();

        $userID = session('u_id');

        $result = $taskUserModel->joinTask($userID, $taskID);

        if (is_array($result)) {
            return $this->failValidationErrors([
                'taskID' => isset($result['tsk_u_task']) ? $result['tsk_u_task'] : null,
                'userID' => isset($result['tsk_u_user']) ? $result['tsk_u_user'] : null,
                'taskDone' => isset($result['tsk_u_done']) ? $result['tsk_u_done'] : null,
            ]);
        }

        if (is_bool($result)) {
            return $this->failValidationErrors([
                'unknown' => 'Unknown error'
            ]);
        }

        return $this->respond([
            'message' => 'Joined task successfully'
        ]);
    }
    public function leave(int $taskID) {
        $taskUserModel = new TaskUserModel();

        $userID = session('u_id');

        $result = $taskUserModel->leaveTask($userID, $taskID);

        if (is_array($result)) {
            return $this->failValidationErrors([
                'taskID' => isset($result['tsk_u_task']) ? $result['tsk_u_task'] : null,
                'userID' => isset($result['tsk_u_user']) ? $result['tsk_u_user'] : null,
                'taskDone' => isset($result['tsk_u_done']) ? $result['tsk_u_done'] : null,
            ]);
        }

        if (is_bool($result)) {
            return $this->failValidationErrors([
                'unknown' => 'Unknown error'
            ]);
        }

        return $this->respond([
            'message' => 'Joined task successfully'
        ]);
    }

    public function updateTask() {
        $newTask = $this->request->getJSON(true);

        if (!isset($newTask)) {
            return $this->failValidationErrors([
                'unknown' => 'Invalid payLoad'
            ]);
        }

        $newTask['userID'] = session('u_id');

        $validation = \Config\Services::validation();

        $taskRulesUpdate = Task::$taskRules;
        $taskRulesUpdate['taskID'] = 'required|integer';
        $taskMessagesUpdate = Task::$taskRules;
        $taskMessagesUpdate['taskID'] = [ 'required' => 'No task found', 'integer' => 'Invalid task'];

        $validation->setRules($taskRulesUpdate, $taskMessagesUpdate);

        if (!$validation->run($newTask)) {
            $errors = $validation->getErrors();

            return $this->failValidationErrors($errors);
        }

        $taskModel = new TaskModel();

        $userID = session('u_id');

        $taskModel
            ->where('tsk_user', $userID)
            ->update($newTask['taskID'], [
                'tsk_id'            => $newTask['taskID'],
                'tsk_name'          => $newTask['taskName'],
                'tsk_description'   => $newTask['taskDescription'],
            ]);

        $errors = $taskModel->errors();

        if (isset($errors) && is_array($errors) && count($errors) > 0) {
            return $this->failValidationErrors($errors);
        }

        $affectedRows = $taskModel->db->affectedRows();

        if ($affectedRows === 0) {
            return $this->failValidationErrors([
                'unknown' => 'User not allowed to delete this task'
            ]);
        }

        return $this->respondUpdated($newTask);
    }

    public function setTaskUndone(int $taskID) {
        if ($taskID <= 0) {
            return $this->failValidationErrors([
                'unknown' => 'Invalid task ID'
            ]);
        }

        $userID = session('u_id');

        $taskUserModel = new TaskUserModel();

        $taskUserModel->where('tsk_u_user', $userID)
                      ->where('tsk_u_task', $taskID)
                      ->where('tsk_u_done', '1')
                      ->set([
                          'tsk_u_done' => '0',
                      ])
                      ->update();

        $errors = $taskUserModel->errors();

        if (isset($errors) && is_array($errors) && count($errors) > 0) {
            return $this->failValidationErrors($errors);
        }

        $affectedRows = $taskUserModel->db->affectedRows();

        if ($affectedRows === 0) {
            return $this->failValidationErrors([
                'unknown' => 'User not registered to this task'
            ]);
        }

        return $this->respondUpdated([
            'taskID' => $taskID
        ]);
    }

    public function setTaskDone(int $taskID) {
        if ($taskID <= 0) {
            return $this->failValidationErrors([
                'unknown' => 'Invalid task ID'
            ]);
        }

        $userID = session('u_id');

        $taskUserModel = new TaskUserModel();

        $taskUserModel->where('tsk_u_user', $userID)
                      ->where('tsk_u_task', $taskID)
                      ->where('tsk_u_done', '0')
                      ->set([
                          'tsk_u_done' => '1',
                      ])
                      ->update();

        $errors = $taskUserModel->errors();

        if (isset($errors) && is_array($errors) && count($errors) > 0) {
            return $this->failValidationErrors($errors);
        }

        $affectedRows = $taskUserModel->db->affectedRows();

        if ($affectedRows === 0) {
            return $this->failValidationErrors([
                'unknown' => 'User not registered to this task'
            ]);
        }

        return $this->respondUpdated([
            'taskID' => $taskID
        ]);
    }

    public function insertTask() {
        $newTask = $this->request->getJSON(true);

        if (!isset($newTask) ) {
            return $this->failValidationErrors([
                'unknown' => 'Invalid payLoad'
            ]);
        }

        $newTask['userID'] = session('u_id');

        $validation = \Config\Services::validation();

        $validation->setRules(Task::$taskRules, Task::$taskMessages);

        if (!$validation->run($newTask)) {
            $errors = $validation->getErrors();

            return $this->failValidationErrors($errors);
        }

        $taskModel = new TaskModel();

        $newTaskArray = [
            'tsk_name'          => $newTask['taskName'],
            'tsk_description'   => $newTask['taskDescription'],
            'tsk_user'          => $newTask['userID'],
        ];

        $result = $taskModel->insertTask($newTaskArray);

        if (is_array($result)) {
            return  $this->failValidationErrors([
                'taskName' => isset($result['tsk_name']) ? $result['tsk_name'] : null,
                'taskDescription' => isset($result['tsk_description']) ? $result['tsk_description'] : null
            ]);
        }

        if (is_bool($result)) {
            return $this->failValidationErrors([
                'unknown' => 'An error has occurred'
            ]);
        }

        $newTask['taskID'] = $result;
        
        return $this->respondCreated($newTask);
    } 
}