<?php

namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;
use App\Controllers\BaseController;

class IsAuth extends BaseController {
    use ResponseTrait;

    function auth() {
        return $this->respond([
            'userID' => session('u_id'),
            'username' => session('u_name')
        ]);
    }
}