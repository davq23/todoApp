<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;
use App\Models\UserModel;

class UserController extends BaseController {
    use ResponseTrait;

    public static $signInRules = [
        'username' => 'required|string|htmlspecialchars|min_length[5]|max_length[12]',
        'password' => 'required|string|min_length[6]'
    ];

    public static $signInMessages = [
        'username' => [
            'required'          => 'Username missing',
            'string'            => 'Invalid username type',
            'htmlspecialchars'  => 'Invalid chars in username',
            'min_length'        => 'Username must be at least 5 chars long',
            'max_length'        => 'Username length must not surpass 12 chars',
        ],

        'password' => [
            'required'          => 'Password missing',
            'string'            => 'Invalid password type',
            'min_length'        => 'Password must be 6 chars long',
        ]
    ];

    /**
     * Create new user
     *
     * @return void
     */
    function post() {
        $userInfo = $this->request->getJSON(true);

        $userModel = new UserModel();

        $validation = \Config\Services::validation();

        $validation->setRules(UserController::$signInRules, UserController::$signInMessages);

        if (!$validation->run($userInfo)) {
            $errors = $validation->getErrors();

            return $this->failValidationErrors($errors);
        }

        $result = $userModel->insert([
            'u_name'     => $userInfo['username'],
            'u_password' => $userInfo['password']
        ]);

        $errors = $userModel->errors();

        if ($errors) {
            return $this->failValidationErrors([
                'username' => isset($errors['u_name']) ? $errors['u_name'] : null, 
                'password' => isset($errors['u_password']) ? $errors['u_password'] : null
            ]);
        }

        return $this->respondCreated([
            'userID' => $result
        ]);
    }

    /**
     * Get all users
     *
     * @param integer $limit    Result limit
     * @return void
     */
    function getAll(int $limit) {
        $userModel = new UserModel();

        $userList = $userModel->fetchAll($limit);

        return $this->respond($userList);
    }
}
