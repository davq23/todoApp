<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;
use App\Models\UserModel;

class Login extends BaseController {
    use ResponseTrait;

    function post() {
        $userInfo = $this->request->getJSON(true);

        $validation = \Config\Services::validation();

        $validation->setRules(UserController::$signInRules);

        if (!$validation->run($userInfo)) {
            return $this->failValidationErrors('Invalid username or password');
        }

        $userModel = new UserModel();

        $result = $userModel->where('u_name', $userInfo['username'])
                            ->first();

        log_message('error', json_encode($result));

        if (!isset($result) || !password_verify($userInfo['password'], $result['u_password'])) {
            return $this->failValidationErrors('Invalid username or password');
        }
        
        $session = session();

        session_regenerate_id(true);

        $session->set('u_id', $result['u_id']);
        $session->set('u_name', $result['u_name']);

        return $this->respond([
            'userID' => $result['u_id'],
            'username' => $result['u_name']
        ]);
    }
}
