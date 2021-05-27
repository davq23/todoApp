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

    protected function setUpdatedAt($data) {
        $currentDateTime = new \DateTime();

        $data['data']['tsk_u_updated_at'] = $currentDateTime->format('Y-m-d H:i:s');

        return $data;
    }
}