<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model {
    protected $table = 'e_user';

    protected $primaryKey = 'u_id';

    protected $allowedFields = [
        'u_name',
        'u_password'
    ];

    protected $validationRules = [
        'u_name' => 'required|alpha_numeric_punct|min_length[4]|max_length[12]|is_unique[e_user.u_name,u_id,{u_id}]',
        'u_password' => 'required',
    ];

    protected $validationMessages = [
        'u_name' =>  [
            'required'              => 'Username required',
            'alpha_numeric_punct'   => 'Invalid characters in username',
            'min_length'            => 'Username must be 4 to 12 chars. long',
            'max_length'            => 'Username must be 4 to 12 chars. long',
            'is_unique'             => 'Username already exist',
        ],

        'u_password' => [
            'required'              => 'Invalid or missing password',
        ]
    ];

    protected $beforeInsert = ['hashPassword'];
    protected $beforeUpdate = ['hashPassword'];

    /**
     * Hashes password
     *
     * @param [array] $data  
     * @return array
     */
    protected function hashPassword($data) {
        if (isset($data['data']['u_password'])) {
            $hash = password_hash($data['data']['u_password'], PASSWORD_BCRYPT);

            $data['data']['u_password'] = $hash;
        }

        return $data;
    }


    public function fetchAll(int $limit) {
        $builder = $this->builder();

        return $builder->select(['u_id as userID', 'u_name as username', 'u_created_at as joinedAt'])
                        ->limit($limit)
                        ->get()->getResult();
    }
}