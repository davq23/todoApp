<?php

namespace App\Controllers;

use App\Models\TaskModel;
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

    public function insertTask() {
        $newTask = $this->request->getJSON();

        if (!isset($newTask)) {
            return $this->failValidationErrors([
                'unknown' => 'Invalid payLoad'
            ]);
        }

        $newTask->userID = session('u_id');

        if (!isset($userID))

        $taskModel = new TaskModel();

        $result = $taskModel->insertTask([
            'tsk_name'          => $newTask->taskName,
            'tsk_description'   => $newTask->taskDescription,
            'tsk_user'          => $newTask->userID
        ]);
        
        return $this->respondCreated($result);
    } 
}