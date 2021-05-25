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
        'tsk_u_task'
    ];

    protected $validationRules = [
        'tsk_u_user' => 'required',
        'tsk_u_task' => 'required',
    ];

}