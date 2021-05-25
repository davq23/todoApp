<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;
use App\Models\UserModel;

class UserController extends BaseController {
    use ResponseTrait;

    /**
     * Create new user
     *
     * @return void
     */
    function post() {
        $userInfo = $this->request->getJSON();

        $userModel = new UserModel();

        $result = $userModel->insert([
            'u_name'     => $userInfo->username,
            'u_password' => $userInfo->password
        ]);

        $errors = $userModel->errors();

        if ($errors) {
            return $this->failValidationErrors(['username' => $errors['u_name'], 'password' => $errors['u_password']]);
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
