<?php

namespace App\Models;

use CodeIgniter\Model;

/**
 * @property \CodeIgniter\Database\BaseConnection $db
 */
class TaskModel extends Model {
    protected $table = 'e_task';

    protected $primaryKey = 'tsk_id';

    protected $allowedFields = [
        'tsk_name',
        'tsk_description',
        'tsk_user'
    ];

    protected $validationRules = [
        'tsk_name' => 'required|min_length[10]|max_length[120]',
        'tsk_description' => 'max_length[255]',
        'tsk_user' => 'required',
    ];

    protected $validationMessages = [
        'tsk_name' =>  [
            'required'              => 'Task name required',
            'min_length'            => 'Task name must be at least 10 chars long',
            'max_length'            => 'Task name must be up to 120 chars long',
        ],
        'tsk_description' =>  [
            'max_length'            => 'Task description must be up to 255 chars long',
        ],

        'tsk_user' => [
            'required'              => 'Missing user',
        ]
    ];

    public function fetchAll(int $limit) {
        $builder = $this->builder();

        return $builder->select(['tsk_id as taskID', 'tsk_name as taskName', 'tsk_description as taskDescription',
                        'tsk_created_at as createdAt', 'tsk_updated_at as updatedAt'])
                        ->limit($limit)
                        ->get()->getResult();
    }

    public function fetchAllFromUser(int $userID) {
        $builder = $this->builder();

        return $builder->select(['tsk_id as taskID', 'tsk_name as taskName',  'tsk_description as taskDescription',
                        'tsk_created_at as createdAt', 'tsk_updated_at as updatedAt', 'tsk_u_done as taskDone'])
                        ->join('r_task_user', 'tsk_u_user = tsk_user')
                        ->where('tsk_user', $userID)
                        ->get()->getResult();
    }

    public function insertTask(array $newTask) {
        try {
            $this->db->transStart();

            $taskID = $this->insert($newTask);

            $insertErrors = $this->errors();

            if ($this->db->transStatus() === false) {
                throw new \Exception(json_encode($this->db->error()));
            }

            if (count($insertErrors) > 0) {
                return $insertErrors;
            }

            $taskUserModel = new TaskUserModel($this->db);

            $taskUserID = $taskUserModel->insert([
                'tsk_u_user' => $newTask['tsk_user'],
                'tsk_u_task' => $taskID,
                'tsk_u_done' => '0',
            ]);

            $insertErrors =  $taskUserModel->errors();

            if ($this->db->transStatus() === false) {
                throw new \Exception(json_encode($this->db->error()));
            }

            if (count($insertErrors) > 0) {
                return $insertErrors;
            }

            $this->db->transComplete();

            return $taskID;

        } catch (\Exception $e) {
            log_message('error', $e->getMessage());
        }

        return false;
    }
}