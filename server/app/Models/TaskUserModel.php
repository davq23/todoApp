<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * @property \CodeIgniter\Database\BaseConnection $db
 */
class TaskUserModel extends Model {
    protected $table = 'r_task_user';

    protected $primaryKey = 'tsk_u_id';

    protected $allowedFields = [
        'tsk_u_user',
        'tsk_u_task',
        'tsk_u_done'
    ];

    protected $validationRules = [
        'tsk_u_user' => 'required',
        'tsk_u_task' => 'required',
        'tsk_u_done' => 'in_list[0,1]',
    ];

    protected $validationNessages = [
        'tsk_u_done' => [
            'in_list' => 'taskDone must be either true or false',
        ]
    ];

    protected $beforeUpdate = ['setUpdatedAt'];

    public function joinTask(int $userID, int $taskID) {
        try {
            $userTaskID = $this->insert([
                'tsk_u_user' => $userID,
                'tsk_u_task' => $taskID,
                'tsk_u_done' => '0',
            ]);
    
            $errors = $this->errors();
    
            if (count($errors)) {
                return $errors;
            }

            return $userTaskID;

        } catch(\Exception $e) {
            log_message('error', $e->getMessage());
        }

        return false;
    }
    public function leaveTask(int $userID, int $taskID) {
        try {
            $taskModel = new TaskModel($this->db); 

            $task = $taskModel->find($taskID);

            log_message('error', json_encode($task));


            if (!isset($task) || $task['tsk_user'] === $userID) {
                return false;
            }

            $this
                            ->where('tsk_u_user', $userID)   
                            ->where('tsk_u_task', $taskID)
                            ->delete();
    
            $errors = $this->errors();
    
            if (count($errors)) {
                return $errors;
            }

            return $taskID;

        } catch(\Exception $e) {
            log_message('error', $e->getMessage());
        }

        return false;
    }

    protected function setUpdatedAt($data) {
        $currentDateTime = new \DateTime();

        $data['data']['tsk_u_updated_at'] = $currentDateTime->format('Y-m-d H:i:s');

        return $data;
    }

    
}