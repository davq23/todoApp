<?php

namespace App\Controllers;

use App\Models\TaskModel;
use App\Models\TaskUserModel;
use CodeIgniter\API\ResponseTrait;

class Task extends BaseController
{
	use ResponseTrait;

    public function fetchAllTask(int $limit) {
        $taskModel = new TaskModel();

        $result = $taskModel->fetchAll($limit);

        return $this->respond($result);
    }

    public function fetchAllTaskFromUser(int $userID) {
        $taskModel = new TaskModel();

        $result = $taskModel->fetchAllFromUser($userID);

        return $this->respond($result);
    }

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

        return $this->respondDeleted($result);
    }

    public function updateTask() {
        $newTask = $this->request->getJSON();

        if (!isset($newTask)) {
            return $this->failValidationErrors([
                'unknown' => 'Invalid payLoad'
            ]);
        }

        $newTask->userID = session('u_id');

        $taskModel = new TaskModel();

        $userID = session('u_id');

        $taskModel
            ->where('tsk_user', $userID)
            ->update((isset($newTask->taskID) ? $newTask->taskID : null), [
                'tsk_id' => (isset($newTask->taskID) ? $newTask->taskID : null),
                'tsk_name' => (isset($newTask->taskName) ? $newTask->taskName : null),
                'tsk_description' => (isset($newTask->taskDescription) ? $newTask->taskDescription : null),
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
        $newTask = $this->request->getJSON();

        if (!isset($newTask) ) {
            return $this->failValidationErrors([
                'unknown' => 'Invalid payLoad'
            ]);
        }

        $newTask->userID = session('u_id');

        $taskModel = new TaskModel();

        $newTaskArray = [
            'tsk_name'          => $newTask->taskName,
            'tsk_description'   => $newTask->taskDescription,
            'tsk_user'          => $newTask->userID
        ];

        $result = $taskModel->insertTask($newTaskArray);

        if (is_array($result)) {
            return  $this->failValidationErrors([
                'taskName' => $result['tsk_name'],
                'taskDescription' => $result['tsk_description']
            ]);
        }

        if (is_bool($result)) {
            return $this->failValidationErrors([
                'unknown' => 'An error has occurred'
            ]);
        }

        $newTask->taskID = $result;
        
        return $this->respondCreated($newTask);
    } 
}